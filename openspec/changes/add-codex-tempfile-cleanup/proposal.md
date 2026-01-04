# Add Codex Temp File Cleanup

## Summary
Add automatic cleanup for Codex temp prompt files under `~/.codex/.tmp/`.

## Motivation
Codex mode currently writes one Markdown file per prompt. Over time, this can accumulate many files and consume disk space.

## Solution
- On each Codex send, delete Markdown files (`*.md`) under `~/.codex/.tmp/` that are older than 7 days.
- Deletion is best-effort (errors are ignored) and scoped strictly to that directory.

## Out of Scope
- Configurable retention days.
- Advanced policies (max file count, size caps).
- Deleting non-`.md` files.
