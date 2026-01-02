# levit-kit

Hybrid starter kit for **AI-Driven Development (AIDD)** projects  
(template + CLI + agentic conventions)

---

## Table of contents

- [Why levit-kit exists](#why-levit-kit-exists)
- [What levit-kit does](#what-levit-kit-does)
- [What levit-kit does not do](#what-levit-kit-does-not-do)
- [How levit-kit is used](#how-levit-kit-is-used)
- [Where does the levit command come from](#where-does-the-levit-command-come-from)
- [Social Contract](#social-contract)
- [Nature of the project](#nature-of-the-project)
- [Status](#status)
- [Contributing](#contributing)
- [Guiding principle](#guiding-principle)

---

## Why levit-kit exists

Levit-kit provides a **clean, readable, and predictable starting point** for initiating projects with **AI-Driven Development (AIDD)**.

It does not attempt to automate development, orchestrate agents, or generate business logic.

Its role is simple:  
👉 **install a clear framework in which humans and agents can work properly.**

---

## What levit-kit does

- Initializes a standardized project structure
- Installs explicit conventions for **AI-Driven Development (AIDD)**
- Provides a protocol for Human-AI collaboration (Intents, Decisions, Evals)
- Facilitates human and agent onboarding
- Reduces unnecessary variability between projects

---

## What levit-kit does not do

- It does not generate business logic
- It makes no functional decisions
- It does not execute or orchestrate agents
- It imposes no workflow
- It introduces no magic

These limits are intentional.

---

## How levit-kit is used

Levit-kit is used **once**, at the very beginning of a project.

```bash
# Default template (generic)
npx @buba_71/levit init my-project

# Symfony template
npx @buba_71/levit init my-project symfony

# Interactive template selection (if multiple templates available)
npx @buba_71/levit init my-project
```

### Commands & Options

- `init <name> [template]`: Initializes a new project in the specified directory. Optionally specify a template (default, symfony).
- `feature new`: Creates a new feature intent (auto-assigns ID).
- `feature list`: Lists all features with their status.
- `feature status <id> <status>`: Updates a feature's status.
- `decision new`: Creates a new Architecture Decision Record (ADR) (auto-assigns ID).
- `handoff new`: Creates a workspace handoff brief for an agent.
- `validate`: Validates project structure and cognitive scaffolding.
- `--json`: Outputs machine-readable JSON (works with all commands).
- `-v, --version`: Displays the current version.
- `-h, --help`: Displays the help message.

### Available Templates

- **default**: Generic template for any type of project (structure only)
- **symfony**: Template with Symfony-specific guidelines in `.levit/AGENT_ONBOARDING.md` (structure only)

> **Important**: Templates provide **structure and governance**, not business logic or framework files.
> For Symfony projects, create your Symfony application separately (e.g., `composer create-project symfony/skeleton`)
> and integrate it with the Levit-Kit structure.

### What happens during init?

The `init` command:
1. Creates a new project directory.
2. Copies the **levit-kit template** (structure only, no business logic).
3. Generates a **`levit.json` manifest** with project metadata, governance rules, discovered roles, and constraints.
4. Includes a base `.gitignore`.
5. Exits immediately.

> **Note**: Templates provide only the **AIDD governance structure** (`.levit/` directory with all governance), 
> not project-specific configuration files. You should create your project files (package.json, composer.json, etc.) 
> separately according to your needs.

The `levit.json` file serves as the **central machine-readable contract** for AI agents, containing:
- Project name and description
- Governance settings (autonomy level, risk tolerance)
- Active features and available roles
- Technical constraints (file size limits, allowed dependencies, forbidden patterns)
- Paths to key directories

Levit-kit does not remain in the project after initialization and installs no dependencies.


---

## The AIDD Workflow (Human + Agent)

Levit-kit installs a cognitive pipeline in your project:

1.  **Human Intent**: You define *what* you want using `levit feature new`.
2.  **Agent Onboarding**: Your AI reads `.levit/AGENT_ONBOARDING.md` to learn your rules.
3.  **Collaborative Decision**: The agent or human proposes technical choices using `levit decision new` (stored in `.levit/decisions/`).
4.  **Handoff**: You package the task for an agent using `levit handoff new`.
5.  **Verification**: You or the agent run quality tests in `.levit/evals/`.
6.  **Review**: The agent submits its work following the protocol in `.levit/workflows/`.

> **📖 New to managing AI agents?** After initializing a project, read `HUMAN_AGENT_MANAGER.md` for a comprehensive guide on effectively managing AI agents, including best practices, anti-patterns, and troubleshooting.
>
> **🔄 Migrating an existing project?** See `MIGRATION_GUIDE.md` for step-by-step instructions on adopting levit-kit in your existing codebase.
>
> **🚀 Setting up CI/CD?** Templates for GitHub Actions and GitLab CI are included in all projects for automatic validation.

---

## Examples

### Example 1: Creating a New Feature

```bash
# Interactive mode (prompts for input)
$ levit feature new
Feature title: User Authentication
Feature slug [user-authentication]: 
Created .levit/features/001-user-authentication.md

# Non-interactive mode (with flags)
$ levit feature new --title "User Authentication" --slug user-authentication --yes
Created .levit/features/001-user-authentication.md
```

The created feature file includes:
- Frontmatter with metadata (id, status, owner, risk_level, etc.)
- Template sections: Vision, Success Criteria, Boundaries, Technical Constraints, Agent Task

### Example 2: Creating an Architecture Decision

```bash
# Link a decision to a feature
$ levit decision new --title "Use PostgreSQL for user data" --feature .levit/features/001-user-authentication.md --yes
Created .levit/decisions/ADR-001-use-postgresql-for-user-data.md

# Auto-assign ID
$ levit decision new --title "Implement JWT authentication" --yes
Created .levit/decisions/ADR-002-implement-jwt-authentication.md
```

### Example 3: Creating an Agent Handoff

```bash
# Handoff a feature to a developer agent
$ levit handoff new --feature .levit/features/001-user-authentication.md --role developer --yes
Created .levit/handoff/2026-01-01-001-user-authentication-developer.md

# Handoff to security reviewer
$ levit handoff new --feature .levit/features/001-user-authentication.md --role security --yes
Created .levit/handoff/2026-01-01-001-user-authentication-security.md
```

### Example 4: Validating Project Structure

```bash
# Human-readable output
$ levit validate
🔍 Validating project cognitive scaffolding...
✨ All cognitive scaffolding checks passed!

# JSON output (for automation)
$ levit validate --json
{"level":"INFO","message":"🔍 Validating project cognitive scaffolding...","timestamp":"2026-01-01T12:00:00.000Z"}
{"level":"INFO","message":"✨ All cognitive scaffolding checks passed!","timestamp":"2026-01-01T12:00:00.000Z"}
```

### Example 5: Complete Workflow

Here's a complete workflow from feature creation to agent handoff:

```bash
# 1. Initialize project
$ npx @buba_71/levit init my-api-project
$ cd my-api-project

# 2. Create a feature
$ levit feature new --title "API Rate Limiting" --slug api-rate-limiting --yes
Created .levit/features/001-api-rate-limiting.md

# 3. Create a technical decision
$ levit decision new --title "Use Redis for rate limiting" --feature .levit/features/001-api-rate-limiting.md --yes
Created .levit/decisions/ADR-001-use-redis-for-rate-limiting.md

# 4. Handoff to developer
$ levit handoff new --feature .levit/features/001-api-rate-limiting.md --role developer --yes
Created .levit/handoff/2026-01-01-001-api-rate-limiting-developer.md

# 5. Agent reads handoff and implements
# (Agent reads .levit/handoff/2026-01-01-001-api-rate-limiting-developer.md)

# 6. Validate after implementation
$ levit validate
🔍 Validating project cognitive scaffolding...
✨ All cognitive scaffolding checks passed!
```

### Example 6: Working with the Manifest

The `levit.json` manifest is automatically synced when you create features or decisions. You can also manually inspect it:

```json
{
  "version": "1.0.0",
  "project": {
    "name": "my-api-project",
    "description": "AI-Driven Development project powered by levit-kit"
  },
  "governance": {
    "autonomy_level": "low",
    "risk_tolerance": "low"
  },
  "features": [
    {
      "id": "001",
      "slug": "api-rate-limiting",
      "status": "active",
      "title": "API Rate Limiting",
      "path": ".levit/features/001-api-rate-limiting.md"
    }
  ],
  "roles": [
    {
      "name": "developer",
      "description": "Developer Role",
      "path": "roles/developer.md"
    }
  ],
  "constraints": {
    "max_file_size": 1000000,
    "allowed_dependencies": [],
    "forbidden_patterns": []
  }
}
```

---

## Where does the levit command come from?

The `levit` command is provided through the npm ecosystem.

Levit-kit is published as an npm package exposing a CLI binary named `levit`.
When running the command above, `npx`:

- downloads the package temporarily
- executes the `levit` CLI
- removes it after execution

Nothing is installed in the generated project.

---

## Social Contract

The behavior, boundaries, and evolution of levit-kit are defined in a foundational document:

📄 **[SOCIAL_CONTRACT.md](./SOCIAL_CONTRACT.md)**

👉 All technical decisions, issues, and contributions are evaluated against this contract.

---

## Nature of the project

Levit-kit is a **hybrid tool**:

- a project **template**
- an initialization **CLI**
- a set of **agentic conventions**

Each component remains deliberately simple and decoupled.

---

## Status

- Phase: foundation
- Stability: being defined
- Target audience: developers working with Antigravity

---

## Contributing

Before contributing, please read the social contract.

Contributions aiming to:
- simplify,
- clarify,
- stabilize

are welcome.

Contributions adding complexity, implicit automation, or decision-making logic will be rejected.

---

## Guiding principle

> Levit-kit does not make agents smarter.  
> It makes projects more intelligible.
