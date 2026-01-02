# Human-Agent Manager Guide

> **For Human Developers**: This guide teaches you how to effectively manage AI agents in your levit-kit project.

---

## Table of Contents

1. [Understanding the Partnership](#understanding-the-partnership)
2. [Setting Up for Success](#setting-up-for-success)
3. [The Intent-First Workflow](#the-intent-first-workflow)
4. [Creating Effective Features](#creating-effective-features)
5. [Making Decisions Together](#making-decisions-together)
6. [Handoffs That Work](#handoffs-that-work)
7. [Reviewing Agent Work](#reviewing-agent-work)
8. [Best Practices](#best-practices)
9. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
10. [Troubleshooting](#troubleshooting)

---

## Understanding the Partnership

### The Human-AI Collaboration Model

In a levit-kit project, you and your AI agent have distinct but complementary roles:

**Your Role (Human)**:
- **Vision**: Define *what* needs to be built and *why*
- **Decisions**: Make architectural and business choices
- **Validation**: Review and approve agent work
- **Boundaries**: Set clear limits on what's in and out of scope

**Agent Role (AI)**:
- **Execution**: Implement the *how* based on your specifications
- **Suggestions**: Propose technical solutions and improvements
- **Consistency**: Maintain code quality and project standards
- **Documentation**: Keep technical records up to date

### Why This Matters

Clear role separation prevents:
- ❌ Agents making business decisions
- ❌ You micromanaging implementation details
- ❌ Scope creep and feature drift
- ❌ Miscommunication and rework

---

## Setting Up for Success

### Day One: Project Initialization

When you initialize a new project with `levit init`, you get a structure designed for AI collaboration. Your first steps:

1. **Review the Social Contract**
   - Open `SOCIAL_CONTRACT.md`
   - Adjust principles to match your team's values
   - This document sets the foundation for all AI interactions

2. **Configure Agent Rules**
   - Edit `.levit/prompts/global-rules.md`
   - Define coding standards, language preferences, style guides
   - Set technical constraints (dependencies, patterns, file sizes)

3. **Define Project Roles**
   - Customize `.levit/roles/` if needed
   - Roles help agents understand context (developer, QA, security, etc.)

### Ongoing: Maintain Your Governance

- **Keep `levit.json` updated**: This manifest is the machine-readable contract
- **Update constraints as needed**: Add forbidden patterns, dependency limits
- **Review and refine prompts**: Adjust `.levit/prompts/` based on experience

---

## The Intent-First Workflow

### The Golden Rule

> **Never start with code. Always start with intent.**

### The Complete Flow

```
1. Define Intent (levit feature new)
   ↓
2. Refine Boundaries (edit feature file)
   ↓
3. Make Technical Decisions (levit decision new)
   ↓
4. Create Handoff (levit handoff new)
   ↓
5. Agent Implements
   ↓
6. Review & Validate (levit validate)
   ↓
7. Iterate or Complete
```

### Why Intent-First?

Starting with code leads to:
- ❌ Unclear requirements
- ❌ Scope creep
- ❌ Technical debt
- ❌ Rework and frustration

Starting with intent leads to:
- ✅ Clear expectations
- ✅ Focused implementation
- ✅ Better quality
- ✅ Faster delivery

---

## Creating Effective Features

### What Makes a Good Feature Specification?

A well-written feature in `.levit/features/` should answer:

1. **Vision (The "Why")**
   - What problem does this solve?
   - Who benefits?
   - What's the user story?

2. **Success Criteria (The "What")**
   - How do we know it's done?
   - What are the acceptance criteria?
   - What tests prove it works?

3. **Boundaries (The "No")**
   - What's explicitly out of scope?
   - What won't we build?
   - What assumptions are we making?

4. **Technical Constraints**
   - Dependencies allowed/forbidden
   - Performance requirements
   - Security considerations

5. **Agent Task**
   - Specific instructions for the AI
   - Implementation hints
   - Code patterns to follow

### Example: Good vs. Bad Feature

**❌ Bad Feature**:
```markdown
# INTENT: Add login

Build a login page.
```

**✅ Good Feature**:
```markdown
# INTENT: User Authentication

## 1. Vision (The "Why")
- **User Story**: As a user, I want to authenticate with email/password so I can access my account securely.
- **Priority**: High - blocks all user-facing features

## 2. Success Criteria (The "What")
- [ ] User can register with email and password
- [ ] User can login with valid credentials
- [ ] Invalid credentials show clear error messages
- [ ] Session persists across page refreshes
- [ ] Password requirements enforced (min 8 chars, complexity)

## 3. Boundaries (The "No")
- **Not in scope**: OAuth providers (Google, GitHub) - future feature
- **Not in scope**: Password reset flow - separate feature
- **Not in scope**: Two-factor authentication - future feature
- **Assumption**: Email verification happens asynchronously

## 4. Technical Constraints
- Use JWT for session tokens (already decided in ADR-002)
- Store passwords with bcrypt (security requirement)
- Follow existing API patterns in `/api/auth/`
- Maximum response time: 200ms for login endpoint

## 5. Agent Task
- Implement `/api/auth/register` and `/api/auth/login` endpoints
- Create user model with email, password_hash, created_at fields
- Add validation middleware for email format and password strength
- Write integration tests for happy path and error cases
- Update API documentation
```

### Tips for Writing Features

- **Be specific**: "Add validation" is vague. "Validate email format and password strength" is clear.
- **Set boundaries**: Explicitly state what you're NOT building prevents scope creep.
- **Link decisions**: Reference ADRs when technical choices are already made.
- **Update status**: Use `levit feature status <id> <status>` to track progress.

---

## Making Decisions Together

### When to Create an ADR

Create an Architecture Decision Record (`levit decision new`) when:
- ✅ Choosing a technology (database, framework, library)
- ✅ Defining an architectural pattern
- ✅ Setting a coding standard or convention
- ✅ Making a trade-off that affects multiple features

**Don't create an ADR for**:
- ❌ Implementation details (which function name to use)
- ❌ Temporary choices (quick fixes)
- ❌ Obvious decisions (using existing patterns)

### The Decision Process

1. **Identify the Need**: You or the agent notices a decision is needed
2. **Create ADR**: `levit decision new --title "Use PostgreSQL" --feature .levit/features/001-auth.md`
3. **Document Context**: Why this decision? What alternatives were considered?
4. **Make the Choice**: Human makes the final decision
5. **Link to Features**: Reference the ADR in relevant features

### Example ADR Structure

```markdown
# ADR-001: Use PostgreSQL for User Data

## Context
We need persistent storage for user accounts. Options considered:
- PostgreSQL (relational, ACID, mature)
- MongoDB (NoSQL, flexible schema)
- SQLite (file-based, simple)

## Decision
Use PostgreSQL because:
- ACID guarantees for financial data
- Strong ecosystem and tooling
- Team familiarity

## Consequences
- Need to set up PostgreSQL instance
- ORM required (choose in separate ADR)
- Migration strategy needed
```

---

## Handoffs That Work

### What is a Handoff?

A handoff (created with `levit handoff new`) packages context for an AI agent. It's like a briefing document that tells the agent:
- What to work on
- What to read first
- What boundaries to respect
- How to deliver results

### Creating Effective Handoffs

**Good handoff includes**:
- ✅ Clear feature reference
- ✅ Specific role (developer, QA, security)
- ✅ Context about current state
- ✅ Expected deliverables
- ✅ Review criteria

**Example handoff creation**:
```bash
levit handoff new \
  --feature .levit/features/001-user-authentication.md \
  --role developer \
  --yes
```

This creates a file in `.levit/handoff/` with:
- Link to the feature
- Instructions to read onboarding docs
- Boundaries from the feature
- Review protocol

### When to Create a Handoff

- **Starting a new feature**: Give the agent clear context
- **Switching agents**: Hand off from one AI session to another
- **Complex tasks**: Break down large features into focused handoffs
- **Different roles**: Create separate handoffs for developer vs. QA vs. security

### Tips for Handoffs

- **One feature per handoff**: Keep focus narrow
- **Update handoffs**: If requirements change, update the handoff file
- **Close handoffs**: Mark as completed when done

---

## Reviewing Agent Work

### The Review Checklist

When an agent submits work, check:

1. **✅ Matches Intent**
   - Does the implementation match the feature specification?
   - Are boundaries respected?
   - Is scope creep avoided?

2. **✅ Follows Decisions**
   - Are ADRs followed?
   - Are technical constraints respected?
   - Are coding standards met?

3. **✅ Quality Standards**
   - Are tests included?
   - Does `levit validate` pass?
   - Is code readable and maintainable?

4. **✅ Documentation**
   - Are changes traceable to features?
   - Are new decisions documented?
   - Is handoff updated?

### Review Workflow

1. **Read the Handoff Summary**
   - Agent should provide: what changed, how tested, next steps, open questions

2. **Run Validation**
   ```bash
   levit validate
   ```
   - Checks project structure
   - Validates dependencies
   - Verifies constraints

3. **Check Feature Status**
   ```bash
   levit feature list
   ```
   - Verify feature status is updated
   - Check if work is complete

4. **Code Review**
   - Read the actual code changes
   - Verify tests pass
   - Check for anti-patterns

5. **Provide Feedback**
   - Be specific: "Add error handling for network failures"
   - Reference standards: "Follow ADR-003 for error responses"
   - Set expectations: "Update feature status when done"

### Common Review Scenarios

**Scenario 1: Agent Did Too Much**
- **Problem**: Agent added features not in scope
- **Solution**: Point to boundaries section, ask to revert extras
- **Prevention**: Be explicit about what's NOT included

**Scenario 2: Agent Didn't Follow ADR**
- **Problem**: Agent used different technology than decided
- **Solution**: Reference the ADR, ask to align
- **Prevention**: Link ADRs in feature specifications

**Scenario 3: Agent Broke Tests**
- **Problem**: Existing tests fail after changes
- **Solution**: Ask agent to fix before review
- **Prevention**: Emphasize "tests first" in prompts

---

## Best Practices

### 1. Start Small, Iterate

- ✅ Begin with minimal features
- ✅ Get feedback early
- ✅ Expand based on learnings

### 2. Be Explicit About Boundaries

- ✅ State what's out of scope
- ✅ Set clear "no" sections
- ✅ Reference existing decisions

### 3. Keep Features Focused

- ✅ One feature = one clear goal
- ✅ Avoid "and also" features
- ✅ Split large features into smaller ones

### 4. Document Decisions Early

- ✅ Create ADRs before implementation
- ✅ Link ADRs to features
- ✅ Update ADRs when context changes

### 5. Validate Frequently

- ✅ Run `levit validate` after agent work
- ✅ Check feature status regularly
- ✅ Review handoffs before starting

### 6. Maintain the Manifest

- ✅ Keep `levit.json` in sync
- ✅ Update constraints as project evolves
- ✅ Review governance periodically

### 7. Communicate Clearly

- ✅ Use precise language in features
- ✅ Provide examples when helpful
- ✅ Reference existing patterns

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Code-First Development

**Problem**: Starting with code before defining intent
```bash
# Bad: Agent, add a login form
# (No feature spec, no boundaries, no decisions)
```

**Solution**: Always create feature first
```bash
levit feature new --title "User Authentication"
# Then refine the spec, then handoff
```

### ❌ Anti-Pattern 2: Vague Boundaries

**Problem**: Not being explicit about what's excluded
```markdown
## Boundaries
- Keep it simple
```

**Solution**: Be specific
```markdown
## Boundaries
- Not in scope: OAuth providers (Google, GitHub)
- Not in scope: Password reset (separate feature)
- Not in scope: Two-factor authentication
```

### ❌ Anti-Pattern 3: Skipping Decisions

**Problem**: Letting agent choose technology without ADR
```bash
# Bad: Agent picks database, framework, etc. without human decision
```

**Solution**: Create ADRs for significant choices
```bash
levit decision new --title "Use PostgreSQL" --feature .levit/features/001-auth.md
```

### ❌ Anti-Pattern 4: Ignoring Validation

**Problem**: Not running `levit validate` after changes
```bash
# Bad: Accept agent work without validation
```

**Solution**: Always validate
```bash
levit validate
# Fix issues before accepting
```

### ❌ Anti-Pattern 5: Feature Drift

**Problem**: Feature scope expands during implementation
```markdown
# Feature says: "User login"
# Agent builds: "User login + password reset + email verification"
```

**Solution**: Reference boundaries, reject extras
```markdown
# Point agent to "Boundaries" section
# Ask to revert out-of-scope changes
```

### ❌ Anti-Pattern 6: No Handoffs

**Problem**: Starting agent work without context
```bash
# Bad: "Agent, work on feature 001" (no handoff)
```

**Solution**: Always create handoff
```bash
levit handoff new --feature .levit/features/001-auth.md --role developer
```

### ❌ Anti-Pattern 7: Micromanaging Implementation

**Problem**: Specifying exact code structure in features
```markdown
## Agent Task
- Create function `validateEmail()` with regex `^[a-z]+@[a-z]+\.[a-z]+$`
- Use if/else structure, not switch
```

**Solution**: Focus on what, not how
```markdown
## Agent Task
- Validate email format according to RFC 5322
- Follow existing validation patterns in the codebase
```

---

## Troubleshooting

### Problem: Agent Doesn't Follow Boundaries

**Symptoms**: Agent implements features not in scope

**Solutions**:
1. Check if boundaries are explicit in feature file
2. Reference boundaries section in handoff
3. Ask agent to read feature file again
4. Update `.levit/prompts/global-rules.md` to emphasize boundaries

### Problem: Agent Makes Technical Decisions

**Symptoms**: Agent chooses technology without ADR

**Solutions**:
1. Create ADR for the decision
2. Link ADR to feature
3. Update prompts to require ADR reference
4. Review agent work before accepting

### Problem: Agent Breaks Existing Code

**Symptoms**: Tests fail, validation errors after agent work

**Solutions**:
1. Run `levit validate` before accepting work
2. Ask agent to run tests before submitting
3. Update prompts to emphasize "tests first"
4. Review changes more carefully

### Problem: Feature Scope Creeps

**Symptoms**: Feature grows beyond original intent

**Solutions**:
1. Split feature into smaller ones
2. Create new feature for extras
3. Update original feature boundaries
4. Reject out-of-scope changes

### Problem: Agent Doesn't Update Status

**Symptoms**: Feature status not updated after completion

**Solutions**:
1. Remind agent to update status in handoff protocol
2. Use `levit feature status <id> completed` manually
3. Add status update to review checklist
4. Update prompts to emphasize status tracking

### Problem: Handoffs Are Unclear

**Symptoms**: Agent asks many clarifying questions

**Solutions**:
1. Review handoff template
2. Add more context to feature file
3. Link relevant ADRs in handoff
4. Provide examples in feature specification

### Problem: Validation Fails Frequently

**Symptoms**: `levit validate` shows many errors

**Solutions**:
1. Review validation errors carefully
2. Fix structural issues first
3. Update constraints if too strict
4. Train agent on validation requirements

---

## Quick Reference

### Essential Commands

```bash
# Create a feature
levit feature new --title "Feature Name" --slug feature-name

# List all features
levit feature list

# Update feature status
levit feature status <id> <active|draft|deprecated|completed>

# Create a decision
levit decision new --title "Decision Title" --feature .levit/features/001-feature.md

# Create a handoff
levit handoff new --feature .levit/features/001-feature.md --role developer

# Validate project
levit validate
```

### Key Files

- `SOCIAL_CONTRACT.md`: Project philosophy and principles
- `.levit/AGENT_ONBOARDING.md`: Agent's operating manual
- `.levit/features/`: Your project roadmap
- `.levit/decisions/`: Technical decision history
- `.levit/handoff/`: Agent briefings
- `levit.json`: Machine-readable project contract

### Workflow Checklist

- [ ] Feature created with `levit feature new`
- [ ] Boundaries explicitly defined
- [ ] ADRs created for technical decisions
- [ ] Handoff created with `levit handoff new`
- [ ] Agent work reviewed
- [ ] `levit validate` passes
- [ ] Feature status updated
- [ ] Documentation updated

---

## Conclusion

Managing AI agents effectively requires:
- **Clear intent** before implementation
- **Explicit boundaries** to prevent drift
- **Documented decisions** for consistency
- **Structured handoffs** for context
- **Regular validation** for quality

Remember: **You define the what and why. The agent handles the how.**

---

*This guide is part of levit-kit v0.8.0. For updates, see the [changelog](../changelog.md).*

