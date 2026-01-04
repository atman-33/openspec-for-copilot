# Spec: Archive Change Custom Instructions

## MODIFIED Requirements

### Requirement: Context Menu
The context menu for changes SHALL include an option to archive the change.

#### Scenario: Archive Change includes custom instructions
- Given I am in the Specs view
- When I right-click on a change item
- And I select "Archive"
- Then the extension executes the archive prompt for that change
- And the prompt is sent using the "Archive Change" instruction context so the configured custom instruction is appended
