# 变更日志 · Changelog

本文件记录 **源·ORIGIN** 门户与公开组件的显著变更。
格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added
- 开源协作基建：`CONTRIBUTING.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md`、`CHANGELOG.md`
- `.github/` 下的 Issue 模板（缺陷 / 功能 / 集成对账）、PR 模板与 `CODEOWNERS`
- `docs/` 开发者文档：架构、快速开始、集成指引、路线图

### Changed
- 留言板通知：新增工作流 `board-notify-all.yml`，使**任意新 issue** 也能触发邮件通知（与 `board-notify.yml` 互补，不重复）

### Fixed
- 留言板邮件通知去重：对「创建 issue 时随带 label」的 `labeled` 事件跳过，确保**一条帖子 = 一封邮件**

## [0.1.0] - 2026-09

### Added
- 门户站点上线（GitHub Pages）
- 开发者留言板（GitHub Issues 驱动，首页内嵌区 `#board` + 独立页）
- 留言 → 邮件通知（GitHub Actions 服务器端直发，不依赖本机开机）
- 全站 12 语言 i18n、赛博深空视觉体系
- 在线询价（Cloudflare Functions + D1）

---

<!--
撰写约定：
- 每个版本分为 Added / Changed / Deprecated / Removed / Fixed / Security
- 最新版本置顶
-->
