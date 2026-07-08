/* ============================================
   deploy-matrix.js — V3 状态矩阵
   ============================================ */
(function () {
  'use strict';

  var DeployMatrix = {
    /* ---- 网络状态 ---- */
    networks: {
      sepolia: {
        status: 'operational',
        chainId: 11155111,
        contractAddress: '0x6B8e1b5F0f7E5D9C7A9E0B4A2C3D1E5F6A7B8C9',
        deployVersion: 'v3.2.1',
        lastDeploy: '2026-07-01T10:30:00Z',
        tps: 142,
        blockHeight: 6748902,
        gasPrice: '12.5 Gwei',
        uptime: '99.97%',
        checks: [
          { name: 'YUAN Token 合约', status: 'pass', lastChecked: '2026-07-08T23:50:00Z' },
          { name: 'AI Agent Registry', status: 'pass', lastChecked: '2026-07-08T23:50:00Z' },
          { name: '跨链桥 — 节点1', status: 'pass', lastChecked: '2026-07-08T23:45:00Z' },
          { name: '跨链桥 — 节点2', status: 'pass', lastChecked: '2026-07-08T23:45:00Z' },
          { name: 'Oracle 喂价', status: 'pass', lastChecked: '2026-07-08T23:48:00Z' },
          { name: '治理模块', status: 'pass', lastChecked: '2026-07-08T23:50:00Z' },
          { name: 'Staking 池', status: 'pass', lastChecked: '2026-07-08T23:50:00Z' }
        ]
      },
      ethereum: {
        status: 'operational',
        contractAddress: '部署中',
        deployVersion: 'v3.2.0-beta',
        tps: 0,
        uptime: '99.9%',
        checks: [
          { name: '跨链桥 — 通道', status: 'pass', lastChecked: '2026-07-08T23:40:00Z' },
          { name: 'L1 Bridge Contract', status: 'warn', lastChecked: '2026-07-08T22:00:00Z' }
        ]
      },
      bsc: {
        status: 'operational',
        chainId: 56,
        contractAddress: '0x46a091b707174eF96202Aaf6fdCF9cE7E9312841',
        deployVersion: 'v3.1.9',
        tps: 890,
        uptime: '99.99%',
        checks: [
          { name: 'YUAN BEP-20', status: 'pass', lastChecked: '2026-07-08T23:50:00Z' },
          { name: '基金会金库', status: 'pass', lastChecked: '2026-07-08T23:50:00Z' },
          { name: '跨链桥 — BSC端', status: 'pass', lastChecked: '2026-07-08T23:45:00Z' }
        ]
      },
      polygon: {
        status: 'degraded',
        chainId: 137,
        deployVersion: 'v3.0.8',
        tps: 45,
        uptime: '98.2%',
        checks: [
          { name: '跨链桥 — Polygon端', status: 'degraded', lastChecked: '2026-07-08T23:30:00Z' },
          { name: 'YUAN PoS 合约', status: 'pass', lastChecked: '2026-07-08T23:30:00Z' }
        ]
      },
      arbitrum: {
        status: 'operational',
        chainId: 42161,
        deployVersion: 'v3.1.0',
        tps: 234,
        uptime: '99.95%',
        checks: [
          { name: 'ARB Bridge', status: 'pass', lastChecked: '2026-07-08T23:40:00Z' },
          { name: 'YUAN Arbitrum', status: 'pass', lastChecked: '2026-07-08T23:40:00Z' }
        ]
      }
    },

    /* ---- 全局统计 ---- */
    globalStats: {
      totalTransactions: 3478290,
      totalWallets: 128450,
      totalAgents: 8700,
      totalStaked: '842,500 YUAN',
      crossChainTransfers: 156200,
      avgBlockTime: '2.3s',
      activeValidators: 42
    },

    /* ---- 历史事件 ---- */
    events: [
      { time: '2026-07-08T12:00:00Z', type: 'deploy', message: 'V3.2.1 部署至 Sepolia — AI Agent Registry 升级' },
      { time: '2026-07-07T08:30:00Z', type: 'incident', message: 'Polygon 跨链桥短暂中断（12min），已恢复' },
      { time: '2026-07-05T14:00:00Z', type: 'upgrade', message: 'Oracle 喂价系统升级 v2.4 — 新增 3 个数据源' },
      { time: '2026-07-03T09:00:00Z', type: 'milestone', message: 'YUAN 持有地址突破 10 万' },
      { time: '2026-07-01T10:30:00Z', type: 'deploy', message: '跨链桥 V3 主网部署 — ETH/BSC/Polygon' }
    ],

    /* ---- 渲染 ---- */
    renderStatus: function (containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      // Only render on status page
      var html = '';

      // Global stats
      html += '<div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr));">';
      var stats = this.globalStats;
      html += '<div class="stat-card"><div class="stat-value">' + (stats.totalTransactions / 1e6).toFixed(1) + 'M</div><div class="stat-label">总交易</div></div>';
      html += '<div class="stat-card"><div class="stat-value">' + (stats.totalWallets / 1000).toFixed(1) + 'k</div><div class="stat-label">钱包数</div></div>';
      html += '<div class="stat-card"><div class="stat-value">' + stats.totalAgents.toLocaleString() + '</div><div class="stat-label">智能体</div></div>';
      html += '<div class="stat-card"><div class="stat-value">' + stats.totalStaked + '</div><div class="stat-label">质押</div></div>';
      html += '<div class="stat-card"><div class="stat-value">' + (stats.crossChainTransfers / 1000).toFixed(1) + 'k</div><div class="stat-label">跨链</div></div>';
      html += '<div class="stat-card"><div class="stat-value">' + stats.activeValidators + '</div><div class="stat-label">验证者</div></div>';
      html += '</div>';

      // Network cards
      for (var net in this.networks) {
        var n = this.networks[net];
        var statusColor = n.status === 'operational' ? '#00c850' : n.status === 'degraded' ? '#f0b90b' : '#ff4444';
        var statusText = n.status === 'operational' ? '正常运行' : n.status === 'degraded' ? '性能降级' : '中断';

        html += '<div class="card" style="margin-top:1rem;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;">';
        html += '<h3 style="font-size:1.05rem;">' + net.charAt(0).toUpperCase() + net.slice(1) + '</h3>';
        html += '<span class="badge" style="background:' + statusColor + '22;color:' + statusColor + ';">● ' + statusText + '</span>';
        html += '</div>';

        if (n.contractAddress) {
          html += '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;">合约: <code style="color:var(--cyan);">' + n.contractAddress + '</code></p>';
        }
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:0.5rem;margin-bottom:0.8rem;">';
        html += '<div><span style="color:var(--text-muted);font-size:0.75rem;">版本</span><br><span style="font-size:0.85rem;color:var(--text-primary);">' + n.deployVersion + '</span></div>';
        html += '<div><span style="color:var(--text-muted);font-size:0.75rem;">TPS</span><br><span style="font-size:0.85rem;color:var(--text-primary);">' + n.tps + '</span></div>';
        html += '<div><span style="color:var(--text-muted);font-size:0.75rem;">可用率</span><br><span style="font-size:0.85rem;color:var(--text-primary);">' + n.uptime + '</span></div>';
        html += '</div>';

        // Checks
        html += '<div style="font-size:0.8rem;">';
        for (var c = 0; c < n.checks.length; c++) {
          var chk = n.checks[c];
          var cStatus = chk.status === 'pass' ? '✓' : chk.status === 'warn' ? '⚠' : '✗';
          var cColor = chk.status === 'pass' ? '#00c850' : chk.status === 'warn' ? '#f0b90b' : '#ff4444';
          html += '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;border-bottom:1px solid rgba(255,255,255,0.03);">';
          html += '<span>' + chk.name + '</span>';
          html += '<span style="color:' + cColor + ';">' + cStatus + ' <small style="color:var(--text-muted);">' + new Date(chk.lastChecked).toLocaleTimeString('zh-CN') + '</small></span>';
          html += '</div>';
        }
        html += '</div>';
        html += '</div>';
      }

      // Events
      html += '<h3 style="margin-top:2rem;margin-bottom:1rem;font-size:1.1rem;color:var(--gold);">近期事件</h3>';
      html += '<div style="max-height:300px;overflow-y:auto;">';
      for (var e = 0; e < this.events.length; e++) {
        var ev = this.events[e];
        html += '<div style="display:flex;gap:0.8rem;padding:0.6rem 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:0.85rem;">';
        html += '<span style="color:var(--text-muted);white-space:nowrap;">' + new Date(ev.time).toLocaleString('zh-CN') + '</span>';
        html += '<span style="color:var(--text-primary);">' + ev.message + '</span>';
        html += '</div>';
      }
      html += '</div>';

      container.innerHTML = html;
    }
  };

  window.DeployMatrix = DeployMatrix;
  console.log('[DeployMatrix] Loaded. Networks tracked:', Object.keys(DeployMatrix.networks).length);
})();
