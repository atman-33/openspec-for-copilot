# Proposal: Add Archive Change Custom Instructions

## Why
Users want to tailor Copilot behavior specifically for the "Archive Change" workflow, similar to the existing custom instructions for "Start All Task".

## What Changes
- Add a new VS Code setting `openspec-for-copilot.customInstructions.archiveChange`.
- Ensure the setting appears directly below "Start All Task" in VS Code Settings UI.
- Extend the prompt context model to support `instructionType: "archiveChange"`.
- Update the "Archive Change" command to pass the new context so prompts include the configured instruction.

## Impact
- Affected specs: `configuration`, `chat-integration`, `spec-explorer`.
- Affected code:
  - `package.json` (configuration contributions)
  - `src/utils/config-manager.ts` (settings shape + read)
  - `src/utils/chat-prompt-runner.ts` (instruction type support)
  - `src/activation/commands/register-spec-commands.ts` (archive change command context)
  - Tests for the above

## Validation
- Unit tests cover custom instruction injection for the new "Archive Change" context.
- `npm test` passes.
- `npm run compile` passes.
- `openspec validate 2026-01-04-add-archive-change-custom-instructions` passes.
- `openspec validate --all` passes.

> Note: `openspec validate --strict` is interactive in some environments. This proposal uses non-interactive validation commands.
