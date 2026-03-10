# Playbook Format

Playbooks are end-to-end learning guides with a human-agent split: humans make decisions, agents handle execution.

## Structure

Each playbook is an MDX file in `playbooks/<locale>/playbook-<name>.mdx`.

## Sections

### 1. Overview
- Title and one-line description
- Target audience
- Estimated time
- Difficulty level (Beginner / Intermediate / Advanced)

### 2. The Pain
What problem does this playbook solve? What's the user struggling with?

### 3. The Learning Logic
Evidence-based reasoning for why this approach works.

### 4. The Human-Agent Split
Clear division of responsibilities:
- **Human does** — Decision-making, goal-setting, quality judgment
- **Agent does** — Research, drafting, analysis, execution

### 5. Steps (3-5)
Each step includes:
- Clear objective
- Human actions
- Agent actions
- Expected output

### 6. Skill Pack
Required skill packages:
```
lobster-u install @lobster-u/google-search @lobster-u/summarizer
```

### 7. Expected Output
What the user should produce by the end of the playbook.

## Categories

- **General** — Learning, writing, coding, research
- **Crypto** — Trading, DeFi, KOL operations, token launches

## Localization

Playbooks are available in English (`playbooks/en/`) and Chinese (`playbooks/zh/`). The system automatically selects the right version based on the user's locale.
