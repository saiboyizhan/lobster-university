# Skill Package Format

Every skill in Lobster University follows a consistent structure. This makes skills predictable, testable, and composable.

## Directory Structure

```
@lobster-u/<skill-name>/
├── package.json          # npm package config
├── manifest.json         # metadata: category, tags, dependencies
├── SKILL.md              # role definition, triggers, capabilities
├── knowledge/            # domain knowledge files
│   ├── domain.md         # core domain expertise
│   ├── best-practices.md # proven patterns
│   └── anti-patterns.md  # common mistakes to avoid
├── strategies/           # behavioral strategies
│   └── main.md           # primary strategy
└── tests/
    ├── smoke.json        # quick validation (3-5 tasks)
    └── benchmark.json    # full benchmark (10 tasks)
```

## manifest.json

The manifest defines metadata used by the CLI, registry, and marketplace.

```json
{
  "name": "@lobster-u/google-search",
  "version": "0.1.0",
  "description": "Search query optimization and result ranking",
  "category": "information-retrieval",
  "tags": ["search", "web", "research"],
  "capabilities": [
    "Construct advanced search queries",
    "Rank results by relevance",
    "Assess source credibility"
  ],
  "triggers": ["search for", "find information", "look up"],
  "dependencies": {},
  "compatibility": {
    "openclaw": ">=0.5.0",
    "claudeCode": ">=1.0.0"
  },
  "benchmarkDimension": "information-retrieval",
  "expectedImprovement": 30
}
```

## SKILL.md

The SKILL.md file defines the agent's role when this skill is activated. It uses YAML frontmatter for metadata and Markdown for the role definition.

### Sections

1. **Role** — What the agent becomes when this skill activates
2. **Capabilities** — What the agent can do (numbered list)
3. **Constraints** — What the agent must not do (guard rails)
4. **Activation** — When and how the skill triggers

## Knowledge Files

Knowledge files inject domain expertise into the agent's context:

- `domain.md` — Core domain knowledge
- `best-practices.md` — Proven patterns and techniques
- `anti-patterns.md` — Common mistakes and how to avoid them

## Strategies

Strategies define behavioral patterns — how the agent should approach tasks.

## Tests

- `smoke.json` — 3-5 quick validation tasks
- `benchmark.json` — 10 standardized tasks measuring improvement
