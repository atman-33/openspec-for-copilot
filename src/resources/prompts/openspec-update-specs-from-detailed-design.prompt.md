---
description: Update source documents (proposal, tasks, design, specs) based on the detailed design.
---

$ARGUMENTS
<!-- OPENSPEC:START -->
**Guardrails**
- Use the provided `detailed-design.md` as the source of truth.
- Do NOT invent new requirements that are not in the detailed design.
- Explain the discrepancies found before providing the updated content.

**Steps**
1. Read the provided inputs: `detailed-design.md` (Source of Truth) and current `proposal.md`, `tasks.md`, `design.md`, and delta specs.
2. Compare the `detailed-design.md` with the other documents to identify discrepancies.
3. For each file that needs updating (`proposal.md`, `tasks.md`, `design.md`, `specs/**/spec.md`):
   - Explain what is outdated or missing.
   - Generate the updated content.
   - Ensure the content aligns with the `detailed-design.md`.
<!-- OPENSPEC:END -->
