// POST /api/inquiry — 询价/需求提交
// 落 D1 + 发送通知邮件到 通知目标邮箱(env.NOTIFY_EMAIL)
import { json, handleOptions, genId, notify, notifyTarget } from './_shared.js';

export const onRequestOptions = () => handleOptions();

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const name = (body.name || '').toString().trim();
    const contact = (body.contact || '').toString().trim();
    const service = (body.service || '').toString().trim();
    const budget = (body.budget || '').toString().trim();
    const deadline = (body.deadline || '').toString().trim();
    const message = (body.message || '').toString().trim();

    // 校验必填
    if (!contact) {
      return json({ ok: false, error: '请留下联系方式（邮箱或手机）' }, 400);
    }
    if (!service) {
      return json({ ok: false, error: '请选择需要的服务类型' }, 400);
    }

    const id = genId('inq');

    // 落 D1
    let dbResult = null;
    if (env && env.DB) {
      const db = env.DB;
      await db.prepare(
        `INSERT INTO inquiries (id, name, contact, service, budget, deadline, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'new', unixepoch())`
      ).bind(id, name, contact, service, budget, deadline, message).run();
      dbResult = 'ok';
    }

    // 发送通知邮件到 QQ 邮箱
    const to = notifyTarget(env);
    const subject = `【源·ORIGIN】新询价单 ${id} — ${service}`;
    const text = [
      `新询价单 ${id}`,
      `-------------------`,
      `姓名: ${name || '(未留)'}`,
      `联系方式: ${contact}`,
      `服务类型: ${service}`,
      `预算: ${budget || '(未填)'}`,
      `期望交付: ${deadline || '(未填)'}`,
      `需求描述: ${message || '(未填)'}`,
      `-------------------`,
      `来自: 源·ORIGIN 门户询价表单`,
      `时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
    ].join('\n');
    const html = text.split('\n').map(l => l.startsWith('--') ? '<hr>' : `<p>${l.replace(/</g, '&lt;')}</p>`).join('');

    const notice = await notify({
      env,
      db: env && env.DB,
      type: 'inquiry',
      subject,
      html,
      text,
      target: to
    });

    return json({
      ok: true,
      id,
      db: dbResult,
      email: notice.email,
      message: '询价已提交，我们会尽快联系您'
    }, 201);
  } catch (e) {
    return json({ ok: false, error: e.message || '服务器错误' }, 500);
  }
}
