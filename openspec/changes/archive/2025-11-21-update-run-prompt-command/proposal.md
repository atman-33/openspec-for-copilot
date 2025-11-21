# Update Run Prompt Command

## Summary
Update the "Run Prompt" command in the PROMPTS view to send the prompt content directly to GitHub Copilot Chat, aligning the behavior with "Create Spec" and "Start Task" commands.

## Motivation
The current implementation of "Run Prompt" only adds the prompt file as context to the chat but does not execute it. Users expect "Run Prompt" to immediately send the prompt to the chat for execution.

## Proposed Changes
- Modify `PromptsExplorerProvider.runPrompt` to read the file content and use `sendPromptToChat` to send it to GitHub Copilot Chat.
