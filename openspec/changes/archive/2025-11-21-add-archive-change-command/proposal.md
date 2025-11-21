# Proposal: Add Archive Change Command

## Summary
Add a context menu item to archive changes in the Specs view. This allows users to archive completed or abandoned changes using a predefined prompt.

## Motivation
Currently, there is no UI-driven way to archive changes. Users have to manually run the `openspec archive` command or move files. Adding this feature streamlines the workflow.

## Solution
- Add "Archive" command to the context menu of change items in the Specs view.
- Execute the `openspec-archive.prompt.md` prompt with the change ID when the command is triggered.
