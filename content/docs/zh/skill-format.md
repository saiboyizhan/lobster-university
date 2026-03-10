# 技能包格式

Lobster University 中的每个技能都遵循统一的结构，使技能具备可预测、可测试、可组合的特性。

## 目录结构

```
@lobster-u/<skill-name>/
├── package.json          # npm 包配置
├── manifest.json         # 元数据：分类、标签、依赖
├── SKILL.md              # 角色定义、触发条件、能力边界
├── knowledge/            # 领域知识文件
│   ├── domain.md         # 核心领域知识
│   ├── best-practices.md # 经过验证的最佳实践
│   └── anti-patterns.md  # 常见错误及规避方法
├── strategies/           # 行为策略
│   └── main.md           # 主策略
└── tests/
    ├── smoke.json        # 冒烟测试（3-5 个任务）
    └── benchmark.json    # 完整基准测试（10 个任务）
```

## manifest.json

manifest 文件定义了 CLI、注册表和市场所使用的元数据。

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

SKILL.md 文件定义了技能激活时 Agent 扮演的角色。使用 YAML frontmatter 存储元数据，Markdown 描述角色定义。

### 主要章节

1. **角色（Role）** — 技能激活后 Agent 变成什么
2. **能力（Capabilities）** — Agent 能做什么（编号列表）
3. **约束（Constraints）** — Agent 不能做什么（安全护栏）
4. **激活条件（Activation）** — 技能何时、如何触发

## 知识文件

知识文件用于向 Agent 的上下文注入领域专业知识：

- `domain.md` — 核心领域知识
- `best-practices.md` — 经过验证的模式和技巧
- `anti-patterns.md` — 常见错误及其规避方法

## 策略

策略定义了行为模式——即 Agent 应该如何处理任务。

## 测试

- `smoke.json` — 3-5 个快速验证任务
- `benchmark.json` — 10 个标准化任务，衡量技能提升效果
