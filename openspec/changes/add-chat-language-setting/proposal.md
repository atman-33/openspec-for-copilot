# Proposal: Add Chat Language Setting

## Summary
Add a configuration setting to control the language used in GitHub Copilot chat interactions initiated by OpenSpec. This ensures that users can receive responses in their preferred language (English or Japanese), addressing the issue where responses default to English even when the user prefers Japanese.

## Problem Statement
Currently, when OpenSpec sends prompts to GitHub Copilot, the chat responses are typically in English. Users who prefer Japanese (or other languages in the future) have to manually instruct Copilot to switch languages or translate the output, which interrupts the workflow.

## Goals
- Allow users to specify their preferred chat language via VS Code settings.
- Automatically append language instructions to all prompts sent to Copilot by OpenSpec.
- Support a wide range of common languages (English, Japanese, Spanish, French, etc.).

## Non-Goals
- Translating the OpenSpec UI itself (localization of the extension).
- Supporting every possible language immediately (start with a common set).

## Risks
- If the appended instruction is too weak, Copilot might ignore it. We may need to tune the prompt injection.
