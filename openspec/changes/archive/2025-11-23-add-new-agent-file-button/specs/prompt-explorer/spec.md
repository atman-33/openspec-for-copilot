# prompt-explorer Specification Delta

## ADDED Requirements

### Requirement: New Agent File Action
The Prompts view title bar MUST include a "New Agent File" action that triggers the creation of a new agent file.

#### Scenario: Button Visibility
- **GIVEN** the Prompts view is visible
- **THEN** the "New Agent File" button is displayed in the view title area

#### Scenario: Button Execution
- **GIVEN** the user clicks the "New Agent File" button
- **THEN** the extension executes the `workbench.command.new.agent` command

### Requirement: Prompts View Action Ordering
The actions in the Prompts view title bar MUST be ordered as follows: New Agent File, New Instruction File, New Prompt File.

#### Scenario: Order Check
- **GIVEN** the Prompts view is visible
- **THEN** the actions appear in the order:
    1. New Agent File
    2. New Instruction File
    3. New Prompt File
