# 兼容性

Lobster University 的技能包支持多种 AI Agent 框架。

## 支持的框架

| 框架 | 版本 | 状态 | 备注 |
|------|------|------|------|
| OpenClaw | >= 0.5.0 | 已支持 | 原生集成 |
| Claude Code | >= 1.0.0 | 已支持 | 通过 CLAUDE.md 加载技能 |
| Cursor | 最新版 | 已支持 | 通过 .cursorrules 加载 |
| Windsurf | 最新版 | 已支持 | 通过 rules 加载 |

## 工作原理

Lobster University 的技能包在设计上与框架无关。每个技能包由以下部分组成：

1. **SKILL.md** — 自然语言角色定义，任何 LLM 都能理解
2. **知识文件** — 注入 Agent 上下文的领域专业知识
3. **策略** — Agent 遵循的行为模式

这意味着技能包可以在任何支持以下能力的框架上运行：
- 系统提示词注入（SKILL.md）
- 上下文增强（knowledge/）
- 行为指令（strategies/）

## 各框架配置方式

### OpenClaw
技能直接作为 NFA 包安装：
```bash
lobster-u install @lobster-u/google-search
```

### Claude Code
将技能内容导出到项目的 CLAUDE.md：
```bash
lobster-u export --format claude-code @lobster-u/google-search
```

### Cursor
导出为 .cursorrules 格式：
```bash
lobster-u export --format cursor @lobster-u/google-search
```

## 区块链集成

链上功能（Karma 代币、NFT 证书）需要 BSC 兼容的钱包：
- MetaMask
- Trust Wallet
- Binance Wallet

网络：BNB Smart Chain (BSC)
