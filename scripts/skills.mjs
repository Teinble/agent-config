import { spawnSync } from 'node:child_process';
import { lstat, mkdir, readFile, realpath, stat, symlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// This adapter relies on the v3 global lock and universal-agent routing in this release.
// Recheck src/skill-lock.ts, src/agents.ts and src/installer.ts before changing it.
export const CLI_PACKAGE = 'skills@1.5.25';
const manifestPath = fileURLToPath(new URL('../skills.json', import.meta.url));
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function keys(value, allowed, label) {
  if (!object(value) || Object.keys(value).some((key) => !allowed.includes(key))) {
    throw new Error(`${label}: expected an object with only ${allowed.join(', ')}`);
  }
}

export function validateManifest(value) {
  keys(value, ['agents', 'global', 'providers'], 'manifest');
  if (value.global !== true) throw new Error('Only global installation is supported.');
  if (!Array.isArray(value.agents) || value.agents.length === 0 ||
      value.agents.some((agent) => !['codex', 'claude-code'].includes(agent)) ||
      new Set(value.agents).size !== value.agents.length) {
    throw new Error('agents must select codex and/or claude-code without duplicates.');
  }
  if (!Array.isArray(value.providers) || value.providers.length === 0) {
    throw new Error('providers must be a non-empty array.');
  }
  const sources = new Set();
  const names = new Set();
  for (const provider of value.providers) {
    keys(provider, ['source', 'skills'], 'provider');
    if (typeof provider.source !== 'string' ||
        !/^[A-Za-z0-9][A-Za-z0-9-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(provider.source) ||
        provider.source.endsWith('.git')) {
      throw new Error('source must be a GitHub owner/repo shorthand, without a ref or URL.');
    }
    const source = provider.source.toLowerCase();
    if (sources.has(source)) throw new Error(`Duplicate provider: ${source}`);
    sources.add(source);
    if (!Array.isArray(provider.skills) || provider.skills.length === 0) {
      throw new Error(`${source}: skills must be a non-empty array.`);
    }
    for (const name of provider.skills) {
      if (typeof name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
        throw new Error(`Invalid skill name: ${JSON.stringify(name)}`);
      }
      if (names.has(name)) throw new Error(`Duplicate skill selection: ${name}`);
      names.add(name);
    }
  }
  return value;
}

export function locations(home = homedir(), env = process.env) {
  const configuredPath = (name, fallback) => {
    const value = env[name]?.trim() || fallback;
    if (!isAbsolute(value)) throw new Error(`${name} must be an absolute path.`);
    return value;
  };
  if (env.XDG_STATE_HOME && !isAbsolute(env.XDG_STATE_HOME)) {
    throw new Error('XDG_STATE_HOME must be an absolute path.');
  }
  return {
    canonical: join(home, '.agents', 'skills'),
    claude: join(configuredPath('CLAUDE_CONFIG_DIR', join(home, '.claude')), 'skills'),
    // Codex reads the canonical directory, but a legacy entry can shadow it.
    codexLegacy: join(configuredPath('CODEX_HOME', join(home, '.codex')), 'skills'),
    lock: env.XDG_STATE_HOME
      ? join(env.XDG_STATE_HOME, 'skills', '.skill-lock.json')
      : join(home, '.agents', '.skill-lock.json'),
  };
}

async function entry(path) {
  try {
    return await lstat(path);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function readLock(path) {
  let text;
  try {
    text = await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return { version: 3, skills: {} };
    throw error;
  }
  const lock = JSON.parse(text);
  if (!object(lock) || lock.version !== 3 || !object(lock.skills)) {
    throw new Error(`Unsupported or malformed global lock: ${path}`);
  }
  return lock;
}

async function inspectSkill(source, name, agents, paths, lock) {
  const canonical = join(paths.canonical, name);
  const installed = await entry(canonical);
  const record = Object.hasOwn(lock.skills, name) ? lock.skills[name] : undefined;
  const targets = [];
  if (agents.includes('codex')) targets.push(join(paths.codexLegacy, name));
  if (agents.includes('claude-code')) targets.push(join(paths.claude, name));

  if (record !== undefined && (!object(record) || record.sourceType !== 'github' ||
      typeof record.source !== 'string' || record.source.toLowerCase() !== source.toLowerCase() ||
      record.ref)) {
    throw new Error(`${name}: source/ref conflict in ${paths.lock}; resolve explicitly.`);
  }
  if (installed && !record) {
    throw new Error(`${name}: installed content has unknown provenance; refusing to overwrite.`);
  }
  if (installed) {
    if (!installed.isDirectory() || !(await stat(join(canonical, 'SKILL.md'))).isFile()) {
      throw new Error(`${name}: canonical installation must be a directory containing SKILL.md.`);
    }
  }
  for (const target of targets) {
    if (await entry(target)) {
      if (!installed || await realpath(target) !== await realpath(canonical)) {
        throw new Error(`${name}: conflicting or independent installation at ${target}.`);
      }
    }
  }
  if (!installed) return { action: 'install', source, name };
  if (agents.includes('claude-code') && !await entry(join(paths.claude, name))) {
    return { action: 'link', source, name };
  }
  return { action: 'keep', source, name };
}

export async function planSync(manifest, paths) {
  validateManifest(manifest);
  const lock = await readLock(paths.lock);
  const plan = [];
  // Inspect every selection before any write, so a later conflict cannot cause
  // avoidable partial installation of earlier providers.
  for (const { source, skills } of manifest.providers) {
    for (const name of skills) {
      plan.push(await inspectSkill(source, name, manifest.agents, paths, lock));
    }
  }
  return plan;
}

function runCLI(args) {
  const result = spawnSync('npx', args, { stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`skills CLI failed (${result.signal || result.status}); sync is incomplete.`);
  }
}

export async function sync(manifest, {
  paths = locations(), dryRun = false, run = runCLI, log = console.log,
} = {}) {
  const plan = await planSync(manifest, paths);
  for (const item of plan) log(`${item.action}: ${item.source} / ${item.name}`);
  if (dryRun) return plan;
  for (const item of plan) {
    if (item.action === 'keep') continue;
    // Recheck before each mutation; another skills command may have changed state.
    const current = await inspectSkill(item.source, item.name, manifest.agents, paths,
      await readLock(paths.lock));
    if (current.action !== item.action) {
      throw new Error(`${item.name}: installed state changed; rerun sync.`);
    }
    if (item.action === 'install') {
      await run(['--yes', CLI_PACKAGE, 'add', item.source, '--global',
        '--agent', ...manifest.agents, '--skill', item.name, '--yes']);
    } else {
      // Re-running upstream add here would refresh canonical content. Only wire
      // the missing Claude entry; symlink fails if a target appeared meanwhile.
      await mkdir(paths.claude, { recursive: true });
      await symlink(await realpath(join(paths.canonical, item.name)),
        join(paths.claude, item.name), 'dir');
    }
    const after = await inspectSkill(item.source, item.name, manifest.agents, paths,
      await readLock(paths.lock));
    if (after.action !== 'keep') {
      throw new Error(`${item.name}: installation verification failed; sync is incomplete.`);
    }
  }
  log('Sync complete. Existing skill contents were not refreshed.');
  return plan;
}

async function main(args) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('Usage: node scripts/skills.mjs sync [--dry-run]');
    return;
  }
  if (args[0] !== 'sync' || args.length > 2 ||
      (args.length === 2 && args[1] !== '--dry-run')) {
    throw new Error('Usage: node scripts/skills.mjs sync [--dry-run]');
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  await sync(manifest, { dryRun: args.includes('--dry-run') });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`Sync failed: ${error.message}`);
    process.exitCode = 1;
  });
}
