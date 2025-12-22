# Proposal: Add Create GitHub Issue Command

## Why
Users want to automate the implementation of specs by assigning GitHub issues to Copilot. Currently, creating an issue from a spec requires manually copying content or references. A dedicated command to create a GitHub issue directly from the Specs view would streamline this workflow.

## What Changes
- Add a "Create GitHub Issue" command to the context menu for change items in the Specs view.
- Create a new prompt template `.github/prompts/openspec-create-github-issue.prompt.md` that instructs Copilot to create an issue.
- The prompt will reference the `proposal.md`, `design.md`, `tasks.md`, and `detailed-design.md` (if available) of the selected change.
- The command will send this prompt to Copilot Chat.

## Impact
- **User Interface**: New context menu item "Create GitHub Issue" in the Specs view.
- **Files**:
    - New prompt template: `.github/prompts/openspec-create-github-issue.prompt.md`.
    - New command registration in `package.json` and `src/activation/register-commands.ts`.
    - New command handler.
