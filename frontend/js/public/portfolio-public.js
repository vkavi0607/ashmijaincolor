'use strict';

/**
 * portfolio.js — ashmija in color Admin
 * Full CRUD portfolio management for the admin dashboard.
 *
 * Exposes:
 *   window.initPortfolio()              — called by dashboard.js when navigating to #portfolio
 *   window.renderPortfolioToMainSite()  — fetches and injects gallery HTML into index.html
 *
 * Depends on:
 *   • window.db   — Database mock client (api.js)
 *   • window.showToast  — toast helper          (toast.js)
 *   • window.logAudit   — audit helper          (api.js)
 *   • window.openModal  — modal helper          (inline bootstrap script)
 *   • window.closeModal — modal helper          (inline bootstrap script)
 *   • window.Sortable   — SortableJS CDN
 *
 * Load order in admin/index.html:
 *   1. SortableJS CDN
 *   2. js/api.js
 *   3. js/toast.js
 *   4. js/dashboard.js
 *   5. js/portfolio.js   ← this file
 */

(function () {

  /* ================================================================
     CONSTANTS & STATE
     ================================================================ */

  const BUCKET      = 'ashmija-in-color-media';
  const STORAGE_DIR = 'portfolio/';
  const TABLE       = 'portfolio';
  let _schemaWarningShown = false;

  /** Module-level state — reset each time initPortfolio() is called. */
  let _items        = [];       // current fetched portfolio rows
  let _sortable     = null;     // SortableJS instance on the tbody
  let _searchTimer  = null;     // debounce handle for search input
  let _editingId    = null;     // UUID of item being edited (null = new)
  let _modalFile    = null;     // File object selected in modal
  let _bulkSelected = new Set();// UUIDs checked for bulk ops

  function isMissingTableError(err) {
    const message = String(err?.message || err?.details || err || '').toLowerCase();
    return message.includes('could not find the table') ||
      message.includes('schema cache') ||
      message.includes('does not exist');
  }

  function shouldBypassRemoteData() {
    return typeof window.shouldBypassRemoteData === 'function' && window.shouldBypassRemoteData();
  }

  function getFallbackPortfolio() {
    return [];
  }

  window.getFallbackPortfolioItems = getFallbackPortfolio;

  /* ================================================================
     INJECT MODULE STYLES  (once per page load)
     ================================================================ */

  (function injectStyles () {
    if (document.getElementById('aw-portfolio-styles')) return;

    const style = document.createElement('style');
    style.id = 'aw-portfolio-styles';
    style.textContent = `

      /* ── Portfolio grid (admin card view) ── */
      #portfolio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
        padding: 20px 0 8px;
      }

      .pf-card {
        background: var(--surface);
        border: 1px solid var(--beige3);
        border-radius: var(--radius-md);
        overflow: hidden;
        position: relative;
        transition: box-shadow 0.22s ease, border-color 0.22s ease;
        cursor: default;
        user-select: none;
      }
      .pf-card:hover { box-shadow: var(--shadow-md); border-color: var(--beige3); }
      .pf-card.sortable-chosen { box-shadow: var(--shadow-lg); opacity: 0.95; }
      .pf-card.sortable-ghost  { opacity: 0.3; }

      /* Checkbox overlay */
      .pf-card-check {
        position: absolute;
        top: 8px; left: 8px;
        z-index: 3;
        width: 20px; height: 20px;
        accent-color: var(--gold);
        cursor: pointer;
        display: none;
      }
      .bulk-active .pf-card-check { display: block; }

      /* Drag handle */
      .pf-card-drag {
        position: absolute;
        top: 8px; right: 8px;
        z-index: 3;
        color: #fff;
        background: rgba(0,0,0,0.38);
        border-radius: 4px;
        width: 26px; height: 26px;
        display: flex; align-items: center; justify-content: center;
        cursor: grab;
        opacity: 0;
        transition: opacity 0.18s ease;
        font-size: 0.85rem;
      }
      .pf-card:hover .pf-card-drag { opacity: 1; }
      .pf-card-drag:active { cursor: grabbing; }

      /* Thumbnail */
      .pf-card-thumb {
        width: 100%;
        height: 148px;
        object-fit: cover;
        display: block;
        background: var(--beige2);
      }
      .pf-card-thumb-placeholder {
        width: 100%;
        height: 148px;
        background: var(--beige2);
        display: flex; align-items: center; justify-content: center;
        color: var(--muted);
        font-size: 2rem;
      }

      /* Body */
      .pf-card-body {
        padding: 10px 12px 12px;
      }
      .pf-card-title {
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--ink1);
        margin: 0 0 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .pf-card-meta {
        font-size: 0.74rem;
        color: var(--muted);
        margin-bottom: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .pf-card-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 10px;
        min-height: 22px;
      }

      /* Action row */
      .pf-card-actions {
        display: flex;
        gap: 6px;
        justify-content: flex-end;
      }

      /* Inline section loading overlay */
      #portfolio-loading {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 48px 0;
        color: var(--muted);
        font-size: 0.85rem;
      }
      #portfolio-loading.visible { display: flex; }

      /* Bulk actions bar */
      #portfolio-bulk-bar {
        display: none;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        background: var(--gold-dim);
        border: 1px solid rgba(184,147,58,0.3);
        border-radius: var(--radius-sm);
        margin-bottom: 12px;
        font-size: 0.83rem;
        color: var(--ink2);
      }
      #portfolio-bulk-bar.visible { display: flex; }
      #portfolio-bulk-bar .bulk-count { font-weight: 600; color: var(--gold); margin-right: 4px; }

      /* Modal image preview */
      .pf-img-preview {
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-radius: var(--radius-sm);
        display: block;
        margin-bottom: 12px;
        border: 1px solid var(--beige3);
      }
      .pf-img-preview.hidden { display: none; }

      /* Toggle switch */
      .aw-toggle-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.83rem;
        color: var(--ink2);
        padding: 6px 0;
      }
      .aw-toggle {
        position: relative;
        width: 36px; height: 20px;
        flex-shrink: 0;
      }
      .aw-toggle input { opacity: 0; width: 0; height: 0; }
      .aw-toggle-slider {
        position: absolute; inset: 0;
        background: var(--beige3);
        border-radius: 20px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .aw-toggle-slider::before {
        content: '';
        position: absolute;
        left: 2px; top: 2px;
        width: 16px; height: 16px;
        background: #fff;
        border-radius: 50%;
        transition: transform 0.2s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.18);
      }
      .aw-toggle input:checked + .aw-toggle-slider { background: var(--gold); }
      .aw-toggle input:checked + .aw-toggle-slider::before { transform: translateX(16px); }

      /* Form 2-col grid */
      .pf-form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0 16px;
      }
      .pf-form-grid .form-group.full { grid-column: 1 / -1; }

      /* Empty state within grid */
      #portfolio-grid-empty {
        display: none;
        text-align: center;
        padding: 56px 0;
        color: var(--muted);
        grid-column: 1 / -1;
      }
      #portfolio-grid-empty.visible { display: block; }
      #portfolio-grid-empty i { font-size: 2.8rem; display: block; margin-bottom: 12px; opacity: 0.4; }
      #portfolio-grid-empty p { font-size: 0.85rem; }
    `;

    document.head.appendChild(style);
  })();


  /* ================================================================
     SECTION REBUILD
     Replaces the existing table-based placeholder with a card grid.
     ================================================================ */

  function buildSectionShell () {
    const section = document.getElementById('section-portfolio');
    if (!section) return;

    // Remove old table-based card
    const oldCard = section.querySelector('.card');
    if (oldCard) oldCard.remove();

    // Bulk bar
    if (!document.getElementById('portfolio-bulk-bar')) {
      const bar = document.createElement('div');
      bar.id = 'portfolio-bulk-bar';
      bar.innerHTML = `
        <span><span class="bulk-count" id="bulk-count">0</span> selected</span>
        <button class="btn btn-ghost btn-sm" id="btn-bulk-hide">
          <i class="ti ti-eye-off"></i> Hide Selected
        </button>
        <button class="btn btn-danger btn-sm" id="btn-bulk-delete">
          <i class="ti ti-trash"></i> Delete Selected
        </button>
        <button class="btn btn-ghost btn-sm" id="btn-bulk-cancel" style="margin-left:auto;">
          Cancel
        </button>
      `;
      section.appendChild(bar);
    }

    // Loading indicator
    if (!document.getElementById('portfolio-loading')) {
      const loader = document.createElement('div');
      loader.id = 'portfolio-loading';
      loader.innerHTML = `<span class="spinner"></span> Loading portfolio…`;
      section.appendChild(loader);
    }

    // Grid container
    if (!document.getElementById('portfolio-grid')) {
      const grid = document.createElement('div');
      grid.id = 'portfolio-grid';
      grid.innerHTML = `<div id="portfolio-grid-empty" class="visible">
        <i class="ti ti-photo"></i>
        <p>No portfolio items yet.<br>Click <strong>Add Project</strong> to get started.</p>
      </div>`;
      section.appendChild(grid);
    }
  }


  /* ================================================================
     DATA FETCH
     ================================================================ */

  async function fetchPortfolio () {
    try {
      if (shouldBypassRemoteData()) {
        return getFallbackPortfolio();
      }

      const { data, error } = await window.db
        .from(TABLE)
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at',    { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      if (isMissingTableError(err)) {
        if (!_schemaWarningShown) {
          showToast('warning', 'Database schema missing', 'Showing local fallback portfolio items until the portfolio table is applied.');
          _schemaWarningShown = true;
        }
        return getFallbackPortfolio();
      }

      console.error('[portfolio] fetch error:', err);
      showToast('error', 'Load failed', err.message || 'Could not load portfolio.');
      return [];
    }
  }

  async function fetchAndRender () {
    setLoading(true);
    _items = await fetchPortfolio();
    setLoading(false);

    const searchInput = document.getElementById('portfolio-search');
    renderGrid(_items, searchInput?.value.trim() || '');
    initSortable();
  }


  /* ================================================================
     UTILITIES
     ================================================================ */

  /** Show / hide the section-level loading indicator. */
  function setLoading (on) {
    const el = document.getElementById('portfolio-loading');
    const grid = document.getElementById('portfolio-grid');
    if (!el) return;
    if (on) {
      el.classList.add('visible');
      if (grid) grid.style.opacity = '0.4';
    } else {
      el.classList.remove('visible');
      if (grid) grid.style.opacity = '';
    }
  }

  /**
   * Extract the storage object path from a Database public URL.
   * e.g. https://xxx.Database.co/storage/v1/object/public/ashmija-in-color-media/portfolio/abc.jpg
   * → portfolio/abc.jpg
   */
  function storagePathFromUrl (url) {
    if (!url) return null;
    try {
      const marker = `/object/public/${BUCKET}/`;
      const idx    = url.indexOf(marker);
      if (idx === -1) return null;
      return url.slice(idx + marker.length);
    } catch (_) {
      return null;
    }
  }

  /** Minimal HTML escaping to prevent XSS in dynamically built HTML. */
  function escHtml (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Thin wrappers so calls read cleanly even when window.* prefix would be noisy. */
  function openModal (opts) {
    if (window.openModal) window.openModal(opts);
  }

  function closeModal () {
    if (window.closeModal) window.closeModal();
  }

  function showToast (type, title, message) {
    if (!window.showToast) return;
    const text = message ? `${title}: ${message}` : title;
    window.showToast(text, type);
  }

  async function logAudit (module, action, details = {}) {
    try {
      if (typeof window.logAudit === 'function') {
        await window.logAudit(module, action, details);
      }
    } catch (err) {
      console.warn('[portfolio] audit log skipped:', err);
    }
  }

})();
