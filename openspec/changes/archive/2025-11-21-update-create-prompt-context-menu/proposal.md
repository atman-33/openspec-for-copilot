# Update Create Prompt Context Menu

## Summary
Move the "Create Prompt" command from the PROMPTS view title to the context menu of "Project" and "Global" items, enabling prompt creation in both scopes.

## Motivation
Currently, "Create Prompt" is only available in the view title and defaults to the project scope. Users need the ability to create prompts in the global scope as well. Moving the command to the context menu of the respective group items provides a clear and intuitive way to target the desired scope.

## Proposed Changes
- Remove "Create Prompt" from `view/title` menu in `package.json`.
- Add "Create Prompt" to `view/item/context` menu for `prompt-group-project` and `prompt-group-global` items in `package.json`.
- Update `kiro-codex-ide.prompts.create` command in `src/extension.ts` to accept the tree item as an argument and determine the target directory based on the item's source (project or global).
