# 快速开始 · Quickstart

## 前置

- **Node.js ≥ 18**（本仓库自带脚本用现代 Node 特性）
- 无需任何构建工具：门户是纯 HTML/CSS/JS
- 可选：[Wrangler](https://developers.cloudflare.com/workers/wrangler/) —— 想本地跑 Cloudflare Functions 时才需要

## 1. 克隆并预览门户

```bash
git clone https://github.com/source-origin/source-origin.git
cd source-origin

# 方式 A：任意静态服务器
npx serve .

# 方式 B：仓库自带 mime-server（若存在）
node mime-server.cjs . 8799
```

打开 <http://localhost:8799>（或 `serve` 提示的端口）。

## 2. 跑测试

```bash
# 内联脚本/资源一致性检查
node tests/check-inline.cjs

# 后端接口测试（如涉及 functions/）
node tests/run-api-tests.mjs
```

## 3. 目录速览

```
/                  门户 HTML 页面（首页、开发者、使命、白皮书……）
assets/            全站样式、i18n 引擎、导航骨架、数据
functions/api/     Cloudflare Functions（health / inquiry / notify）
.github/           Actions 工作流与协作模板
docs/              开发者文档（你正在看的一类）
tests/             自检脚本
```

## 4. 提交第一个贡献

见 [`../CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 5. 想接协议？

先读 [`INTEGRATION.md`](INTEGRATION.md) 与 [`ARCHITECTURE.md`](ARCHITECTURE.md)，然后在仓库开一个 **集成 / 对账** issue。

---

### 常见问题

**Q：需要装依赖吗？**
A：门户本身零依赖。只有 `functions/` 与个别脚本可能需要 npm 包。

**Q：为什么没有框架？**
A：门户刻意保持零框架、零构建，降低贡献门槛与长期维护成本。

**Q：中文乱码？**
A：所有文本为 UTF-8。若终端显示乱码，Windows 下建议 `chcp 65001`；脚本打印请用 ASCII 以免旧控制台崩溃。
