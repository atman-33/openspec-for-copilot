# Support Codex Chat Integration

## Summary
Add support for sending instructions to Codex Chat in addition to the existing GitHub Copilot Chat integration. This allows users to choose their preferred AI agent for executing tasks like "create new spec" or "task start".

## Motivation
Currently, the extension is hardcoded to use GitHub Copilot Chat. Some users prefer or require Codex Chat for their workflows. By supporting Codex, we expand the extension's usability and flexibility.

## Solution
1.  Introduce a configuration setting `openspec-for-copilot.aiAgent` to select between `github-copilot` (default) and `codex`.
2.  Implement a specific workflow for Codex integration:
    -   Create a temporary markdown file with the instruction.
    -   Open and select the content of the file.
    -   Execute `chatgpt.addToThread` command.

