# Project Overview

This project was initialized with **Levit-Kit**. 
It is designed for a **hybrid workspace** where Human vision leads and AI execution follows.

## 🚀 Quick Start: Human Operator Guide

### 📖 Start Here: Read the Guides

**New to managing AI agents?** Start with the comprehensive guide:
- **[HUMAN_AGENT_MANAGER.md](./HUMAN_AGENT_MANAGER.md)**: Complete guide on managing AI agents effectively

**Migrating an existing project?** Check out:
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**: Step-by-step guide for adopting levit-kit in existing projects

**Setting up CI/CD?** See:
- **[.github/workflows/README.md](./.github/workflows/README.md)**: GitHub Actions workflows
- **[.gitlab-ci.yml](./.gitlab-ci.yml)**: GitLab CI configuration

### 1. The Day One Setup
- **Adjust Governance**: Open `SOCIAL_CONTRACT.md` and tweak the principles to match your vision.
- **Define Standards**: Open `.levit/prompts/global-rules.md` to set your technical expectations (language, styling, strictness).

### 2. The "Intent-First" Workflow
When building a new feature, do not start with code:
1.  **Declare Intent**: Run `levit feature new` and follow the prompts.
2.  **Define Boundaries**: Open the generated file in `.levit/features/` and refine the "User Story" and "Boundaries" section.

### 3. Leading your Agents
When using an AI agent (Antigravity, Cursor, etc.):
1.  **Onboard the Agent**: Direct it to read `.levit/AGENT_ONBOARDING.md` in your first prompt.
2.  **Assign the Task**: Point it to your new intent file in `.levit/features/`.
3.  **Review the Output**: Follow the guides in `.levit/workflows/submit-for-review.md`.

---

## 🏛️ Project Principles
This repository is built for **clarity over automation**:
- **Explicit Structure**: No hidden magic.
- **Human Sovereignty**: You make the final decisions.
- **Traceability**: All technical choices are documented (run `levit decision new` to create a record in `.levit/decisions/`).

## 📂 Navigation
- `HUMAN_AGENT_MANAGER.md`: **Complete guide for managing AI agents** (start here!)
- `MIGRATION_GUIDE.md`: **Guide for migrating existing projects** to levit-kit
- `SOCIAL_CONTRACT.md`: Your ethical and operational foundations.
- `.github/workflows/`: CI/CD workflows for GitHub Actions
- `.gitlab-ci.yml`: CI/CD configuration for GitLab
- `.levit/`: The AI's workspace (Onboarding, Prompts, Workflows, Features, Roles, etc.).
  - `.levit/features/`: The project roadmap and active intents.
  - `.levit/evals/`: Technical quality tests for AI outputs.
  - `.levit/roles/`: Defined roles for the project.
  - `.levit/decisions/`: Architecture Decision Records (ADRs).
  - `.levit/handoff/`: Agent handoff briefs.
