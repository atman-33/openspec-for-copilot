## ADDED Requirements

### Requirement: OpenSpec Structure Support
The IDE SHALL support the new OpenSpec directory structure.

#### Scenario: View OpenSpec Structure
Given the user has an `openspec` folder in their workspace
And the folder contains `specs/` and `changes/`
When the user opens the "SPECS" view
Then they should see two top-level sections: "Current Specs" and "Changes"
And "Current Specs" should list folders from `openspec/specs/`
And "Changes" should list folders from `openspec/changes/`

#### Scenario: Navigate Change Proposal
Given the user sees a change proposal "add-2fa" in the "Changes" section
When the user expands "add-2fa"
Then they should see "Proposal", "Tasks", and "Design" items
And clicking "Proposal" should open `openspec/changes/add-2fa/proposal.md`
And clicking "Tasks" should open `openspec/changes/add-2fa/tasks.md`

#### Scenario: Navigate Current Spec
Given the user sees a spec "auth" in the "Current Specs" section
When the user expands "auth"
Then they should see "Spec"
And clicking "Spec" should open `openspec/specs/auth/spec.md`
