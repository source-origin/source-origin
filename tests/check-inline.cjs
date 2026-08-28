// 直接从agent-services.html提取内嵌表单JS做语法校验 (node读文件,避开PS编码坑)
const fs = require('fs');
const html = fs.readFileSync(process.argv[2] || './agent-services.html', 'utf8');
const m = html.match(/<script>\s*\(function\(\)\{[\s\S]*?\}\)\(\);\s*<\/script>/);
if (!m) { console.log('未找到内嵌表单script'); process.exit(2); }
try {
  new Function(m[0].replace(/<\/?script>/g, ''));
  console.log('内嵌表单JS语法: OK');
} catch (e) {
  console.log('语法错误:', e.message);
  process.exit(1);
}
