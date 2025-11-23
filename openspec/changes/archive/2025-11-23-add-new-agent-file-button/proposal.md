# Proposal: Add New Agent File Button

## Goal
Add a "New Agent File" button to the Prompts view title bar to allow users to quickly create new agent files, aligning with the existing "New Instruction File" and "New Prompt File" actions.

## Context
The Prompts view currently provides quick access to create Instruction and Prompt files. As Agent files are becoming a first-class citizen in the workflow, a dedicated creation action is required.

## Changes
- **UI**: Add "New Agent File" button to the `openspec-for-copilot.views.promptsExplorer` view title.
- **Ordering**: Ensure the buttons are ordered as follows:
    1. New Agent File
    2. New Instruction File
    3. New Prompt File
- **Command**: The new button will trigger the internal command `workbench.command.new.agent`.

## Implementation Details
- Register a new command `openspec-for-copilot.prompts.createAgentFile`.
- Update `package.json` menus to include the new command and adjust `group` sorting properties.
- Implement the command handler in `src/extension.ts` to delegate to `workbench.command.new.agent`.
