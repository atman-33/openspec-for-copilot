# spec-explorer Specification

## Purpose
TBD - created by archiving change add-archive-change-command. Update Purpose after archive.
## Requirements
### Requirement: Context Menu
The context menu for changes SHALL include an option to archive the change.

#### Scenario: Archive Change
Given I am in the Specs view
When I right-click on a change item
Then I should see an "Archive" option
And clicking it should execute the archive prompt for that change

### Requirement: Display Order
The Spec Explorer SHALL display "Changes" before "Current Specs".

#### Scenario: Default View
- Given the Spec Explorer is opened
- When the tree view is rendered
- Then "Changes" should appear before "Current Specs"

