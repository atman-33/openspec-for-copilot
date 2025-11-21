# Update Settings View for Copilot

## Summary
Update the Settings view and extension branding to align with "OpenSpec for Copilot". This includes renaming the extension, changing the configuration shortcut to open `mcp.json`, and updating the help link.

## Why
The extension is evolving from "Kiro for Codex IDE" to "OpenSpec for Copilot". The settings view needs to reflect this change and provide access to the relevant configuration file (`mcp.json`) for the new architecture.

## What Changes
1.  **Rename Extension:** Change "Kiro for Codex IDE" to "OpenSpec for Copilot" in `package.json` and UI strings.
2.  **Update Config Action:** Replace "Open Global Config (config.toml)" with "Open MCP Config (mcp.json)".
    *   Target path: `<User Folder>/AppData/Roaming/Code/User/mcp.json`.
3.  **Update Help Link:** Point to `https://github.com/atman-33/openspec-for-copilot#readme`.
