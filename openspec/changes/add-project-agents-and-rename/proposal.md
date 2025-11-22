## Why
The Prompts explorer currently hides `.github/agents` content, so teams cannot reference their project-specific agent definitions alongside prompts and instructions. The context menu also lacks a rename flow, forcing users to manually rename files in the filesystem and leaving the "Delete Prompt" label inaccurate when applied to non-prompt files.

## What Changes
- Add a `Project Agents` group beneath `Project Instructions`, sourcing files from `.github/agents` with the same tree behaviors as the existing project folders.
- Keep the group ordering explicit so the explorer renders `Global`, `Project Prompts`, `Project Instructions`, then `Project Agents`.
- Introduce a context-menu `Rename` command for prompt, instruction, and agent files; place it above the `Delete` entry.
- Relabel the existing `Delete Prompt` action to `Delete` to reflect its broader scope and refresh the tree after renames.
- Backfill tests and specs describing the new folder, ordering rules, and rename workflow.

## Impact
- Affected specs: `prompt-explorer`
- Affected code: `src/providers/prompts-explorer-provider.ts`, `package.json` (menus/commands), `src/utils/config-manager.ts`, prompt-related tests, any prompt tree context types.
