/* ============================================================
   board-embed.js · 门户首页内嵌留言板（真实 · GitHub Issues 驱动）
   repo: source-origin/source-origin  ·  label: board
   读：公开 REST API（CORS *，匿名可读）
   写：打开 GitHub 预填 new-issue 页（真实持久化，人工确认提交）
   ============================================================ */
(function () {
  'use strict';

  var REPO = 'source-origin/source-origin';
  var LABEL = 'board';
  var MARK = '<!--origin-board-->';
  var GITHUB = 'https://github.com/' + REPO;
  var API = 'https://api.github.com/repos/' + REPO + '/issues?state=open&labels=' + LABEL +
            '&per_page=40&sort=created&direction=desc';

  var COLORS = ['#00d4ff', '#f0b90b', '#4ade80', '#c084fc', '#fb7185', '#38bdf8'];
  function colorFor(name) { var n = 0; for (var i = 0; i < name.length; i++) n += name.charCodeAt(i); return COLORS[n % COLORS.length]; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(iso) {
    try { var d = new Date(iso);
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    } catch (e) { return String(iso || ''); }
  }
  function nick(body) { var m = (body || '').match(/昵称：\s*([^\n<]+)/); return m ? m[1].trim() : ''; }
  function text(body) {
    var t = (body || '').split(MARK)[0];
    return t.replace(/\n*---\s*\n*昵称：[\s\S]*$/, '').trim();
  }
  function applyI18n() { try { if (window.__ORIGIN_I18N__ && window.__ORIGIN_I18N__.apply) window.__ORIGIN_I18N__.apply(document); } catch (e) {} }

  function el(id) { return document.getElementById(id); }

  function render(list) {
    var box = el('beList'), empty = el('beEmpty'), c = el('beCount2');
    if (c) c.textContent = list.length;
    if (!list.length) { box.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';
    box.innerHTML = list.map(function (m) {
      return '' +
        '<div class="be-card">' +
          '<div class="be-head">' +
            '<span class="be-ava" style="background:' + colorFor(m.name) + '">' + esc((m.name || '匿').charAt(0).toUpperCase()) + '</span>' +
            '<div class="be-who">' +
              '<div class="be-name">' + esc(m.name) + '</div>' +
              '<div class="be-meta"><span class="be-time">' + esc(m.time) + '</span>' +
                (m.badge ? '<span class="be-badge">' + esc(m.badge) + '</span>' : '') + '</div>' +
            '</div>' +
          '</div>' +
          '<p class="be-body">' + esc(m.text).replace(/\n/g, '<br>') + '</p>' +
          '<div class="be-actions">' +
            '<a class="be-act" href="' + esc(m.url) + '" target="_blank" rel="noopener">❤️ ' + (m.likes || 0) + '</a>' +
            '<a class="be-act" href="' + esc(m.url) + '" target="_blank" rel="noopener">💬 ' + (m.comments || 0) + ' <span data-i18n="board.reply">回复</span></a>' +
            '<a class="be-act" href="' + esc(m.url) + '" target="_blank" rel="noopener">↗ <span data-i18n="board.viewGithub">在 GitHub 查看</span></a>' +
          '</div>' +
        '</div>';
    }).join('');
    applyI18n();
  }

  function load() {
    var box = el('beList'), empty = el('beEmpty');
    if (!box) return;
    if (empty) empty.style.display = 'none';
    box.innerHTML = '<div class="be-empty">… <span data-i18n="board.loading">正在接收信号（读取 GitHub）…</span></div>';
    applyI18n();
    fetch(API, { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (rows) {
        if (!Array.isArray(rows)) throw new Error('bad payload');
        var list = rows.filter(function (it) { return !it.pull_request; }).map(function (it) {
          return {
            name: nick(it.body) || ('@' + ((it.user && it.user.login) || 'unknown')),
            time: fmt(it.created_at),
            badge: (it.labels || []).some(function (l) { return l.name === LABEL; }) ? '真实留言' : '',
            text: text(it.body) || it.title || '',
            likes: (it.reactions && it.reactions.total_count) || 0,
            comments: it.comments || 0,
            url: it.html_url
          };
        });
        render(list);
      })
      .catch(function () {
        box.innerHTML = '<div class="be-empty">⚠️ <span data-i18n="board.error">留言板数据暂时读不到（可能触发了 GitHub 匿名读取限流）。</span> ' +
          '<a class="be-link" href="' + GITHUB + '/issues?q=label%3Aboard" target="_blank" rel="noopener"><span data-i18n="board.openAll">在 GitHub 打开全部</span></a> ' +
          '<a class="be-link" href="#" id="beRetry"><span data-i18n="board.retry">重试</span></a></div>';
        var rb = el('beRetry');
        if (rb) rb.addEventListener('click', function (e) { e.preventDefault(); load(); });
        applyI18n();
      });
  }

  function compose() {
    var t = el('beText'), n = el('beName'), b = el('bePublish'), cnt = el('beCount'), st = el('beStatus');
    if (!t || !b) return;
    t.addEventListener('input', function () { if (cnt) cnt.textContent = t.value.length; });
    b.addEventListener('click', function () {
      var body = t.value.trim();
      if (!body) { t.focus(); return; }
      var who = (n && n.value || '').trim() || '匿名信号';
      var title = body.split('\n')[0].slice(0, 90);
      var full = body + '\n\n' + MARK + '\n---\n昵称：' + who + '\n来源：源·ORIGIN 门户 · Dev Command';
      var url = GITHUB + '/issues/new?labels=' + encodeURIComponent(LABEL) +
        '&title=' + encodeURIComponent(title) +
        '&body=' + encodeURIComponent(full);
      window.open(url, '_blank', 'noopener');
      if (st) st.style.display = 'block';
    });
  }

  function boot() { compose(); load(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
