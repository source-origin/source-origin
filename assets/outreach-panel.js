/* ============================================
   outreach-panel.js — 宣发面板
   Postavel + agntdata 集成（模拟）
   ============================================ */
(function () {
  'use strict';

  var OutreachPanel = {
    /* ---- 宣发渠道配置 ---- */
    channels: {
      twitter:    { name: 'Twitter / X',       enabled: true,  icon: '𝕏', autoPost: true },
      farcaster:  { name: 'Farcaster',          enabled: true,  icon: 'ƒ', autoPost: false },
      lens:       { name: 'Lens Protocol',      enabled: false, icon: '◈', autoPost: false },
      telegram:   { name: 'Telegram',           enabled: true,  icon: '✈', autoPost: true },
      discord:    { name: 'Discord',            enabled: true,  icon: '◆', autoPost: false },
      medium:     { name: 'Medium',             enabled: true,  icon: 'M', autoPost: false },
      mirror:     { name: 'Mirror.xyz',         enabled: false, icon: '⬡', autoPost: false }
    },

    /* ---- 宣发统计 ---- */
    stats: {
      totalPosts: 2847,
      totalReach: 1420000,
      totalEngagement: 85600,
      weeklyActive: 7,
      lastPostAt: '2026-07-08T14:30:00Z',
      topChannel: 'twitter'
    },

    /* ---- 宣发队列 ---- */
    queue: [
      { id: 'q_001', title: '源·ORIGIN V3 白皮书发布公告', channels: ['twitter','telegram','medium'], scheduledAt: '2026-07-10T09:00:00Z', status: 'scheduled' },
      { id: 'q_002', title: '开发者激励计划启动', channels: ['twitter','discord'], scheduledAt: '2026-07-12T09:00:00Z', status: 'draft' },
      { id: 'q_003', title: 'YUAN 代币跨链桥升级通知', channels: ['farcaster','telegram'], scheduledAt: '2026-07-15T09:00:00Z', status: 'draft' },
      { id: 'q_004', title: 'Partner 入驻公告 — DeFi 协议集成', channels: ['twitter','mirror'], scheduledAt: '2026-07-18T09:00:00Z', status: 'draft' }
    ],

    /* ---- Postavel SDK 模拟 ---- */
    postavel: {
      publish: function (content, channels) {
        console.log('[Postavel] Publishing to channels:', channels, 'Content:', content);
        OutreachPanel.stats.totalPosts++;
        OutreachPanel.stats.lastPostAt = new Date().toISOString();
        OutreachPanel._emit('postavel:publish', { content: content, channels: channels, success: true });
        return Promise.resolve({ id: 'post_' + Date.now(), status: 'published' });
      },

      schedule: function (content, channels, time) {
        console.log('[Postavel] Scheduling for', time, 'on channels:', channels);
        OutreachPanel.queue.push({
          id: 'q_' + Date.now(),
          title: content.substring(0, 60),
          channels: channels,
          scheduledAt: time,
          status: 'scheduled'
        });
        OutreachPanel._emit('postavel:schedule', { content: content, channels: channels, time: time, success: true });
        return Promise.resolve({ status: 'scheduled' });
      }
    },

    /* ---- AgntData SDK 模拟 ---- */
    agntdata: {
      track: function (event, properties) {
        console.log('[AgntData] Track event:', event, properties);
        OutreachPanel._emit('agntdata:track', { event: event, properties: properties });
      },

      getAnalytics: function (opts) {
        return Promise.resolve({
          impressions: OutreachPanel.stats.totalReach + Math.floor(Math.random() * 1000),
          clicks: Math.floor(OutreachPanel.stats.totalEngagement * 0.3),
          conversions: Math.floor(OutreachPanel.stats.totalEngagement * 0.05),
          topSources: ['twitter.com', 't.me', 'discord.com'],
          period: opts || '7d'
        });
      }
    },

    /* ---- 渲染宣发面板到DOM ---- */
    mount: function (containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var html = '';
      html += '<div class="outreach-panel" style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-lg);padding:1.5rem;">';

      // Stats header
      html += '<div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:0.8rem;margin-bottom:1.5rem;">';
      html += '<div class="stat-card"><div class="stat-value" style="font-size:1.3rem;">' + (this.stats.totalPosts).toLocaleString() + '</div><div class="stat-label">总发布</div></div>';
      html += '<div class="stat-card"><div class="stat-value" style="font-size:1.3rem;">' + (this.stats.totalReach / 10000).toFixed(1) + 'w</div><div class="stat-label">总触达</div></div>';
      html += '<div class="stat-card"><div class="stat-value" style="font-size:1.3rem;">' + (this.stats.totalEngagement / 1000).toFixed(1) + 'k</div><div class="stat-label">互动</div></div>';
      html += '<div class="stat-card"><div class="stat-value" style="font-size:1.3rem;">' + this.stats.weeklyActive + '</div><div class="stat-label">活跃渠道</div></div>';
      html += '</div>';

      // Channels
      html += '<h4 style="color:var(--gold);margin-bottom:0.8rem;font-size:0.9rem;">宣发渠道</h4>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.2rem;">';
      for (var ch in this.channels) {
        var c = this.channels[ch];
        html += '<span style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid ' + (c.enabled ? 'var(--cyan)' : 'rgba(255,255,255,0.1)') + ';font-size:0.8rem;color:' + (c.enabled ? 'var(--cyan)' : 'var(--text-muted)') + ';">' + c.icon + ' ' + c.name + (c.autoPost ? ' <small>自动</small>' : '') + '</span>';
      }
      html += '</div>';

      // Queue
      html += '<h4 style="color:var(--gold);margin-bottom:0.8rem;font-size:0.9rem;">宣发队列</h4>';
      html += '<div style="max-height:240px;overflow-y:auto;">';
      for (var i = 0; i < this.queue.length; i++) {
        var q = this.queue[i];
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:0.82rem;">';
        html += '<div><span style="color:var(--text-primary);">' + q.title + '</span><br><span style="color:var(--text-muted);font-size:0.75rem;">' + new Date(q.scheduledAt).toLocaleString('zh-CN') + '</span></div>';
        html += '<span class="badge ' + (q.status === 'scheduled' ? 'badge-green' : 'badge-yellow') + '">' + q.status + '</span>';
        html += '</div>';
      }
      html += '</div>';

      html += '</div>';
      container.innerHTML = html;
    },

    _listeners: {},
    on: function (event, cb) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(cb);
    },
    _emit: function (event, data) {
      var cbs = this._listeners[event] || [];
      cbs.forEach(function (cb) { try { cb(data); } catch (e) { console.error(e); } });
    }
  };

  window.OutreachPanel = OutreachPanel;
  console.log('[OutreachPanel] Loaded. Total posts:', OutreachPanel.stats.totalPosts);
})();
