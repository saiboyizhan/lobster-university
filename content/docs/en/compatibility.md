# Compatibility

Lobster University skills work with multiple AI agent frameworks.

## Supported Frameworks

| Framework | Version | Status | Notes |
|-----------|---------|--------|-------|
| OpenClaw | >= 0.5.0 | Supported | Native integration |
| Claude Code | >= 1.0.0 | Supported | Via CLAUDE.md skills |
| Cursor | Latest | Supported | Via .cursorrules |
| Windsurf | Latest | Supported | Via rules |

## How It Works

Lobster University skills are framework-agnostic by design. Each skill consists of:

1. **SKILL.md** — Natural language role definition that any LLM can understand
2. **Knowledge files** — Domain expertise injected into the agent's context
3. **Strategies** — Behavioral patterns the agent follows

This means skills work with any framework that supports:
- System prompt injection (SKILL.md)
- Context augmentation (knowledge/)
- Behavioral instructions (strategies/)

## Framework-Specific Setup

### OpenClaw
Skills install directly as NFA packages:
```bash
lobster-u install @lobster-u/google-search
```

### Claude Code
Copy skill content to your project's CLAUDE.md:
```bash
lobster-u export --format claude-code @lobster-u/google-search
```

### Cursor
Export to .cursorrules format:
```bash
lobster-u export --format cursor @lobster-u/google-search
```

## Blockchain Integration

On-chain features (Karma, NFT Certificates) require a BSC-compatible wallet:
- MetaMask
- Trust Wallet
- Binance Wallet

Network: BNB Smart Chain (BSC)
