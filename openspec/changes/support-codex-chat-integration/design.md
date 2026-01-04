# Design: Codex Chat Integration

## Architecture
The `ChatPromptRunner` or equivalent service responsible for sending instructions to the AI agent will be updated to support multiple strategies.

### Configuration
A new configuration item `openspec.aiAgent` will be added to `package.json`.
-   Type: `string`
-   Enum: `['github-copilot', 'codex']`
-   Default: `'github-copilot'`

### Strategy Pattern
We will implement a strategy pattern or a simple switch to handle the different dispatch logic for each agent.

-   **GitHub Copilot Strategy**: Existing logic (using `vscode.commands.executeCommand('workbench.action.chat.open', ...)` or similar).
-   **Codex Strategy**:
    1.  Generate a temporary file path: `~/.codex/.tmp/YYYYMMDD-<UUID>.md`.
    2.  Ensure the directory exists.
    3.  Write the prompt content to the file.
    4.  Open the file in the editor (`vscode.window.showTextDocument`).
    5.  Select all text (`editor.selection`).
    6.  Execute `chatgpt.addToThread`.

### Temporary File Management
For Codex, we need a reliable way to manage temporary files.
-   Location: `~/.codex/.tmp/` (User home directory based).
-   Naming: `YYYYMMDD-<UUID>.md` to avoid collisions and allow easy sorting/cleanup.
-   Cleanup: We might not strictly need to delete these immediately as they serve as a history, but we should ensure the directory doesn't grow indefinitely if possible (out of scope for this initial change, but good to note).

## Trade-offs
-   **Clipboard/Selection usage**: The Codex workflow requires opening a file and selecting text, which changes the user's focus and selection. This is a limitation of the `chatgpt.addToThread` command (assuming it works on selection).
-   **Dependency**: Depends on the `chatgpt` extension being installed and the command `chatgpt.addToThread` being available.
