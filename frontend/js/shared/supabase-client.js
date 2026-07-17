'use strict';

/**
 * supabase-client.js — Real Supabase client
 *
 * Replaces the old api.js + api-client.js (which faked a Supabase-shaped
 * client on top of the Java/MySQL REST backend). Since the rest of the app
 * (admin/js/*.js, js/public/*.js) already speaks Supabase syntax
 * (db.from().select()/.insert()/.update()/.delete(), db.storage, db.auth),
 * no other files need to change table/column names.
 *
 * Requires the Supabase JS SDK to be loaded before this file:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 */

(function () {
  window.isLocalPreviewMode = function isLocalPreviewMode() {
    return window.location.protocol === 'file:';
  };

  window.shouldBypassRemoteData = function shouldBypassRemoteData() {
    return false;
  };

  if (typeof supabase === 'undefined') {
    console.error('[supabase-client] Supabase SDK not loaded. Add the CDN <script> tag before this file.');
    return;
  }

  const client = supabase.createClient(
    window.appConfig.SUPABASE_URL,
    window.appConfig.SUPABASE_ANON_KEY
  );

  window.db = client;

  window.notifyContentChange = function notifyContentChange(reason = 'content', detail = {}) {
    const payload = { reason, detail, ts: Date.now() };
    try {
      localStorage.setItem('ashmija_content_sync', JSON.stringify(payload));
    } catch (err) {
      console.warn('[supabase-client] content sync write failed', err);
    }

    window.dispatchEvent(new CustomEvent('ashmija:content-sync', { detail: payload }));
  };

  window.refreshFrontendContent = async function refreshFrontendContent() {
    if (typeof window.loadAllSections === 'function') {
      try {
        await window.loadAllSections();
      } catch (err) {
        console.warn('[supabase-client] frontend refresh failed', err);
      }
    }
  };

  // Global audit-log helper, used across admin/js/*.js
  window.logAudit = async function logAudit(module, action, details = {}) {
    try {
      const { data: { session } = {} } = await client.auth.getSession();
      await client.from('audit_log').insert({
        module,
        action,
        details: typeof details === 'string' ? details : details,
        user_id: session?.user?.id ?? null,
      });
    } catch (err) {
      console.warn('[logAudit] failed:', err);
    }
  };
})();
