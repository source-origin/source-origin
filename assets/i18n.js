/* ============================================
   i18n.js · 源·ORIGIN 全球语言切换框架
   面向全球程序员的接入层：可切换语言阅读/协作
   语言清单：中文/English/日本語/한국어/Español/Français/Deutsch/Русский/Português/Tiếng Việt/العربية/हिन्दी
   机制：data-i18n 标记静态文本 + 动态内容翻译 + localStorage 记忆 + 浏览器自动检测
   ============================================ */
(function () {
  'use strict';

  var LANG_KEY = 'origin_lang';

  // ---------- 语言元数据 ----------
  var LANGS = [
    { code: 'zh', label: '中文',       flag: '🇨🇳', dir: 'ltr' },
    { code: 'en', label: 'English',    flag: '🇬🇧', dir: 'ltr' },
    { code: 'ja', label: '日本語',     flag: '🇯🇵', dir: 'ltr' },
    { code: 'ko', label: '한국어',      flag: '🇰🇷', dir: 'ltr' },
    { code: 'es', label: 'Español',    flag: '🇪🇸', dir: 'ltr' },
    { code: 'fr', label: 'Français',   flag: '🇫🇷', dir: 'ltr' },
    { code: 'de', label: 'Deutsch',    flag: '🇩🇪', dir: 'ltr' },
    { code: 'ru', label: 'Русский',    flag: '🇷🇺', dir: 'ltr' },
    { code: 'pt', label: 'Português',  flag: '🇧🇷', dir: 'ltr' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
    { code: 'ar', label: 'العربية',    flag: '🇸🇦', dir: 'rtl' },
    { code: 'hi', label: 'हिन्दी',     flag: '🇮🇳', dir: 'ltr' }
  ];

  // ---------- 翻译字典（key: 语言码） ----------
  // 结构：dict.zh['key'] = '中文' ；dict.en['key'] = 'English' ... 
  // 未翻译的语言回退到 en，再回退到 zh
  var dict = {
    zh: {
      // 导航（与 site-nav.js NAV 一致）
      'nav.home': '首页',
      'nav.factory': '智能体工厂',
      'nav.weapon': '武器库',
      'nav.cases': '案例',
      'nav.developers': 'Dev Command',
      'nav.agents': 'Agent Command',
      'nav.about': '关于',
      'nav.services': 'AI 服务',
      'nav.global': '全球协作',

      // 通用
      'lang.switcher': '语言',
      'common.learnMore': '了解更多',
      'common.explore': '探索',
      'common.home': '首页',
      'common.tagline': '从思想到行动，从连接到共生',
      'common.motto': '权力来自创新，而非资本',
      'common.footer': '开放协议 · 去中心化治理 · AI 智能体经济清算与结算层',
      'common.sourceOrigin': '源·ORIGIN',

      // 留言板通用
      'board.empty': '暂无信号，发送第一条吧 🚀',
      'board.placeholder': '输入你的留言…（技术分享 / 需求 / 求助 / 想法）',
      'board.nameHolder': '你的昵称',
      'board.anonymous': '匿名'
    },

    en: {
      'nav.home': 'Home',
      'nav.factory': 'Agent Factory',
      'nav.weapon': 'Arsenal',
      'nav.cases': 'Cases',
      'nav.developers': 'Dev Command',
      'nav.agents': 'Agent Command',
      'nav.about': 'About',
      'nav.services': 'AI Services',
      'nav.global': 'Global',

      'lang.switcher': 'Language',
      'common.learnMore': 'Learn more',
      'common.explore': 'Explore',
      'common.home': 'Home',
      'common.tagline': 'From thought to action, from connection to symbiosis',
      'common.motto': 'Power comes from innovation, not capital',
      'common.footer': 'Open protocol · Decentralized governance · Clearing & settlement layer for the AI agent economy',
      'common.sourceOrigin': 'Source·ORIGIN',

      'board.empty': 'No signals yet. Send the first one 🚀',
      'board.placeholder': 'Write your message… (share / ask / help / ideas)',
      'board.nameHolder': 'Your name',
      'board.anonymous': 'Anonymous'
    },

    ja: {
      'nav.home': 'ホーム',
      'nav.factory': 'エージェント工場',
      'nav.weapon': '兵器庫',
      'nav.cases': '事例',
      'nav.developers': 'Dev Command',
      'nav.agents': 'Agent Command',
      'nav.about': '概要',
      'nav.services': 'AIサービス',
      'nav.global': 'グローバル',

      'lang.switcher': '言語',
      'common.learnMore': 'もっと見る',
      'common.explore': '探索',
      'common.home': 'ホーム',
      'common.tagline': '思考から行動へ、接続から共生へ',
      'common.motto': '力は資本ではなく革新から生まれる',
      'common.footer': 'オープンプロトコル・分散型ガバナンス・AIエージェント経済の清算・決済レイヤー',
      'common.sourceOrigin': '源・ORIGIN',

      'board.empty': 'まだシグナルはありません。最初の1つを送信 🚀',
      'board.placeholder': 'メッセージを入力…（共有 / 依頼 / 助け / アイデア）',
      'board.nameHolder': 'ニックネーム',
      'board.anonymous': '匿名'
    },

    ko: {
      'nav.home': '홈',
      'nav.factory': '에이전트 공장',
      'nav.weapon': '무기고',
      'nav.cases': '사례',
      'nav.developers': 'Dev Command',
      'nav.agents': 'Agent Command',
      'nav.about': '소개',
      'nav.services': 'AI 서비스',
      'nav.global': '글로벌',

      'lang.switcher': '언어',
      'common.learnMore': '더 보기',
      'common.explore': '탐색',
      'common.home': '홈',
      'common.tagline': '생각에서 행동으로, 연결에서 공생으로',
      'common.motto': '힘은 자본이 아닌 혁신에서 나온다',
      'common.footer': '오픈 프로토콜 · 분산 거버넌스 · AI 에이전트 경제 청산·결제 레이어',
      'common.sourceOrigin': '소스·ORIGIN',

      'board.empty': '아직 신호가 없습니다. 첫 번째를 보내세요 🚀',
      'board.placeholder': '메시지 입력… (공유 / 요청 / 도움 / 아이디어)',
      'board.nameHolder': '닉네임',
      'board.anonymous': '익명'
    },

    es: {
      'nav.home': 'Inicio',
      'nav.factory': 'Fábrica de Agentes',
      'nav.weapon': 'Arsenal',
      'nav.cases': 'Casos',
      'nav.developers': 'Dev Command',
      'nav.agents': 'Agent Command',
      'nav.about': 'Acerca de',
      'nav.services': 'Servicios IA',
      'nav.global': 'Global',

      'lang.switcher': 'Idioma',
      'common.learnMore': 'Saber más',
      'common.explore': 'Explorar',
      'common.home': 'Inicio',
      'common.tagline': 'Del pensamiento a la acción, de la conexión a la simbiosis',
      'common.motto': 'El poder proviene de la innovación, no del capital',
      'common.footer': 'Protocolo abierto · Gobernanza descentralizada · Capa de compensación y liquidación para la economía de agentes IA',
      'common.sourceOrigin': 'Fuente·ORIGIN',

      'board.empty': 'Aún no hay señales. Envía la primera 🚀',
      'board.placeholder': 'Escribe tu mensaje… (compartir / pedir / ayuda / ideas)',
      'board.nameHolder': 'Tu nombre',
      'board.anonymous': 'Anónimo'
    }
  };

  // ---------- 判断当前语言 ----------
  function stored() {
    try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
  }
  function detect() {
    // 查询参数 ?lang=en 优先（便于分享/测试）
    try {
      var ql = new URLSearchParams(window.location.search).get('lang');
      if (ql && dict[ql]) return ql;
    } catch (e) {}
    var s = stored();
    if (s && dict[s]) return s;
    var nav = (navigator.language || navigator.userLanguage || 'zh').toLowerCase();
    if (nav.indexOf('zh') === 0) return 'zh';
    if (nav.indexOf('en') === 0) return 'en';
    if (nav.indexOf('ja') === 0) return 'ja';
    if (nav.indexOf('ko') === 0) return 'ko';
    if (nav.indexOf('es') === 0) return 'es';
    // 其余回退中文
    return 'zh';
  }

  var current = detect();

  // ---------- 翻译查找 ----------
  function t(key) {
    if (dict[current] && dict[current][key] !== undefined) return dict[current][key];
    if (dict.en && dict.en[key] !== undefined) return dict.en[key];
    if (dict.zh && dict.zh[key] !== undefined) return dict.zh[key];
    return key;
  }

  // ---------- 应用翻译到 DOM（data-i18n 标记） ----------
  function applyToDom(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var key = n.getAttribute('data-i18n');
      if (key) n.textContent = t(key);
    }
    // 占位符
    var ph = root.querySelectorAll('[data-i18n-ph]');
    for (var j = 0; j < ph.length; j++) {
      var p = ph[j];
      var pk = p.getAttribute('data-i18n-ph');
      if (pk) p.setAttribute('placeholder', t(pk));
    }
    // RTL
    var langMeta = null;
    for (var k = 0; k < LANGS.length; k++) if (LANGS[k].code === current) langMeta = LANGS[k];
    if (langMeta && langMeta.dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
    }
  }

  // ---------- 切换语言 ----------
  function setLang(code) {
    if (code === current) return;
    current = code;
    try { localStorage.setItem(LANG_KEY, code); } catch (e) {}
    applyToDom(document);
    // 广播，让动态渲染内容(留言板/武器库)重新翻译
    document.dispatchEvent(new CustomEvent('origin:langchange', { detail: code }));
  }

  // ---------- 渲染语言切换器(挂到 .lang-switcher 容器) ----------
  function renderSwitcher() {
    // 由 lang-switcher.js 负责挂载 UI；这里只暴露 API
  }

  // ---------- 暴露全局 API ----------
  window.__ORIGIN_I18N__ = {
    t: t,
    setLang: setLang,
    getLang: function () { return current; },
    getLangs: function () { return LANGS; },
    apply: applyToDom,
    LANGS: LANGS,
    KEY: LANG_KEY
  };

  // 页面加载后自动应用（DOMContentLoaded 前先试一次，DOM已存在）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyToDom(document); });
  } else {
    applyToDom(document);
  }

})();
