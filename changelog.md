# Changelog

All notable changes to this project will be documented in this file.

This project follows a pragmatic versioning strategy inspired by Semantic Versioning.
Versions `0.x` indicate that the public API and configuration format may still evolve.

---

## [0.8.1] – 2026-01-02

### Added
- **Human-Agent Manager Guide**: Comprehensive guide for developers on managing AI agents effectively
  - Complete documentation on the Human-AI partnership model
  - Best practices for creating features, decisions, and handoffs
  - Anti-patterns to avoid and troubleshooting guide
  - Included in all project templates (default and symfony)
  - Referenced prominently in project README files

### Changed
- **Project Templates**: Updated README files to prominently feature the Human-Agent Manager Guide
- **Main README**: Added reference to the guide in the AIDD Workflow section

---

## [0.8.0] – 2026-01-02

### Added
- **Enhanced UX with Colors and Formatting**:
  - Colorized output using `chalk` for all log levels (info, warn, error, success)
  - Formatted tables using `cli-table3` for `levit feature list` and `levit validate`
  - Color-coded status indicators in feature lists (green=active, yellow=draft, red=deprecated, cyan=completed)
- **Preview Before Creation**:
  - Preview boxes showing feature/decision/handoff details before creation
  - Interactive confirmation prompts (can be skipped with `--yes` flag)
  - Clear visual feedback for all create operations
- **Improved Error Messages**:
  - Contextual suggestions for each error type
  - Formatted error display with color coding
  - Structured error output in JSON mode
  - New `error_helper.ts` module for consistent error handling

### Changed
- **Logger Enhancement**:
  - Added `success()` method for success messages (green)
  - Added `getJsonMode()` method for checking JSON mode
  - All log levels now use appropriate colors (blue=info, yellow=warn, red=error, green=success)
- **Command Output**:
  - `levit feature list`: Now displays formatted table with color-coded statuses
  - `levit validate`: Now displays separate tables for errors and warnings with color coding
  - All create commands (`feature new`, `decision new`, `handoff new`) show preview before creation
- **Error Handling**:
  - All errors now display with helpful suggestions
  - Better error formatting with visual hierarchy
  - Improved error messages in CLI entry point

### Technical Improvements
- Added `chalk` v4.1.2 dependency for terminal colors
- Added `cli-table3` v0.6.5 dependency for formatted tables
- Created `src/core/table.ts` helper module for table creation and rendering
- Created `src/core/error_helper.ts` for consistent error display with suggestions
- Enhanced `Logger` class with color support while maintaining JSON mode compatibility
- All improvements maintain backward compatibility with JSON mode

---

## [0.7.0] – 2026-01-01

### Added
- **Auto-sync Manifest**: `levit.json` is now automatically synchronized after creating features, decisions, or handoffs
- **Feature Management Commands**: 
  - `levit feature list`: Lists all features with their status
  - `levit feature status <id> <status>`: Updates a feature's status (active, draft, deprecated, completed)
- **Dependency Validation**: 
  - Validates that all `depends_on` references exist (features or decisions)
  - Detects circular dependencies in feature dependencies
- **Constraint Validation**: 
  - Validates `max_file_size` constraint (reports files exceeding limit)
  - Validates `forbidden_patterns` constraint (scans code for forbidden patterns)
  - Validates `allowed_dependencies` constraint (checks package.json against allowed list)

### Changed
- **FeatureService**: Now includes `listFeatures()` and `updateFeatureStatus()` methods
- **ValidationService**: Enhanced with dependency and constraint validation
- **Manifest Sync**: Automatic sync after all create operations (feature, decision, handoff)

### Technical Improvements
- Improved error messages for dependency validation
- Circular dependency detection using DFS algorithm
- File size and pattern validation with efficient directory traversal

---

## [0.5.0] – 2026-01-01

### Added
- **V2 Architecture**: Layered architecture with clear separation between Commands, Services, and Types
- **Machine-Readable Manifest**: `levit.json` generated for every project with governance rules, features, roles, and constraints
- **Structured Error Handling**: `LevitError` with typed error codes for machine-readable errors
- **Standardized Logging**: Centralized `Logger` with JSON output mode (`--json` flag)
- **Validation Command**: `levit validate` to check project structure and cognitive scaffolding
- **ManifestService**: Automatic discovery and syncing of features and roles from filesystem
- **Comprehensive Test Suite**: 24 tests (9 integration + 15 unit tests) organized by layer

### Changed
- **Services Layer**: All business logic extracted to pure services (FeatureService, DecisionService, HandoffService, ValidationService)
- **Commands Layer**: CLI commands now thin wrappers that delegate to services
- **Test Structure**: Tests reorganized into `tests/cli/` (integration) and `tests/services/` (unit)
- **Build Artifacts**: `dist/` removed from version control, generated on publish via `prepublishOnly`
- **Documentation**: Updated README.md, created ARCHITECTURE.md, updated CONTRIBUTING.md

### Technical Improvements
- Strong typing for all domain concepts (Feature, Decision, Handoff)
- ValidationService returns structured results instead of exiting
- All output goes through Logger (supports human and JSON modes)
- Services are pure functions (no side effects, testable in isolation)

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

