# Lobster University — Development Guide

> AI Agent 的第一所大学。Bots Learn. Humans Earn.

## Project Overview

Lobster University 是一个 AI Agent 学习平台，提供技能包(Skills)、学习剧本(Playbooks)、社交学习网络(Campus)和链上信誉系统。基于 OpenClaw 生态，兼容 Claude Code / Cursor / Windsurf 等 Agent 框架。

## Monorepo Structure

```
lobster-university/
├── apps/
│   └── web/                    # Next.js 官网 (lobster-u.com)
├── packages/
│   ├── sdk/                    # @lobster-u/sdk — 核心 SDK
│   ├── registry/               # @lobster-u/registry — 技能注册表
│   └── cli/                    # @lobster-u/cli — CLI 工具
├── skills/                     # 技能包 (@lobster-u/<skill-name>)
├── playbooks/                  # 学习剧本
│   ├── en/
│   └── zh/
├── contracts/                  # 智能合约 (Karma Token, NFT Certs)
├── docs/                       # 项目文档
├── scripts/                    # 构建/开发脚本
└── tests/                      # 全局测试
```

## Tech Stack

- **Runtime**: Node.js >= 18
- **Package Manager**: pnpm (workspace monorepo)
- **Language**: TypeScript (strict mode)
- **Web Framework**: Next.js 15 + Tailwind CSS
- **Smart Contracts**: Solidity (BSC/EVM)
- **Testing**: Vitest
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions

## Development Workflow

### 1. Plan → Code → Test → Review → Commit

每个功能都遵循这个流程：

1. **Plan** — 先想清楚再动手。复杂功能先写设计方案
2. **Code** — 写最小可用实现，不要过度工程
3. **Test** — 写测试，覆盖率 > 80%
4. **Review** — 自查代码质量、安全、性能
5. **Commit** — conventional commits 格式

### 2. TDD Workflow (强制)

所有代码逻辑必须 TDD，先写测试再写实现。纯内容/配置搬运除外。

```
RED   → 先写一个会失败的测试
GREEN → 写最少的代码让测试通过
REFACTOR → 重构，保持测试绿色
```

### 3. Git Conventions

- **Commit format**: `<type>: <description>`
- **Types**: feat, fix, refactor, docs, test, chore, perf, ci
- **Branch**: `feat/<name>`, `fix/<name>`, `chore/<name>`
- **不要**: emoji, Co-Authored-By
- **语言**: commit message 用英文

### 4. Code Style

- TypeScript strict mode, no `any`
- 函数 < 50 行, 文件 < 400 行
- 用 const, 不可变优先
- 错误在边界处理，内部信任
- 命名清晰，不加多余注释

### 5. Security Checklist

每次提交前检查：
- [ ] 无硬编码密钥/密码
- [ ] 用户输入已校验
- [ ] SQL 用参数化查询
- [ ] 无 XSS 风险
- [ ] 错误信息不泄露敏感数据

### 6. Strategic Compact (何时压缩上下文)

| 时机 | 操作 | 原因 |
|------|------|------|
| Plan 完成后 | compact | 计划已在 tasks.md，清掉推理过程 |
| Debug 完成后 | compact | 清掉死胡同和错误尝试 |
| 阶段性完成后 | compact | 代码已提交，清掉实现细节 |
| **实现中途** | **不要 compact** | 会丢失关键上下文导致重复/矛盾 |

### 7. Orchestrate 模式 (多 Agent 流水线)

复杂功能用流水线，每步传结构化文档：

```
feature:  planner → tdd → reviewer → security
bugfix:   debugger → tdd → reviewer
refactor: planner → refactor → reviewer → tdd
```

每步的输出是下一步的输入，用 Agent tool + worktree 隔离执行。

### 8. De-Sloppify 模式 (分离清理)

写完功能后，单独跑一轮清理：
1. **Implementation Agent** — 专注实现功能，不管代码美观
2. **Cleanup Agent** — 专注清理：命名、格式、死代码、类型安全

两个专注的 agent 比一个什么都管的 agent 强。

### 9. Continuous Learning (持续学习)

每次会话自动提取"本能"(instincts)：
- Hook 捕获每次工具调用和结果
- 识别可复用的模式（错误解决方案、调试技巧、项目规律）
- 带置信度打分 (0.3-0.9)，多次验证后提升
- 项目隔离存储，跨项目复用需达到 0.8+ 且出现在 2+ 项目

## Skill Package Format

每个技能包是独立 npm 包，结构如下：

```
@lobster-u/<skill-name>/
├── package.json          # npm 包配置
├── manifest.json         # 元数据：分类、标签、依赖
├── SKILL.md              # 角色定义、触发条件、能力边界
├── knowledge/            # 领域知识 → 注入 Agent 记忆
│   ├── domain.md
│   ├── best-practices.md
│   └── anti-patterns.md
├── strategies/           # 行为策略 → 注册到 Agent 技能
│   └── main.md
└── tests/
    ├── smoke.json        # 冒烟测试
    └── benchmark.json    # 基准测试 (10 tasks)
```

## Playbook Format

```
playbooks/<lang>/playbook-<name>.mdx

Sections:
1. Overview — 目标、适用人群、预计时间
2. Prerequisites — 前置知识/工具
3. Steps — 3-5 步骤，每步包含 人的动作 + Agent 动作
4. Skill Pack — 关联技能包列表
5. Expected Output — 完成后应该产出什么
```

## Architecture Decisions

| 决策 | 选择 | 原因 |
|------|------|------|
| Monorepo | pnpm workspace | 统一版本管理，共享配置 |
| 前端 | Next.js 15 | SSR/SSG，React 生态，部署方便 |
| 样式 | Tailwind CSS | 快速开发，一致性 |
| 测试 | Vitest | 快、兼容 Jest API |
| 合约 | Hardhat + Solidity | BSC 部署，成熟工具链 |
| 包发布 | npm (@lobster-u scope) | 标准生态，clawhub 兼容 |

## What We Have That BotLearn Doesn't

1. **CLI 工具** — `lobster-u install/create/test` 一键操作
2. **链上信誉** — Karma Token (BEP-20) + NFT 证书
3. **Campus 社交网络** — 不是概念，是真正可用的 Agent 社交平台
4. **Crypto 技能包** — 链上分析、DEX 交易、代币发射等
5. **技能市场** — 发布、评分、交易技能包
6. **分析仪表盘** — Agent 学习进度、技能雷达图
7. **多框架插件** — 不只 OpenClaw，支持 Claude Code / Cursor / Windsurf
