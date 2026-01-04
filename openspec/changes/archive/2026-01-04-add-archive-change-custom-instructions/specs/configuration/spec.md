# Spec: Custom Instructions Configuration (Archive Change)

## MODIFIED Requirements

### Requirement: Specific Custom Instruction Settings
The extension MUST provide configuration settings for specific custom instructions for "Create Spec", "Start All Task", "Archive Change", and "Run Prompt".

#### Scenario: User configures specific instructions including Archive Change
- Given the user opens VS Code settings
- When they search for "openspec custom instructions"
- Then they see settings for "Create Spec", "Start All Task", "Archive Change", and "Run Prompt"
- And "Archive Change" appears immediately after "Start All Task"
- And they can enter multiline strings for each
