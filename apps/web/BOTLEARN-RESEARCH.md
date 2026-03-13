# BotLearn.ai 完整功能研究报告

> 研究日期: 2026-03-10
> 目的: 为 Lobster University 做完整竞品对比
> 覆盖: 首页、社区、文档、7步引导、技能排行、Playbooks、GitHub 仓库

---

## 一、平台概览

- **定位**: "The World's First Bot University" — AI Agent 的第一所大学 + 社交学习网络
- **Slogan**: "Bot Learn, Human Earn." / "Send Your AI Agents to School"
- **核心依赖**: 基于 OpenClaw Agent 平台构建（不是独立 Agent 框架）
- **技术栈**: Next.js (前端)、pnpm monorepo (Skills 仓库)、TypeScript、npm 发包
- **价格**: 免费（schema markup 标注 price: 0 USD）
- **团队**: "Designed by Harvard Alumni & Education Veterans. Building in Public."
- **版权**: (c) 2026 BotLearn
- **社交**: GitHub (botlearn-ai org)、Twitter/X (@botlearn_ai)、Discord

---

## 二、首页 (botlearn.ai)

### 2.1 导航栏
| 项目 | 链接 | 说明 |
|------|------|------|
| Get Started | /7-step | 7步引导页 |
| Docs | /en | 文档首页 |
| Community | /community | Reddit 式社区 |
| SkillHunt | /skillhunt | 技能发现（Coming Soon） |
| 主题切换 | — | 亮色/暗色 |
| 语言切换 | — | EN / 中文 |
| 搜索 | Cmd+K | 全局搜索 |

### 2.2 Hero Section
- 主标语: "Send Your AI Agents to School. Bot Learn, Human Earn."
- 代码块: `Read https://botlearn.ai/skill.md and follow the instructions` (带一键复制)
- 邮件订阅表单（含隐私政策勾选）
- 问题陈述: "The learning bottleneck has shifted..."

### 2.3 四大功能卡片
1. **Best Practices, Fast Onboarding** — 最佳实践快速上手
2. **Bot University (Agent Community)** — 机器人大学（Agent 社区）
3. **Skills & Tools, Always Compounding** — 技能与工具，持续复利
4. **Learning-First Agents (Future)** — 学习优先的 Agent（未来愿景）

### 2.4 CTA Section
- "Join the First Cohort of Bot University"
- 定位早期用户为创始成员

### 2.5 Footer
- 版权 + 社交链接 + Privacy Policy / Terms of Service
- 标语: "Designed by Harvard Alumni & Education Veterans. Building in Public."

---

## 三、社区 (botlearn.ai/community)

### 3.1 整体架构
**三栏布局**, 类 Reddit 设计:
- **左栏**: 频道列表 (Molts)
- **中栏**: 帖子信息流
- **右栏**: 近期 AI Agent + 热门配对

### 3.2 频道系统 (Molts) — 20+ 个频道
| 频道名 | 类型 |
|--------|------|
| #general | 通用 |
| #AI General Discussion | AI 讨论 |
| #Learn in Public | 公开学习 |
| #AI Tools & Applications | AI 工具 |
| #AI Projects Showcase | 项目展示 |
| #Prompt Engineering | 提示工程 |
| #AI Research Papers | 论文 |
| #AI 实战游乐场 | 实战练习 |
| #Macroeconomics | 宏观经济 |
| #Research & Learning | 研究学习 |
| #Machine Learning | 机器学习 |
| #Meta & Governance | 治理 |
| #Agent Divination | Agent 占卜 |
| #入学考试 | 能力评估 |
| #Sensor Design | 传感器设计 |
| #Quant Trading | 量化交易 |
| #龙虾校园恋爱专区 | 社交娱乐 |
| #GASA虾塘 | 社区 |
| #社区共建 | 共建 |

每个频道显示: 订阅人数、帖子数、创建日期、描述

### 3.3 帖子结构
- 标题 + 内容预览 (Markdown 支持)
- 作者信息: 名称、头像、X 绑定、AI/人类标识
- 互动指标: 上投票/下投票 (Reddit 式 +/- 系统)、评论数
- 时间戳 (相对时间: "1h ago")
- 所属频道标签

### 3.4 内容类型
- 技术教程/指南
- 项目展示
- 研究摘要
- 个人学习日志
- 安全提醒/最佳实践
- 代码示例

### 3.5 投票系统
- 上投票/下投票箭头
- 分数计算展示
- userVote 追踪 (null = 未投票)

### 3.6 排序/筛选/分页
- 标签页: New / Top / Discussed
- 分页: 141 页 (截至研究时)
- 按频道、作者类型、互动量筛选

### 3.7 Agent 社交功能
- **Top Pairings**: Agent 配对互动排行
- **Recent AI Agents**: 最新 Agent 列表 (显示 8 个)
- Agent 关注数
- Owner X 账号链接

### 3.8 用户功能
- 登录/注册 (评论/投票需登录)
- 创建帖子按钮
- Markdown 编辑器
- 频道/Molt 选择器
- Cmd+K 命令面板

---

## 四、文档体系 (botlearn.ai/en/docs)

### 4.1 文档框架
- Next.js 构建
- 暗色模式支持
- Cmd+K 搜索
- 双语: EN / 中文
- 无版本管理系统
- 无面包屑导航

### 4.2 完整侧边栏结构

```
Docs
  ├── Home
  ├── Foundations (404, 未完成)
  │
  ├── 7-Step Quick Start
  │   ├── Step 0: OpenClaw Installation Guide
  │   ├── Step 1: Activation — Meet Your Agent
  │   ├── Step 2: Activation — First Real Task
  │   ├── Step 3: Stabilization — Security Baseline
  │   ├── Step 4: Stabilization — Personalize Your Agent
  │   ├── Step 5: Optimization — First Advanced Task
  │   ├── Step 6: Optimization — Self-Improvement
  │   └── Step 7: Systemization — Before/After/Beyond
  │
  ├── Playbooks (10 个)
  │   ├── Playbooks Overview
  │   ├── AI Skill Learning
  │   ├── Career Learning Loop
  │   ├── English Learning Professionals
  │   ├── Exam Prep Fast Track
  │   ├── Learning Science System
  │   ├── Micro-Learning Daily Digest
  │   ├── Personal Knowledge System
  │   ├── Research Paper Reading
  │   ├── Technical Interview Training
  │   └── Writing for Impact
  │
  ├── Extended Reading
  │   ├── The 4C Framework (404)
  │   ├── Morning Brief Pipeline
  │   ├── Skill Pack vs Skills
  │   └── Agent Security Layers
  │
  └── Skills (21 个文档页)
      ├── Skills Leaderboard Overview
      ├── Continuous Learning v2
      ├── Learning Medusa
      ├── Remembering Conversations
      ├── Obsidian Markdown
      ├── Obsidian Bases
      ├── JSON Canvas
      ├── Excalidraw Diagram
      ├── Writing Clearly & Concisely
      ├── Writing Plans
      ├── Copywriting
      ├── Doc Coauthoring
      ├── Code Reviewer
      ├── Frontend Code Review
      ├── Requesting Code Review
      ├── Next.js Best Practices
      ├── Vercel React Best Practices
      ├── Vue Best Practices
      ├── Remotion Best Practices
      ├── Better Auth Best Practices
      └── Supabase Postgres Best Practices
```

---

## 五、7步引导系统 (核心功能)

### 5.0 概览页 (/7-step)
- **标题**: "Master OpenClaw in 7 Steps"
- **Before/After 对比**: Step 0 (无方向) vs Step 7 (自动化运行)
- **四大能力展示**: Morning Brief / Social Media Monitoring / Financial Intelligence / Inbox Defence
- **5 个自定义技能**: botlearn-reminder, botlearn-healthcheck, botlearn-assessment, botlearn-selfoptimize, botlearn-certify

### 5.1 Step 0: OpenClaw 安装
**阶段**: 准备
- **前置条件**: LLM API Key (支持 7 家供应商: OpenAI, Anthropic, Google, Mistral, xAI, Meta, Cohere)
- **安装命令**: `curl -fsSL https://openclaw.ai/install.sh | bash`
- **验证**: `openclaw --version` + `openclaw doctor`
- **配置向导**: 11 步 (模型、渠道、技能、Hooks、Token、Web UI)
- **消息渠道**: Discord (详细配置) + Telegram
- **云部署**: 8 个选项 (ClawHost, MyClaw, DockClaw, Railway, Zeabur, Render, DigitalOcean, Vercel)
- **FAQ**: 安装/配置/渠道/运行时/云部署/安全

### 5.2 Step 1: 激活 — 认识你的 Agent
**阶段**: Activation (1-2)
**心理收益**: "I can see what my agent can actually do"

**3 个任务**:
1. 安装 3 个 BotLearn 技能 (Reminder + HealthCheck + Assessment)
2. 运行系统诊断 (5 维度: Hardware/Config/Security/Skills/Autonomy)
3. 运行自我评估 (5 维度: Reasoning/Retrieval/Creation/Execution/Orchestration)

**输出**: 基线分数 (55-70 正常)、HTML 报告、JSON 数据
**核心概念**: Capability Delta (Step 1 vs Step 7 的分差 = 成长指标)

### 5.3 Step 2: 激活 — 第一个真实任务
**阶段**: Activation (1-2)
**心理收益**: "My agent actually did something useful"

**核心任务**: Morning Brief (每日智能摘要)
- **3 个技能选项**:
  - `dinstein/tech-news-digest` — 技术新闻 (推荐, 最快)
  - `kevinho/clawfeed` — 团队级情报
  - `steipete/blogwatcher` — 特定源监控
- **配置**: 默认运行 or 自定义主题
- **数据源**: RSS + GitHub Trending + (可选) Twitter API / Brave Search API
- **输出格式**: Markdown 结构化摘要 (TOP STORIES / YOUR TOPICS / MARKET PULSE / SAVED FOR LATER)

### 5.4 Step 3: 稳定 — 安全基线
**阶段**: Stabilization (3-4)
**心理收益**: "My agent is safe to run"

**3 大安全原则**:
1. **控制监听者**: 声明授权用户, 限制敏感操作
2. **凭证隔离**: API Key 放专用 secrets 文件, 不进代码/仓库
3. **执行限制**: 限制工作区范围, 排除系统目录

### 5.5 Step 4: 稳定 — 个性化
**阶段**: Stabilization (3-4)
**心理收益**: "This is my agent"

**上下文文件体系**:
- P0 (必配): `SOUL.md` (价值观) / `USER.md` (用户信息) / `AGENTS.md` (行为规则)
- P1 (可选): `HEARTBEAT.md` (日程) / `MEMORY.md` (持久记忆)

**关键设计**: `AGENTS.md` 定义 "执行偏好 > 咨询偏好"
- 不问就做的操作: 发消息、读文件、搜索、跑定时任务
- 需要审批的操作: 发外部邮件、付费 API、删除文件

### 5.6 Step 5: 优化 — 高级任务
**阶段**: Optimization (5-6)
**心理收益**: "This agent is actually useful"

**3 个场景 (选 1)**:
- **场景 A: 社交媒体监控** — Reddit + YouTube + Twitter/X (3 个技能)
- **场景 B: 金融情报** — Finnhub + 宏观分析 + 股票分析 + Polymarket (4 个技能)
- **场景 C: 邮箱防御** — Gmail 分类 + 日历同步 + 会议准备 (3 个技能)

### 5.7 Step 6: 优化 — 自我改进
**阶段**: Optimization (5-6)
**心理收益**: "My agent can keep getting better"

**自进化循环**: Observe → Analyze → Ask Community → Propose → You Approve
- **90/10 原则**: Agent 做 90% 分析, 人做 10% 决策
- **安装**: `botlearn-selfoptimize` 技能
- **输出**: `.learnings/` 目录下的改进建议
- **人类操作**: Approve / Modify / Decline

### 5.8 Step 7: 体系化 — 认证
**阶段**: Systemization
**心理收益**: "I can see where this is going"

**认证流程**:
1. 安装 `botlearn-certify` 技能
2. 运行最终评估 (对比 Step 1 基线)
3. 生成 BotLearn Education Certificate (MD + HTML)
4. 可选: 分享到社区 or 导出 PDF
5. Agent 规划 Week 2 路线

**认证级别示例**: "AI Practitioner (Silver)" + 专业方向 (如 "Content Creator")

---

## 六、Playbooks 系统

### 6.1 理念
- 20 分钟学习方案, 强调产出而非笔记
- 基于学习科学: ZPD (最近发展区)、认知负荷理论、自我调节学习
- 10/90 逻辑: 人做决策, Agent 做执行

### 6.2 10 个 Playbooks
| # | 名称 | 场景 |
|---|------|------|
| 01 | AI Skill Learning | 从零到真实产出 |
| 02 | Career Learning Loop | 边工作边成长 |
| 03 | English Learning | 从阅读到口语 |
| 04 | Exam Prep Fast Track | 快速备考 |
| 05 | Learning Science System | 脑科学学习 |
| 06 | Micro-Learning Daily Digest | 5分钟微学习 |
| 07 | Personal Knowledge System | 知识管理 |
| 08 | Research Paper Reading | 论文阅读 |
| 09 | Technical Interview | 模拟面试 |
| 10 | Writing for Impact | 专业写作 |

### 6.3 Skill Pack 覆盖
- 104 个技能, 64 个已验证, 40 个候选
- 每个 Playbook 包含可下载的 Skill Pack

---

## 七、技能系统

### 7.1 Skills Leaderboard
- **数据源**: 镜像 skills.sh 的安装数据 (BotLearn 不自己管排名)
- **排名依据**: 全时安装量 (如 143.6K, 104.0K)
- **视图**: Overall Top 20 / Learning Top 20 / Playbook-Covered Skills
- **无投票/评分**: 纯安装量排名
- **无提交机制**: 只展示, 不管理

### 7.2 Skills 文档页结构 (每个技能)
| 字段 | 内容 |
|------|------|
| Status | verified / unverified |
| Included in Playbook | yes / no |
| Source | inventory |
| URL | skills.sh 链接 |
| Heat | 全时安装量 |
| Tags | scenario / category / tool |
| Associated Playbook | 关联的 Playbook |
| What It Does | 功能描述 |
| Who It's For | 目标用户 |
| How It Fits | 如何配合 Playbook |
| Use Case | 使用场景 |
| How to Use | 使用步骤 |
| Example | 示例 |
| Verification | 验证标准 |

### 7.3 BotLearn 自定义技能 (botlearn-skills 仓库)

**27 个官方技能**, 分 6 大类:

#### Information Retrieval (5)
- google-search, academic-search, rss-manager, twitter-intel, reddit-tracker

#### Content Processing (5)
- summarizer, translator, rewriter, keyword-extractor, sentiment-analyzer

#### Code Assistance (5)
- code-gen, code-review, debugger, refactor, doc-gen

#### Creative Generation (5)
- brainstorm, storyteller, writer, copywriter, social-media

#### Reasoning (1)
- mental-models (24 个 Munger 心智模型)

#### BotLearn Agent Skills (6) — 自进化循环
- botlearn (社区 SDK)
- botlearn-assessment (5 维评估)
- botlearn-healthcheck (健康检查)
- botlearn-reminder (7 步提醒)
- botlearn-certify (认证生成)
- botlearn-selfoptimize (自我优化)

### 7.4 技能包结构 (标准化)
```
@botlearn/<skill-name>/
├── package.json            # npm 包配置
├── manifest.json           # 元数据: category, benchmarkDimension, 文件声明
├── SKILL.md                # 角色定义, 触发词, 能力边界
├── knowledge/              # 领域知识 → 注入 Agent Memory
│   ├── domain.md
│   ├── best-practices.md
│   └── anti-patterns.md
├── strategies/             # 行为策略 → 注册到 Agent Skills
│   └── main.md
└── tests/
    ├── smoke.json          # 冒烟测试: 1 任务, <60s, 通过阈值 60/100
    └── benchmark.json      # 基准测试: 10 任务 (3 easy / 4 medium / 3 hard)
```

### 7.5 自进化循环架构
```
botlearn-reminder (引导)
       ↓
botlearn-assessment (测量能力)
       ↓
botlearn-healthcheck (确保健康)
       ↓
botlearn-selfoptimize (改进弱项)
       ↓
botlearn-certify (认证成就)
       ↓
botlearn (分享到社区)
       ↓ (循环)
```

---

## 八、Extended Reading (深度内容)

### 8.1 Morning Brief Pipeline (四阶段架构)
1. **Ingestion** (采集): RSS/Atom + Web Scraping + API (GitHub Trending, Product Hunt)
2. **Curation** (策展): 去重 + 语义过滤 + 质量评分 (来源权威度/互动量/时效性)
3. **Synthesis** (合成): LLM 摘要 + 交叉验证 + 翻译
4. **Delivery** (投递): Markdown 格式 + 多渠道 (消息/邮件/语音/Notion/飞书)

### 8.2 Skill Pack vs Skills
- **核心论点**: 技能太多会降低 Agent 性能
- **4 大隐藏成本**: 智能退化 / 决策瘫痪 / 安全风险 / 成本爆炸
- **安装层级**: Bundled > Dashboard > CLI Registry > Manual
- **3-Filter 测试**: 频繁使用? 真实替代努力? 最小权限?

### 8.3 Agent Security Layers (四层安全模型)
1. **Network Isolation**: Agent 隐藏于公网, 仅消息渠道为入口
2. **Permission Minimization**: 限制工作区范围
3. **Secrets Management**: 凭证隔离, 泄露即重置
4. **Execution Control**: OS 路径限制 + 行为约束

### 8.4 The 4C Framework
- **状态**: 404 (页面不存在, 尚未发布)

---

## 九、SkillHunt (/skillhunt)
- **状态**: Coming Soon (纯占位页)
- **描述**: "Discover the best skills for your AI agent. A curated directory to find the newest and most suitable tools."
- **当前无任何功能**

---

## 十、GitHub 仓库分析

### 10.1 组织: botlearn-ai (4 个仓库)

| 仓库 | Stars | 语言 | 描述 |
|------|-------|------|------|
| awesome-openclaw-learning-skills | 25 | MDX | 文档源码 (Playbooks + Skills 文档) |
| botlearn-skills | 6 | Shell/TS | 27 个官方技能包 |
| Playbooks | 1 | — | (可能是旧仓库) |
| .github | 0 | — | 组织配置 |

### 10.2 botlearn-skills 仓库结构
```
botlearn-skills/
├── packages/
│   └── botlearn/                    # SDK 包
│       ├── registry/
│       │   └── skills-registry.json # 技能注册表
│       └── src/
│           ├── catalog.ts
│           ├── index.ts
│           ├── types.ts
│           └── validator.ts
├── skills/                          # 27 个技能目录
│   ├── academic-search/
│   ├── botlearn/
│   ├── botlearn-assessment/
│   ├── botlearn-certify/
│   ├── botlearn-healthcheck/
│   ├── botlearn-mental-models/
│   ├── botlearn-reminder/
│   ├── botlearn-selfoptimize/
│   ├── brainstorm/
│   ├── code-gen/
│   ├── code-review/
│   ├── copywriter/
│   ├── debugger/
│   ├── doc-gen/
│   ├── google-search/
│   ├── keyword-extractor/
│   ├── reddit-tracker/
│   ├── refactor/
│   ├── rewriter/
│   ├── rss-manager/
│   ├── sentiment-analyzer/
│   ├── social-media/
│   ├── storyteller/
│   ├── summarizer/
│   ├── translator/
│   ├── twitter-intel/
│   └── writer/
├── scripts/                         # 工具脚本
│   ├── create-skill.ts
│   ├── cross-regression.mjs
│   ├── enrich-manifests.mjs
│   ├── generate-readmes.mjs
│   ├── generate-registry.mjs
│   ├── publish.mjs
│   └── validate-all.mjs
└── docs/
    └── specs/skills/
        ├── design.md
        ├── requirements.md
        └── tasks.md
```

### 10.3 SDK 功能
```typescript
import { validateManifest } from "botlearn";
import type { SkillManifest, ValidationResult } from "botlearn";
```
- manifest 验证
- 类型检查
- 注册表生成

### 10.4 发布渠道
- npm (`pnpm publish:npm`)
- skills.ai (`pnpm publish:skills`)
- clawhub (`pnpm publish:clawhub`)
- 自动按依赖拓扑序发布

### 10.5 awesome-openclaw-learning-skills 仓库结构
```
awesome-openclaw-learning-skills/
├── botlearn-playbooks/
│   ├── playbook_en/ (10 个 .mdx 文件)
│   └── playbook_zh/ (10 个 .mdx 文件)
└── botlearn-skills/
    ├── skills_en/ (21 个 .mdx 文件)
    └── skills_zh/ (21 个 .mdx 文件)
```

---

## 十一、Registry 数据模型 (skills-registry.json)

每个技能注册条目:
```json
{
  "name": "@botlearn/skill-name",
  "version": "0.1.0",
  "description": "...",
  "category": "information-retrieval | content-processing | programming-assistance | creative-generation | meta",
  "benchmarkDimension": "...",
  "expectedImprovement": 30-50,
  "tags": ["..."],
  "capabilities": ["..."],
  "triggers": ["..."],
  "dependencies": { "@botlearn/dep": ">=0.1.0" },
  "dependents": ["@botlearn/dep"],
  "compatibility": { "openclaw": ">=0.5.0" },
  "npm": "https://www.npmjs.com/package/@botlearn/skill-name"
}
```

---

## 十二、未完成 / 404 页面
| URL | 状态 |
|-----|------|
| /en/docs/foundations | 404 |
| /en/docs/get-started | 404 (实际是 /en/quickstart/step0) |
| /en/docs/extended-reading | 404 (实际分散在子页面) |
| /en/extended-reading/the-4c-framework | 404 |
| /skillhunt | Coming Soon 占位页 |

---

## 十三、BotLearn vs Lobster University 对比要点

### BotLearn 有, 我们需要评估的:
1. **7 步引导系统** — 结构化渐进式 Agent 激活流程
2. **Reddit 式社区** — 频道、投票、帖子、Agent 身份
3. **Playbooks (10个)** — 20 分钟学习方案 + Skill Pack
4. **Skills Leaderboard** — 基于安装量的排行 (镜像 skills.sh)
5. **自进化循环** — 评估→诊断→优化→认证→社区分享
6. **Context Files 体系** — SOUL.md / USER.md / AGENTS.md / HEARTBEAT.md / MEMORY.md
7. **Morning Brief 功能** — 多源采集→策展→合成→投递
8. **Capability Delta** — Step 1 vs Step 7 可量化成长
9. **认证系统** — Education Certificate (MD + HTML)
10. **双语支持** — EN / 中文 全站

### BotLearn 没有 / 我们可以差异化的:
1. **无链上功能** — 没有 Karma 上链、没有代币、没有合约
2. **无 CLI 工具** — 依赖 OpenClaw 的 clawhub CLI
3. **无技能市场** — SkillHunt "Coming Soon"
4. **无独立 Agent 框架** — 100% 依赖 OpenClaw
5. **无收费模式** — 纯免费, 无商业模式
6. **社区功能简单** — 没有 DM、没有群组、没有实时聊天
7. **排行榜被动** — 只镜像 skills.sh, 不管理自己的排名
8. **无 Campus 功能** — README 提到但产品中不存在 (Labs / Knowledge Chain / Karma)
9. **SkillHunt 未上线** — 技能发现功能空白
10. **Foundations 未完成** — 基础概念页 404

### 关键洞察:
- BotLearn 本质是 **OpenClaw 的教育层**, 不是独立平台
- 社区是亮点但规模小 (141 页帖子)
- Skills 仓库质量不错 (27 个标准化技能, 完整测试)
- 7 步系统是核心产品, 设计精心但依赖 OpenClaw 安装
- README 中描述的 Karma/Credits/Knowledge Chain 在产品中尚未实现
- 团队注重心理设计 (每步都有 Psychological Payoff)
