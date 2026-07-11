'use strict';

(function () {
  const ADMIN_SECTION_ID = 'section-faq';
  const TABLE_NAME = 'faqs';

  let _faqs = [];
  let _sortable = null;
  let _quill = null;
  let _editingId = null;
  let _schemaWarningShown = false;

  function getDb() {
    return window.db || null;
  }

  function showToastSafe(type, message) {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
      return;
    }
    console[type === 'error' ? 'error' : 'log']('[faq] ' + message);
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
      console.warn('[faq] audit failed', err);
    }
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  function getCategoryLabel(item) {
    if (item.category) return escapeHtml(item.category);
    return 'General';
  }

  function getVisibleLabel(item) {
    if (typeof item.is_visible === 'boolean') {
      return item.is_visible ? 'Yes' : 'No';
    }
    return 'Yes';
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


  const FALLBACK_PUBLIC_FAQS = [
    {
      id: 'process',
      question: 'How does the mural creation process work?',
      answer: 'Our process begins with a detailed consultation where we understand your space, vision, and brand story. We then provide curated artist recommendations, mood boards, and digital mockups for your approval. Once the design is finalised, our team handles everything from surface preparation and scaffolding to the final UV-resistant clear coat.',
    },
    {
      id: 'timeline',
      question: 'What is the typical timeline for a mural project?',
      answer: 'Timelines vary depending on the scale and complexity of the artwork. A small indoor accent wall typically takes 3-5 days, while a large exterior mural can take 2-4 weeks. The design and approval phase usually takes an additional 1-2 weeks.',
    },
    {
      id: 'materials',
      question: 'What types of paints and materials do you use?',
      answer: 'We use premium, eco-certified paints that are UV-resistant, weatherproof, and non-toxic. For outdoor murals, we apply specialised anti-graffiti and UV-protective clear coats that help the artwork retain its vibrancy for years.',
    },
    {
      id: 'pricing',
      question: 'How is pricing determined for mural projects?',
      answer: 'Pricing depends on wall size, design complexity, surface condition, location, and artist specialisation. We provide transparent, itemised quotes after the initial site assessment and work within your budget to find the best creative solution.',
    },
    {
      id: 'artist-choice',
      question: 'Can I choose or request a specific artist?',
      answer: 'Absolutely. During consultation, we present artist portfolios that best match your project aesthetic, and you have full creative control over the final artist selection.',
    },
    {
      id: 'project-types',
      question: 'Do you work on both commercial and residential projects?',
      answer: 'Yes. We work across all scales, from intimate bedroom accent walls to corporate offices, hotel lobbies, restaurants, schools, and public art installations.',
    },
    {
      id: 'design-revisions',
      question: 'What happens if I am not satisfied with the design?',
      answer: 'We include revision rounds during the digital mockup stage before paint touches the wall. The project moves forward only after you are aligned with the concept, colour palette, and composition.',
    },
    {
      id: 'maintenance-after-mural',
      question: 'Do you provide maintenance after the mural is completed?',
      answer: 'Yes. We share simple care instructions after handover and can schedule periodic touch-ups or protective coat refreshes for high-traffic and outdoor murals. Our team will recommend the right maintenance plan based on the wall surface, location, and exposure.',
    },
  ];

  function withFallbackPublicFaqs(items) {
    const list = Array.isArray(items) ? [...items] : [];
    const existingQuestions = new Set(list.map(item => String(item.question || '').trim().toLowerCase()));

    FALLBACK_PUBLIC_FAQS.forEach((faq) => {
      if (!existingQuestions.has(faq.question.toLowerCase())) {
        list.push(faq);
      }
    });

    return list;
  }
  function buildFaqRow(faq) {
    const question = escapeHtml(faq.question || 'Untitled question');
    const category = getCategoryLabel(faq);
    const visible = getVisibleLabel(faq);
    const order = typeof faq.display_order === 'number' ? faq.display_order : '-';

    return `
      <tr data-id="${faq.id}">
        <td class="drag-handle" style="cursor:grab;text-align:center;">
          <i class="ti ti-arrows-up-down"></i>
        </td>
        <td>${question}</td>
        <td>${category}</td>
        <td>${visible}</td>
        <td>${order}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-ghost btn-sm btn-edit-faq" data-id="${faq.id}">
            <i class="ti ti-pencil"></i>
          </button>
          <button class="btn btn-ghost btn-sm btn-delete-faq" data-id="${faq.id}">
            <i class="ti ti-trash"></i>
          </button>
        </td>
      </tr>`;
  }

  function renderFaqTable() {
    const tbody = document.getElementById('faq-table-body');
    if (!tbody) return;

    if (!_faqs.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <i class="ti ti-help-circle empty-icon"></i>
              <div class="empty-title">No FAQ items</div>
              <div class="empty-text">Add questions to help visitors understand your services.</div>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = _faqs.map(buildFaqRow).join('');
  }

  async function fetchFaqs() {
    const db = getDb();
    if (!db) throw new Error('Database client not available');
    if (shouldBypassRemoteData()) return [];

    const { data, error } = await db.from(TABLE_NAME)
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  function initQuill(answerHtml = '') {
    _quill = null;
    const editorContainer = document.getElementById('faq-editor');
    if (!editorContainer) return;

    if (window.Quill) {
      _quill = new window.Quill(editorContainer, {
        theme: 'snow',
        placeholder: 'Write the answer here...',
      });
      _quill.root.innerHTML = answerHtml || '<p></p>';
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.id = 'faq-answer-textarea';
    textarea.style.width = '100%';
    textarea.style.minHeight = '240px';
    textarea.value = answerHtml.replace(/<[^>]+>/g, '');
    editorContainer.appendChild(textarea);
  }

  function getEditorContent() {
    if (_quill) {
      return _quill.root.innerHTML.trim();
    }
    const textarea = document.getElementById('faq-answer-textarea');
    return textarea ? textarea.value.trim() : '';
  }

  async function openFaqModal(isEdit, faq = {}) {
    _editingId = isEdit ? faq.id : null;

    openModal({
      title: isEdit ? 'Edit FAQ Item' : 'Add FAQ Item',
      size: 'lg',
      bodyHTML: `
        <div class="faq-form-grid">
          <div class="form-group full">
            <label class="form-label" for="faq-question-input">Question</label>
            <input class="form-input" type="text" id="faq-question-input" value="${escapeHtml(faq.question || '')}" placeholder="Enter a question" />
          </div>
          <div class="form-group full">
            <label class="form-label" for="faq-editor">Answer</label>
            <div id="faq-editor" class="faq-editor"></div>
          </div>
        </div>
      `,
      onConfirm: async function () {
        const questionInput = document.getElementById('faq-question-input');
        const question = questionInput ? questionInput.value.trim() : '';
        const answer = getEditorContent();

        if (!question) {
          showToastSafe('error', 'Please add a question.');
          return;
        }
        if (!answer || answer === '<p><br></p>') {
          showToastSafe('error', 'Please add an answer.');
          return;
        }

        try {
          const db = getDb();
          if (!db) throw new Error('Database client not available');

          if (_editingId) {
            const { error } = await db.from(TABLE_NAME)
              .update({ question, answer })
              .eq('id', _editingId);
            if (error) throw error;
            await logAudit('faq', 'update', { id: _editingId, question });
            window.notifyContentChange?.('faqs', { action: 'update', id: _editingId });
            showToastSafe('success', 'FAQ updated successfully.');
          } else {
            const maxOrder = _faqs.length ? Math.max(..._faqs.map(item => item.display_order || 0)) : -1;
            const payload = {
              question,
              answer,
              display_order: maxOrder + 1,
            };
            const { error } = await db.from(TABLE_NAME).insert(payload);
            if (error) throw error;
            await logAudit('faq', 'create', { question });
            window.notifyContentChange?.('faqs', { action: 'create' });
            showToastSafe('success', 'FAQ added successfully.');
          }

          closeModal();
          await loadFaqs();
        } catch (err) {
          console.error('[faq] save error', err);
          showToastSafe('error', err.message || 'Could not save FAQ item.');
        }
      },
    });

    initQuill(faq.answer || '');
  }

  async function deleteFaqItem(id) {
    if (!id || !window.confirm('Delete this FAQ item?')) return;

    try {
      const db = getDb();
      if (!db) throw new Error('Database client not available');

      const { error } = await db.from(TABLE_NAME).delete().eq('id', id);
      if (error) throw error;

      await logAudit('faq', 'delete', { id });
      window.notifyContentChange?.('faqs', { action: 'delete', id });
      showToastSafe('success', 'FAQ removed.');
      await loadFaqs();
    } catch (err) {
      console.error('[faq] delete error', err);
      showToastSafe('error', err.message || 'Could not delete FAQ item.');
    }
  }

  async function initSortable() {
    const tbody = document.getElementById('faq-table-body');
    if (!tbody || !window.Sortable) return;

    if (_sortable) {
      _sortable.destroy();
      _sortable = null;
    }

    _sortable = window.Sortable.create(tbody, {
      animation: 180,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      onEnd: onSortEnd,
    });
  }

  async function onSortEnd() {
    const tbody = document.getElementById('faq-table-body');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr[data-id]'));
    const updates = rows.map((row, index) => ({
      id: row.dataset.id,
      display_order: index,
    }));

    updates.forEach(({ id, display_order }) => {
      const item = _faqs.find(entry => String(entry.id) === String(id));
      if (item) item.display_order = display_order;
    });

    try {
      const session = JSON.parse(localStorage.getItem('ashmija_session'));
      const token = session ? session.access_token : '';
      const response = await fetch(`${window.appConfig.API_BASE_URL}/api/faqs/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: updates })
      });
      if (!response.ok) {
        throw new Error('Failed to save order on server');
      }

      await logAudit('faq', 'reorder', { count: updates.length });
      window.notifyContentChange?.('faqs', { action: 'reorder' });
      showToastSafe('success', 'FAQ order saved.');
    } catch (err) {
      console.error('[faq] reorder error', err);
      showToastSafe('error', err.message || 'Could not save FAQ order.');
    }
  }

  async function handleFaqAction(event) {
    const editBtn = event.target.closest('.btn-edit-faq');
    const deleteBtn = event.target.closest('.btn-delete-faq');
    if (editBtn) {
      const id = editBtn.dataset.id;
      const faq = _faqs.find(item => String(item.id) === String(id));
      if (faq) openFaqModal(true, faq);
      return;
    }
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      await deleteFaqItem(id);
    }
  }

  async function loadFaqs() {
    try {
      _faqs = await fetchFaqs();
      renderFaqTable();
      initSortable();
    } catch (err) {
      if (isMissingTableError(err)) {
        if (!_schemaWarningShown) {
          showToastSafe('warning', 'FAQ table is missing in database. Showing an empty FAQ list until the schema is applied.');
          _schemaWarningShown = true;
        }
        _faqs = [];
        renderFaqTable();
        return;
      }

      console.error('[faq] load error', err);
      showToastSafe('error', 'Unable to load FAQ items.');
    }
  }

  function initAdminFaqSection() {
    if (!localStorage.getItem('ashmija_session')) return;
    const section = document.getElementById(ADMIN_SECTION_ID);
    if (!section) return;
    if (_isInitialized) {
      loadFaqs();
      return;
    }
    _isInitialized = true;

    const addButton = document.getElementById('btn-add-faq');
    const tbody = document.getElementById('faq-table-body');

    if (addButton) {
      addButton.addEventListener('click', () => openFaqModal(false));
    }
    if (tbody) {
      tbody.addEventListener('click', handleFaqAction);
    }
    loadFaqs();
  }

  window.initFAQ = initAdminFaqSection;

  document.addEventListener('DOMContentLoaded', function () {
    initAdminFaqSection();
  });
})();
