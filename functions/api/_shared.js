// 源·ORIGIN Portal — 共享工具 (邮件发送 + 通知落账)
// 邮件通过 Resend API 发送 (可配置)。即使 Portal 静态页离线，Worker 仍独立运行，
// 通知邮件会直接进入收件箱，不依赖门户页面在线。
//
// 注意: Cloudflare Pages Functions 的 handler 签名是 (context) 或 (request, env, ctx)。
// 所有需要 binding 的函数都显式接收 env 参数。

// 从 bindings 读取通知目标邮箱（部署时通过 NOTIFY_EMAIL secret 配置）
export function notifyTarget(env) {
  return {
    email: (env && env.NOTIFY_EMAIL) || '' // 部署时设 NOTIFY_EMAIL,
    name: (env && env.NOTIFY_NAME) || '源'
  };
}

// JSON 响应助手
export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...extra
    }
  });
}

// 处理 OPTIONS 预检
export function handleOptions() {
  return new Response(null, { status: 204, headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }});
}

// 生成 ID
export function genId(prefix = 'inq') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// 发送邮件 — 主链路。用 Resend；若未配置 RESEND_API_KEY，则降级 Mailjet。
// 返回 { ok, provider, id?, error? }
export async function sendEmail(env, { to, subject, html, text }) {
  // 优先 Resend
  const resendKey = (env && env.RESEND_API_KEY) || '';
  if (resendKey) {
    try {
      const from = (env && env.RESEND_FROM) || '源·ORIGIN 门户 <onboarding@resend.dev>';
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to, subject, html, text })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'resend error');
      return { ok: true, provider: 'resend', id: data.id };
    } catch (e) {
      return { ok: false, provider: 'resend', error: e.message };
    }
  }

  // 其次 Mailjet (可选备用)
  const mjKey = (env && env.MAILJET_API_KEY) || '';
  if (mjKey && mjKey.includes(':')) {
    try {
      const [pk, sk] = mjKey.split(':');
      const auth = btoa(`${pk}:${sk}`);
      const resp = await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Messages: [{
            From: { Email: (env && env.MAILJET_FROM) || 'origin@resend.dev', Name: '源·ORIGIN 门户' },
            To: [{ Email: to }],
            Subject: subject,
            HTMLPart: html,
            TextPart: text
          }]
        })
      });
      if (!resp.ok) throw new Error('mailjet error ' + resp.status);
      return { ok: true, provider: 'mailjet' };
    } catch (e) {
      return { ok: false, provider: 'mailjet', error: e.message };
    }
  }

  // 都没有 → 记录日志，提示配置
  return { ok: false, provider: 'none', error: 'No email provider configured (set RESEND_API_KEY or MAILJET_API_KEY)' };
}

// 通知落账到 D1 + 发送邮件。返回 { emailed, logged }
export async function notify({ env, db, type, subject, html, text, target }) {
  const to = target || notifyTarget(env);
  const emailResult = await sendEmail(env, { to: to.email, subject, html, text });

  // 写通知日志 (若 D1 可用)
  let logged = false;
  if (db) {
    try {
      await db.prepare(
        `INSERT INTO notifications (id, type, target, subject, body, channel, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'email', ?, unixepoch())`
      ).bind(genId('ntf'), type, to.email, subject, text || html, emailResult.ok ? 'sent' : 'failed').run();
      logged = true;
    } catch (e) { /* 日志失败不影响主流程 */ }
  }
  return { email: emailResult, logged };
}
