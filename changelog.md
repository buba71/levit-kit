# Changelog

All notable changes to this project will be documented in this file.

This project follows a pragmatic versioning strategy inspired by Semantic Versioning.
Versions `0.x` indicate that the public API and configuration format may still evolve.

---

## [0.2.2] – 2025-xx-xx

### Added
- Modular CI generation
- Role-based documentation templates
- Roles index with dynamic links
- Architecture positioning (3-layer model)

### Changed
- Validator now emits warnings instead of blocking errors


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
- Initiative-based workflows (feature / refactor / bugfix)
- Advanced templates
- Adapter support for additional agentic IDEs
- CLI tests

