/* ============================================
   源·ORIGIN Portal — 全站骨架注入器 v2
   自动注入（一次性）：
   1. 科幻字体（Google Fonts: Orbitron + Bai Jamjuree）
   2. 星空粒子背景 + 赛博网格 + 能量光晕 + HUD 角标 + 扫描线
   3. 统一导航 / 页脚 / 悬浮按钮
   用法：每个页面 </body> 前引入：
   <script src="assets/site-nav.js" defer></script>
   全站共享，改这一处即全站同步。当前页用 body[data-page] 高亮。
============================================ */
(function () {
  'use strict';

  
  // HKBTX 金色香港 BTC 交易所地址（集中配置：本地预览 / 部署后换线上域名）
  var HKBTX_URL = 'https://source-origin.github.io/hkbtx/';

  var NAV =  [
    { id: 'home',     label: '首页',        href: 'index.html' },
    { id: 'factory',  label: '智能体工厂',  href: 'factory.html' },
    { id: 'weapon',   label: '武器库',      href: 'weapon-library.html' },
    { id: 'cases',    label: '案例',        href: 'cases.html' },
    { id: 'developers', label: 'Dev Command', href: 'developer-board.html' },
    { id: 'agents', label: 'Agent Command', href: 'agent-command.html' },
    { id: 'about',    label: '关于',        href: 'about.html' },
    { id: 'hkbtx',    label: 'HKBTX 交易所', href: HKBTX_URL },
    { id: 'services', label: 'AI 服务',     href: 'agent-services.html' }
  ];

  var currentPage = (document.body && document.body.getAttribute('data-page')) || '';

  function injectFonts() {
    if (document.getElementById('facadeFonts')) return;
    var l = document.createElement('link');
    l.id = 'facadeFonts';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800&family=Bai+Jamjuree:wght@300;400;600&display=swap';
    document.head.appendChild(l);
  }

  // 注入固定的背景层（星空/网格/光晕/HUD/扫描线）
  function injectBackground() {
    if (document.getElementById('facadeBgRoot')) return;
    var d = document.createElement('div');
    d.id = 'facadeBgRoot';
    d.innerHTML =
      '<div class="stars"></div>' +
      '<div class="stars-grid"></div>' +
      '<div class="glow-orb a"></div>' +
      '<div class="glow-orb b"></div>' +
      '<div class="glow-orb c"></div>' +
      '<div class="hud tl"></div>' +
      '<div class="hud tr"></div>' +
      '<div class="hud bl"></div>' +
      '<div class="hud br"></div>';
    document.body.insertBefore(d, document.body.firstChild);
    document.body.classList.add('scanlines');
  }

  function navHTML() {
    var links = NAV.map(function (n) {
      var cls = n.id === currentPage ? 'nav-link active' : 'nav-link';
      var ext = n.id === 'services' ? ' target="_blank"' : '';
      return '<a href="' + n.href + '" class="' + cls + '" data-page="' + n.id + '"' + ext + ' data-i18n="nav.' + n.id + '">' + n.label + '</a>';
    }).join('');
    return '' +
      '<nav class="nav">' +
      '  <div class="nav-inner">' +
      '    <a href="index.html" class="nav-brand">' +
      '      <span class="nav-logo">✦</span>' +
      '      <span class="nav-name">源·ORIGIN</span>' +
      '    </a>' +
      '    <div class="nav-links">' + links + '</div>' +
      '    <button class="nav-toggle" id="navToggle" aria-label="菜单">☰</button>' +
      '  </div>' +
      '</nav>' +
      '<div class="nav-fix"></div>';
  }

  function footerHTML() {
    return '' +
      '<footer class="footer">' +
      '  <div class="container">' +
      '    <div class="footer-grid">' +
      '      <div>' +
      '        <h4>源·ORIGIN</h4>' +
      '        <p class="text-muted">从思想到行动，从连接到共生</p>' +
      '        <p class="text-muted" style="font-size:13px;margin-top:6px">权力来自创新，而非资本</p>' +
      '      </div>' +
      '      <div>' +
      '        <h4>探索</h4>' +
      '        <a href="index.html">首页</a>' +
      '        <a href="factory.html">智能体工厂</a>' +
      '        <a href="weapon-library.html">武器库</a>' +
      '      </div>' +
      '      <div>' +
      '        <h4>了解更多</h4>' +
      '        <a href="cases.html">案例</a>' +
      '        <a href="developer-board.html">Dev Command</a>' +
      '        <a href="about.html">关于</a>' +
      '        <a href="agent-services.html" target="_blank">AI 服务</a>' +
      '      </div>' +
      '      <div>' +
      '        <h4>联系</h4>' +
      '        <a href="mailto:origin-agent-svc@protonmail.com">📧 商务邮箱</a>' +
      '        <a href="#" onclick="return false;">🌐 社区</a>' +
      '      </div>' +
      '    </div>' +
      '    <div class="footer-bottom">' +
      '      <p>© 2026 源·ORIGIN · 开放协议 · 去中心化治理 · AI 智能体经济清算与结算层</p>' +
      '    </div>' +
      '  </div>' +
      '</footer>' +
      '<a href="agent-services.html" class="float-cta" id="floatCta" title="联系我们 / 提交需求">' +
      '  <span class="float-cta-icon">💬</span>' +
      '  <span class="float-cta-text">联系我们</span>' +
      '</a>';
  }

  function injectChrome() {
    // 防重复
    if (document.getElementById('siteNavRoot')) return;

    injectBackground();
    var root = document.createElement('div');
    root.id = 'siteNavRoot';
    root.innerHTML = navHTML() + footerHTML();
    document.body.appendChild(root); // 背景层已在最前，导航/页脚追加到 body 末尾即可（fixed 定位不受影响）

    var toggle = document.getElementById('navToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var links = document.querySelector('.nav-links');
        if (links) links.classList.toggle('show');
      });
    }
    var cta = document.getElementById('floatCta');
    if (cta) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 300) cta.classList.add('float-cta-on');
        else cta.classList.remove('float-cta-on');
      }, { passive: true });
    }
  }

  // 等待 DOM 就绪
  function boot() {
    injectFonts();
    var done = function () {
      injectChrome();
      // HKBTX 入口统一链接（[data-hkbtx] 元素 href 指向交易所，集中配置）
      try {
        var hb = HKBTX_URL;
        document.querySelectorAll('[data-hkbtx]').forEach(function (a) {
          a.setAttribute('href', hb);
        });
      } catch (e) {}
      // i18n：导航等动态注入内容翻译（若有全局 i18n）
      if (window.__ORIGIN_I18N__ && window.__ORIGIN_I18N__.apply) {
        try { window.__ORIGIN_I18N__.apply(document); } catch (e) {}
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', done);
    } else {
      done();
    }
  }
  boot();
})();
