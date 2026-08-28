/* ============================================
   lang-switcher.js · 源·ORIGIN 全局语言切换器
   依赖 assets/i18n.js (window.__ORIGIN_I18N__)
   注入：顶栏导航右端一个 🌐 下拉，切换全球主流语言
   ============================================ */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function css() {
    var el = document.createElement('style');
    var c = document.createElement('style');
    c.innerHTML = text;
  }

  var STYLE = [
    '#langSwitch { position: relative; display: inline-flex; align-items: center; margin-left: 12px; font-family: "Bai Jamjuree","Noto Sans SC",sans-serif; }',
    '#langSwitch .lang-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(10,17,34,0.6); border: 1px solid rgba(120,160,255,0.25); color: #cfe0ff; font-size: 12px; padding: 7px 12px; border-radius: 30px; cursor: pointer; transition: all .2s; white-space: nowrap; }',
    '#langSwitch .lang-btn:hover { border-color: #00d4ff; color: #00d4ff; box-shadow: 0 0 14px rgba(0,212,255,0.2); }',
    '#langSwitch .lang-del { font-size: 14px; line-height: 1; }',
    '#langSwitch .lang-arrow { font-size: 9px; opacity: .7; }',
    '#langMenu { position: absolute; top: calc(100% + 8px); right: 0; min-width: 200px; background: rgba(6,10,22,0.97); border: 1px solid rgba(0,212,255,0.25); border-radius: 14px; padding: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(0,212,255,0.08); z-index: 999; display: none; }',
    '#langMenu.open { display: block; }',
    '#langMenu .lang-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; width: 100%; background: none; border: none; color: #cfe0ff; font-size: 13px; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-family: inherit; }',
    '#langMenu .lang-row:hover { background: rgba(0,212,255,0.1); color: #fff; }',
    '#langMenu .lang-row.active { color: #00d4ff; font-weight: 700; }',
    '#langMenu .lang-row .lang-flag { font-size: 16px; }',
    '#langMenu .lang-row .lang-name { flex: 1; }',
    '#langMenu .lang-row .lang-check { opacity: 0; }',
    '#langMenu .lang-row.active .lang-check { opacity: 1; }',
    '@media (max-width: 768px) { #langSwitch { margin-left: 6px; } #langSwitch .lang-btn { padding: 6px 9px; } #langSwitch .lang-btn .lang-txt { display: none; } }'
  ].join('\n');

  ready(function () {
    var I18N = window.__ORIGIN_I18N__;
    if (!I18N) { console.warn('[i18n] i18n.js 未加载'); return; }

    // 注入样式
    var st = document.createElement('style');
    st.textContent = STYLE;
    document.head.appendChild(st);

    // 挂载点 .nav-inner 是 site-nav.js 动态注入的，需等待出现
    function mount() {
      var host = document.querySelector('.nav-inner') || document.querySelector('nav .container') || document.querySelector('nav');
      if (!host) return false;
      if (document.getElementById('langSwitch')) return true; // 已挂载

      // 建切换器 DOM
      var wrap = document.createElement('div');
      wrap.id = 'langSwitch';
      var cur = I18N.getLang();
      var langs = I18N.getLangs();
      var curMeta = langs.filter(function (l) { return l.code === cur; })[0] || { code: 'zh', label: '中文', flag: '🇨🇳' };

      wrap.innerHTML =
        '<button class="lang-btn" id="langBtn" aria-haspopup="true" aria-expanded="false">' +
          '<span class="lang-del">🌐</span>' +
          '<span class="lang-txt">' + curMeta.label + '</span>' +
          '<span class="lang-arrow">▾</span>' +
        '</button>' +
        '<div id="langMenu" role="menu">' +
          langs.map(function (l) {
            var on = l.code === cur ? 'active' : '';
            return '<button class="lang-row ' + on + '" role="menuitem" data-code="' + l.code + '">' +
              '<span class="lang-flag">' + l.flag + '</span>' +
              '<span class="lang-name">' + l.label + '</span>' +
              '<span class="lang-check">✓</span>' +
            '</button>';
          }).join('') +
        '</div>';

      host.appendChild(wrap);

      // 交互
      var btn = wrap.querySelector('#langBtn');
      var menu = wrap.querySelector('#langMenu');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
      });

      // 切换
      menu.addEventListener('click', function (e) {
        var row = e.target.closest('.lang-row');
        if (!row) return;
        var code = row.getAttribute('data-code');
        I18N.setLang(code);
        var m = langs.filter(function (l) { return l.code === code; })[0] || curMeta;
        wrap.querySelector('.lang-txt').textContent = m.label;
        menu.querySelectorAll('.lang-row').forEach(function (r) {
          r.classList.toggle('active', r.getAttribute('data-code') === code);
        });
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });

      // 监听语言变更（动态内容重新翻译）
      document.addEventListener('origin:langchange', function () {
        var nm = I18N.getLangs().filter(function (l) { return l.code === I18N.getLang(); })[0];
        if (nm) wrap.querySelector('.lang-txt').textContent = nm.label;
      });
      return true;
    }

    // 尝试立即挂载；若导航未就绪则观察 DOM 变化
    if (!mount()) {
      var tries = 0;
      var timer = setInterval(function () {
        tries++;
        if (mount() || tries > 60) clearInterval(timer); // 最多 6 秒
      }, 100);
    }
  });
})();
