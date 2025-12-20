# Design: Update Specs from Detailed Design

## Architecture
The implementation mirrors the "Create Detailed Design" command but flows information in the opposite direction.

1.  **Command Trigger**: User selects "Update Specs from Detailed Design" from the change item context menu.
2.  **Context Gathering**:
    *   Read `detailed-design.md`.
    *   Read current `proposal.md`, `tasks.md`, `design.md`.
    *   Read all `spec.md` files in the change's `specs/` directory.
3.  **Prompt Construction**:
    *   Load template from `.github/prompts/openspec-update-specs-from-detailed-design.prompt.md` (scaffold if missing).
    *   Inject the content of `detailed-design.md` as the source of truth.
    *   Inject the current content of other files as targets to be updated.
4.  **Execution**:
    *   Send the constructed prompt to Copilot Chat using `sendPromptToChat`.
    *   Copilot analyzes the differences and proposes updates to the individual files.

## Prompt Strategy
The prompt will explicitly ask Copilot to:
1.  Compare `detailed-design.md` with the provided source files.
2.  Identify discrepancies where the source files are outdated.
3.  Provide updated content for `proposal.md`, `tasks.md`, `design.md`, and specific `spec.md` files.
4.  Format the output so the user can easily apply changes (e.g., using code blocks with file paths).

## Constraints
*   The command relies on the existence of `detailed-design.md`. If missing, it should show an error.
*   It does not automatically write to files to prevent accidental data loss; it relies on the standard Copilot Chat "Apply in Editor" workflow.
