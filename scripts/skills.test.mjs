import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { CLI_PACKAGE, locations, planSync, sync, validateManifest } from './skills.mjs';

const manifest = () => ({
  global: true, agents: ['codex', 'claude-code'],
  providers: [{ source: 'owner/skills', skills: ['example'] }],
});

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'agent-config-skills-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const paths = locations(root, {});
  const lock = { version: 3, skills: {} };
  async function saveLock() {
    await mkdir(dirname(paths.lock), { recursive: true });
    await writeFile(paths.lock, JSON.stringify(lock));
  }
  async function install(name = 'example', source = 'owner/skills', link = true) {
    const canonical = join(paths.canonical, name);
    await mkdir(canonical, { recursive: true });
    await writeFile(join(canonical, 'SKILL.md'), `---\nname: ${name}\n---\nLocal content\n`);
    lock.skills[name] = { source, sourceType: 'github' };
    await saveLock();
    if (link) {
      await mkdir(paths.claude, { recursive: true });
      await symlink(canonical, join(paths.claude, name), 'dir');
    }
  }
  return { root, paths, lock, saveLock, install };
}

test('rejects ambiguous manifests before installation', () => {
  const invalid = [
    null,
    { ...manifest(), global: false },
    { ...manifest(), agents: [] },
    { ...manifest(), agents: ['unknown'] },
    { ...manifest(), agents: ['codex', 'codex'] },
    { ...manifest(), providers: [] },
    { ...manifest(), globla: true },
  ];
  for (const source of ['--help', '../skills', 'owner/repo/tree/main', 'https://github.com/a/b']) {
    invalid.push({ ...manifest(), providers: [{ source, skills: ['example'] }] });
  }
  for (const skills of [[], ['*'], ['../outside'], ['--all'], ['example', 'example']]) {
    invalid.push({ ...manifest(), providers: [{ source: 'owner/skills', skills }] });
  }
  invalid.push({ ...manifest(), providers: [
    ...manifest().providers, { source: 'other/skills', skills: ['example'] },
  ] });
  for (const value of invalid) assert.throws(() => validateManifest(value));
  assert.equal(validateManifest(manifest()).global, true);
});

test('dry-run lists missing selections without running CLI or creating state', async (t) => {
  const { paths } = await fixture(t);
  const plan = await sync(manifest(), { paths, dryRun: true, log() {},
    run() { assert.fail('dry-run must not execute'); } });
  assert.deepEqual(plan.map((item) => item.action), ['install']);
  await assert.rejects(readFile(paths.lock), { code: 'ENOENT' });
});

test('fresh sync installs exact selections and the second sync is a no-op', async (t) => {
  const f = await fixture(t);
  const calls = [];
  const run = async (args) => { calls.push(args); await f.install(); };
  await sync(manifest(), { paths: f.paths, run, log() {} });
  assert.deepEqual(calls, [[
    '--yes', CLI_PACKAGE, 'add', 'owner/skills', '--global',
    '--agent', 'codex', 'claude-code', '--skill', 'example', '--yes',
  ]]);
  const before = await readFile(f.paths.lock, 'utf8');
  await sync(manifest(), { paths: f.paths, run, log() {} });
  assert.equal(calls.length, 1);
  assert.equal(await readFile(f.paths.lock, 'utf8'), before);
});

test('repairs missing Claude link without refreshing canonical content or lock', async (t) => {
  const f = await fixture(t);
  await f.install('example', 'owner/skills', false);
  const canonical = join(f.paths.canonical, 'example');
  const before = await readFile(f.paths.lock, 'utf8');
  await writeFile(join(canonical, 'notes.md'), 'User edits');
  await sync(manifest(), { paths: f.paths, log() {},
    run() { assert.fail('must not fetch upstream'); } });
  assert.equal(await realpath(join(f.paths.claude, 'example')), canonical);
  assert.equal(await readFile(join(canonical, 'notes.md'), 'utf8'), 'User edits');
  assert.equal(await readFile(f.paths.lock, 'utf8'), before);
});

test('Codex needs only canonical content, while a shadowing legacy copy is a conflict', async (t) => {
  const f = await fixture(t);
  await f.install('example', 'owner/skills', false);
  const value = { ...manifest(), agents: ['codex'] };
  assert.equal((await planSync(value, f.paths))[0].action, 'keep');
  await mkdir(join(f.paths.codexLegacy, 'example'), { recursive: true });
  await assert.rejects(planSync(value, f.paths), /conflicting or independent/);
});

test('source conflict anywhere prevents all writes', async (t) => {
  const f = await fixture(t);
  await f.install('conflict', 'other/skills');
  const value = manifest();
  value.providers[0].skills.push('conflict');
  await assert.rejects(sync(value, { paths: f.paths, log() {},
    run() { assert.fail('must preflight every skill first'); } }), /source\/ref conflict/);
});

test('unknown provenance, custom refs and malformed locks fail closed', async (t) => {
  const f = await fixture(t);
  await f.install();
  delete f.lock.skills.example;
  await f.saveLock();
  await assert.rejects(planSync(manifest(), f.paths), /unknown provenance/);
  f.lock.skills.example = { source: 'owner/skills', sourceType: 'github', ref: 'custom' };
  await f.saveLock();
  await assert.rejects(planSync(manifest(), f.paths), /source\/ref conflict/);
  for (const content of ['{', '{"version":4,"skills":{}}', '{"version":3,"skills":[]}']) {
    await writeFile(f.paths.lock, content);
    await assert.rejects(planSync(manifest(), f.paths));
  }
});

test('independent and broken Claude entries are preserved as conflicts', async (t) => {
  const f = await fixture(t);
  await f.install('example', 'owner/skills', false);
  const target = join(f.paths.claude, 'example');
  await mkdir(target, { recursive: true });
  await assert.rejects(planSync(manifest(), f.paths), /conflicting or independent/);
  await rm(target, { recursive: true });
  await symlink(join(f.root, 'missing'), target);
  await assert.rejects(planSync(manifest(), f.paths));
});

test('an absent installation with a matching stale lock may be restored', async (t) => {
  const f = await fixture(t);
  f.lock.skills.example = { source: 'owner/skills', sourceType: 'github' };
  await f.saveLock();
  assert.equal((await planSync(manifest(), f.paths))[0].action, 'install');
});

test('missing SKILL.md is not considered installed', async (t) => {
  const f = await fixture(t);
  await f.install();
  await rm(join(f.paths.canonical, 'example', 'SKILL.md'));
  await assert.rejects(planSync(manifest(), f.paths));
});

test('CLI failure stops later installs and false success fails post-verification', async (t) => {
  const f = await fixture(t);
  const value = manifest();
  value.providers[0].skills.push('later');
  let calls = 0;
  await assert.rejects(sync(value, { paths: f.paths, log() {}, run() {
    calls++; throw new Error('CLI unavailable');
  } }), /CLI unavailable/);
  assert.equal(calls, 1);
  await assert.rejects(sync(value, { paths: f.paths, log() {}, run() {} }), /verification failed/);
});

test('unselected skills remain untouched', async (t) => {
  const f = await fixture(t);
  await f.install('unmanaged', 'someone/else');
  const before = await readFile(join(f.paths.canonical, 'unmanaged', 'SKILL.md'), 'utf8');
  await sync(manifest(), { paths: f.paths, log() {}, run: () => f.install() });
  assert.equal(await readFile(join(f.paths.canonical, 'unmanaged', 'SKILL.md'), 'utf8'), before);
  assert.equal(JSON.parse(await readFile(f.paths.lock)).skills.unmanaged.source, 'someone/else');
});

test('honors configured agent and XDG lock locations', () => {
  const paths = locations('/example', {
    CODEX_HOME: '/custom/codex', CLAUDE_CONFIG_DIR: '/custom/claude', XDG_STATE_HOME: '/custom/state',
  });
  assert.equal(paths.canonical, '/example/.agents/skills');
  assert.equal(paths.codexLegacy, '/custom/codex/skills');
  assert.equal(paths.claude, '/custom/claude/skills');
  assert.equal(paths.lock, '/custom/state/skills/.skill-lock.json');
  assert.throws(() => locations('/example', { XDG_STATE_HOME: 'relative' }), /absolute/);
});

test('multiple providers install only missing selections from their own source', async (t) => {
  const f = await fixture(t);
  await f.install();
  const value = manifest();
  value.providers[0].skills.push('another');
  value.providers.push({ source: 'second/repo', skills: ['external'] });
  const calls = [];
  await sync(value, { paths: f.paths, log() {}, run: async (args) => {
    const name = args[args.indexOf('--skill') + 1];
    const source = args[args.indexOf('add') + 1];
    calls.push([source, name]);
    await f.install(name, source);
  } });
  assert.deepEqual(calls, [['owner/skills', 'another'], ['second/repo', 'external']]);
  assert.deepEqual((await planSync(value, f.paths)).map((item) => item.action),
    ['keep', 'keep', 'keep']);
});

test('Claude skills directory may itself point to the shared directory', async (t) => {
  const f = await fixture(t);
  await f.install('example', 'owner/skills', false);
  await mkdir(dirname(f.paths.claude), { recursive: true });
  await symlink(f.paths.canonical, f.paths.claude, 'dir');
  assert.equal((await planSync(manifest(), f.paths))[0].action, 'keep');
});
