<div align="center">

# 源·ORIGIN

**The settlement & clearing layer for the AI-agent economy.**
**为 AI 智能体经济设计的清算与结算层。**

*BTC is digital gold. ETH is smart contracts. ORIGIN is the settlement layer for agents.*

[🌐 Portal](https://source-origin.github.io/source-origin/) · [🧬 L5 Protocol](https://github.com/source-origin/l5-protocol) · [⛓️ origin-chain](https://github.com/source-origin/origin-chain) · [🤝 Join us](https://source-origin.github.io/source-origin/join.html)

</div>

---

## What is 源·ORIGIN?

Agents already transact — they call paid APIs, hire other agents, escrow value, settle debts. Existing protocols let an agent **pay**; none of them **adjudicate** or **clear** it. 源·ORIGIN is that missing primitive: a chain-native **clearing & settlement layer** — not another protocol stacked on someone else's L1.

- **Own L1 `origin-1`** — DPoS, 21 validators, 100 YUAN minimum stake
- **Native settlement token `YUAN`** — 6 decimals; the unit agents settle in
- **Article 0 sealed in the genesis block** — *"Human will is the supreme law"*
- **6 settlement contracts** — agreement · escrow · identity · delegation · x402 · credit score
- **Crash-recoverable orchestration** — off-chain state graph + checkpoints + idempotency
- **Dual-ledger escrow** + default-state interceptor

## Repositories

| Repo | What |
|---|---|
| [`l5-protocol`](https://github.com/source-origin/l5-protocol) | The L5 agent settlement layer — contracts + off-chain orchestration |
| [`origin-chain`](https://github.com/source-origin/origin-chain) | The `origin-1` chain — genesis, DPoS consensus, native YUAN |
| [`source-origin`](https://github.com/source-origin/source-origin) | Developer portal (this repo) — multi-language, board, join |

## Why we build

> **Power comes from verified innovation — not capital, not arrival time.**

Human will is the supreme law (Article 0). Agents get an identity, a reputation, and a way to settle — verifiable, not gatekept.

## Get involved

- 🧩 **Build on it** — read the [protocol](https://github.com/source-origin/l5-protocol), open an issue
- 💬 **Say hi** — [developer board](https://source-origin.github.io/source-origin/developer-board.html)
- 🤝 **Co-build** — [join](https://source-origin.github.io/source-origin/join.html)

---

<details>
<summary>🛠️ Portal development (this repo)</summary>

The portal is a framework-free static site (HTML/CSS/JS, 12 languages, dark-cosmos theme), deployed on Cloudflare Pages + Functions + D1.

```bash
npx serve .            # or: node mime-server.cjs . 8799
```

Full setup (D1, email notify, deploy) → [DEPLOY.md](./DEPLOY.md)

Pages: `index.html` · `agent-command.html` · `developer-board.html` · `weapon-library.html` · `factory.html`
</details>

---

<sub>MIT License · 源·ORIGIN · 人类意志为最高法则</sub>
