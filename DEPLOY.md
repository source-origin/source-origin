# 源·ORIGIN 门户 · 在线接单 + QQ 邮箱通知 部署指南

> 目标：把静态门户升级为「能在线接单、离线也能收到通知」的活系统。
> 通知邮箱：**你的通知邮箱(部署时配置)**（源）
> 无需自建服务器，全部用 Cloudflare Pages + Functions + D1 免费层。

---

## 一、本次新增了哪些东西

### 新增文件
```
functions/
  api/
    _shared.js      # 工具：邮件发送(Resend/Mailjet) + 通知落账 + 响应助手
    inquiry.js      # POST /api/inquiry   询价表单 (D1落库 + 邮件通知QQ)
    notify.js       # POST /api/notify    通用通知(付款/订单/告警) + 可密钥鉴权
    health.js       # GET  /api/health    健康检查(worker/db/邮件配置状态)
schema.sql          # D1 表结构 (inquiries / payments / notifications)
tests/
  run-api-tests.mjs # 本地逻辑验证脚本 (node 直接跑，绕过 workerd)
```

### 修改文件
```
agent-services.html   # 加了「在线提交需求」表单，前端接 /api/inquiry
wrangler.toml         # 加了 D1 binding (DB)
_headers              # 修复格式错误 (原格式 Cloudflare 不识别)
_redirects            # 加注释说明 /api 优先级
```

---

## 二、部署步骤 (约 10 分钟)

### 第 1 步：创建 D1 数据库
```bash
cd E:\OriginHub\origin\portal\portal
npx wrangler d1 create source-origin
```
会输出一个 `database_id`，把它填进 `wrangler.toml` 的
`database_id = "REPLACE_WITH_D1_DATABASE_ID"`（替换引号内的占位符）。

### 第 2 步：建表
```bash
npx wrangler d1 execute source-origin --remote --file=schema.sql
```

### 第 3 步：配置邮件发送 (二选一，推荐 Resend)
- **Resend** (推荐，免费100封/天，个人可用)
  1. 去 https://resend.com 注册，拿 API Key
  2. 配置密钥：
     ```bash
     npx wrangler pages secret put RESEND_API_KEY
     # 粘贴你的 key
     npx wrangler pages secret put RESEND_FROM
     # 填: 源·ORIGIN 门户 <onboarding@resend.dev>
     # 若要自定义域名发信，在 Resend 里添加你的域名
     ```
- **Mailjet** (备用)：同位置填 `MAILJET_API_KEY` (格式 `pk:sk`) 和 `MAILJET_FROM`

> 注：`NOTIFY_EMAIL` 默认已是 `你的通知邮箱(部署时配置)`，一般不用改。

### 第 4 步：配置通知密钥 (可选但建议)
```bash
npx wrangler pages secret put NOTIFY_KEY
# 设一个随机字符串，这样 /api/notify 只有带 X-Notify-Key 头才能调
```

### 第 5 步：部署
```bash
npx wrangler pages deploy .
```

### 第 6 步：验证
浏览器访问：`https://<你的项目>.pages.dev/api/health`
应返回：
```json
{ "ok": true, "status": "online", "db": "connected",
  "notify": { "to": "你的通知邮箱(部署时配置)", "emailProvider": "resend" } }
```

然后在 `agent-services.html` 的表单里填一条**测试询价**提交，
你的 QQ 邮箱应收到「【源·ORIGIN】新询价单」邮件。

---

## 三、离线兜底逻辑（你要的关键点）

```
在线时:  浏览器询价 → Worker(/api/inquiry) → D1落账 + 邮件→QQ
门户离线: 邮件已进入邮局(independent of 门户页面是否在线)
```
- **Worker 是 Cloudflare 全球边缘节点**，与 Pages 静态托管同账号但独立运行。
- 即使门户页面挂了，`/api/*` 的 Worker 通常仍在线；邮件一旦发出即入 QQ 邮局，**不依赖门户后续状态**。
- D1 数据库落账 = 邮件万一失败也有完整记录可追溯。

---

## 四、后续可扩展方向
- `payments` 表已建好，可接链上 USDC 付款回调 → 自动状态更新
- 后台看板 (D1 Studio / 简单页) 查看询价单
- 钱包登录 (privy-config.js 已预留) → 客户查自己订单
