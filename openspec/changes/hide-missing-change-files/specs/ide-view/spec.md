# ide-view Specification

## ADDED Requirements

### Requirement: Hide Missing Change Files
The IDE SHALL hide change files (proposal, tasks, design) from the sidebar if they do not exist.

#### Scenario: Navigate Change Proposal with Missing Files
Given the user sees a change proposal "add-2fa" in the "Changes" section
And the folder `openspec/changes/add-2fa` contains `proposal.md`
And the folder `openspec/changes/add-2fa` does NOT contain `design.md`
When the user expands "add-2fa"
Then they should see "Proposal" item
And they should NOT see "Design" item
