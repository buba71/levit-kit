# Levit-Kit: Roadmap v1.0 (AIDD Vision)

This document outlines the current state of Levit-Kit and the strategic path forward to becoming the standard for AI-Driven Development (AIDD) governance.

## 🟢 Current State (v0.4.0-alpha)

We have successfully transformed Levit-Kit into an **AI-Aware Scaffolding tool**. 

### 1. AI-First Onboarding
- **`.levit/AGENT_ONBOARDING.md`**: Immediate context for agents.
- **`.levit/prompts/`**: Centralized governance for AI behavior.
- **`SOCIAL_CONTRACT.md`**: Formalized Human-AI collaboration rules.

### 2. Intent-Driven Specification
- **`features/INTENT.md`**: Human-first specification template.
- **Boundaries Management**: Explicit "Out of Scope" sections to prevent AI drift.
- **ADR for AI**: Decision Record templates for technical traceability.

### 3. Technical Empowerment
- **`evals/`**: First-class support for AI quality testing.
- **Conformance Scripts**: Automated validation of agent adherence to project rules.

---

## 🟡 Short-Term Goals (Next Steps)

- [ ] **Live Eval Integration**: Integrated support for tools like `promptfoo` or `langsmith` out of the box.
- [ ] **Multi-Template Support**: Specialized templates for Next.js, Python/FastAPI, and Rust, all sharing the same `.levit/` governance.
- [ ] **Human-Agent Manager Guide**: Documentation dedicated to the Human developer on "How to manage your AI agents effectively".
- [ ] **CLI Polish**: Enhanced interactive mode for choosing specific AIDD modules during `init`.

## 🔵 Long-Term Vision

- **Self-Healing Projects**: Using Evals and Prompts to allow the project to detect and suggest refactoring needs automatically.
- **Agent Interoperability**: Ensuring Levit-Kit projects work seamlessly across Antigravity, Cursor, Windsurf, and other agentic IDEs.
- **Governance as Code**: Formalizing project policy into executable rules that any agent must respect.

---
*Levit-Kit: Elevating the partnership between human vision and AI execution.*
