/* ============================================
   源·ORIGIN Portal — SPA Router
   ============================================ */
(function () {
  'use strict';

  const ROUTES = {
    '/': { title: '首页 · 源·ORIGIN' },
    '/whitepaper': { title: '白皮书 · 源·ORIGIN' },
    '/developers': { title: '开发者 · 源·ORIGIN' },
    '/status': { title: '状态 · 源·ORIGIN' },
    '/adapter-manager': { title: '适配器管理 · 源·ORIGIN' },
    '/foundation': { title: '基金会 · 源·ORIGIN' }
  };

  function navigateTo(path) {
    if (ROUTES[path]) {
      history.pushState(null, '', path);
      routePage();
    }
  }

  function routePage() {
    var path = location.pathname;
    if (!ROUTES[path]) path = '/';
    document.title = ROUTES[path].title;

    // Update nav active state
    document.querySelectorAll('.navbar-links a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === path);
    });

    // Show relevant section
    document.querySelectorAll('.page-section').forEach(function (s) {
      s.style.display = 'none';
    });
    var target = document.getElementById('page-' + path.replace(/[/-]/g, ''));
    if (target) target.style.display = 'block';
    else {
      var home = document.getElementById('page-');
      if (home) home.style.display = 'block';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Expose globally
  window.Router = { navigateTo: navigateTo, routePage: routePage };

  // Listen to popstate
  window.addEventListener('popstate', routePage);

  // Intercept nav links
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-nav]');
    if (link) {
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
    }
  });
})();
