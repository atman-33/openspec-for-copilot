# prompt-explorer Specification

## MODIFIED Requirements

### Requirement: Prompt File Extension
When creating a new prompt, the file extension MUST be `.prompt.md`.

#### Scenario: Create New Prompt
Given the user triggers the "Create Prompt" command
When the user enters the name "my-test"
Then a file named "my-test.prompt.md" should be created
