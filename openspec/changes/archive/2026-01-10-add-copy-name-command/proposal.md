# Proposal: Add Copy Name Command

## Why
Users need to quickly copy the name of a change or spec to reference it in AI Assistant chats or other contexts. Currently, there is no way to copy the name from the Spec Explorer tree view, forcing users to manually type or navigate to find the identifier.

## What Changes
- Add a "Copy Name" context menu command for `change` items in the Spec Explorer
- Add a "Copy Name" context menu command for `spec` items in the Spec Explorer
- The command copies the item's name (e.g., `add-copy-name-command` or `spec-explorer`) to the system clipboard
- Display a confirmation notification after copying

## Impact
- Affected specs: `spec-explorer`
- Affected code: 
  - `src/activation/commands/register-spec-commands.ts` (new command registration)
  - `src/providers/spec-explorer-provider.ts` (no changes needed, uses existing `specName` property)
  - `package.json` (command definition and context menu contribution)
