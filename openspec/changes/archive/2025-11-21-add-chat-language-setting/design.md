# Design: Centralized Chat Language Injection

## Context
We need to ensure that every prompt sent to GitHub Copilot by OpenSpec includes an instruction to use the user's preferred language.

## Decision
We will implement a centralized mechanism in `ChatPromptRunner` (or the equivalent utility used for sending prompts) to append the language instruction.

### Alternative Considered: Per-Prompt Modification
We could modify every individual prompt template to include a `{{language}}` variable.
- **Pros**: Explicit control per prompt.
- **Cons**: High maintenance burden. Easy to miss new prompts. Requires updating all existing prompts.

### Chosen Approach: Centralized Injection
Modify `sendPromptToChat` (and any other entry points for chat) to append the language instruction automatically based on the current configuration.

## Detailed Design

### Configuration
Add `openspec-for-copilot.chatLanguage` setting in `package.json`.
- Type: `string`
- Enum: `["en", "ja", "es", "fr", "de", "zh-cn", "zh-tw", "it", "pt-br", "ko", "ru"]`
- Default: `"en"`
- Description: "The language GitHub Copilot should use for responses."

### Implementation Logic
1.  **Config Manager**: Update `ConfigManager` to read the new setting.
2.  **Language Mapping**: Create a mapping from language codes to English language names.
    - `ja` -> "Japanese"
    - `es` -> "Spanish"
    - `fr` -> "French"
    - ...etc
3.  **Prompt Runner**: In `src/utils/chat-prompt-runner.ts`, before calling `workbench.action.chat.open`:
    - Retrieve the preferred language code from `ConfigManager`.
    - If the language is not English (`en`):
        - Look up the English name for the language.
        - Append the instruction: `\n\n(Please respond in ${LanguageName}.)`
    - If the language is English, do not append any instruction (relying on Copilot's default).

### Trade-offs
- **Prompt Length**: Appending text consumes a small amount of context window, but it is negligible compared to the benefit.
- **Flexibility**: This applies globally. If a specific prompt *must* be in English regardless of the setting, we might need an override mechanism later, but for now, a global setting is sufficient for the stated goals.
- **Language Support**: We are hardcoding the mapping of codes to names. This is simple and sufficient for the "Please respond in X" strategy.
