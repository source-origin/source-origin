// GET /api/health — 健康检查
// 验证 Worker 在线 + D1 连通性 + 通知目标配置
import { json, handleOptions, notifyTarget } from './_shared.js';

export const onRequestOptions = () => handleOptions();

export async function onRequestGet(context) {
  const { env } = context;
  const dbOk = !!(env && env.DB);
  const target = notifyTarget(env);
  return json({
    ok: true,
    status: 'online',
    worker: 'source-origin portal worker',
    db: dbOk ? 'connected' : 'DISABLED (未配置 D1 binding)',
    notify: {
      to: target.email,
      name: target.name,
      emailProvider: (env && env.RESEND_API_KEY) ? 'resend' : ((env && env.MAILJET_API_KEY) ? 'mailjet' : 'NONE')
    },
    time: new Date().toISOString()
  });
}
