# Spec Explorer Specs

## MODIFIED Requirements

### Context Menu

#### Scenario: Archive Change
Given I am in the Specs view
When I right-click on a change item
Then I should see an "Archive" option
And clicking it should execute the archive prompt for that change
