# chat-integration Specification

## Purpose
TBD - created by archiving change add-chat-language-setting. Update Purpose after archive.
## Requirements
### Requirement: Append Language Instruction
All prompts sent to GitHub Copilot via OpenSpec commands MUST include an instruction to respond in the configured language.

#### Scenario: Send Prompt in English (Default)
- Given the `chatLanguage` setting is `en`
- When the user executes a command that sends a prompt to chat (e.g., "Run Prompt", "Create Spec")
- Then the prompt text sent to Copilot should NOT include a specific language instruction (or explicitly request English if needed to override context).
- *Refinement*: Since Copilot defaults to English, we can omit the instruction for `en` to save tokens, or add "Please respond in English" to be explicit. For this iteration, we will omit it for `en` unless testing shows otherwise.

#### Scenario: Send Prompt in Japanese
- Given the `chatLanguage` setting is `ja`
- When the user executes a command that sends a prompt to chat
- Then the prompt text sent to Copilot should end with the directive "Please respond in Japanese."

#### Scenario: Send Prompt in Other Languages
- Given the `chatLanguage` setting is set to another supported language (e.g., `es` for Spanish)
- When the user executes a command that sends a prompt to chat
- Then the prompt text sent to Copilot should end with the directive "Please respond in Spanish."

#### Scenario: Centralized Handling
- Given the developer adds a new feature that uses `sendPromptToChat`
- When the feature is used
- Then the language instruction should be applied automatically without extra code in the new feature.

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

