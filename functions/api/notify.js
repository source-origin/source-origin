// POST /api/notify — 通用通知（付款提醒 / 订单状态 / 系统告警）
// 发邮件到 通知目标邮箱(env.NOTIFY_EMAIL) 并落 D1 通知日志
import { json, handleOptions, genId, notify, notifyTarget } from './_shared.js';

export const onRequestOptions = () => handleOptions();

export async function onRequestPost(context) {
  const { request, env } = context;
  // 可选简单鉴权：请求头 X-Notify-Key 与绑定匹配才接受
  const secret = env && env.NOTIFY_KEY;
  if (secret) {
    const key = request.headers.get('X-Notify-Key') || '';
    if (key !== secret) return json({ ok: false, error: 'unauthorized' }, 401);
  }

  try {
    const body = await request.json();
    const type = (body.type || 'system').toString();
    const subject = (body.subject || '源·ORIGIN 通知').toString();
    const text = (body.text || '').toString();
    const html = body.html || text.split('\n').map(l => `<p>${l.replace(/</g, '&lt;')}</p>`).join('');
    const targetEmail = body.target || null; // 允许覆盖收件人

    const target = targetEmail
      ? { email: targetEmail, name: body.targetName || '' }
      : notifyTarget(env);

    const notice = await notify({
      env,
      db: env && env.DB,
      type,
      subject,
      html,
      text,
      target
    });

    return json({ ok: true, email: notice.email, logged: notice.logged });
  } catch (e) {
    return json({ ok: false, error: e.message || '服务器错误' }, 500);
  }
}
