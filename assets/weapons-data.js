/* ============================================
   源·ORIGIN 武器库数据 (JSON)
   更新这里即可更新页面，无需改动页面结构。
   字段: name / star / cat / product / status / desc / tags
   cat: agent | infra | contract | crawl | voice | video
   product: ai-agent | crawl | rag | media | chain
   status: activated(已激活-可运行) | ready(可激活-待部署) | applicable(待申请-需下载)
============================================ */
window.WEAPONS = [
  // ========== 已激活 (有源码可运行) ==========
  { name: '源·ORIGIN · 协议状态机', star: '', cat: 'contract', product: 'chain', status: 'activated', desc: 'L5 智能体协议状态机：9 态协议 + ECDSA 签名 + 修订链，已编译 + 测试通过。', tags: ['L5结算','已实证'] },
  { name: '源·ORIGIN · 托管引擎', star: '', cat: 'contract', product: 'chain', status: 'activated', desc: 'L5 托管引擎：6 态生命周期 + 争议押金 + 三重 slash 防双花。', tags: ['L5结算','已实证'] },
  { name: '源·ORIGIN · 身份层', star: '', cat: 'contract', product: 'chain', status: 'activated', desc: 'L5 身份层：did:origin 实现 + 排行榜 + 推荐分润 + append-only 身份链。', tags: ['L5结算','已实证'] },
  { name: '源·ORIGIN · 授权消费', star: '', cat: 'contract', product: 'chain', status: 'activated', desc: 'L5 授权消费：周期预算 + 挂起恢复 + 超额拦截，13 项测试全过。', tags: ['L5结算','已实证'] },
  { name: '源·ORIGIN · 微支付结算', star: '', cat: 'contract', product: 'chain', status: 'activated', desc: 'x402 微支付结算：收据证据验证 + 争议退款 + 额度快照，6 项测试全过。', tags: ['L5结算','微支付'] },
  { name: '源·ORIGIN · 实时语音框架', star: '', cat: 'voice', product: 'media', status: 'activated', desc: '14K★ 实时语音 Agent 框架，源码已入库。', tags: ['语音Agent','源码'] },
  { name: '源·ORIGIN · 音视频实时框架', star: '', cat: 'voice', product: 'media', status: 'activated', desc: '12.9K★ 音视频 + 语音 Agent 实时框架，源码已入库。', tags: ['语音Agent','源码'] },
  { name: '源·ORIGIN · 音频Agent', star: '', cat: 'voice', product: 'media', status: 'activated', desc: '通义音频 Agent（语音/声音理解），含 server/cli/desktop，源码已入库。', tags: ['音频Agent','源码'] },
  { name: '源·ORIGIN · 视觉Agent', star: '', cat: 'agent', product: 'ai-agent', status: 'activated', desc: '视觉 Agent 全家桶（agents-core + plugins），源码已入库。', tags: ['视觉Agent','源码'] },
  { name: '源·ORIGIN · 语音合成', star: '', cat: 'voice', product: 'media', status: 'activated', desc: '45.8K★ 开源 TTS 语音合成，源码已入库。', tags: ['TTS','源码'] },
  { name: '源·ORIGIN · 中文语音合成', star: '', cat: 'voice', product: 'media', status: 'activated', desc: '22.7K★ 高质量中文语音合成，源码已入库。', tags: ['TTS','源码'] },
  { name: '源·ORIGIN · AI短剧生成', star: '', cat: 'video', product: 'media', status: 'activated', desc: 'AI 短剧生成工具，源码已入库。', tags: ['短剧','源码'] },
  { name: '源·ORIGIN · 短视频流水线', star: '', cat: 'video', product: 'media', status: 'activated', desc: '短视频批量生成流水线，源码已入库。', tags: ['短视频','源码'] },
  { name: '源·ORIGIN · 互联网法庭', star: '', cat: 'contract', product: 'chain', status: 'activated', desc: '互联网法庭 Skill（六层栈 + 裁决层），L5 标准参照库。', tags: ['裁决','仲裁'] },
  { name: '源·ORIGIN · 通用抓取引擎', star: '', cat: 'crawl', product: 'crawl', status: 'activated', desc: '自适应选择器 + 反反爬 + MCP 直连 AI，通用抓取引擎。', tags: ['爬虫','MCP'] },

  // ========== 可激活 (有提纯报告, 可部署落地) ==========
  { name: '源·ORIGIN · Agent结算协议', star: '', cat: 'contract', product: 'chain', status: 'ready', desc: '主权 AI Agent 协议：ERC-8004 + escrow 三态 + 4 维声誉 + 法庭。', tags: ['结算协议','已提纯'] },
  { name: '源·ORIGIN · 去中心消息协议', star: '', cat: 'contract', product: 'chain', status: 'ready', desc: '去中心化消息协议：身份 + 消息 + 结算三层，L5 三件套参照。', tags: ['消息协议','已提纯'] },
  { name: '源·ORIGIN · 聚合支付平台', star: '', cat: 'contract', product: 'chain', status: 'ready', desc: '聚合支付平台：约束图智能路由，L5 聚合支付升级方向。', tags: ['支付','已提纯'] },
  { name: '源·ORIGIN · 大模型生态精华', star: '', cat: 'infra', product: 'ai-agent', status: 'ready', desc: '开源大模型生态精华吸收：PagedAttention / Modelfile / 量化。', tags: ['大模型','已提纯'] },
  { name: '源·ORIGIN · 自建源链', star: '', cat: 'contract', product: 'chain', status: 'ready', desc: '自建源链 origin-1：双节点 + YUAN 代币 + DPoS 21 验证者 + 宪法第0条。', tags: ['源链','基建'] },

  // ========== 待申请 (需 clone 下载+部署) ==========
  { name: '源·ORIGIN · Agent协作框架', star: '', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '多智能体协作框架，Agent/Task/Crew，L5 结算层核心参照。', tags: ['Agent框架'] },
  { name: '源·ORIGIN · 应用编排', star: '', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '大模型应用编排，结算流水线 / 事件总线 / 武器接口。', tags: ['Agent框架'] },
  { name: '源·ORIGIN · 自主循环Agent', star: '', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '智能体自主循环 + 目标分解，自主任务执行。', tags: ['Agent框架'] },
  { name: '源·ORIGIN · SOP角色系统', star: '', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: 'SOP 角色系统 + 结算流程模板，软件公司多角色协作。', tags: ['Agent框架'] },
  { name: '源·ORIGIN · 多智能体框架', star: '', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '微软多智能体框架，Pub/Sub 事件总线 + AgentID。', tags: ['Agent框架'] },
  { name: '源·ORIGIN · 轻量任务编排', star: '', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '任务队列 + 最小可行实现，轻量任务编排。', tags: ['Agent框架'] },
  { name: '源·ORIGIN · 长程SuperAgent', star: '', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '字节长程 SuperAgent：run 回执 / checkpoint 血缘 / 三段沙箱。', tags: ['长程任务'] },
  { name: '源·ORIGIN · 自进化Harness', star: '', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '5 层自进化 Harness，OpenClaw 敞口最大。', tags: ['自进化'] },
  { name: '源·ORIGIN · 专业角色库', star: '', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '147K★ 专业 AI 智能体角色库，232+/316 角色。', tags: ['角色库'] },
  { name: '源·ORIGIN · AI网关', star: '', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: 'AI 网关：17 策略 + 9 因子打分 + 分级回退。', tags: ['网关'] },
  { name: '源·ORIGIN · Agent运营平台', star: '', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: 'AI 团队运营平台：hire/schedule/report 编排。', tags: ['运营'] },
  { name: '源·ORIGIN · Agent平台', star: '', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: 'Agent 平台：Build/Run/Manage 三段分离 + 四级 ID 契约。', tags: ['平台'] },
  { name: '源·ORIGIN · 跨链结算协议', star: '', cat: 'contract', product: 'chain', status: 'applicable', desc: 'AI Agent 跨链结算参考协议。', tags: ['结算'] },
  { name: '源·ORIGIN · 合约审计引擎', star: '', cat: 'contract', product: 'chain', status: 'applicable', desc: '智能合约审计检测器引擎。', tags: ['审计'] },
  { name: '源·ORIGIN · 自媒体爬虫', star: '', cat: 'crawl', product: 'crawl', status: 'applicable', desc: '7 大中国平台自媒体爬虫，CDP 复用登录态。', tags: ['自媒体','爬虫'] },
  { name: '源·ORIGIN · 情报反查', star: '', cat: 'crawl', product: 'crawl', status: 'applicable', desc: 'OSINT 用户名反查，400+ 站。', tags: ['情报'] },
  { name: '源·ORIGIN · 个人AI超级智能', star: '', cat: 'video', product: 'media', status: 'applicable', desc: '个人 AI 超级智能，本地优先记忆树。', tags: ['个人AI'] },
  { name: '源·ORIGIN · AI视频流水线', star: '', cat: 'video', product: 'media', status: 'applicable', desc: 'AI 视频自动生成流水线。', tags: ['视频'] },
  { name: '源·ORIGIN · 推理引擎', star: '', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: '推理引擎：PagedAttention 分页注意力。', tags: ['推理'] },
  { name: '源·ORIGIN · 本地推理', star: '', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: 'Modelfile 模型即文件，本地推理。', tags: ['本地推理'] },
  { name: '源·ORIGIN · 结算基建', star: '', cat: 'contract', product: 'chain', status: 'applicable', desc: '贡献时钟 + 并行结算 + 内存池，L5 结算基建参照。', tags: ['结算','基建'] }
];
