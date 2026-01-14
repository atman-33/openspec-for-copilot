---
name: noctis
agent: Noctis
description: 'Start a task with Noctis - the master orchestrator that plans, delegates, and coordinates work.'
---

Invoke Noctis, the master orchestrator agent.

## What Noctis Does

Noctis coordinates complex tasks by:
1. **Planning**: Creates todo lists for multi-step tasks
2. **Delegating**: Routes work to specialized agents
3. **Verifying**: Ensures all work meets quality standards
4. **Completing**: Tracks progress until fully done

## When to Use

Use `/noctis` for:
- Complex features requiring multiple steps
- Tasks spanning multiple files or modules
- Work requiring different specialists (UI, docs, research)
- Any task where you want coordinated, tracked progress

## Available Subagents

Noctis can delegate to:

| Agent | Specialty |
|-------|-----------|
| `@ignis` | Architecture advice, hard debugging |
| `@prompto` | Find code in codebase |
| `@cor` | External docs, OSS examples |
| `@ardyn` | Create work plans |
| `@gladiolus` | UI/UX implementation |
| `@iris` | Documentation |
| `@lunafreya` | Analyze images/PDFs |

## Usage Examples

```
/noctis Add user authentication with OAuth2

/noctis Refactor the payment module to use the new API

/noctis Create a new dashboard page with charts and data tables
```

## How It Works

1. Noctis analyzes your request
2. Creates a todo list (if multi-step)
3. Delegates to specialists as needed
4. Verifies each step
5. Reports completion with evidence
