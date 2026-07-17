(function () {
  'use strict';

  let _logs = [];

  function getDb() {
    return window.db;
  }

  function initAudit() {
    loadAuditLogs();
    bindEvents();
  }

  async function loadAuditLogs() {
    const tbody = document.getElementById('audit-table-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;padding:32px;">
            <div class="spinner" style="margin: 0 auto 12px auto; width: 24px; height: 24px; border: 2px solid var(--gold); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            Loading audit logs...
          </td>
        </tr>
      `;
    }

    try {
      const db = getDb();
      if (!db) throw new Error('API Client is not initialized');

      // Use the client wrapper helper to call '/api/audit'
      const { data, error } = await db.from('audit_log').select().order('created_at', { ascending: false });
      if (error) throw error;
      _logs = data || [];
      renderAuditTable(_logs);
    } catch (err) {
      console.error('[audit] Failed to load audit logs:', err);
      showToastSafe('error', 'Failed to load audit logs.');
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center;padding:32px;color:red;">
              Failed to load logs. Make sure the backend service is running.
            </td>
          </tr>
        `;
      }
    }
  }

  function renderAuditTable(items = _logs) {
    const tbody = document.getElementById('audit-table-body');
    if (!tbody) return;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <i class="ti ti-history empty-icon"></i>
              <div class="empty-title">No audit logs found</div>
              <div class="empty-text">No security events have been logged yet.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map((log) => {
      const timestamp = formatDate(log.created_at || log.createdAt);
      const module = escHtml(log.module || 'system');
      const action = escHtml(log.action || 'unknown');
      const user = escHtml(log.user_id || log.userId || 'system');
      const details = formatDetails(log.details);

      // Color coding helper classes
      const moduleBadge = getModuleBadgeStyle(log.module);
      const actionBadge = getActionBadgeStyle(log.action);

      return `
        <tr>
          <td style="white-space:nowrap;font-size:0.85rem;color:var(--muted);">${timestamp}</td>
          <td><span class="badge" style="${moduleBadge}">${module}</span></td>
          <td><span class="badge" style="${actionBadge}">${action}</span></td>
          <td style="font-weight:500;">${user}</td>
          <td style="font-size:0.82rem;font-family:monospace;max-width:320px;word-break:break-all;">${details}</td>
        </tr>
      `;
    }).join('');
  }

  function formatDetails(detailsStr) {
    if (!detailsStr) return '—';
    try {
      const parsed = typeof detailsStr === 'object' ? detailsStr : JSON.parse(detailsStr);
      return Object.entries(parsed)
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
        .join(', ');
    } catch {
      return escHtml(String(detailsStr));
    }
  }

  function getModuleBadgeStyle(mod) {
    const map = {
      portfolio: 'background:rgba(184,147,58,0.1);color:#b8933a;',
      artists: 'background:rgba(107,124,107,0.1);color:#6b7c6b;',
      inquiries: 'background:rgba(74,138,184,0.1);color:#4a8ab8;',
      reviews: 'background:rgba(155,107,191,0.1);color:#9b6bbf;',
      faq: 'background:rgba(184,107,74,0.1);color:#b86b4a;',
      config: 'background:rgba(74,184,168,0.1);color:#4ab8a8;',
      auth: 'background:rgba(122,114,104,0.1);color:#7a7268;'
    };
    return map[String(mod).toLowerCase()] || 'background:rgba(122,114,104,0.1);color:#7a7268;';
  }

  function getActionBadgeStyle(act) {
    const normalized = String(act).toUpperCase();
    if (normalized.includes('CREATE') || normalized.includes('ADD') || normalized.includes('INSERT')) {
      return 'background:rgba(40,167,69,0.1);color:#28a745;font-weight:500;';
    }
    if (normalized.includes('UPDATE') || normalized.includes('EDIT') || normalized.includes('TOGGLE')) {
      return 'background:rgba(255,193,7,0.1);color:#b88300;font-weight:500;';
    }
    if (normalized.includes('DELETE') || normalized.includes('REMOVE')) {
      return 'background:rgba(220,53,69,0.1);color:#dc3545;font-weight:500;';
    }
    return 'background:rgba(108,117,125,0.1);color:#6c757d;';
  }

  function bindEvents() {
    const btn = document.getElementById('btn-refresh-audit');
    if (btn) {
      btn.onclick = function() {
        loadAuditLogs();
      };
    }
  }

  // Helpers
  function formatDate(dStr) {
    if (!dStr) return '—';
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return dStr;
    return d.toLocaleString();
  }

  // Escaping helper
  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToastSafe(type, msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg, type);
    }
    // Intentionally empty for production
  }

  // Expose init globally
  window.initAudit = initAudit;

})();
