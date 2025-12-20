# Hide Missing Change Files in Sidebar

## Summary
Currently, the OpenSpec sidebar displays entries for `proposal.md`, `tasks.md`, and `design.md` for every change, regardless of whether these files actually exist. This leads to clutter and potential confusion, especially for optional files like `design.md`. This proposal aims to filter out these entries if the corresponding files do not exist on the filesystem.

## Motivation
- **Reduce Clutter**: Only show relevant files to the user.
- **Avoid Confusion**: Prevent users from clicking on files that don't exist or thinking they need to create them when they are optional.
- **Better UX**: A cleaner interface that reflects the actual state of the project.

## Proposed Changes
- Modify `SpecExplorerProvider` to check for the existence of `proposal.md`, `tasks.md`, and `design.md` before adding them to the tree view.
- Use `vscode.workspace.fs.stat` or similar to check for file existence.
