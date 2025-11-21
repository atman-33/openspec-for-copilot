# Use .prompt.md Extension

## Summary
Change the file extension for newly created prompts from `.md` to `.prompt.md`.

## Motivation
To better distinguish prompt files from regular Markdown files, we should use the `.prompt.md` extension. This convention helps in identifying files that are intended to be executed as prompts.

## Proposed Changes
- Update `kiro-codex-ide.prompts.create` command in `src/extension.ts` to append `.prompt.md` instead of `.md` to the user-provided name.
