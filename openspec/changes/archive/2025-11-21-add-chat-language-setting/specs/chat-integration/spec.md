# Spec: Chat Language Integration

## ADDED Requirements

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
