# Spec Explorer Specs

## ADDED Requirements

### Requirement: Create Detailed Design
The Spec Explorer SHALL provide a context menu command on change items to generate a detailed design document.

#### Scenario: Create Detailed Design
Given I am in the Specs view
And I right-click on a change item
When I select "Create Detailed Design"
Then the extension should generate `detailed-design.md` under `openspec/changes/<change-id>/`
And the content should be produced using the prompt at `.github/prompts/openspec-add-detailed-design.prompt.md` plus the change documents as inputs

### Requirement: Prompt Bootstrapping
The system SHALL create `.github/prompts/openspec-add-detailed-design.prompt.md` with starter content if it does not already exist.

#### Scenario: Missing Prompt File
Given `.github/prompts/openspec-add-detailed-design.prompt.md` does not exist
When I run "Create Detailed Design" for a change
Then the system should create `.github/prompts/openspec-add-detailed-design.prompt.md`
And it should not overwrite the file on subsequent runs

### Requirement: Detailed Design Visibility
When `detailed-design.md` exists for a change, it SHALL be displayed in the Spec Explorer under that change and be openable.

#### Scenario: View Detailed Design
Given `openspec/changes/<change-id>/detailed-design.md` exists
When I expand the change item in the Specs view
Then I should see a "Detailed Design" document entry
And selecting it should open `detailed-design.md`
