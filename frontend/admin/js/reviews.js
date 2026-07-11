'use strict';

(function () {
  const ADMIN_SECTION_ID = 'section-reviews';
  const TABLE_NAME = 'reviews';

  let _reviews = [];
  let _searchTimer = null;
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
    console[type === 'error' ? 'error' : 'log'](`[reviews] ${message}`);
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
      console.warn('[reviews] audit failed', err);
    }
  }

  function escHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
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

  function extractWorkImage(reviewText) {
    const text = String(reviewText || '');
    const marker = '||work_image:';
    const markerIndex = text.indexOf(marker);
    if (markerIndex < 0) return { text, workImage: '' };
    return {
      text: text.slice(0, markerIndex),
      workImage: text.slice(markerIndex + marker.length),
    };
  }

  function extractReviewLocation(reviewText) {
    const text = String(reviewText || '');
    const marker = '||location:';
    const markerIndex = text.indexOf(marker);
    if (markerIndex < 0) return { text, location: '' };
    const remainder = text.slice(markerIndex + marker.length);
    const nextMarkerIndex = remainder.indexOf('||');
    return {
      text: text.slice(0, markerIndex),
      location: nextMarkerIndex >= 0 ? remainder.slice(0, nextMarkerIndex) : remainder,
    };
  }

  function parseReviewText(reviewText) {
    const withLocation = extractReviewLocation(reviewText);
    const withImage = extractWorkImage(withLocation.text);
    return {
      text: withImage.text,
      location: withLocation.location,
      workImage: withImage.workImage,
    };
  }

  function buildStars(rating) {
    const count = Math.min(5, Math.max(0, parseInt(rating, 10) || 0));
    return `<span class="review-stars" aria-hidden="true">${Array.from({ length: 5 }, (_, index) => {
      const filled = index < count;
      return `<i class="ti ${filled ? 'ti-star-filled' : 'ti-star'}" aria-hidden="true"></i>`;
    }).join('')}</span>`;
  }

  function buildRatingPicker(rating) {
    const current = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
    return `
      <div class="review-rating-picker" id="review-rating-picker" role="radiogroup" aria-label="Review rating">
        ${[5, 4, 3, 2, 1].map((value) => `
          <button
            type="button"
            class="review-rating-star${value === current ? ' selected' : ''}"
            data-rating="${value}"
            role="radio"
            aria-checked="${value === current ? 'true' : 'false'}"
            aria-label="${value} star${value === 1 ? '' : 's'}">
            <i class="ti ti-star-filled" aria-hidden="true"></i>
            <span>${value}</span>
          </button>`).join('')}
        <input type="hidden" id="review-rating" value="${current}">
      </div>
    `;
  }

  function buildReviewRow(review) {
    const name = escHtml(review.name || 'Unnamed client');
    const company = escHtml(review.company || '—');
    const rating = buildStars(review.rating);
    const featured = review.is_pinned ? 'Yes' : 'No';
    const statusBadge = review.is_approved
      ? `<span class="badge" style="background: rgba(40, 167, 69, 0.1); color: #28a745; padding: 4px 8px; border-radius: 12px; font-weight: 500; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i class="ti ti-eye"></i> Visible</span>`
      : `<span class="badge" style="background: rgba(255, 193, 7, 0.15); color: #b8860b; padding: 4px 8px; border-radius: 12px; font-weight: 500; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i class="ti ti-clock"></i> Pending</span>`;
    const sortValue = formatDate(review.created_at);
    const parsedReview = parseReviewText(review.review_text);
    const locationValue = escHtml(review.location || parsedReview.location || '—');
    const reviewText = escHtml(String(parsedReview.text || ''));
    const previewText = reviewText.length > 80 ? `${reviewText.slice(0, 80)}…` : reviewText || '—';

    const approvalBtn = review.is_approved
      ? `<button class="btn btn-ghost btn-sm btn-toggle-approval" data-id="${review.id}" title="Hide from Site" style="color: var(--muted);">
          <i class="ti ti-eye-off"></i> Hide
         </button>`
      : `<button class="btn btn-sm btn-toggle-approval" data-id="${review.id}" title="Approve & Show on Site" style="background: rgba(40, 167, 69, 0.1); color: #28a745; border: 1px solid rgba(40, 167, 69, 0.2); border-radius: 4px; padding: 2px 8px; font-weight: 500;">
          <i class="ti ti-check"></i> Approve
         </button>`;

    return `
      <tr data-id="${review.id}">
        <td style="text-align:center;">${rating}</td>
        <td>${name}</td>
        <td>${company}</td>
        <td>${locationValue}</td>
        <td>${parsedReview.workImage ? `<div class="review-work-photo"><img src="${escHtml(parsedReview.workImage)}" alt="${escHtml(review.name || 'Client')} project work" loading="lazy"><span class="review-work-photo-location">${locationValue}</span></div>` : `<span style="color:var(--muted);">—</span>`}</td>
        <td title="${reviewText}">${previewText}</td>
        <td>${review.rating != null ? escHtml(String(review.rating)) : '0'}</td>
        <td>${featured}</td>
        <td>${statusBadge}</td>
        <td>${sortValue}</td>
        <td style="white-space:nowrap; display: flex; gap: 4px; align-items: center;">
          <button class="btn btn-ghost btn-sm btn-ai-reply" data-id="${review.id}" title="Generate AI reply">
            <i class="ti ti-robot"></i>
          </button>
          ${approvalBtn}
          <button class="btn btn-ghost btn-sm btn-edit-review" data-id="${review.id}" title="Edit review">
            <i class="ti ti-pencil"></i>
          </button>
          <button class="btn btn-ghost btn-sm btn-delete-review" data-id="${review.id}" title="Delete review">
            <i class="ti ti-trash"></i>
          </button>
        </td>
      </tr>`;
  }

  function renderReviewTable(items = _reviews) {
    const tbody = document.getElementById('reviews-table-body');
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11">
            <div class="empty-state">
              <i class="ti ti-star empty-icon"></i>
              <div class="empty-title">No reviews found</div>
              <div class="empty-text">Client testimonials will appear here once submitted.</div>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = items.map(buildReviewRow).join('');
  }

  async function fetchReviews() {
    const db = getDb();
    if (!db) throw new Error('Database client not available');
    if (shouldBypassRemoteData()) return [];

    const { data, error } = await db.from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  function filterReviews(query) {
    const search = String(query || document.getElementById('reviews-search')?.value || '').trim().toLowerCase();
    if (!search) {
      renderReviewTable(_reviews);
      return;
    }

    const filtered = _reviews.filter((item) => {
      return [item.name, item.company, item.location, item.review_text]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    });

    renderReviewTable(filtered);
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxDim = 800;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = () => reject(new Error('Image load error'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  }

  async function openReviewModal(isEdit, review = {}) {
    _editingId = isEdit ? review.id : null;

    const isApproved = _editingId ? review.is_approved : false;
    const isPinned = _editingId ? review.is_pinned : false;

    const presetAvatars = [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150"
    ];

    const currentAvatar = review.avatar_url || presetAvatars[0];
    const isPreset = presetAvatars.includes(currentAvatar);

    openModal({
      title: isEdit ? 'Edit Review' : 'Add Review',
      size: 'lg',
      bodyHTML: `
        <div class="form-grid">
          <div class="form-group full">
            <label class="form-label" style="text-align: center; display: block; margin-bottom: 0.5rem;">Choose Avatar Option</label>
            <div class="review-avatar-options">
              ${presetAvatars.map((url, idx) => `
                <label class="rating-avatar${currentAvatar === url ? ' selected' : ''}">
                  <input type="radio" name="review-avatar" value="${url}" ${currentAvatar === url ? 'checked' : ''}>
                  <img src="${url}" alt="Preset option ${idx + 1}">
                </label>
              `).join('')}
            </div>
          </div>
          <div class="form-group full">
            <label class="form-label" for="review-avatar-file">Your Photo (optional - overrides avatar selection)</label>
            <input class="form-input" type="file" id="review-avatar-file" accept="image/*" style="width: 100%;" />
            <div style="text-align: center; margin-top: 8px;">
              <img id="avatar-image-preview" class="review-modal-upload-preview${!isPreset && currentAvatar && currentAvatar.startsWith('data:') ? ' active' : ''}" src="${!isPreset ? currentAvatar : ''}" style="border-radius: 50%; width: 72px; height: 72px; display: ${!isPreset && currentAvatar && currentAvatar.startsWith('data:') ? 'inline-block' : 'none'}; object-fit: cover;" />
            </div>
          </div>
          <div class="form-group full">
            <label class="form-label" for="review-name">Client Name</label>
            <input class="form-input" type="text" id="review-name" value="${escHtml(review.name || '')}" placeholder="Enter client name" required />
          </div>
          <div class="form-group full">
            <label class="form-label" for="review-company">Company</label>
            <input class="form-input" type="text" id="review-company" value="${escHtml(review.company || '')}" placeholder="Enter company name" required />
          </div>
          <div class="form-group full">
            <label class="form-label" for="review-location">Location</label>
            <input class="form-input" type="text" id="review-location" value="${escHtml(review.location || parseReviewText(review.review_text).location || '')}" placeholder="Enter project location" required />
          </div>
          <div class="form-group full">
            <label class="form-label" for="review-rating">Rating</label>
            ${buildRatingPicker(review.rating)}
          </div>
          <div class="form-group full">
            <label class="form-label" for="review-text">Review Text</label>
            <textarea class="form-input" id="review-text" rows="4" placeholder="Share your experience..." required>${escHtml(parseReviewText(review.review_text).text || '')}</textarea>
          </div>
          <div class="form-group full">
            <label class="form-label" for="review-work-image">Project Work Photo</label>
            <input class="form-input" type="file" id="review-work-image" accept="image/*" style="width: 100%;" />
            <div style="text-align: center; margin-top: 8px;">
              <img id="work-image-preview" class="review-modal-upload-preview${parseReviewText(review.review_text).workImage ? ' active' : ''}" src="${parseReviewText(review.review_text).workImage || ''}" style="max-width: 100%; height: 120px; border-radius: 8px; object-fit: cover; display: ${parseReviewText(review.review_text).workImage ? 'inline-block' : 'none'};" />
            </div>
          </div>
          <div class="form-group full">
            <label class="form-label" for="review-reply-text">Owner Response / Reply</label>
            <textarea class="form-input" id="review-reply-text" rows="3" placeholder="Write a response to this review...">${escHtml(review.reply_text || '')}</textarea>
          </div>
          <div class="form-group full" style="border-top: 1px solid var(--beige3); padding-top: 1rem; margin-top: 0.5rem;">
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center;">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500;">
                <input type="checkbox" id="review-approved" ${isApproved ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                <span style="font-size: 0.9rem;">Approve & Show on Site</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500;">
                <input type="checkbox" id="review-featured" ${isPinned ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                <span style="font-size: 0.9rem;">Feature on Homepage</span>
              </label>
            </div>
          </div>
        </div>
      `,
      confirmLabel: isEdit ? 'Save Changes' : 'Add Review',
      cancelLabel: 'Cancel',
      showDeleteBtn: isEdit,
      onConfirm: async function () {
        const name = document.getElementById('review-name')?.value.trim() || '';
        const company = document.getElementById('review-company')?.value.trim() || '';
        const location = document.getElementById('review-location')?.value.trim() || '';
        const rating = parseInt(document.getElementById('review-rating')?.value, 10) || 5;
        const reviewText = document.getElementById('review-text')?.value.trim() || '';
        const replyText = document.getElementById('review-reply-text')?.value.trim() || null;
        const isApprovedCheckbox = document.getElementById('review-approved')?.checked ?? (_editingId ? review.is_approved : false);
        const isFeaturedCheckbox = document.getElementById('review-featured')?.checked ?? (_editingId ? review.is_pinned : false);

        if (!name) {
          showToastSafe('error', 'Please enter the client name.');
          return;
        }
        if (!company) {
          showToastSafe('error', 'Please enter the company name.');
          return;
        }
        if (!location) {
          showToastSafe('error', 'Please enter the location.');
          return;
        }
        if (!reviewText) {
          showToastSafe('error', 'Please enter the review text.');
          return;
        }

        // Get avatar URL
        let avatarUrl = document.querySelector('input[name="review-avatar"]:checked')?.value || null;
        const avatarPreviewEl = document.getElementById('avatar-image-preview');
        if (avatarPreviewEl && avatarPreviewEl.classList.contains('active') && avatarPreviewEl.src.startsWith('data:')) {
          avatarUrl = avatarPreviewEl.src;
        } else if (isEdit && !isPreset) {
          avatarUrl = review.avatar_url;
        }

        // Get project work photo
        let workImage = '';
        const workPreviewEl = document.getElementById('work-image-preview');
        if (workPreviewEl && workPreviewEl.classList.contains('active') && workPreviewEl.src.startsWith('data:')) {
          workImage = workPreviewEl.src;
        } else if (isEdit) {
          workImage = parseReviewText(review.review_text).workImage || '';
        }

        try {
          const db = getDb();
          if (!db) throw new Error('Database client not available');

          const payload = {
            name,
            company,
            location,
            review_text: [reviewText, location ? `location:${location}` : '', workImage ? `work_image:${workImage}` : '']
              .filter(Boolean)
              .join('||'),
            reply_text: replyText,
            rating,
            avatar_url: avatarUrl,
            is_approved: isApprovedCheckbox,
            is_pinned: isFeaturedCheckbox,
          };

          if (_editingId) {
            const { error } = await db.from(TABLE_NAME)
              .update(payload)
              .eq('id', _editingId);
            if (error) throw error;
            await logAudit('reviews', 'update', { id: _editingId, name });
            window.notifyContentChange?.('reviews', { action: 'update', id: _editingId });
            showToastSafe('success', 'Review updated successfully.');
          } else {
            const { error } = await db.from(TABLE_NAME)
              .insert(payload);
            if (error) throw error;
            await logAudit('reviews', 'create', { name });
            window.notifyContentChange?.('reviews', { action: 'create' });
            showToastSafe('success', 'Review added successfully.');
          }

          closeModal();
          await loadReviews();
        } catch (err) {
          console.error('[reviews] save error', err);
          showToastSafe('error', err.message || 'Could not save review.');
        }
      },
      onDelete: isEdit ? async function () {
        if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
          await deleteReviewItem(_editingId);
          closeModal();
          await loadReviews();
        }
      } : null,
    });

    setTimeout(() => {
      // Set up rating picker events
      const picker = document.getElementById('review-rating-picker');
      const hidden = document.getElementById('review-rating');
      if (picker && hidden) {
        picker.querySelectorAll('.review-rating-star').forEach((button) => {
          button.addEventListener('click', () => {
            const value = String(button.getAttribute('data-rating') || '0');
            hidden.value = value;
            picker.querySelectorAll('.review-rating-star').forEach((item) => {
              const selected = item === button;
              item.classList.toggle('selected', selected);
              item.setAttribute('aria-checked', selected ? 'true' : 'false');
            });
          });
        });
      }

      // Set up image file change listeners
      const avatarFileEl = document.getElementById('review-avatar-file');
      const avatarPreviewEl = document.getElementById('avatar-image-preview');
      if (avatarFileEl && avatarPreviewEl) {
        avatarFileEl.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              const compressed = await compressImage(file);
              avatarPreviewEl.src = compressed;
              avatarPreviewEl.style.display = 'inline-block';
              avatarPreviewEl.classList.add('active');
              // Unselect preset avatars
              document.querySelectorAll('.rating-avatar').forEach(label => label.classList.remove('selected'));
              document.querySelectorAll('input[name="review-avatar"]').forEach(input => input.checked = false);
            } catch (err) {
              console.warn('Failed to compress avatar image', err);
            }
          }
        });
      }

      const workFileEl = document.getElementById('review-work-image');
      const workPreviewEl = document.getElementById('work-image-preview');
      if (workFileEl && workPreviewEl) {
        workFileEl.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              const compressed = await compressImage(file);
              workPreviewEl.src = compressed;
              workPreviewEl.style.display = 'inline-block';
              workPreviewEl.classList.add('active');
            } catch (err) {
              console.warn('Failed to compress work image', err);
            }
          }
        });
      }

      // Add avatar radio click handlers
      document.querySelectorAll('input[name="review-avatar"]').forEach(input => {
        input.addEventListener('change', () => {
          document.querySelectorAll('.rating-avatar').forEach(label => {
            label.classList.toggle('selected', label.querySelector('input') === input);
          });
          if (avatarFileEl) avatarFileEl.value = '';
          if (avatarPreviewEl) {
            avatarPreviewEl.classList.remove('active');
            avatarPreviewEl.style.display = 'none';
            avatarPreviewEl.src = '';
          }
        });
      });
    }, 0);
  }

  async function deleteReviewItem(id) {
    if (!id || !window.confirm('Delete this review?')) return;

    try {
      const db = getDb();
      if (!db) throw new Error('Database client not available');

      const { error } = await db.from(TABLE_NAME).delete().eq('id', id);
      if (error) throw error;

      await logAudit('reviews', 'delete', { id });
      window.notifyContentChange?.('reviews', { action: 'delete', id });
      showToastSafe('success', 'Review deleted successfully.');
      await loadReviews();
    } catch (err) {
      console.error('[reviews] delete error', err);
      showToastSafe('error', err.message || 'Could not delete review.');
    }
  }

  async function handleGenerateAiReply(review) {
    const parsed = parseReviewText(review.review_text);
    const reviewText = parsed.text;
    const name = review.name;

    showToastSafe('info', 'Generating AI reply...');

    try {
      const mlApiUrl = window.appConfig.ML_REPLY_FUNCTION_URL;

      const response = await fetch(mlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          review: reviewText,
          customer_name: name
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();

      openModal({
        title: 'AI Generated Reply',
        confirmLabel: 'Save Response',
        bodyHTML: `
          <div style="margin-bottom: 1.2rem;">
            <p style="margin-bottom: 0.4rem;"><strong>Sentiment:</strong> <span class="badge" style="background: rgba(184, 147, 58, 0.1); color: var(--gold); padding: 2px 8px; border-radius: 12px; font-weight: 500;">${escHtml(res.sentiment.toUpperCase())}</span></p>
            <p><strong>Confidence:</strong> ${(res.sentiment_confidence * 100).toFixed(1)}%</p>
          </div>
          <div class="form-group full">
            <label class="form-label" for="ai-reply-text">Suggested Response</label>
            <textarea class="form-input" id="ai-reply-text" rows="8" style="font-family: inherit; font-size: 0.9rem; line-height: 1.5; width: 100%; border: 1px solid #d8cfbf; border-radius: 8px; padding: 0.6rem 0.85rem;">${escHtml(res.reply)}</textarea>
          </div>
        `,
        onConfirm: async function() {
          const replyVal = document.getElementById('ai-reply-text')?.value.trim() || '';
          if (!replyVal) {
            showToastSafe('error', 'Reply text cannot be empty.');
            return;
          }
          try {
            const db = getDb();
            const { error } = await db.from(TABLE_NAME)
              .update({ reply_text: replyVal })
              .eq('id', review.id);

            if (error) throw error;
            showToastSafe('success', 'Reply response saved successfully.');
            loadReviews(); // Reload the table
            closeModal();
          } catch (e) {
            console.error('[reviews] Failed to save AI response:', e);
            showToastSafe('error', 'Failed to save response.');
          }
        }
      });
    } catch (err) {
      console.error('[reviews] AI generation failed:', err);
      showToastSafe('error', 'Failed to generate AI reply. Make sure the ML service is running.');
    }
  }

  async function handleReviewAction(event) {
    const editBtn = event.target.closest('.btn-edit-review');
    const deleteBtn = event.target.closest('.btn-delete-review');
    const toggleBtn = event.target.closest('.btn-toggle-approval');
    const aiBtn = event.target.closest('.btn-ai-reply');

    if (aiBtn) {
      const id = aiBtn.dataset.id;
      const review = _reviews.find((item) => String(item.id) === String(id));
      if (review) await handleGenerateAiReply(review);
      return;
    }

    if (editBtn) {
      const id = editBtn.dataset.id;
      const review = _reviews.find((item) => String(item.id) === String(id));
      if (review) openReviewModal(true, review);
      return;
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      await deleteReviewItem(id);
      return;
    }

    if (toggleBtn) {
      const id = toggleBtn.dataset.id;
      await toggleReviewApproval(id);
    }
  }

  async function toggleReviewApproval(id) {
    if (!id) return;

    const review = _reviews.find((item) => String(item.id) === String(id));
    if (!review) return;

    try {
      const db = getDb();
      if (!db) throw new Error('Database client not available');

      const newStatus = !review.is_approved;
      const { error } = await db.from(TABLE_NAME).update({ is_approved: newStatus }).eq('id', id);
      if (error) throw error;

      review.is_approved = newStatus;
      renderReviewTable(_reviews);
      await logAudit('reviews', 'toggle_approval', { id, is_approved: newStatus });
      window.notifyContentChange?.('reviews', { action: 'toggle_approval', id });
      showToastSafe('success', `Review ${newStatus ? 'approved' : 'marked pending'}.`);
    } catch (err) {
      console.error('[reviews] approval toggle error', err);
      showToastSafe('error', err.message || 'Could not change approval status.');
    }
  }

  async function loadReviews() {
    try {
      _reviews = await fetchReviews();
      renderReviewTable(_reviews);
    } catch (err) {
      if (isMissingTableError(err)) {
        if (!_schemaWarningShown) {
          showToastSafe('warning', 'Reviews table is missing in database. Showing an empty list until the schema is applied.');
          _schemaWarningShown = true;
        }
        _reviews = [];
        renderReviewTable(_reviews);
        return;
      }

      console.error('[reviews] load error', err);
      showToastSafe('error', 'Unable to load reviews.');
    }
  }

  let _isInitialized = false;

  function initAdminReviewSection() {
    const section = document.getElementById(ADMIN_SECTION_ID);
    if (!section) return;
    if (_isInitialized) {
      loadReviews();
      return;
    }
    _isInitialized = true;

    const addButton = document.getElementById('btn-add-review');
    const tbody = document.getElementById('reviews-table-body');
    const searchInput = document.getElementById('reviews-search');

    if (addButton) {
      addButton.addEventListener('click', () => openReviewModal(false));
    }
    if (tbody) {
      tbody.addEventListener('click', handleReviewAction);
    }
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(_searchTimer);
        _searchTimer = setTimeout(() => filterReviews(searchInput.value), 180);
      });
    }

    loadReviews();
  }

  window.initReviews = initAdminReviewSection;

  document.addEventListener('DOMContentLoaded', function () {
    initAdminReviewSection();
  });
})();
