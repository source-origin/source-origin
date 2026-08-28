-- 源·ORIGIN Portal Database Schema (Cloudflare D1)
-- 离线兜底 + 通知落账核心表

-- 询价/需求单
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT,
  contact TEXT NOT NULL,          -- 邮箱/联系方式
  service TEXT,                   -- 需要的服务类型
  budget TEXT,
  deadline TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',      -- new / quoted / accepted / paid / delivered / archived
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 收款/订单记录 (USDC 链上)
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  tx_hash TEXT UNIQUE,            -- 链上交易哈希
  inquiry_id TEXT,                -- 关联询价单 (可为空)
  amount TEXT,                    -- USDC 金额 (字符串,避免浮点)
  token TEXT DEFAULT 'USDC',
  network TEXT DEFAULT 'Base',    -- Base / BSC / Ethereum
  from_addr TEXT,
  status TEXT DEFAULT 'pending',  -- pending / confirmed / settled
  received_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 通知日志 (审计)
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,             -- inquiry / payment / system
  target TEXT,                    -- 通知目标 (qq邮箱)
  subject TEXT,
  body TEXT,
  channel TEXT DEFAULT 'email',
  status TEXT DEFAULT 'sent',     -- sent / failed / pending
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_payments_tx ON payments(tx_hash);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);
