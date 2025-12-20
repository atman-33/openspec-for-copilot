# Proposal: Update Specs from Detailed Design

## Why
The `detailed-design.md` document often evolves during review or implementation planning. When this happens, the original source documents (`proposal.md`, `tasks.md`, `design.md`, and delta specs) become outdated. Manually back-propagating changes from the detailed design to these fragmented files is tedious and error-prone.

## What Changes
- Add a "Update Specs from Detailed Design" command to the Specs view context menu for change items.
- This command reads the current `detailed-design.md` and the existing source documents.
- It constructs a prompt using a template (`.github/prompts/openspec-update-specs-from-detailed-design.prompt.md`) and sends it to Copilot Chat.
- The prompt instructs Copilot to analyze the detailed design and suggest updates to the source documents to ensure consistency.

## Impact
- **User Interface**: New context menu item "Update Specs from Detailed Design" on change items in the Specs view.
- **Files**:
    - New prompt template: `.github/prompts/openspec-update-specs-from-detailed-design.prompt.md`.
    - Reads: `detailed-design.md`, `proposal.md`, `tasks.md`, `design.md`, and delta specs.
    - Actions: Sends instructions to Copilot Chat; does not automatically overwrite files (user reviews and applies changes via Chat).
