# Lobster University — Task Tracker

## Phase 1: Foundation [DONE]
- [x] Monorepo 骨架 (pnpm workspace)
- [x] @lobster-u/sdk (manifest 校验)
- [x] @lobster-u/registry (技能搜索)
- [x] @lobster-u/cli 骨架
- [x] 示例 Skill (google-search + content-engine)
- [x] CLAUDE.md 开发标准 + 高级工作流模式
- [x] Hooks 系统
- [x] 推到 GitHub

## Phase 2: Website [95%]
- [x] Next.js 15 项目初始化
- [x] 首页 (Hero + Quick Start + Skills Overview + Features)
- [x] Skills 展示页 (31 skills, 6 categories)
- [x] Playbooks 展示页 (5 playbooks)
- [x] 文档页 (Getting Started + Skill Format + Compatibility)
- [ ] 部署到 Cloudflare
- [ ] 更新网站 skills 页面 (planned → ready，28 skills)
- [ ] 更新网站 playbooks 页面 (5 → 10 playbooks)

## Phase 3: Skills Library [90%]

### 通用 Skills — 全部完成 (从 BotLearn fork + 改名)
- [x] 信息检索 (5): google-search, academic-search, rss-manager, twitter-intel, reddit-tracker
- [x] 内容处理 (5): summarizer, translator, rewriter, keyword-extractor, sentiment-analyzer
- [x] 代码辅助 (5): code-gen, code-review, debugger, refactor, doc-gen
- [x] 创意生成 (5): brainstorm, storyteller, writer, copywriter, social-media
- [x] 推理 (1): mental-models (20 个思维模型)
- [x] 原创: content-engine (唯一自己写的)

### 自研 Skills — 全部完成 (从 BotLearn fork + 改名)
- [x] assessment — 5 维考试 + 自动打分 + 雷达图
- [x] healthcheck — 11 个收集脚本 + 5 域检查
- [x] selfoptimize — hook 系统 + 错误检测 + 学习提取
- [x] certify — 6 级认证 + 证书生成
- [x] reminder — 7 天入学引导
- [x] campus-sdk — 社交网络 API 客户端

### Crypto Skills — 未开始 (我们的差异化，BotLearn 没有)
- [ ] chain-analyzer — 链上数据分析，地址画像，资金流向
- [ ] dex-trader — DEX 交易策略，流动性分析，滑点优化
- [ ] token-launcher — 代币发行，合约部署，流动性引导
- [ ] kol-manager — KOL 运营管理，影响力分析，合作策略
- [ ] wallet-monitor — 钱包监控，大户追踪，异常告警

### 基础设施 — 已完成
- [x] validate-all.mjs — 28/28 skills 通过
- [x] skills-registry.json — 28 skills 填充
- [x] SDK 升级：加权搜索 + 拓扑排序 + 依赖树 + 丰富类型
- [x] Registry 升级：加权相关性评分
- [ ] npm 发布所有 skill 包

## Phase 4: Playbooks [DONE]
- [x] 10 双语 playbooks (从 BotLearn awesome repo fork)
- [x] AI 技能学习 (playbook-ai-skill-learning)
- [x] 职业学习循环 (playbook-career-learning-loop)
- [x] 英语口语 (playbook-english-learning-professionals)
- [x] 考试突击 (playbook-exam-prep-fast-track)
- [x] 学习科学 (playbook-learning-science-system)
- [x] 微学习日报 (playbook-micro-learning-daily-digest)
- [x] 个人知识系统 (playbook-personal-knowledge-system)
- [x] 论文阅读 (playbook-research-paper-reading)
- [x] 技术面试 (playbook-technical-interview-training)
- [x] 写作 (playbook-writing-for-impact)
- [ ] 补充 Crypto 专属 playbooks (配合 Crypto skills)

## Phase 5: Smart Contracts — 未开始
- [ ] Karma Token (BEP-20)
- [ ] NFT Certificate (ERC-721)
- [ ] Skill Marketplace 合约
- [ ] 部署到 BSC Testnet
- [ ] 部署到 BSC Mainnet

## Phase 6: Campus (Agent Social Network) — 未开始
- [ ] API 设计
- [ ] Agent 注册/身份
- [ ] 发帖/评论/投票
- [ ] Karma 计算引擎
- [ ] Knowledge Chain

## 基础设施
- [x] 文档体系 (design.md, requirements.md, user-guide.md, user-stories.md)
- [x] CONTRIBUTING.md
- [x] .npmrc 多注册表配置
- [x] 发布工具链 (validate-all, cross-regression, publish, generate-registry, generate-readmes, enrich-manifests, create-skill)
- [ ] CI/CD (GitHub Actions)
- [ ] npm 发布

## 未 commit 的变更 (当前 session)
- 28 个 skills (通用 + 自研 + 原创)
- SDK 升级 (catalog.ts, 丰富类型, 加权搜索)
- Registry 升级 (加权相关性)
- 10 双语 playbooks
- 7 个 build scripts
- 文档体系 + CONTRIBUTING.md + .npmrc
- skills-registry.json (28 skills)
- tasks.md 更新
