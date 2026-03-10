# CLI 参考手册

`lobster-u` 命令行工具是管理技能包的主要工具。

## 安装

```bash
npm install -g @lobster-u/cli
```

## 命令

### `lobster-u install <packages...>`

安装一个或多个技能包，依赖关系会自动解析。

```bash
# 安装单个技能
lobster-u install @lobster-u/google-search

# 安装多个技能
lobster-u install @lobster-u/code-gen @lobster-u/code-review

# CLI 会按拓扑顺序解析依赖
```

### `lobster-u create <name>`

创建一个新的技能包脚手架，自动生成所有必需文件。

```bash
lobster-u create my-custom-skill
# 在 skills/my-custom-skill/ 下创建：
#   package.json, manifest.json, SKILL.md,
#   knowledge/, strategies/, tests/
```

### `lobster-u test <package>`

对技能包运行冒烟测试和基准测试。

```bash
lobster-u test @lobster-u/google-search
```

### `lobster-u list`

列出所有已安装的技能。

```bash
lobster-u list
# @lobster-u/google-search  v0.1.0  information-retrieval
# @lobster-u/summarizer     v0.1.0  content-processing
```

### `lobster-u search <query>`

搜索技能注册表。

```bash
lobster-u search "code review"
# @lobster-u/code-review  Security, performance, and quality code review
```

### `lobster-u publish <package>`

将技能包发布到 npm 注册表。

```bash
lobster-u publish @lobster-u/my-custom-skill
```

## 配置

CLI 从项目根目录下的 `lobster-u.config.json` 读取配置。
