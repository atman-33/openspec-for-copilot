# Add Delete Prompt Command

## Summary
Add a "Delete" command to the context menu of prompt files in the PROMPTS view, allowing users to delete prompt files after confirmation.

## Motivation
Users currently have no way to delete prompt files directly from the PROMPTS view. They have to use the file explorer or terminal. Adding this functionality improves the management of prompt files within the extension.

## Proposed Changes
- Add `kiro-codex-ide.prompts.delete` command to `package.json`.
- Add the command to the `view/item/context` menu for `prompt` items in the PROMPTS view.
- Implement the command handler in `src/extension.ts` to:
    - Confirm deletion with a modal dialog.
    - Delete the file if confirmed.
    - Refresh the PROMPTS view.
