# Spec: Chat Integration with Custom Instructions (Archive Change)

## MODIFIED Requirements

### Requirement: Inject Custom Instructions
The `sendPromptToChat` utility MUST append configured custom instructions to the prompt before the language instruction.

#### Scenario: Specific instruction only (Archive Change)
- Given the user has configured a specific instruction "Specific Context" for "Archive Change"
- And no global instruction is configured
- When an "Archive Change" prompt "Archive this change" is sent
- Then the final prompt sent to Copilot is "Archive this change\n\nSpecific Context\n\n(Please respond in ...)"

#### Scenario: Global and Specific instructions (Archive Change)
- Given the user has configured a global instruction "Global Context"
- And a specific instruction "Specific Context" for "Archive Change"
- When an "Archive Change" prompt "Archive this change" is sent
- Then the final prompt sent to Copilot is "Archive this change\n\nGlobal Context\n\nSpecific Context\n\n(Please respond in ...)"

#### Scenario: Order of injection (unchanged)
- The order MUST be: Original Prompt -> Global Instruction -> Specific Instruction -> Language Instruction.
