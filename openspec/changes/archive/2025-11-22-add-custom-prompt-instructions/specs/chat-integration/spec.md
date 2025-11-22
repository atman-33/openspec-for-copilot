# Spec: Chat Integration with Custom Instructions

## ADDED Requirements

### Requirement: Inject Custom Instructions
The `sendPromptToChat` utility MUST append configured custom instructions to the prompt before the language instruction.

#### Scenario: Global instruction only
- Given the user has configured a global instruction "Global Context"
- And no specific instruction is configured
- When a prompt "Hello" is sent
- Then the final prompt sent to Copilot is "Hello\n\nGlobal Context\n\n(Please respond in ...)"

#### Scenario: Specific instruction only
- Given the user has configured a specific instruction "Specific Context" for "Create Spec"
- And no global instruction is configured
- When a "Create Spec" prompt "Make spec" is sent
- Then the final prompt sent to Copilot is "Make spec\n\nSpecific Context\n\n(Please respond in ...)"

#### Scenario: Global and Specific instructions
- Given the user has configured a global instruction "Global Context"
- And a specific instruction "Specific Context" for "Create Spec"
- When a "Create Spec" prompt "Make spec" is sent
- Then the final prompt sent to Copilot is "Make spec\n\nGlobal Context\n\nSpecific Context\n\n(Please respond in ...)"

#### Scenario: Order of injection
- The order MUST be: Original Prompt -> Global Instruction -> Specific Instruction -> Language Instruction.
