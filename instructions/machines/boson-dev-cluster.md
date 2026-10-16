# boson-dev-cluster

Load only when the local global-instruction entry explicitly selects this profile.
It applies to Boson dev cluster hosts such as a100-1 and a100-4. Do not apply it
to a Mac or other host merely because it has a GPU.

Use /local/numa1/scratch/xiling for disposable artifacts. Avoid /tmp when this
scratch directory is available and writable. If unavailable, report the mismatch
and use an authorized temporary location; do not silently create the host path.

Track artifacts created for the task and clean only those artifacts afterward.
Never recursively delete the shared scratch root or unrelated files.
