# Spec: Spec Explorer - Create GitHub Issue

## ADDED Requirements

### Requirement: Create GitHub Issue Command
The Spec Explorer SHALL provide a command to create a GitHub issue based on the selected change spec.

#### Scenario: User creates GitHub issue from change
- Given the user has the Specs view open
- And there is a change item listed
- When the user right-clicks on the change item
- Then a "Create GitHub Issue" option is available in the context menu
- When the user selects "Create GitHub Issue"
- Then a prompt is sent to Copilot Chat instructing it to create a GitHub issue for the change
- And the prompt references the `proposal.md`, `design.md`, `tasks.md`, and `detailed-design.md` (if present) of the change
