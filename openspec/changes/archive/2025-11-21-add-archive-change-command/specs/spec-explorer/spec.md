# Spec Explorer Specs

## ADDED Requirements

### Requirement: Context Menu
The context menu for changes SHALL include an option to archive the change.

#### Scenario: Archive Change
Given I am in the Specs view
When I right-click on a change item
Then I should see an "Archive" option
And clicking it should execute the archive prompt for that change
