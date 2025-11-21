# prompt-explorer Specification

## ADDED Requirements

### Requirement: Delete Prompt Command
The extension MUST provide a "Delete" command in the context menu for prompt files in the PROMPTS view.

#### Scenario: Delete Menu Item
Given the PROMPTS view is open
When the user right-clicks on a prompt file
Then the "Delete" option should be visible in the context menu

### Requirement: Delete Confirmation
The "Delete" command MUST ask for confirmation before deleting the file.

#### Scenario: Confirm Deletion
Given the user selects "Delete" for a prompt file
Then a confirmation dialog should appear asking "Are you sure you want to delete 'filename'?"
And the dialog should have "Delete" and "Cancel" options

### Requirement: File Deletion
The "Delete" command MUST delete the file from the file system if the user confirms.

#### Scenario: User Confirms Deletion
Given the confirmation dialog is open
When the user clicks "Delete"
Then the prompt file should be deleted from the file system
And the PROMPTS view should be refreshed

#### Scenario: User Cancels Deletion
Given the confirmation dialog is open
When the user clicks "Cancel"
Then the prompt file should NOT be deleted
And the PROMPTS view should remain unchanged
