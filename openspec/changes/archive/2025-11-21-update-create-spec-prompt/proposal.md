# Update Create Spec Prompt

## Summary
Update the "Create Spec" workflow to use a dynamic prompt template from `.github/prompts/openspec-proposal.prompt.md` instead of the internal hardcoded or compiled prompt. This ensures that the prompt used for spec creation is always in sync with the repository's latest prompt definition without requiring an extension update.

## Motivation
Currently, the prompt for creating a spec is generated using `PromptLoader` which relies on internal templates. The user wants to use a specific file in the repository (`.github/prompts/openspec-proposal.prompt.md`) as the base for the prompt, appending the user's input to it. This allows for easier updates to the prompt strategy by simply modifying the file in the repo.

## Proposed Changes
- Modify `CreateSpecInputController` to read the content of `.github/prompts/openspec-proposal.prompt.md`.
- Concatenate the file content with the user's input from the "Create New Spec" dialog.
- Send this combined content to the chat.
