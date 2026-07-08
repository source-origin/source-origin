/* ============================================
   user-state.js — 登录/钱包/会话管理
   ============================================ */
(function () {
  'use strict';

  var UserState = {
    _state: {
      authenticated: false,
      wallet: null,
      address: null,
      chainId: null,
      balance: '0',
      email: null,
      name: null,
      avatar: null,
      sessionId: null,
      lastLogin: null
    },
    _listeners: {},

    /* ---- 登录 ---- */
    loginWallet: function () {
      if (window.PrivyProvider) {
        return window.PrivyProvider.login('wallet').then(function (user) {
          UserState._updateFromPrivy(user);
          UserState._save();
          return user;
        });
      }
      // Fallback mock
      var addr = '0x' + Array.from({length: 40}, function () { return '0123456789abcdef'[Math.floor(Math.random()*16)]; }).join('');
      UserState._state.authenticated = true;
      UserState._state.wallet = 'metamask';
      UserState._state.address = addr;
      UserState._state.chainId = 11155111;
      UserState._state.balance = (Math.random() * 10).toFixed(4);
      UserState._state.sessionId = 'session_' + Date.now();
      UserState._state.lastLogin = new Date().toISOString();
      UserState._save();
      UserState._emit('change', UserState._state);
      return Promise.resolve(UserState._state);
    },

    loginEmail: function (email) {
      return window.PrivyProvider ? window.PrivyProvider.login('email').then(function (user) {
        UserState._updateFromPrivy(user);
        UserState._save();
        return user;
      }) : Promise.reject(new Error('Privy not available'));
    },

    /* ---- 登出 ---- */
    logout: function () {
      if (window.PrivyProvider) {
        window.PrivyProvider.logout();
      }
      UserState._state.authenticated = false;
      UserState._state.wallet = null;
      UserState._state.address = null;
      UserState._state.balance = '0';
      UserState._state.name = null;
      UserState._state.email = null;
      UserState._state.avatar = null;
      UserState._state.sessionId = null;
      UserState._save();
      UserState._emit('change', UserState._state);
    },

    /* ---- 获取状态 ---- */
    get: function (key) {
      return key ? UserState._state[key] : UserState._state;
    },

    isAuthenticated: function () {
      return UserState._state.authenticated;
    },

    getShortAddress: function () {
      var a = UserState._state.address;
      if (!a) return '';
      return a.slice(0, 6) + '...' + a.slice(-4);
    },

    /* ---- 内部 ---- */
    _updateFromPrivy: function (user) {
      UserState._state.authenticated = true;
      UserState._state.sessionId = 'session_' + Date.now();
      UserState._state.lastLogin = new Date().toISOString();
      if (user.wallet) {
        UserState._state.wallet = 'wallet';
        UserState._state.address = user.wallet.address;
        UserState._state.chainId = user.wallet.chainId;
      }
      if (user.email) UserState._state.email = user.email;
      if (user.name) UserState._state.name = user.name;
      if (user.avatar) UserState._state.avatar = user.avatar;
      UserState._emit('change', UserState._state);
    },

    _save: function () {
      try {
        localStorage.setItem('origin_user_state', JSON.stringify(UserState._state));
      } catch (e) { /* storage may be unavailable */ }
    },

    _load: function () {
      try {
        var raw = localStorage.getItem('origin_user_state');
        if (raw) {
          var parsed = JSON.parse(raw);
          Object.assign(UserState._state, parsed);
          UserState._emit('change', UserState._state);
        }
      } catch (e) { /* ignore */ }
    },

    on: function (event, cb) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(cb);
    },

    _emit: function (event, data) {
      var cbs = this._listeners[event] || [];
      cbs.forEach(function (cb) { try { cb(data); } catch (e) { console.error(e); } });
    }
  };

  // Load prior state
  UserState._load();

  // Also auto-refresh from Privy events
  if (window.PrivyProvider) {
    window.PrivyProvider.on('login', function (data) {
      if (data && data.user) UserState._updateFromPrivy(data.user);
    });
    window.PrivyProvider.on('logout', function () {
      UserState.logout();
    });
  }

  window.UserState = UserState;

  console.log('[UserState] Loaded. Authenticated:', UserState.isAuthenticated());
  if (UserState.get('address')) {
    console.log('[UserState] Wallet:', UserState.getShortAddress());
  }
})();
