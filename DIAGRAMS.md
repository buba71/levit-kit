# Diagrammes - levit-kit

Ce document contient des diagrammes visuels pour comprendre l'architecture, les workflows et les concepts de levit-kit.

---

## 📐 Architecture du Projet

### Vue d'ensemble des couches

```mermaid
graph TB
    subgraph "CLI Layer"
        CLI[bin/cli.ts<br/>Point d'entrée]
    end
    
    subgraph "Commands Layer"
        CMD1[commands/init.ts]
        CMD2[commands/feature.ts]
        CMD3[commands/decision.ts]
        CMD4[commands/handoff.ts]
        CMD5[commands/validate.ts]
    end
    
    subgraph "Services Layer"
        SVC1[FeatureService]
        SVC2[DecisionService]
        SVC3[HandoffService]
        SVC4[ValidationService]
        SVC5[ManifestService]
        SVC6[ProjectService]
    end
    
    subgraph "Core Layer"
        CORE1[logger.ts]
        CORE2[errors.ts]
        CORE3[security.ts]
        CORE4[frontmatter.ts]
        CORE5[ids.ts]
    end
    
    subgraph "Types Layer"
        TYPES1[domain.ts]
        TYPES2[manifest.ts]
    end
    
    CLI --> CMD1
    CLI --> CMD2
    CLI --> CMD3
    CLI --> CMD4
    CLI --> CMD5
    
    CMD1 --> SVC6
    CMD2 --> SVC1
    CMD3 --> SVC2
    CMD4 --> SVC3
    CMD5 --> SVC4
    
    SVC1 --> SVC5
    SVC2 --> SVC5
    SVC3 --> SVC5
    SVC4 --> SVC5
    
    SVC1 --> CORE1
    SVC1 --> CORE2
    SVC1 --> CORE3
    SVC1 --> CORE4
    SVC1 --> CORE5
    
    SVC1 --> TYPES1
    SVC5 --> TYPES2
    
    style CLI fill:#e1f5ff
    style CMD1 fill:#fff4e1
    style CMD2 fill:#fff4e1
    style CMD3 fill:#fff4e1
    style CMD4 fill:#fff4e1
    style CMD5 fill:#fff4e1
    style SVC1 fill:#e8f5e9
    style SVC2 fill:#e8f5e9
    style SVC3 fill:#e8f5e9
    style SVC4 fill:#e8f5e9
    style SVC5 fill:#e8f5e9
    style SVC6 fill:#e8f5e9
```

---

## 🔄 Workflow AIDD (AI-Driven Development)

### Cycle complet Human-Agent

```mermaid
sequenceDiagram
    participant Human as Human
    participant CLI as levit CLI
    participant FS as File System
    participant Agent as AI Agent
    participant Manifest as levit.json

    Note over Human,Agent: Phase 1: Intent Definition
    Human->>CLI: levit feature new
    CLI->>FS: Create .levit/features/001-*.md
    CLI->>Manifest: Sync features
    Manifest-->>Human: Feature registered

    Note over Human,Agent: Phase 2: Agent Onboarding
    Human->>Agent: Read .levit/AGENT_ONBOARDING.md
    Agent->>FS: Read onboarding docs
    Agent->>Manifest: Read levit.json
    Agent-->>Human: Context understood

    Note over Human,Agent: Phase 3: Collaborative Decision
    Human->>CLI: levit decision new
    CLI->>FS: Create .levit/decisions/ADR-*.md
    CLI->>Manifest: Sync decisions
    Manifest-->>Human: Decision recorded

    Note over Human,Agent: Phase 4: Handoff
    Human->>CLI: levit handoff new
    CLI->>FS: Create .levit/handoff/*.md
    CLI->>Manifest: Sync handoffs
    Human->>Agent: Execute handoff
    Agent->>FS: Read feature & handoff
    Agent->>FS: Implement changes

    Note over Human,Agent: Phase 5: Validation
    Human->>CLI: levit validate
    CLI->>FS: Check structure
    CLI->>Manifest: Validate manifest
    CLI-->>Human: Validation results

    Note over Human,Agent: Phase 6: Review
    Agent->>FS: Submit work
    Human->>FS: Review changes
    Human->>CLI: Update feature status
```

---

## 📁 Structure d'un Projet levit-kit

### Arborescence complète

```mermaid
graph TD
    ROOT[my-project/] --> SC[SOCIAL_CONTRACT.md]
    ROOT --> README[README.md]
    ROOT --> LEVIT[levit.json]
    ROOT --> GIT[.gitignore]
    
    ROOT --> LEVIT_DIR[.levit/]
    
    LEVIT_DIR --> AO[AGENT_ONBOARDING.md]
    LEVIT_DIR --> AC[AGENT_CONTRACT.md]
    
    LEVIT_DIR --> FEATURES[features/]
    FEATURES --> F1[001-feature-1.md]
    FEATURES --> F2[002-feature-2.md]
    FEATURES --> README_F[README.md]
    
    LEVIT_DIR --> DECISIONS[decisions/]
    DECISIONS --> D1[ADR-001-decision-1.md]
    DECISIONS --> D2[ADR-002-decision-2.md]
    DECISIONS --> README_D[README.md]
    
    LEVIT_DIR --> HANDOFF[handoff/]
    HANDOFF --> H1[2026-01-02-feature-1-developer.md]
    HANDOFF --> H2[2026-01-02-feature-2-reviewer.md]
    
    LEVIT_DIR --> ROLES[roles/]
    ROLES --> R1[developer.md]
    ROLES --> R2[reviewer.md]
    
    LEVIT_DIR --> PROMPTS[prompts/]
    PROMPTS --> GR[global-rules.md]
    PROMPTS --> TC[technical-constraints.md]
    
    LEVIT_DIR --> WORKFLOWS[workflows/]
    WORKFLOWS --> SR[submit-for-review.md]
    
    LEVIT_DIR --> EVALS[evals/]
    EVALS --> E1[eval-1.md]
    
    style ROOT fill:#e1f5ff
    style LEVIT_DIR fill:#fff4e1
    style FEATURES fill:#e8f5e9
    style DECISIONS fill:#e8f5e9
    style HANDOFF fill:#e8f5e9
```

---

## 🔀 Flux de Données

### Comment les données circulent dans levit-kit

```mermaid
flowchart LR
    subgraph "Input Sources"
        CLI_CMD[CLI Commands]
        FILES[Markdown Files]
    end
    
    subgraph "Processing"
        SERVICES[Services Layer]
        READERS[Readers]
        PARSERS[Parsers]
    end
    
    subgraph "Storage"
        MANIFEST[levit.json]
        FEATURES_DIR[.levit/features/]
        DECISIONS_DIR[.levit/decisions/]
        HANDOFFS_DIR[.levit/handoff/]
    end
    
    subgraph "Output"
        CLI_OUT[CLI Output]
        JSON_OUT[JSON Output]
        VALIDATION[Validation Results]
    end
    
    CLI_CMD --> SERVICES
    FILES --> READERS
    READERS --> PARSERS
    PARSERS --> SERVICES
    
    SERVICES --> MANIFEST
    SERVICES --> FEATURES_DIR
    SERVICES --> DECISIONS_DIR
    SERVICES --> HANDOFFS_DIR
    
    MANIFEST --> SERVICES
    FEATURES_DIR --> READERS
    DECISIONS_DIR --> READERS
    HANDOFFS_DIR --> READERS
    
    SERVICES --> CLI_OUT
    SERVICES --> JSON_OUT
    SERVICES --> VALIDATION
```

---

## 🎯 Workflow Feature Lifecycle

### Cycle de vie d'une Feature

```mermaid
stateDiagram-v2
    [*] --> Draft: levit feature new
    
    Draft --> Active: Human activates
    Draft --> Deprecated: Human deprecates
    
    Active --> InProgress: Agent starts work
    InProgress --> Review: Agent submits
    Review --> Active: Changes needed
    Review --> Completed: Approved
    
    Active --> Deprecated: No longer needed
    InProgress --> Deprecated: Cancelled
    Completed --> Deprecated: Replaced
    
    Deprecated --> [*]
    Completed --> [*]
    
    note right of Draft
        Initial state
        Feature defined but not started
    end note
    
    note right of Active
        Ready for work
        Can be assigned to agent
    end note
    
    note right of Completed
        Feature delivered
        All criteria met
    end note
```

---

## 🔐 Sécurité et Validation

### Flux de validation des chemins et fichiers

```mermaid
flowchart TD
    START[File Operation Request] --> CHECK_PATH{Path provided?}
    
    CHECK_PATH -->|Yes| VALIDATE[validatePath]
    CHECK_PATH -->|No| ERROR1[Error: Missing path]
    
    VALIDATE --> RESOLVE[Resolve absolute path]
    RESOLVE --> CHECK_BASE{Within baseDir?}
    
    CHECK_BASE -->|No| ERROR2[Error: Path traversal]
    CHECK_BASE -->|Yes| CHECK_EXISTS{File exists?}
    
    CHECK_EXISTS -->|No| ERROR3[Error: File not found]
    CHECK_EXISTS -->|Yes| CHECK_SIZE{Size < 10MB?}
    
    CHECK_SIZE -->|No| ERROR4[Error: File too large]
    CHECK_SIZE -->|Yes| READ[Read file safely]
    
    READ --> SUCCESS[Operation successful]
    
    ERROR1 --> END[End]
    ERROR2 --> END
    ERROR3 --> END
    ERROR4 --> END
    SUCCESS --> END
    
    style START fill:#e1f5ff
    style SUCCESS fill:#e8f5e9
    style ERROR1 fill:#ffebee
    style ERROR2 fill:#ffebee
    style ERROR3 fill:#ffebee
    style ERROR4 fill:#ffebee
```

---

## 📊 Manifest Synchronization

### Comment levit.json est synchronisé

```mermaid
sequenceDiagram
    participant User as User/Agent
    participant CLI as CLI Command
    participant Service as Service
    participant FS as File System
    participant Manifest as levit.json

    User->>CLI: Create/Update Feature
    CLI->>Service: createFeature()
    Service->>FS: Write feature file
    Service->>FS: Scan .levit/features/
    Service->>FS: Read all .md files
    Service->>FS: Parse frontmatter
    Service->>Manifest: Update features array
    Manifest-->>User: Feature synced

    User->>CLI: Create Decision
    CLI->>Service: createDecision()
    Service->>FS: Write decision file
    Service->>Manifest: Sync (decisions not in manifest)
    Manifest-->>User: Decision created

    User->>CLI: levit validate
    CLI->>Service: validate()
    Service->>Manifest: Read manifest
    Service->>FS: Verify all paths exist
    Service->>FS: Check dependencies
    Service->>CLI: Return validation results
    CLI-->>User: Display results
```

---

## 🎨 Command Flow Example

### Exemple : Création d'une Feature

```mermaid
flowchart TD
    START[User: levit feature new] --> PARSE[Parse arguments]
    
    PARSE --> HAS_TITLE{--title provided?}
    HAS_TITLE -->|No| PROMPT[Prompt for title]
    HAS_TITLE -->|Yes| GET_SLUG{--slug provided?}
    
    PROMPT --> GET_SLUG
    GET_SLUG -->|No| GEN_SLUG[Generate slug from title]
    GET_SLUG -->|Yes| CHECK_ID{--id provided?}
    
    GEN_SLUG --> CHECK_ID
    CHECK_ID -->|No| GEN_ID[Generate sequential ID]
    CHECK_ID -->|Yes| PREVIEW[Show preview box]
    
    GEN_ID --> PREVIEW
    PREVIEW --> CONFIRM{User confirms?}
    
    CONFIRM -->|No| CANCEL[Cancel operation]
    CONFIRM -->|Yes| VALIDATE[Validate filename]
    
    VALIDATE --> CHECK_EXISTS{File exists?}
    CHECK_EXISTS -->|Yes| CHECK_FORCE{--force?}
    CHECK_EXISTS -->|No| CREATE[Create feature file]
    
    CHECK_FORCE -->|No| ERROR[Error: File exists]
    CHECK_FORCE -->|Yes| CREATE
    
    CREATE --> SYNC[Sync manifest]
    SYNC --> SUCCESS[Display success message]
    
    CANCEL --> END[End]
    ERROR --> END
    SUCCESS --> END
    
    style START fill:#e1f5ff
    style SUCCESS fill:#e8f5e9
    style ERROR fill:#ffebee
    style CANCEL fill:#fff4e1
```

---

## 🌐 Écosystème levit-kit

### Positionnement dans l'écosystème AIDD

```mermaid
graph TB
    subgraph "Human Developer"
        HUMAN[👤 Developer]
    end
    
    subgraph "levit-kit"
        LEVIT[levit-kit<br/>Scaffolding & Governance]
        CLI[CLI Tools]
        MANIFEST[levit.json<br/>Machine Contract]
    end
    
    subgraph "AI Agents"
        CURSOR[Cursor AI]
        ANTIGRAVITY[Antigravity]
        WINDSURF[Windsurf]
        OTHER[Other Agents]
    end
    
    subgraph "Project Files"
        FEATURES[Features]
        DECISIONS[Decisions]
        HANDOFFS[Handoffs]
        EVALS[Evaluations]
    end
    
    subgraph "CI/CD"
        GITHUB[GitHub Actions]
        GITLAB[GitLab CI]
    end
    
    HUMAN --> LEVIT
    LEVIT --> CLI
    LEVIT --> MANIFEST
    
    CLI --> FEATURES
    CLI --> DECISIONS
    CLI --> HANDOFFS
    
    MANIFEST --> CURSOR
    MANIFEST --> ANTIGRAVITY
    MANIFEST --> WINDSURF
    MANIFEST --> OTHER
    
    CURSOR --> FEATURES
    ANTIGRAVITY --> FEATURES
    WINDSURF --> FEATURES
    OTHER --> FEATURES
    
    FEATURES --> EVALS
    DECISIONS --> EVALS
    HANDOFFS --> EVALS
    
    EVALS --> GITHUB
    EVALS --> GITLAB
    
    style HUMAN fill:#e1f5ff
    style LEVIT fill:#fff4e1
    style MANIFEST fill:#e8f5e9
    style CURSOR fill:#f3e5f5
    style ANTIGRAVITY fill:#f3e5f5
    style WINDSURF fill:#f3e5f5
    style OTHER fill:#f3e5f5
```

---

## 📝 Notes sur les Diagrammes

### Support Mermaid

- **Mermaid** : Tous les diagrammes utilisent la syntaxe Mermaid, supportée nativement par GitHub, GitLab, et de nombreux éditeurs Markdown.
- **Mise à jour** : Ces diagrammes doivent être mis à jour lorsque l'architecture ou les workflows changent.

### Visualisation selon l'éditeur

#### VS Code
**Extensions recommandées** (déjà configurées dans `.vscode/extensions.json`) :
- `bierner.markdown-mermaid` - Support Mermaid dans la prévisualisation Markdown
- `bpruitt-goddard.mermaid-markdown-syntax-highlighting` - Coloration syntaxique pour Mermaid
- `bierner.markdown-preview-github-styles` - Styles GitHub pour la prévisualisation

**Installation automatique** :
VS Code vous proposera automatiquement d'installer ces extensions si vous ouvrez ce projet.

**Installation manuelle** :
```bash
code --install-extension bierner.markdown-mermaid
code --install-extension bpruitt-goddard.mermaid-markdown-syntax-highlighting
code --install-extension bierner.markdown-preview-github-styles
```

#### GitHub / GitLab
Les diagrammes s'affichent **automatiquement** dans les fichiers `.md` sur GitHub et GitLab.

#### Autres éditeurs
- **Obsidian** : Support natif de Mermaid
- **Typora** : Support natif de Mermaid
- **En ligne** : Utilisez [Mermaid Live Editor](https://mermaid.live/) pour tester et visualiser

### Dépannage

Si les diagrammes ne s'affichent pas dans VS Code :
1. Vérifiez que les extensions sont installées (`Ctrl+Shift+X` puis recherchez "mermaid")
2. Ouvrez la prévisualisation Markdown (`Ctrl+Shift+V` ou `Cmd+Shift+V` sur Mac)
3. Si le problème persiste, redémarrez VS Code

---

*Dernière mise à jour : 2026-01-02*

