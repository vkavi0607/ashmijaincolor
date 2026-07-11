'use strict';

/**
 * artists.js — ashmija in color Admin
 * Full CRUD management for the Artists section of the admin dashboard.
 *
 * Exposes:
 *   window.initArtists()              — called by dashboard.js when navigating to #section-artists
 *   window.renderArtistsToMainSite()  — fetches and injects exact creator-card HTML into index.html
 *
 * Depends on:
 *   • window.db   — Database mock client (api.js)
 *   • window.showToast  — toast helper          (toast.js)
 *   • window.logAudit   — audit helper          (api.js)
 *   • window.openModal  — modal helper          (dashboard.js inline script)
 *   • window.closeModal — modal helper          (dashboard.js inline script)
 *   • window.Sortable   — SortableJS CDN
 *   • window.Quill      — Quill.js CDN
 *
 * Load order in admin/index.html:
 *   1. SortableJS CDN
 *   2. Quill.js CDN
 *   3. js/api.js
 *   4. js/toast.js
 *   5. js/dashboard.js
 *   6. js/artists.js   ← this file
 */

(function () {

  /* ================================================================
     CONSTANTS & STATE
     ================================================================ */

  const BUCKET      = 'ashmija-in-color-media';
  const STORAGE_DIR = 'artists/';
  const TABLE       = 'artists';
  let _schemaWarningShown = false;

  function getPublicArtistAsset(fileName) {
    const inAdminPage = /(^|\/)admin(\/|$)/.test(window.location.pathname || '');
    return inAdminPage ? `../assets/artists/${fileName}` : `./assets/artists/${fileName}`;
  }

  function resolveFeaturedArtistImage(name, fallbackUrl) {
    const normalized = String(name || '').trim().toLowerCase();
    if (normalized === 'vikram') return getPublicArtistAsset('vikram-profile.jpg');
    if (normalized === 'ashmija') return getPublicArtistAsset('ashmija-profile.jpg');
    return fallbackUrl || '';
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

  function getFallbackArtists() {
    return [
      {
        id: 'fallback-vikram',
        name: 'Vikram',
        role: 'Lead Artist, Urban & Abstract',
        bio: 'Specializing in geometric abstraction and large-scale urban realism, Vikram has spent the last 12 years collaborating with corporate campuses, hospitality interiors, and public districts to transform blank walls into local landmarks.',
        quote: 'Art should not be confined behind closed doors. Corporate corridors and public walls are the spaces where street realism and daily life truly merge.',
        image_url: getPublicArtistAsset('vikram-profile.jpg'),
        stats: 'Featured in Elle Decor,80+ Projects',
        fb_url: '#',
        tw_url: '#',
        ln_url: '#',
        is_available: true,
        display_order: 0,
      },
      {
        id: 'fallback-ashmija',
        name: 'Ashmija',
        role: 'Lead Artist, Muralist',
        bio: 'Merging intricate botanical illustrations with architectural backdrops, Ashmija\'s nature-inspired murals and large-scale floral art pieces bring organic life and a sense of calm to high-end interiors across South Asia.',
        quote: 'My work bridges the gap between concrete rooms and the wild serenity of nature. I paint to give blank walls a voice and spaces a heartbeat.',
        image_url: getPublicArtistAsset('ashmija-profile.jpg'),
        stats: '120+ Murals,National Art Award',
        fb_url: '#',
        tw_url: '#',
        ln_url: '#',
        is_available: true,
        display_order: 1,
      },
      {
        id: 'fallback-meera',
        name: 'Meera S.',
        role: 'Fine Art & Botanical Specialist',
        bio: 'With a background in classical fine art, Meera translates traditional oil and watercolor textures onto large indoor surfaces with detailed foliage patterns and calm, layered color stories.',
        quote: 'A mural is a dialogue with the room, its light, and the people who move through it every day.',
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500',
        stats: '90+ Paintings,Gold Medalist in Fine Arts',
        fb_url: '#',
        tw_url: '#',
        ln_url: '#',
        is_available: true,
        display_order: 2,
      },
    ];
  }

  window.getFallbackArtistsItems = getFallbackArtists;

  /** Module-level state — reset each time initArtists() is called. */
  let _items       = [];     // current fetched artist rows
  let _sortable    = null;   // SortableJS instance on the grid
  let _searchTimer = null;   // debounce handle for the search input
  let _editingId   = null;   // UUID of artist being edited (null = new)
  let _modalFile   = null;   // File object selected in the add/edit modal
  let _quill       = null;   // Quill editor instance inside the modal


  /* ================================================================
     INJECT MODULE STYLES  (once per page load)
     ================================================================ */

  (function injectStyles() {
    if (document.getElementById('aw-artists-styles')) return;

    const style = document.createElement('style');
    style.id = 'aw-artists-styles';
    style.textContent = `

      /* ── Artists card grid ── */
      #artists-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 18px;
        padding: 20px 0 8px;
      }

      .ar-card {
        background: var(--surface);
        border: 1px solid var(--beige3);
        border-radius: var(--radius-md);
        overflow: hidden;
        position: relative;
        transition: box-shadow 0.22s ease, border-color 0.22s ease;
        user-select: none;
      }
      .ar-card:hover { box-shadow: var(--shadow-md); }
      .ar-card.sortable-chosen { box-shadow: var(--shadow-lg); opacity: 0.95; }
      .ar-card.sortable-ghost  { opacity: 0.28; }

      /* Drag handle */
      .ar-card-drag {
        position: absolute;
        top: 8px; right: 8px;
        z-index: 3;
        color: #fff;
        background: rgba(0,0,0,0.40);
        border-radius: 4px;
        width: 26px; height: 26px;
        display: flex; align-items: center; justify-content: center;
        cursor: grab;
        opacity: 0;
        transition: opacity 0.18s ease;
        font-size: 0.85rem;
      }
      .ar-card:hover .ar-card-drag { opacity: 1; }
      .ar-card-drag:active { cursor: grabbing; }

      /* Availability badge */
      .ar-avail-badge {
        position: absolute;
        top: 8px; left: 8px;
        z-index: 3;
        padding: 3px 8px;
        border-radius: 20px;
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        cursor: pointer;
        transition: filter 0.15s ease;
      }
      .ar-avail-badge:hover { filter: brightness(1.12); }
      .ar-avail-badge.available {
        background: rgba(34, 197, 94, 0.18);
        color: #16a34a;
        border: 1px solid rgba(34, 197, 94, 0.38);
      }
      .ar-avail-badge.unavailable {
        background: rgba(239, 68, 68, 0.14);
        color: #dc2626;
        border: 1px solid rgba(239, 68, 68, 0.30);
      }

      /* Photo */
      .ar-card-photo {
        width: 100%;
        height: 160px;
        object-fit: cover;
        display: block;
        background: var(--beige2);
      }
      .ar-card-photo-placeholder {
        width: 100%;
        height: 160px;
        background: var(--beige2);
        display: flex; align-items: center; justify-content: center;
        color: var(--muted);
        font-size: 2.6rem;
      }

      /* Body */
      .ar-card-body {
        padding: 10px 12px 12px;
      }
      .ar-card-name {
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--ink1);
        margin: 0 0 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ar-card-role {
        font-size: 0.75rem;
        color: var(--gold);
        margin-bottom: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
      }
      .ar-card-actions {
        display: flex;
        gap: 6px;
        justify-content: flex-end;
      }

      /* Loading overlay */
      #artists-loading {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 56px 0;
        color: var(--muted);
        font-size: 0.85rem;
      }
      #artists-loading.visible { display: flex; }

      /* Empty state */
      #artists-grid-empty {
        display: none;
        text-align: center;
        padding: 64px 0;
        color: var(--muted);
        grid-column: 1 / -1;
      }
      #artists-grid-empty.visible { display: block; }
      #artists-grid-empty i { font-size: 3rem; display: block; margin-bottom: 14px; opacity: 0.38; }
      #artists-grid-empty p { font-size: 0.85rem; }

      /* ── Modal styles ── */

      /* Upload zone */
      .ar-upload-zone {
        border: 2px dashed var(--beige3);
        border-radius: var(--radius-sm);
        padding: 24px 16px;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.2s ease, background 0.2s ease;
        color: var(--muted);
        font-size: 0.84rem;
        margin-bottom: 0;
      }
      .ar-upload-zone:hover,
      .ar-upload-zone.drag-over {
        border-color: var(--gold);
        background: var(--gold-dim, rgba(184,147,58,0.06));
        color: var(--ink2);
      }
      .ar-upload-zone i {
        font-size: 2rem;
        display: block;
        margin-bottom: 8px;
        color: var(--gold);
        opacity: 0.7;
      }

      /* Photo preview */
      .ar-img-preview {
        width: 130px;
        height: 130px;
        object-fit: cover;
        border-radius: 50%;
        display: block;
        margin: 0 auto 16px auto;
        border: 1px solid var(--beige3);
        cursor: pointer;
        transition: opacity 0.2s ease;
      }
      .ar-img-preview:hover { opacity: 0.88; }
      .ar-img-preview.hidden { display: none; }

      /* Modal 2-col grid */
      .ar-form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px 16px;
        align-items: start;
      }
      .ar-form-grid .form-group {
        min-width: 0;
        margin-bottom: 0;
      }
      .ar-form-grid .form-group.full { grid-column: 1 / -1; }
      /* Quill editor inside modal */
      .ar-quill-wrap {
        border: 1px solid var(--beige3);
        border-radius: var(--radius-sm);
        overflow: hidden;
        background: var(--bg, #fff);
      }
      .ar-quill-wrap .ql-toolbar {
        border: none;
        border-bottom: 1px solid var(--beige3);
        background: var(--beige1, #f9f5f0);
        padding: 6px 8px;
      }
      .ar-quill-wrap .ql-container {
        border: none;
        font-size: 0.85rem;
        min-height: 96px;
        max-height: 180px;
        overflow-y: auto;
      }
      .ar-quill-wrap .ql-editor { padding: 10px 12px; }
      .ar-quill-wrap .ql-editor.ql-blank::before {
        color: var(--muted);
        font-style: normal;
        font-size: 0.83rem;
      }

      /* Stats helper text */
      .ar-stats-helper {
        font-size: 0.72rem;
        color: var(--muted);
        margin-top: 4px;
        line-height: 1.4;
      }

      /* Availability toggle row */
      .ar-toggle-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.83rem;
        color: var(--ink2);
        padding: 4px 0;
      }
      .ar-toggle {
        position: relative;
        width: 36px; height: 20px;
        flex-shrink: 0;
      }
      .ar-toggle input { opacity: 0; width: 0; height: 0; }
      .ar-toggle-slider {
        position: absolute; inset: 0;
        background: var(--beige3);
        border-radius: 20px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .ar-toggle-slider::before {
        content: '';
        position: absolute;
        left: 2px; top: 2px;
        width: 16px; height: 16px;
        background: #fff;
        border-radius: 50%;
        transition: transform 0.2s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.18);
      }
      .ar-toggle input:checked + .ar-toggle-slider { background: #22c55e; }
      .ar-toggle input:checked + .ar-toggle-slider::before { transform: translateX(16px); }

      /* Social url inputs group */
      .ar-social-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ar-social-row i {
        font-size: 1.1rem;
        width: 22px;
        text-align: center;
        flex-shrink: 0;
        color: var(--muted);
      }
      .ar-social-row i.ti-brand-facebook { color: #1877f2; }
      .ar-social-row i.ti-brand-twitter  { color: #1da1f2; }
      .ar-social-row i.ti-brand-linkedin { color: #0a66c2; }

      /* Saving spinner in modal button */
      .ar-saving { display: inline-flex; align-items: center; gap: 6px; }

      /* Responsive: Add/Edit Artist form on mobile */
      @media (max-width: 768px) {
        .ar-form-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }

      @media (max-width: 480px) {
        .ar-upload-zone {
          padding: 20px 14px;
          font-size: 0.8rem;
        }
        .ar-img-preview {
          height: 150px;
        }
        .ar-form-grid {
          gap: 14px;
        }
        .ar-social-row {
          gap: 6px;
        }
        .ar-social-row input.form-input {
          min-width: 0;
        }
      }
    `;

    document.head.appendChild(style);
  })();


  /* ================================================================
     SECTION SHELL BUILDER
     Replaces the static placeholder table with our card grid.
     ================================================================ */

  function buildSectionShell() {
    const section = document.getElementById('section-artists');
    if (!section) return;

    // Loading indicator
    if (!document.getElementById('artists-loading')) {
      const loader = document.createElement('div');
      loader.id = 'artists-loading';
      loader.innerHTML = `<span class="spinner"></span> Loading artists…`;
      section.appendChild(loader);
    }
  }


  /* ================================================================
     PUBLIC INIT  (called by dashboard.js router)
     ================================================================ */

  window.initArtists = async function initArtists() {
    buildSectionShell();

    // Add Artist button
    const addBtn = document.getElementById('btn-add-artist');
    if (addBtn) {
      // Remove any stale listener by replacing the node
      const freshAdd = addBtn.cloneNode(true);
      addBtn.parentNode.replaceChild(freshAdd, addBtn);
      freshAdd.addEventListener('click', () => openArtistModal(null));
    }

    // Search
    const searchInput = document.getElementById('artists-search');
    if (searchInput) {
      const freshSearch = searchInput.cloneNode(true);
      searchInput.parentNode.replaceChild(freshSearch, searchInput);
      freshSearch.addEventListener('input', () => {
        clearTimeout(_searchTimer);
        _searchTimer = setTimeout(
          () => renderGrid(_items, freshSearch.value.trim()),
          220
        );
      });
    }

    await fetchAndRender();
  };

  /**
   * window.renderArtistsToMainSite()
   *
   * Fetches all artists from the database (ordered by display_order),
   * builds the exact .creator-card HTML the public site's CSS/script.js
   * expects, and injects it into .creators-grid-new — so admin CRUD
   * changes actually show up on the live public page.
   *
   * Called automatically by shared/data-loader.js on page load.
   * Safe to call multiple times — fully idempotent.
   */
  window.renderArtistsToMainSite = async function renderArtistsToMainSite() {
    const creatorsGrid = document.querySelector('.creators-grid-new');
    if (!creatorsGrid) return;

    const staticCardsHtml = [...creatorsGrid.children]
      .filter(el => !el.classList.contains('admin-injected-artist'))
      .map(el => el.outerHTML)
      .join('');

    let artists = [];

    try {
      if (shouldBypassRemoteData()) {
        artists = getFallbackArtists();
      } else {
        const { data, error } = await window.db
          .from(TABLE)
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at',    { ascending: true });

        if (error) throw error;
        artists = data || [];
      }
    } catch (err) {
      if (!isMissingTableError(err)) {
        console.error('[artists] renderArtistsToMainSite error:', err);
        return;
      }
      if (!_schemaWarningShown && typeof window.showToast === 'function') {
        window.showToast('Artists table is missing in database. Showing local fallback artists until the schema is applied.', 'warning');
        _schemaWarningShown = true;
      }
      artists = getFallbackArtists();
    }

    if (artists.length === 0) return;

    const html = artists.map((artist, index) => {
      const name   = artist.name  || '';
      const role   = artist.role  || '';
      const bio    = artist.bio   || '';
      const quote  = artist.quote || '';
      const imgUrl = resolveFeaturedArtistImage(artist.name, artist.image_url || '');
      const stats  = artist.stats || '';

      return `<div class="creator-card flip-card reveal admin-injected-artist" style="transition-delay: ${index * 0.12}s">
  <div class="flip-card-inner">
    <div class="flip-card-front">
      <div class="creator-card-img">
        <img src="${escHtml(imgUrl)}" class="creator-raw-img" alt="${escHtml(name)}">
      </div>
    </div>
    <div class="flip-card-back glass-card">
      <div class="creator-card-back-info">
        <span class="creator-role-badge">${escHtml(role)}</span>
        <h3 class="creator-name-title">${escHtml(name.toUpperCase())}</h3>
        <p class="creator-bio-text">${escHtml(bio)}</p>
        <blockquote class="creator-quote-text">"${escHtml(quote)}"</blockquote>
        <div class="creator-stats-wrap">
          ${stats ? stats.split(',').map(stat => `<span class="creator-stat-badge">${escHtml(stat.trim())}</span>`).join('\n          ') : ''}
        </div>
      </div>
    </div>
  </div>
</div>`;
    }).join('\n');

    creatorsGrid.innerHTML = staticCardsHtml + html;

    creatorsGrid.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });

    if (window.revealObserver) {
      creatorsGrid.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('in');
        window.revealObserver.observe(el);
      });
    }
  };


  /* ================================================================
     DATA FETCH
     ================================================================ */

  async function fetchArtists() {
    try {
      if (shouldBypassRemoteData()) {
        return getFallbackArtists();
      }

      const { data, error } = await window.db
        .from(TABLE)
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at',    { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[artists] fetch error:', err);
      if (isMissingTableError(err)) {
        if (!_schemaWarningShown && typeof window.showToast === 'function') {
          window.showToast('Artists table is missing in database. Showing local fallback data until the schema is applied.', 'warning');
          _schemaWarningShown = true;
        }
        return getFallbackArtists();
      }

      if (typeof window.showToast === 'function') {
        window.showToast('Failed to load artists: ' + (err.message || 'Unknown error'), 'error');
      }
      return [];
    }
  }

  async function fetchAndRender() {
    setLoading(true);
    _items = await fetchArtists();
    setLoading(false);

    const q = document.getElementById('artists-search')?.value.trim() || '';
    renderGrid(_items, q);
    initSortable();
  }


  /* ================================================================
     UTILITIES
     ================================================================ */

  /** Show / hide the section-level loading overlay. */
  function setLoading(on) {
    const loader = document.getElementById('artists-loading');
    const grid   = document.getElementById('artists-grid');
    const tableBody = document.getElementById('artists-table-body');
    if (!loader) return;
    if (on) {
      loader.classList.add('visible');
      if (grid) grid.style.opacity = '0.4';
      if (tableBody) tableBody.style.opacity = '0.4';
    } else {
      loader.classList.remove('visible');
      if (grid) grid.style.opacity = '';
      if (tableBody) tableBody.style.opacity = '';
    }
  }

  /**
   * Extract the storage object path from a Database public URL.
   * e.g. https://xxx.Database.co/storage/v1/object/public/ashmija-in-color-media/artists/abc.jpg
   *   → artists/abc.jpg
   */
  function storagePathFromUrl(url) {
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

  /** Minimal HTML escaping to prevent XSS in dynamically built innerHTML. */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Thin wrappers so internal calls read cleanly. */
  function openModal(opts)  { if (window.openModal)  window.openModal(opts);  }
  function closeModal()     { if (window.closeModal) window.closeModal();      }

})();
