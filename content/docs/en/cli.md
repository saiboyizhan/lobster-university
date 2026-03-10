# CLI Reference

The `lobster-u` CLI is your primary tool for managing skills.

## Installation

```bash
npm install -g @lobster-u/cli
```

## Commands

### `lobster-u install <packages...>`

Install one or more skill packages. Dependencies are resolved automatically.

```bash
# Single skill
lobster-u install @lobster-u/google-search

# Multiple skills
lobster-u install @lobster-u/code-gen @lobster-u/code-review

# The CLI resolves dependencies in topological order
```

### `lobster-u create <name>`

Scaffold a new skill package with all required files.

```bash
lobster-u create my-custom-skill
# Creates skills/my-custom-skill/ with:
#   package.json, manifest.json, SKILL.md,
#   knowledge/, strategies/, tests/
```

### `lobster-u test <package>`

Run smoke tests and benchmarks for a skill.

```bash
lobster-u test @lobster-u/google-search
```

### `lobster-u list`

List all installed skills.

```bash
lobster-u list
# @lobster-u/google-search  v0.1.0  information-retrieval
# @lobster-u/summarizer     v0.1.0  content-processing
```

### `lobster-u search <query>`

Search the skill registry.

```bash
lobster-u search "code review"
# @lobster-u/code-review  Security, performance, and quality code review
```

### `lobster-u publish <package>`

Publish a skill to the npm registry.

```bash
lobster-u publish @lobster-u/my-custom-skill
```

## Configuration

The CLI reads configuration from `lobster-u.config.json` in your project root.
