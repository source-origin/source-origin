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
  { name: 'L5 AgentAgreement', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'activated', desc: 'L5 智能体协议状态机：9 态协议 + ECDSA 签名 + 修订链，已编译 + 测试通过。', tags: ['L5结算','已实证'] },
  { name: 'L5 AgentEscrow', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'activated', desc: 'L5 托管引擎：6 态生命周期 + 争议押金 + 三重 slash 防双花。', tags: ['L5结算','已实证'] },
  { name: 'L5 AgentIdentity', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'activated', desc: 'L5 身份层：did:origin 实现 + 排行榜 + 推荐分润 + append-only 身份链。', tags: ['L5结算','已实证'] },
  { name: 'L5Delegation', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'activated', desc: 'L5 授权消费：周期预算 + 挂起恢复 + 超额拦截，13 项测试全过。', tags: ['L5结算','已实证'] },
  { name: 'L5x402', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'activated', desc: 'x402 微支付结算：收据证据验证 + 争议退款 + 额度快照，6 项测试全过。', tags: ['L5结算','微支付'] },
  { name: 'Pipecat', star: '⭐⭐⭐⭐⭐', cat: 'voice', product: 'media', status: 'activated', desc: '14K★ 实时语音 Agent 框架，源码已入库。', tags: ['语音Agent','源码'] },
  { name: 'LiveKit-Agents', star: '⭐⭐⭐⭐⭐', cat: 'voice', product: 'media', status: 'activated', desc: '12.9K★ 音视频 + 语音 Agent 实时框架，源码已入库。', tags: ['语音Agent','源码'] },
  { name: 'Qwen-Audio-Agent', star: '⭐⭐⭐⭐⭐', cat: 'voice', product: 'media', status: 'activated', desc: '通义音频 Agent（语音/声音理解），含 server/cli/desktop，源码已入库。', tags: ['音频Agent','源码'] },
  { name: 'Vision-Agents', star: '⭐⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'activated', desc: '视觉 Agent 全家桶（agents-core + plugins），源码已入库。', tags: ['视觉Agent','源码'] },
  { name: 'Coqui-TTS', star: '⭐⭐⭐⭐⭐', cat: 'voice', product: 'media', status: 'activated', desc: '45.8K★ 开源 TTS 语音合成，源码已入库。', tags: ['TTS','源码'] },
  { name: 'Index-TTS', star: '⭐⭐⭐⭐⭐', cat: 'voice', product: 'media', status: 'activated', desc: '22.7K★ 高质量中文语音合成，源码已入库。', tags: ['TTS','源码'] },
  { name: 'ToonFlow', star: '⭐⭐⭐⭐', cat: 'video', product: 'media', status: 'activated', desc: 'AI 短剧生成工具，源码已入库。', tags: ['短剧','源码'] },
  { name: 'Shorts-Gen', star: '⭐⭐⭐⭐', cat: 'video', product: 'media', status: 'activated', desc: '短视频批量生成流水线，源码已入库。', tags: ['短视频','源码'] },
  { name: 'Internet-Court', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'activated', desc: '互联网法庭 Skill（六层栈 + 裁决层），L5 标准参照库。', tags: ['裁决','仲裁'] },
  { name: 'Scrapling', star: '⭐⭐⭐⭐⭐', cat: 'crawl', product: 'crawl', status: 'activated', desc: '自适应选择器 + 反反爬 + MCP 直连 AI，通用抓取引擎。', tags: ['爬虫','MCP'] },

  // ========== 可激活 (有提纯报告, 可部署落地) ==========
  { name: 'Pneuma-Protocol', star: '⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'ready', desc: '主权 AI Agent 协议：ERC-8004 + escrow 三态 + 4 维声誉 + 法庭。', tags: ['结算协议','已提纯'] },
  { name: 'XMTP', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'ready', desc: '去中心化消息协议：身份 + 消息 + 结算三层，L5 三件套参照。', tags: ['消息协议','已提纯'] },
  { name: 'HyperSwitch', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'ready', desc: '聚合支付平台：约束图智能路由，L5 聚合支付升级方向。', tags: ['支付','已提纯'] },
  { name: 'LLM-Ecosystem', star: '⭐⭐⭐⭐⭐', cat: 'infra', product: 'ai-agent', status: 'ready', desc: '开源大模型生态精华吸收：PagedAttention / Modelfile / 量化。', tags: ['大模型','已提纯'] },
  { name: 'Origin-Chain', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'ready', desc: '自建源链 origin-1：双节点 + YUAN 代币 + DPoS 21 验证者 + 宪法第0条。', tags: ['源链','基建'] },

  // ========== 待申请 (需 clone 下载+部署) ==========
  { name: 'CrewAI', star: '⭐⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '多智能体协作框架，Agent/Task/Crew，L5 结算层核心参照。', tags: ['Agent框架'] },
  { name: 'LangChain', star: '⭐⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '大模型应用编排，结算流水线 / 事件总线 / 武器接口。', tags: ['Agent框架'] },
  { name: 'AutoGPT', star: '⭐⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '智能体自主循环 + 目标分解，自主任务执行。', tags: ['Agent框架'] },
  { name: 'MetaGPT', star: '⭐⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: 'SOP 角色系统 + 结算流程模板，软件公司多角色协作。', tags: ['Agent框架'] },
  { name: 'AutoGen', star: '⭐⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '微软多智能体框架，Pub/Sub 事件总线 + AgentID。', tags: ['Agent框架'] },
  { name: 'BabyAGI', star: '⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '任务队列 + 最小可行实现，轻量任务编排。', tags: ['Agent框架'] },
  { name: 'DeerFlow', star: '⭐⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '字节长程 SuperAgent：run 回执 / checkpoint 血缘 / 三段沙箱。', tags: ['长程任务'] },
  { name: 'CowAgent', star: '⭐⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '5 层自进化 Harness，OpenClaw 敞口最大。', tags: ['自进化'] },
  { name: 'AgencyAgents', star: '⭐⭐⭐⭐⭐', cat: 'agent', product: 'ai-agent', status: 'applicable', desc: '147K★ 专业 AI 智能体角色库，232+/316 角色。', tags: ['角色库'] },
  { name: 'OmniRoute', star: '⭐⭐⭐⭐⭐', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: 'AI 网关：17 策略 + 9 因子打分 + 分级回退。', tags: ['网关'] },
  { name: 'LobeHub', star: '⭐⭐⭐⭐⭐', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: 'AI 团队运营平台：hire/schedule/report 编排。', tags: ['运营'] },
  { name: 'Agno', star: '⭐⭐⭐⭐⭐', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: 'Agent 平台：Build/Run/Manage 三段分离 + 四级 ID 契约。', tags: ['平台'] },
  { name: 'Stoa Protocol', star: '⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'applicable', desc: 'AI Agent 跨链结算参考协议。', tags: ['结算'] },
  { name: 'Scout Audit', star: '⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'applicable', desc: '智能合约审计检测器引擎。', tags: ['审计'] },
  { name: 'MediaCrawler', star: '⭐⭐⭐⭐⭐', cat: 'crawl', product: 'crawl', status: 'applicable', desc: '7 大中国平台自媒体爬虫，CDP 复用登录态。', tags: ['自媒体','爬虫'] },
  { name: 'Sherlock', star: '⭐⭐⭐⭐⭐', cat: 'crawl', product: 'crawl', status: 'applicable', desc: 'OSINT 用户名反查，400+ 站。', tags: ['情报'] },
  { name: 'OpenHuman', star: '⭐⭐⭐⭐⭐', cat: 'video', product: 'media', status: 'applicable', desc: '个人 AI 超级智能，本地优先记忆树。', tags: ['个人AI'] },
  { name: 'MoneyPrinter', star: '⭐⭐⭐⭐', cat: 'video', product: 'media', status: 'applicable', desc: 'AI 视频自动生成流水线。', tags: ['视频'] },
  { name: 'vLLM', star: '⭐⭐⭐⭐⭐', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: '推理引擎：PagedAttention 分页注意力。', tags: ['推理'] },
  { name: 'Ollama', star: '⭐⭐⭐⭐⭐', cat: 'infra', product: 'ai-agent', status: 'applicable', desc: 'Modelfile 模型即文件，本地推理。', tags: ['本地推理'] },
  { name: 'Solana', star: '⭐⭐⭐⭐⭐', cat: 'contract', product: 'chain', status: 'applicable', desc: '贡献时钟 + 并行结算 + 内存池，L5 结算基建参照。', tags: ['结算','基建'] }
];
