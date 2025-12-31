# Changelog

All notable changes to this project will be documented in this file.

This project follows a pragmatic versioning strategy inspired by Semantic Versioning.
Versions `0.x` indicate that the public API and configuration format may still evolve.

---

## [0.4.0] – 2025-12-31

### Added
- **AIDD Lifecycle CLI**: New commands `feature new`, `decision new`, and `handoff new`.
- **Auto-ID Generation**: Sequential 3-digit IDs (001, 002...) automatically assigned to features and ADRs.
- **Shared Core Utilities**: Centralized ID generation and file management logic.
- **Improved Test Suite**: Comprehensive coverage for all CLI commands and project initialization.

### Changed
- **Terminology Shift**: Rebranded from "Antigravity" projects to "AI-Driven Development (AIDD)" projects.
- **Documentation Alignment**: Refreshed all READMEs and onboarding guides to reflect v0.4.0 functionality.
- **Enhanced Agent Onboarding**: Updated `.levit/AGENT_ONBOARDING.md` with new context directories (`decisions`, `handoff`).

### Removed
- Manual `decision-record.md` template (superseded by `levit decision new`).

---

## [0.3.3] – 2025-12-28

### Added
- Foundation-first project structure
- Enhanced agentic boundaries
- Modular documentation templates
- Explicit social contract positioning

### Changed
- CLI refined for minimal, high-impact initialization
- Stabilized configuration format for long-term readability

---

## [0.2.2] – 2025-12-25

### Added
- Role-based documentation templates
- Architecture positioning (3-layer model)
- Initial path handling stabilization


---

## [0.2.1] – 2025-12-22

### Added
- Interactive CLI wizard to initialize Antigravity projects
- Agent selection (product, developer, QA, security, DevOps)
- UX agent selection (presenter, feedback collector)
- Quality & governance configuration (tests, code review, human validation)
- DevOps configuration with optional CI/CD
- GitHub Actions CI/CD template generation
- Project summary and confirmation step before generation

### Changed
- Centralized default values using a single `defaults.ts` source of truth
- Improved CLI UX (no empty selections, clearer prompts)
- Normalized configuration keys using `snake_case`
- Clear separation of concerns between wizard, validator and generator

### Generated Artifacts
- `antigravity.yaml`
- `agents.custom.yaml`
- `docs/README.md`
- `.github/workflows/ci.yml` (optional)

### Stability
- This version is considered **stable for real-world usage**
- Configuration format may still evolve in future `0.x` versions

---

## [0.2.0] – Initial public baseline

### Added
- Initial CLI structure
- Basic Antigravity project generation
- Early wizard experimentation

---

## Planned
- Advanced templates for specific tech stacks (Next.js, Python)
- Adapter support for additional agentic IDEs
- Self-healing project checks (`levit audit`)

