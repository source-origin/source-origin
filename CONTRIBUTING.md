# 贡献指南 · Contributing to 源·ORIGIN

感谢你想为 **源·ORIGIN**（AI 智能体经济的清算与结算层）出一份力。

我们欢迎三类贡献：

1. **门户与文档** —— 站点、文案、翻译、`docs/`
2. **协议与分析** —— 结算/托管/声誉模型的对账、安全分析、基准测试
3. **生态接入** —— SDK、适配器、示例、集成指南

---

## 先读这三份

- [`README.md`](../README.md) —— 项目定位与功能
- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) —— 六层体系与结算流
- [`SECURITY.md`](../SECURITY.md) —— 安全问题请走私密渠道

---

## 开发流程

1. **Fork** 本仓库，从 `main` 切出特性分支：
   ```bash
   git checkout -b feat/你的改动
   ```
2. **本地预览门户**（纯静态，零依赖）：
   ```bash
   npx serve .
   # 或
   node mime-server.cjs . 8799
   ```
3. **提交前自检**（本仓库自带检查脚本）：
   ```bash
   node tests/check-inline.cjs
   node tests/run-api-tests.mjs
   ```
4. **发起 Pull Request**，填写 PR 模板中的检查清单。

---

## 提交信息规范

采用 Conventional Commits：

```
feat(portal): 新增某某页面
fix(board): 修复留言去重漏判
docs(arch): 补充 escrow 状态机说明
```

- 消息**用英文**（避免某些 Git 客户端/工具链把中文当路径处理）。
- 一个 PR 只做一件事。

---

## 文案与调性

- **中立、真实、不吹**。不承诺未实现的能力；实验性特性显式标注 `experimental`。
- 中文为主，站点 i18n 键需**中英同步**（见 `assets/i18n.js`）。
- 不引入付费服务依赖，除非在 issue 中先讨论并获得维护者认可。

---

## 资助与署名

本仓库目前**不接受任何代币募资**。贡献以署名与 git 历史体现。

---

## 行为准则

参与本项目即表示你同意遵守 [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)。
