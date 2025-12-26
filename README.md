# levit-kit

Hybrid starter kit for **Antigravity** projects  
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

Levit-kit provides a **clean, readable, and predictable starting point** for initiating projects with Google Antigravity.

It does not attempt to automate development, orchestrate agents, or generate business logic.

Its role is simple:  
👉 **install a clear framework in which humans and agents can work properly.**

---

## What levit-kit does

- Initializes a standardized project structure
- Installs explicit conventions
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
npx levit init my-project
```

This command:
- creates a new project directory
- copies the default levit-kit template
- installs no dependency
- exits immediately

Levit-kit does not remain in the project after initialization.

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
