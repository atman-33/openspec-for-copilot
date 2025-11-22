# Reorder Sidebar Views

## Why
Users often access Global prompts more frequently, so placing them at the top of the Prompts view improves accessibility. Similarly, prioritizing Changes over Current Specs in the Spec Explorer highlights active work.

## What Changes
- **Spec Explorer**: Move "Changes" above "Current Specs".
- **Prompts Explorer**: Move "Global" above "Project".

## Impact
- Affected specs: `spec-explorer`, `prompt-explorer`
- Affected code: `SpecExplorerProvider`, `PromptsExplorerProvider`
