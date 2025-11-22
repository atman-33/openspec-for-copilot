# Spec: Custom Instructions Configuration

## ADDED Requirements

### Requirement: Global Custom Instruction Setting
The extension MUST provide a configuration setting for a global custom instruction that applies to all prompts.

#### Scenario: User configures global instruction
- Given the user opens VS Code settings
- When they search for "openspec custom instructions"
- Then they see a "Global" setting
- And they can enter a multiline string

### Requirement: Specific Custom Instruction Settings
The extension MUST provide configuration settings for specific custom instructions for "Create Spec", "Start All Task", and "Run Prompt".

#### Scenario: User configures specific instructions
- Given the user opens VS Code settings
- When they search for "openspec custom instructions"
- Then they see settings for "Create Spec", "Start All Task", and "Run Prompt"
- And they can enter multiline strings for each
