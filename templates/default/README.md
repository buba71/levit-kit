# Project Overview

This project was initialized with **Levit-Kit**. 
It is designed for a **hybrid workspace** where Human vision leads and AI execution follows.

## 🚀 Quick Start: Human Operator Guide

### 1. The Day One Setup
- **Adjust Governance**: Open `SOCIAL_CONTRACT.md` and tweak the principles to match your vision.
- **Define Standards**: Open `.levit/prompts/global-rules.md` to set your technical expectations (language, styling, strictness).

### 2. The "Intent-First" Workflow
When building a new feature, do not start with code:
1.  **Declare Intent**: Copy `features/INTENT.md` to a new file (e.g., `features/001-my-feature.md`).
2.  **Define Boundaries**: Fill in the "User Story" and especially the "Boundaries" section (what the AI must NOT touch).

### 3. Leading your Agents
When using an AI agent (Antigravity, Cursor, etc.):
1.  **Onboard the Agent**: Direct it to read `.levit/AGENT_ONBOARDING.md` in your first prompt.
2.  **Assign the Task**: Point it to your new intent file in `features/`.
3.  **Review the Output**: Follow the guides in `.levit/workflows/submit-for-review.md`.

---

## 🏛️ Project Principles
This repository is built for **clarity over automation**:
- **Explicit Structure**: No hidden magic.
- **Human Sovereignty**: You make the final decisions.
- **Traceability**: All technical choices are documented (see `.levit/decision-record.md`).

## 📂 Navigation
- `SOCIAL_CONTRACT.md`: Your ethical and operational foundations.
- `.levit/`: The AI's workspace (Onboarding, Prompts, Workflows).
- `features/`: The project roadmap and active intents.
- `evals/`: Technical quality tests for AI outputs.
