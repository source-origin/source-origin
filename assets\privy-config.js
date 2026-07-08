/* ============================================
   privy-config.js — Privy 用户接入层配置
   ============================================ */
(function () {
  'use strict';

  var PRIVY_CONFIG = {
    appId: 'cm5q2vrx000dcf0358b9f6lm7',
    clientId: 'privy-prod-cm5q2vrx000dcf0358b9f6lm7',
    logoUrl: '/assets/logo.png',
    // 支持登录方式
    loginMethods: ['wallet', 'email', 'google', 'twitter'],
    // 支持的链
    supportedChains: [
      { id: 1, name: 'Ethereum' },
      { id: 56, name: 'BNB Smart Chain' },
      { id: 137, name: 'Polygon' },
      { id: 42161, name: 'Arbitrum' },
      { id: 11155111, name: 'Sepolia' }
    ],
    // 默认钱包连接选项
    walletOptions: {
      recommendedWallets: ['metamask', 'walletconnect', 'coinbase'],
      hideSmallBalance: false
    },
    // UI 主题
    theme: {
      brandColor: '#f0b90b',
      accentColor: '#00d4ff',
      darkMode: true
    }
  };

  /* ---- Privy Mock Provider ---- */
  // 在 Privy SDK 未加载时提供模拟登录功能
  window.PrivyProvider = {
    config: PRIVY_CONFIG,

    _user: null,
    _listeners: {},

    init: function () {
      console.log('[Privy] Initialized with appId:', PRIVY_CONFIG.appId);
      this._emit('ready', { initialized: true });
    },

    login: function (method) {
      method = method || 'wallet';
      console.log('[Privy] Login attempt via:', method);
      // 模拟登录 — 实际部署替换为 Privy SDK 调用
      var mockUser = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        wallet: null,
        email: null,
        name: null,
        avatar: null
      };
      if (method === 'wallet') {
        mockUser.wallet = {
          address: '0x' + Array.from({length: 40}, function () { return '0123456789abcdef'[Math.floor(Math.random()*16)]; }).join(''),
          chainId: 11155111,
          balance: '0.0'
        };
      } else if (method === 'email') {
        mockUser.email = 'user@example.com';
        mockUser.name = 'User';
      } else {
        mockUser.name = 'Anonymous';
      }
      this._user = mockUser;
      this._emit('login', { user: mockUser });
      return Promise.resolve(mockUser);
    },

    logout: function () {
      console.log('[Privy] Logout');
      this._user = null;
      this._emit('logout', {});
      return Promise.resolve();
    },

    getUser: function () { return this._user; },

    isLoggedIn: function () { return !!this._user; },

    on: function (event, cb) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(cb);
    },

    _emit: function (event, data) {
      var cbs = this._listeners[event] || [];
      cbs.forEach(function (cb) { try { cb(data); } catch (e) { console.error(e); } });
    }
  };

  // Auto init
  window.PrivyProvider.init();

  console.log('[Privy] Config loaded.', PRIVY_CONFIG);
})();
