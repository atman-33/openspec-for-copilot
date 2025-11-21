# prompt-explorer Specification

## MODIFIED Requirements

### Requirement: Run Prompt Command
The "Run Prompt" command MUST read the content of the selected prompt file and send it as a message to the GitHub Copilot Chat interface.

#### Scenario: User clicks Run Prompt
Given a prompt file "my-prompt.md" with content "Explain this code"
When the user clicks the "Run Prompt" button on the file in the PROMPTS view
Then the GitHub Copilot Chat window should open
And the message "Explain this code" should be sent to the chat
