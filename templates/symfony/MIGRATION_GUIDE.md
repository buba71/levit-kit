# Migration Guide: Adopting levit-kit in Existing Projects

> **For teams with existing projects**: This guide helps you migrate your project to use levit-kit's AIDD governance structure.

---

## Table of Contents

1. [Should You Migrate?](#should-you-migrate)
2. [Migration Strategies](#migration-strategies)
3. [Step-by-Step Migration](#step-by-step-migration)
4. [Migrating Existing Features](#migrating-existing-features)
5. [Migrating Existing Decisions](#migrating-existing-decisions)
6. [Updating Your Workflow](#updating-your-workflow)
7. [Team Adoption](#team-adoption)
8. [Troubleshooting](#troubleshooting)

---

## Should You Migrate?

### When Migration Makes Sense

✅ **Migrate if**:
- You're already using AI agents (Cursor, Antigravity, Windsurf, etc.)
- You want standardized governance for AI collaboration
- You have multiple developers working with AI
- You want better traceability of features and decisions
- You're starting a new major feature or refactoring

❌ **Don't migrate if**:
- Your project is near end-of-life
- You have no plans to use AI agents
- The migration effort outweighs the benefits
- Your team is resistant to new processes

### Benefits of Migration

- **Standardized Structure**: Consistent project organization
- **Better AI Collaboration**: Clear protocols for agent interaction
- **Improved Traceability**: All features and decisions documented
- **Team Alignment**: Shared understanding of project state
- **Future-Proof**: Ready for evolving AI development practices

---

## Migration Strategies

### Strategy 1: Gradual Adoption (Recommended)

**Best for**: Active projects with ongoing development

- Migrate one feature at a time
- Keep existing code structure
- Add levit-kit governance incrementally
- Low risk, minimal disruption

### Strategy 2: Fresh Start

**Best for**: New features or major refactoring

- Initialize levit-kit in a new branch
- Migrate features as you work on them
- Gradually adopt the full structure
- Clean slate approach

### Strategy 3: Full Migration

**Best for**: Projects starting a new phase

- Migrate all features at once
- Restructure project completely
- Requires team buy-in and planning
- Highest effort, most complete result

---

## Step-by-Step Migration

### Phase 1: Preparation

1. **Backup Your Project**
   ```bash
   git checkout -b migration/levit-kit
   git commit -m "Pre-migration backup"
   ```

2. **Review Current State**
   - List existing features/requirements
   - Identify documented decisions
   - Note current project structure
   - Document any existing governance

3. **Team Alignment**
   - Discuss migration with team
   - Set expectations and timeline
   - Assign migration owner
   - Plan training session

### Phase 2: Initialize levit-kit

1. **Install levit-kit Structure**
   ```bash
   # In your project root
   npx @buba_71/levit init . --template default
   ```
   
   **Note**: If your project root is not empty, you may need to:
   ```bash
   # Create a temporary directory
   mkdir temp-levit
   cd temp-levit
   npx @buba_71/levit init temp-project
   
   # Copy .levit directory to your project
   cp -r temp-project/.levit /path/to/your/project/
   cp temp-project/levit.json /path/to/your/project/
   cp temp-project/SOCIAL_CONTRACT.md /path/to/your/project/
   cp temp-project/HUMAN_AGENT_MANAGER.md /path/to/your/project/
   
   # Clean up
   rm -rf temp-levit
   ```

2. **Customize Governance**
   - Edit `SOCIAL_CONTRACT.md` to match your team's values
   - Update `.levit/prompts/global-rules.md` with your coding standards
   - Configure `levit.json` with project-specific constraints

3. **Validate Structure**
   ```bash
   levit validate
   ```

### Phase 3: Migrate Content

1. **Migrate Features** (see [Migrating Existing Features](#migrating-existing-features))
2. **Migrate Decisions** (see [Migrating Existing Decisions](#migrating-existing-decisions))
3. **Update Documentation**
4. **Sync Manifest**
   ```bash
   levit validate  # This syncs the manifest automatically
   ```

### Phase 4: Team Onboarding

1. **Share Documentation**
   - Point team to `HUMAN_AGENT_MANAGER.md`
   - Review `SOCIAL_CONTRACT.md` together
   - Explain the new workflow

2. **Training Session**
   - Demo: Creating a feature
   - Demo: Making a decision
   - Demo: Creating a handoff
   - Demo: Reviewing agent work

3. **Update Processes**
   - Update PR templates
   - Update team documentation
   - Update onboarding docs

---

## Migrating Existing Features

### Identifying Features to Migrate

Look for:
- User stories in issue trackers
- Requirements documents
- Feature branches
- Product backlog items
- API endpoints or modules

### Migration Process

1. **Create Feature File**
   ```bash
   levit feature new --title "Your Feature Name" --slug your-feature-name
   ```

2. **Extract Information**
   From your existing documentation, extract:
   - **Vision**: Why does this feature exist?
   - **Success Criteria**: How do we know it's done?
   - **Boundaries**: What's explicitly out of scope?
   - **Technical Constraints**: Dependencies, performance, security

3. **Fill Feature Template**
   Open `.levit/features/XXX-your-feature-name.md` and populate:
   ```markdown
   ## 1. Vision (The "Why")
   - **User Story**: [from your existing docs]
   - **Priority**: [High/Medium/Low/Critical]
   
   ## 2. Success Criteria (The "What")
   - [ ] Criterion 1
   - [ ] Criterion 2
   
   ## 3. Boundaries (The "No")
   - Not in scope: X
   - Not in scope: Y
   
   ## 4. Technical Constraints
   - [your constraints]
   
   ## 5. Agent Task
   - [implementation guidance]
   ```

4. **Link to Code**
   - Reference the feature ID in code comments
   - Update PR templates to reference features
   - Link issues to features

### Example: Migrating a User Authentication Feature

**Before (Issue Tracker)**:
```
Issue #42: User Authentication
- Users should be able to login
- Need password reset
- OAuth later
```

**After (levit-kit Feature)**:
```bash
levit feature new --title "User Authentication" --slug user-authentication
```

Then edit `.levit/features/001-user-authentication.md`:
```markdown
## 1. Vision (The "Why")
- **User Story**: As a user, I want to authenticate with email/password so I can access my account.
- **Priority**: High

## 2. Success Criteria (The "What")
- [ ] User can register with email and password
- [ ] User can login with valid credentials
- [ ] Session persists across requests
- [ ] Invalid credentials show clear errors

## 3. Boundaries (The "No")
- **Not in scope**: OAuth providers (Google, GitHub) - future feature
- **Not in scope**: Password reset flow - separate feature (Issue #43)
- **Not in scope**: Two-factor authentication - future feature

## 4. Technical Constraints
- Use JWT for sessions (see ADR-002)
- Password hashing with bcrypt
- Rate limiting on login endpoint

## 5. Agent Task
- Implement `/api/auth/register` and `/api/auth/login` endpoints
- Create user model with email, password_hash fields
- Add validation middleware
- Write integration tests
```

---

## Migrating Existing Decisions

### Identifying Decisions to Migrate

Look for:
- Architecture documents
- Technical design docs
- Team meeting notes
- Code comments explaining "why"
- README files with technical choices

### Migration Process

1. **Create ADR**
   ```bash
   levit decision new --title "Use PostgreSQL" --feature .levit/features/001-auth.md
   ```

2. **Document Context**
   Edit the ADR file and include:
   - **Context**: Why was this decision needed?
   - **Decision**: What was chosen?
   - **Consequences**: What are the implications?
   - **Alternatives**: What else was considered?

3. **Link to Features**
   - Reference ADRs in feature files
   - Update code comments to reference ADRs

### Example: Migrating a Database Decision

**Before (README)**:
```
We use PostgreSQL because it's reliable and the team knows it.
```

**After (levit-kit ADR)**:
```bash
levit decision new --title "Use PostgreSQL for User Data" --feature .levit/features/001-auth.md
```

Then edit `.levit/decisions/ADR-001-use-postgresql-for-user-data.md`:
```markdown
# ADR-001: Use PostgreSQL for User Data

## Context
We needed persistent storage for user accounts. Options considered:
- PostgreSQL (relational, ACID, mature)
- MongoDB (NoSQL, flexible schema)
- SQLite (file-based, simple)

## Decision
Use PostgreSQL because:
- ACID guarantees for financial data
- Strong ecosystem and tooling
- Team familiarity
- Production-ready reliability

## Consequences
- Need to set up PostgreSQL instance
- ORM required (see ADR-002)
- Migration strategy needed
- Connection pooling required

## Status
Active - Decision made 2024-01-15
```

---

## Updating Your Workflow

### Before Migration

```
1. Create issue in tracker
2. Discuss in meeting
3. Implement feature
4. Code review
5. Merge
```

### After Migration

```
1. Create feature: levit feature new
2. Create decisions: levit decision new (if needed)
3. Create handoff: levit handoff new
4. Agent implements
5. Validate: levit validate
6. Review feature status
7. Code review
8. Merge
```

### Updating PR Templates

**Add to your PR template**:
```markdown
## Feature Reference
- Feature: `.levit/features/XXX-feature-name.md`
- Status: [ ] Draft [ ] Active [ ] Completed

## Decisions
- ADRs referenced: ADR-XXX, ADR-YYY

## Validation
- [ ] `levit validate` passes
- [ ] Feature status updated
```

### Updating CI/CD

See [CI/CD Integration](#cicd-integration) section below.

---

## Team Adoption

### Communication Plan

1. **Announce Migration**
   - Explain why (benefits)
   - Show timeline
   - Address concerns

2. **Provide Resources**
   - Link to `HUMAN_AGENT_MANAGER.md`
   - Create quick reference card
   - Record training session

3. **Start Small**
   - Migrate one feature together
   - Get team feedback
   - Iterate on process

4. **Celebrate Wins**
   - Share success stories
   - Highlight improvements
   - Recognize adopters

### Common Concerns and Responses

**"This is too much overhead"**
- Response: Start with critical features only
- Show time saved in review cycles
- Emphasize long-term benefits

**"We don't use AI agents"**
- Response: Structure helps humans too
- Better documentation and traceability
- Future-proof your project

**"Our project is too complex"**
- Response: Start with one module/feature
- Gradual adoption is fine
- Structure helps manage complexity

**"We don't have time"**
- Response: Migrate as you work on features
- No need to migrate everything at once
- Incremental approach is valid

---

## Troubleshooting

### Problem: Init Fails in Non-Empty Directory

**Solution**: Initialize in temp directory, copy `.levit/` folder
```bash
mkdir temp && cd temp
npx @buba_71/levit init temp-project
cp -r temp-project/.levit /path/to/your/project/
cp temp-project/levit.json /path/to/your/project/
```

### Problem: Existing Features Don't Match Template

**Solution**: Create features manually, don't force fit
- Extract what you can
- Don't worry about perfect match
- Focus on future features

### Problem: Team Resistance

**Solution**: 
- Start with volunteers
- Show concrete benefits
- Make it optional initially
- Gather feedback and adjust

### Problem: Validation Fails

**Solution**:
```bash
# Check what's wrong
levit validate

# Fix structural issues
# Update constraints if needed
# Re-run validation
```

### Problem: Too Many Features to Migrate

**Solution**:
- Prioritize active features
- Migrate as you work on them
- Archive old features
- Don't migrate everything at once

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/levit-validate.yml`:

```yaml
name: Validate Levit Project

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Validate levit-kit structure
        run: |
          npx @buba_71/levit validate --json > validation.json || true
      
      - name: Check validation results
        run: |
          if [ -f validation.json ]; then
            # Parse JSON and check for errors
            ERRORS=$(node -e "const v=require('./validation.json'); console.log(v.metrics?.errors || 0)")
            if [ "$ERRORS" -gt 0 ]; then
              echo "Validation failed with $ERRORS errors"
              cat validation.json
              exit 1
            fi
          else
            echo "Validation passed"
          fi
```

### GitLab CI

Create `.gitlab-ci.yml` (add to existing or create new):

```yaml
levit-validate:
  image: node:20
  script:
    - npm install -g @buba_71/levit
    - levit validate --json > validation.json || true
    - |
      if [ -f validation.json ]; then
        ERRORS=$(node -e "const v=require('./validation.json'); console.log(v.metrics?.errors || 0)")
        if [ "$ERRORS" -gt 0 ]; then
          echo "Validation failed with $ERRORS errors"
          cat validation.json
          exit 1
        fi
      fi
  only:
    - merge_requests
    - main
    - develop
```

---

## Checklist

### Pre-Migration
- [ ] Team aligned on migration
- [ ] Backup created
- [ ] Migration strategy chosen
- [ ] Timeline set

### Migration
- [ ] levit-kit structure initialized
- [ ] Governance customized
- [ ] Features migrated (at least active ones)
- [ ] Decisions migrated (at least recent ones)
- [ ] Validation passes

### Post-Migration
- [ ] Team trained
- [ ] Documentation updated
- [ ] CI/CD updated
- [ ] PR templates updated
- [ ] Workflow documented

---

## Next Steps

After migration:

1. **Read the Human-Agent Manager Guide**
   - `HUMAN_AGENT_MANAGER.md` has best practices
   - Learn effective agent management
   - Avoid common pitfalls

2. **Start Using the Workflow**
   - Create features for new work
   - Document decisions as you make them
   - Create handoffs for agents

3. **Iterate and Improve**
   - Gather team feedback
   - Adjust governance as needed
   - Refine your process

---

*This guide is part of levit-kit v0.8.1. For updates, see the [changelog](../changelog.md).*

