# Fix Tasks CodeLens Visibility

## Summary
Enable the "Start Task" CodeLens (play button) for `tasks.md` files located within the `openspec` directory structure.

## Problem
Currently, the CodeLens for executing tasks does not appear for `tasks.md` files in the `openspec` folder, preventing users from easily running prompt generation tasks directly from the editor.

## Solution
Update the `SpecTaskCodeLensProvider` to correctly validate `tasks.md` files located within the configured specs directory (defaulting to `openspec`).
