# prompt-explorer Specification

## Purpose
TBD - created by archiving change add-global-prompt-folders. Update Purpose after archive.
## Requirements
### Requirement: Prompt Source Grouping
The Prompts tree MUST organize prompt items under `Global`, `Project Prompts`, `Project Instructions`, and `Project Agents` group nodes so each directory surfaces in its own section.

#### Scenario: View Project Prompts
Given I have files in `.github/prompts`, `.github/instructions`, or `.github/agents`
When I open the Prompts view
Then I should see "Global", "Project Prompts", "Project Instructions", and "Project Agents" groups
And the files from each directory appear under their matching group

### Requirement: Resolve Global Prompt Directory
The extension MUST locate the platform-specific global prompt directory when populating the Prompts view.

#### Scenario: Detect platform-specific directory
- **GIVEN** the user is running on Linux, macOS, or Windows with a `.copilot/prompts` folder in their home directory
- **WHEN** the Prompts view loads prompt data
- **THEN** the extension reads prompts from the appropriate global path for the current platform and lists them under the `Global` group

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

### Requirement: Create Prompt Command Location
The "Create Prompt" command SHALL be available in the context menu of the "Project" and "Global" group items in the PROMPTS view, and SHALL NOT be available in the view title.

#### Scenario: Context Menu for Project
Given the PROMPTS view is open
When the user right-clicks on the "Project" item
Then the "Create Prompt" option should be visible

#### Scenario: Context Menu for Global
Given the PROMPTS view is open
When the user right-clicks on the "Global" item
Then the "Create Prompt" option should be visible

### Requirement: Create Prompt Scope
The "Create Prompt" command MUST create the prompt file in the directory corresponding to the selected scope (Project or Global).

#### Scenario: Create Project Prompt
Given the user selects "Create Prompt" from the "Project" item context menu
When the user enters a valid file name
Then the prompt file should be created in the configured project prompts directory

#### Scenario: Create Global Prompt
Given the user selects "Create Prompt" from the "Global" item context menu
When the user enters a valid file name
Then the prompt file should be created in the global prompts directory (`~/.github/prompts`)

### Requirement: Run Prompt Command
The "Run Prompt" command MUST read the content of the selected prompt file and send it as a message to the GitHub Copilot Chat interface.

#### Scenario: User clicks Run Prompt
Given a prompt file "my-prompt.md" with content "Explain this code"
When the user clicks the "Run Prompt" button on the file in the PROMPTS view
Then the GitHub Copilot Chat window should open
And the message "Explain this code" should be sent to the chat

### Requirement: Prompt File Extension
When creating a new prompt, the file extension MUST be `.prompt.md`.

#### Scenario: Create New Prompt
Given the user triggers the "Create Prompt" command
When the user enters the name "my-test"
Then a file named "my-test.prompt.md" should be created

### Requirement: Display Order
The Prompts Explorer SHALL display the group nodes in the following order: `Global`, `Project Prompts`, `Project Instructions`, `Project Agents`.

#### Scenario: Default View
Given the Prompts Explorer is opened
When the tree view is rendered
Then "Global" appears first, followed by "Project Prompts", "Project Instructions", and "Project Agents" in that order

### Requirement: Project Instructions Display
The Prompts tree MUST include a `Project Instructions` group node that lists files from the `.github/instructions` directory.

#### Scenario: View Project Instructions
Given I have files in `.github/instructions`
When I open the Prompts view
Then I should see a "Project Instructions" group
And it should list the files from `.github/instructions`

### Requirement: Project Agents Display
The Prompts tree MUST include a `Project Agents` group node that lists files located under `.github/agents`, mirroring the behaviors of `Project Instructions` items.

#### Scenario: View Project Agents
Given I have files in `.github/agents`
When I open the Prompts view
Then I should see a "Project Agents" group directly beneath "Project Instructions"
And it should list the files from `.github/agents`

### Requirement: Rename Prompt Command
The PROMPTS view context menu MUST expose a `Rename` command for prompt, instruction, and agent files, positioned above `Delete`, and it MUST rename the underlying file without overwriting other files.

#### Scenario: Rename Option Placement
Given the PROMPTS view is open
When the user right-clicks on any prompt, instruction, or agent file
Then the context menu shows "Rename" directly above "Delete"

#### Scenario: Rename File
Given the user selects "Rename" and enters a new valid filename
Then the command renames the underlying file on disk without overwriting an existing file
And the PROMPTS view refreshes to show the updated filename

