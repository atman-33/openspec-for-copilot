# spec-explorer Specification

## Purpose
TBD - created by archiving change add-archive-change-command. Update Purpose after archive.
## Requirements
### Requirement: Context Menu
The context menu for changes SHALL include an option to archive the change.

#### Scenario: Archive Change includes custom instructions
- Given I am in the Specs view
- When I right-click on a change item
- And I select "Archive"
- Then the extension executes the archive prompt for that change
- And the prompt is sent using the "Archive Change" instruction context so the configured custom instruction is appended

### Requirement: Display Order
The Spec Explorer SHALL display "Changes" before "Current Specs".

#### Scenario: Default View
- Given the Spec Explorer is opened
- When the tree view is rendered
- Then "Changes" should appear before "Current Specs"

### Requirement: Create Detailed Design
The Spec Explorer SHALL provide a context menu command on change items to generate a detailed design document.

#### Scenario: Create Detailed Design
Given I am in the Specs view
And I right-click on a change item
When I select "Create Detailed Design"
Then the extension should ensure `detailed-design.md` exists under `openspec/changes/<change-id>/` (scaffold if missing)
And the extension should open `detailed-design.md` for editing
And Copilot Chat should be invoked using the prompt at `.github/prompts/openspec-create-detailed-design.prompt.md` plus the change documents as inputs
And I should paste the Copilot output into `detailed-design.md`

### Requirement: Prompt Bootstrapping
The system SHALL create `.github/prompts/openspec-create-detailed-design.prompt.md` with starter content if it does not already exist.

#### Scenario: Missing Prompt File
Given `.github/prompts/openspec-create-detailed-design.prompt.md` does not exist
When I run "Create Detailed Design" for a change
Then the system should create `.github/prompts/openspec-create-detailed-design.prompt.md`
And it should not overwrite the file on subsequent runs

### Requirement: Detailed Design Visibility
When `detailed-design.md` exists for a change, it SHALL be displayed in the Spec Explorer under that change and be openable.

#### Scenario: View Detailed Design
Given `openspec/changes/<change-id>/detailed-design.md` exists
When I expand the change item in the Specs view
Then I should see a "Detailed Design" document entry
And selecting it should open `detailed-design.md`

### Requirement: Update Specs Command
The Spec Explorer SHALL provide a context menu command on change items to update source documents from the detailed design.

#### Scenario: Trigger Update
Given a change item with an existing `detailed-design.md`
When I right-click the change item
Then I should see "Update Specs from Detailed Design" in the context menu
And it should be positioned after "Create Detailed Design"

#### Scenario: Execute Update
Given I have selected "Update Specs from Detailed Design"
Then the extension reads `detailed-design.md` and all source documents (`proposal.md`, `tasks.md`, `design.md`, `specs/**/spec.md`)
And sends a prompt to Copilot Chat instructing it to update the source documents based on the detailed design

#### Scenario: Missing Detailed Design
Given a change item without a `detailed-design.md`
When I try to run "Update Specs from Detailed Design"
Then I should see an error message indicating that the detailed design document is missing

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

