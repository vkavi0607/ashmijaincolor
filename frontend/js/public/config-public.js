'use strict';

(function () {
  const SECTION_ID = 'section-config';
  const TABLE_NAME = 'site_config';
  const WARNING_BANNER_ID = 'config-warning-banner';
  const SAVE_BUTTON_ID = 'btn-save-config';
  const PREVIEW_BUTTON_ID = 'btn-preview-live';

  const FIELD_MAP = {
    hero_tagline       : 'config-hero-tagline',
    hero_sub           : 'config-hero-sub',
    stat_sqft          : 'config-stat-sqft',
    stat_projects      : 'config-stat-projects',
    stat_cities        : 'config-stat-cities',
    contact_phone      : 'config-contact-phone',
    contact_email      : 'config-contact-email',
    contact_whatsapp   : 'config-contact-whatsapp',
  };

  let _hasUnsavedChanges = false;
  let _schemaWarningShown = false;

  function getDb() {
    return window.db || null;
  }

  function showToastSafe(type, message) {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
      return;
    }
    console[type === 'error' ? 'error' : 'log']('[config] ' + message);
  }

  async function logAudit(module, action, details = {}) {
    if (typeof window.logAudit === 'function') {
      return window.logAudit(module, action, details);
    }

    try {
      const db = getDb();
      if (!db) return;
      const { data: { session } = {} } = await db.auth.getSession();
      const userId = session?.user?.id ?? null;
      await db.from('audit_log').insert({
        module,
        action,
        details,
        user_id: userId,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[config] audit failed', err);
    }
  }

  function getElement(id) {
    return document.getElementById(id);
  }

  function isMissingTableError(err) {
    const message = String(err?.message || err?.details || err || '').toLowerCase();
    return message.includes('could not find the table') ||
      message.includes('schema cache') ||
      message.includes('does not exist');
  }

  function shouldBypassRemoteData() {
    return typeof window.shouldBypassRemoteData === 'function' && window.shouldBypassRemoteData();
  }

  async function loadConfig() {
    const section = getElement(SECTION_ID);
    if (!section) return;

    try {
      if (shouldBypassRemoteData()) {
        Object.values(FIELD_MAP).forEach((id) => {
          const input = getElement(id);
          if (input) input.value = '';
        });
        setUnsavedChanges(false);
        return;
      }

      const db = getDb();
      if (!db) {
        console.warn('[config] Database client not available');
        return;
      }

      const { data, error } = await db.from(TABLE_NAME).select('key,value');
      if (error) throw error;

      const config = (data || []).reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});

      Object.entries(FIELD_MAP).forEach(([key, id]) => {
        const input = getElement(id);
        if (input) input.value = config[key] || '';
      });

      setUnsavedChanges(false);
    } catch (err) {
      if (isMissingTableError(err)) {
        if (!_schemaWarningShown) {
          showToastSafe('warning', 'Site config table is missing in database. Using blank defaults until the schema is applied.');
          _schemaWarningShown = true;
        }
        Object.values(FIELD_MAP).forEach((id) => {
          const input = getElement(id);
          if (input) input.value = '';
        });
        setUnsavedChanges(false);
        return;
      }

      console.error('[config] load error', err);
      showToastSafe('error', 'Unable to load site configuration.');
    }
  }

  function updateTextContent(selector, value, isHtml = false) {
    const el = document.querySelector(selector);
    if (!el) return;
    if (isHtml) {
      el.innerHTML = value || '';
    } else {
      el.textContent = value || '';
    }
  }

  function setLinkHref(selector, href) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.setAttribute('href', href);
  }

  function normalizeWhatsAppNumber(value) {
    return String(value || '').replace(/[^0-9+]/g, '').replace(/^\+/, '');
  }

  async function renderConfigToMainSite(dbClient) {
    try {
      const db = dbClient || window.db;
      if (!db) {
        console.warn('[renderConfigToMainSite] Database client not found.');
        return;
      }

      if (shouldBypassRemoteData()) {
        updateTextContent('.hero-title', '');
        updateTextContent('.hero-sub', '');
        return;
      }

      const { data, error } = await db.from(TABLE_NAME).select('key,value');
      if (error) {
        if (!isMissingTableError(error)) {
          console.warn('[renderConfigToMainSite] Fetch error:', error.message);
        }
        return;
      }

      const config = (data || []).reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});

      let tagline = config.hero_tagline || '';
      if (tagline && !tagline.includes('<em')) {
        const parts = tagline.split(/,|\n|<br>/i);
        if (parts.length >= 2) {
          tagline = `${parts[0].trim()},<br><em>${parts.slice(1).join(', ').trim()}</em>`;
        }
      }
      updateTextContent('.hero-title', tagline, true);
      updateTextContent('.hero-sub', config.hero_sub || '');

      const statEls = document.querySelectorAll('.hero-stat-num');
      if (statEls.length > 0 && config.stat_sqft) {
        const valStr = String(config.stat_sqft);
        const numPart = parseInt(valStr.replace(/[^0-9]/g, ''), 10) || 0;
        const suffixPart = valStr.replace(/[0-9]/g, '');
        statEls[0].setAttribute('data-target', numPart);
        statEls[0].setAttribute('data-suffix', suffixPart);
        if (typeof window.animateStatCounter === 'function') {
          window.animateStatCounter(statEls[0]);
        } else {
          statEls[0].textContent = numPart + suffixPart;
        }
      }
      if (statEls.length > 1 && config.stat_projects) {
        let valStr = String(config.stat_projects);
        if (valStr.includes('2,900') || valStr.includes('2900')) {
          valStr = '100+';
        }
        const numPart = parseInt(valStr.replace(/[^0-9]/g, ''), 10) || 0;
        const suffixPart = valStr.replace(/[0-9]/g, '').replace(/,/g, '');
        statEls[1].setAttribute('data-target', numPart);
        statEls[1].setAttribute('data-suffix', suffixPart);
        if (typeof window.animateStatCounter === 'function') {
          window.animateStatCounter(statEls[1]);
        } else {
          statEls[1].textContent = numPart + suffixPart;
        }
      }
      if (statEls.length > 2 && config.stat_cities) {
        const valStr = String(config.stat_cities);
        const numPart = parseInt(valStr.replace(/[^0-9]/g, ''), 10) || 0;
        const suffixPart = valStr.replace(/[0-9]/g, '');
        statEls[2].setAttribute('data-target', numPart);
        statEls[2].setAttribute('data-suffix', suffixPart);
        if (typeof window.animateStatCounter === 'function') {
          window.animateStatCounter(statEls[2]);
        } else {
          statEls[2].textContent = numPart + suffixPart;
        }
      }

      updateTextContent('#footer-link-email', config.contact_email || '');
      updateTextContent('#footer-link-phone', config.contact_phone || '');

      if (config.contact_email) {
        setLinkHref('#footer-link-email', `mailto:${config.contact_email}`);
      }
      if (config.contact_phone) {
        setLinkHref('#footer-link-phone', `tel:${config.contact_phone}`);
      }

      const waNumber = normalizeWhatsAppNumber(config.contact_whatsapp);
      if (waNumber) {
        const waUrl = `https://wa.me/${encodeURIComponent(waNumber)}`;
        setLinkHref('#footer-link-whatsapp', waUrl);
        setLinkHref('#whatsapp-cta-link', waUrl);
        const cta = document.getElementById('whatsapp-cta');
        if (cta) cta.style.display = 'block';
      } else {
        const cta = document.getElementById('whatsapp-cta');
        if (cta) cta.style.display = 'none';
      }

      if (window.revealObserver) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) window.revealObserver.observe(heroTitle);
      }
    } catch (err) {
      console.error('[renderConfigToMainSite] error', err);
    }
  }

  window.renderConfigToMainSite = renderConfigToMainSite;

})();
