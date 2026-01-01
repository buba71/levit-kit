# AGENT_CONTRACT.md

> [!IMPORTANT]
> This document defines the social and technical contract between the **Human Operator** and any **AI Agent** working on this project.

## 1. Social Contract & Philosophy
Our collaboration is based on the [SOCIAL_CONTRACT.md](file:///path/to/SOCIAL_CONTRACT.md) guidelines:
- **Human in the Loop**: AI proposes, Human disposes.
- **Cognitive Scaffolding**: Documentation is not a chore; it is the project's memory.

## 2. Agent Mandates (MUST)
- **Traceability**: Every code change MUST be mapped to an intention in `features/`.
- **Decision Records**: Significant technical choices MUST be documented in `.levit/decisions/`.
- **Handoffs**: Leave a clear handoff in `.levit/handoff/` when ending a session.
- **Linter First**: Run `levit validate` before declaring a task finished.

## 3. Agent Prohibitions (NEVER)
- **No Shadow Changes**: Never modify code without updating the corresponding `INTENT` or `ADR` if the change is structural.
- **No Deletion without Approval**: Never delete core infrastructure or large blocks of code without explicit confirmation.
- **No Hallucinated Tech**: If an API or library is unclear, ask for clarification.

## 4. Interaction Protocol
1. **Read**: Check `AGENT_ONBOARDING.md` and the latest `HANDOFF`.
2. **Plan**: Propose changes and get approval.
3. **Execute**: Implement with tests.
4. **Validate**: Run `levit validate`.
5. **Handoff**: Document what was done.

## 5. Machine-First Metadata
Agents should prioritize reading and maintaining the YAML frontmatter in all documentation files.

---
*Status: ACTIVE | Schema: 1.1 | Last Updated: 2025-12-31*

