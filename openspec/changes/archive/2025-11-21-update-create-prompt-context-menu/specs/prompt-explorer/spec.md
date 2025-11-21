# prompt-explorer Specification

## ADDED Requirements

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
