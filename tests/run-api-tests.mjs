// 本地逻辑验证（不依赖 workerd）：
// 模拟 Cloudflare Pages Function 的 context 调用 inquiry.js / notify.js / health.js
// 用假 env（DB 用内存数组模拟 + RESEND_API_KEY 留空）验证：
//   1) 路由/参数解析正常
//   2) D1 落库逻辑执行
//   3) 表单校验返回正确错误
// 直接运行：node tests/run-api-tests.mjs

// --- 模拟 D1 (仅存储，非真 SQL) ---
function mockDb() {
  const tables = { inquiries: [], notifications: [] };
  return {
    prepare(sql, ...args) {
      return {
        bind(...values) { this._vals = values; return this; },
        async run() {
          const s = (sql + '').toLowerCase();
          for (const t of Object.keys(tables)) {
            if (s.includes('into ' + t)) {
              tables[t].push(this._vals);
              break;
            }
          }
          return { success: true };
        }
      };
    },
    _tables: tables
  };
}

// --- 模拟 fetch (拦截对 api.resend.com 的调用) ---
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  if (typeof url === 'string' && url.includes('api.resend.com')) {
    const body = JSON.parse(opts.body);
    return new Response(JSON.stringify({ id: 'mock_email_' + Date.now(), _captured: { to: body.to, subject: body.subject } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return originalFetch(url, opts);
};

// 加载被测模块
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let inquiryMod, notifyMod, healthMod, sharedMod;
try {
  inquiryMod = await import('../functions/api/inquiry.js');
  notifyMod = await import('../functions/api/notify.js');
  healthMod = await import('../functions/api/health.js');
  sharedMod = await import('../functions/api/_shared.js');
} catch (e) {
  console.error('模块加载失败 (可能是 .js 被当 CommonJS):', e.message);
  process.exit(1);
}

function makeContext(env, body) {
  return {
    request: {
      json: async () => body,
      headers: { get: (h) => ({ 'X-Notify-Key': 'secret' }[h] || null) }
    },
    env
  };
}

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('  ✅ ' + name); }
  else { fail++; console.log('  ❌ ' + name + (extra ? ' -> ' + JSON.stringify(extra) : '')); }
}

async function run() {
  console.log('== health.js ==');
  const hEnv = { /* 无 D1，无 RESEND */ };
  let resp = await healthMod.onRequestGet({ env: hEnv });
  let j = await resp.json();
  check('health 无D1时 db=DISABLED', j.ok === true && j.db.includes('DISABLED'), j);

  console.log('== inquiry.js 校验 ==');
  // 缺 contact
  resp = await inquiryMod.onRequestPost(makeContext(hEnv, { service: '爬虫' }));
  j = await resp.json();
  check('缺联系方式返回400', resp.status === 400 && j.ok === false, j);

  // 正常提交, 有 D1 + 有 RESEND
  const dbEnv = { DB: mockDb(), RESEND_API_KEY: 're_test', NOTIFY_EMAIL: 'notification@example.com' };
  resp = await inquiryMod.onRequestPost(makeContext(dbEnv, {
    name: '测试', contact: 'test@example.com', service: '🕷️ 网络数据采集', budget: '$100', deadline: '1周', message: '要抓取数据'
  }));
  j = await resp.json();
  check('正常询价返回201+单号', resp.status === 201 && j.ok === true && j.id.startsWith('inq_'), j);
  check('D1 inquiries 落库1条', dbEnv.DB._tables.inquiries.length === 1, dbEnv.DB._tables);
  check('邮件调用 provider=resend', j.email && j.email.provider === 'resend' && j.email.ok === true, j.email);
  check('通知日志落库', dbEnv.DB._tables.notifications.length === 1, dbEnv.DB._tables.notifications);

  // 重复提交再来一条
  await inquiryMod.onRequestPost(makeContext(dbEnv, { contact: 'b@x.com', service: '合约' }));
  check('第二条询价落库', dbEnv.DB._tables.inquiries.length === 2);

  console.log('== notify.js 鉴权 ==');
  resp = await notifyMod.onRequestPost(makeContext({ NOTIFY_KEY: 'secret', DB: dbEnv.DB, RESEND_API_KEY: 're_test' }, { type: 'payment', subject: '付款', text: '收到 $100' }));
  j = await resp.json();
  check('notify 用对 key 成功(provider=resend)', j.ok === true && j.email.provider === 'resend', j);

  console.log('== shared no-provider 降级 ==');
  const noKey = await sharedMod.sendEmail({}, { to: 'x@qq.com', subject: 's', text: 't' });
  check('未配置发送方时 ok=false', noKey.ok === false && noKey.provider === 'none', noKey);

  console.log('\n======== 结果: ' + pass + ' 通过, ' + fail + ' 失败 ========');
  process.exit(fail > 0 ? 1 : 0);
}

run().catch(e => { console.error('测试崩溃:', e); process.exit(1); });
