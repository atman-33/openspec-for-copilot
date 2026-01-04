# Design: Create GitHub Issue Command

## Architecture
The feature will be implemented as a VS Code command `openspec.createGitHubIssue` triggered from the `SpecExplorerProvider` tree view.

### Components
1.  **Command Registration**: The command will be registered in `src/activation/register-commands.ts`.
2.  **Command Handler**: A new handler function will be created (e.g., in `src/features/spec/create-github-issue.ts` or similar) to:
    -   Identify the selected change ID.
    -   Resolve paths to relevant spec files (`proposal.md`, `design.md`, `tasks.md`, `detailed-design.md`).
    -   Load the prompt template `.github/prompts/openspec-create-github-issue.prompt.md`.
    -   Construct the prompt message.
    -   Send the prompt to Copilot Chat using `ChatPromptRunner` or `CopilotChatUtils`.
3.  **Prompt Template**: A new Markdown prompt template will be added to `.github/prompts/`. This template will instruct Copilot to create a GitHub issue with a title derived from the change ID/proposal and a body referencing the spec files.

### Data Flow
1.  User right-clicks a change item in Specs view -> "Create GitHub Issue".
2.  `openspec.createGitHubIssue` is invoked with the tree item context.
3.  Handler resolves file paths for the change.
4.  Handler constructs the prompt.
5.  Handler invokes Copilot Chat.
6.  Copilot Chat (with user confirmation/interaction) creates the issue.

## Trade-offs
-   **Prompt vs. API**: We are using a prompt to instruct Copilot to create the issue rather than using the GitHub API directly. This aligns with the "Copilot-first" philosophy of OpenSpec and allows the user to review/refine the issue content in the chat before creation.
