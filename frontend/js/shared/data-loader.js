'use strict';

(function () {
  const CONTACT_FORM_ID = 'contact-section-form';
  const CONTACT_BUTTON_ID = 'btn-contact-submit';
  const STATUS_MESSAGE_ID = 'contact-status-message';

  function createStatusNode() {
    const status = document.createElement('div');
    status.id = STATUS_MESSAGE_ID;
    status.setAttribute('aria-live', 'polite');
    status.style.marginTop = '1rem';
    status.style.fontSize = '0.95rem';
    status.style.fontWeight = '500';
    status.style.lineHeight = '1.4';
    return status;
  }

  function getStatusNode() {
    return null;
  }

  function setStatusMessage(message, type = 'info') {
    // No-op: Toasts disabled
  }

  function clearStatusMessage() {
    // No-op: Toasts disabled
  }

  function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function toggleSubmitButton(disabled) {
    const button = document.getElementById(CONTACT_BUTTON_ID);
    if (!button) return;
    button.disabled = disabled;
    button.style.opacity = disabled ? '0.65' : '';
    button.style.cursor = disabled ? 'not-allowed' : 'pointer';
    button.textContent = disabled ? 'Sending...' : 'Send Message';
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    clearStatusMessage();

    const firstName = getInputValue('contact-first-name');
    const lastName = getInputValue('contact-last-name');
    const email = getInputValue('contact-email');
    const phone = getInputValue('contact-phone');
    const projectType = getInputValue('contact-project-type') || 'General';
    const message = getInputValue('contact-message');

    toggleSubmitButton(true);
    setStatusMessage('Sending message...', 'info');

    try {
      if (!window.db) {
        throw new Error('Database client is not available.');
      }

      const { error } = await window.db.from('inquiries').insert({
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone: phone || null,
        message: [projectType ? `Project type: ${projectType}` : '', message].filter(Boolean).join('\n\n'),
        status: 'new',
        created_at: new Date().toISOString()
      });

      if (error) {
        throw error;
      }

      window.notifyContentChange?.('inquiry', { source: 'contact-form' });

      const form = document.getElementById(CONTACT_FORM_ID);
      if (form) form.reset();

      const formContainer = document.getElementById('contact-form-container');
      const successState = document.getElementById('contact-success-state');
      if (formContainer && successState) {
        formContainer.style.display = 'none';
        successState.style.display = 'flex';
      } else {
        setStatusMessage('Thank you! Your message has been sent successfully.', 'success');
      }
    } catch (err) {
      console.warn('[data-loader] inquiry submission failed, falling back to mailto:', err);
      try {
        const subject = encodeURIComponent(`Website enquiry from ${firstName} ${lastName}`);
        const body = encodeURIComponent([
          `Name: ${firstName} ${lastName}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : '',
          projectType ? `Project type: ${projectType}` : '',
          '',
          message,
        ].filter(Boolean).join('\n'));

        setStatusMessage('Opening your email app so you can send the message directly.', 'success');
        const mailtoUrl = `mailto:ashmijaincolor@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
        const form = document.getElementById(CONTACT_FORM_ID);
        if (form) form.reset();

        const formContainer = document.getElementById('contact-form-container');
        const successState = document.getElementById('contact-success-state');
        if (formContainer && successState) {
          formContainer.style.display = 'none';
          successState.style.display = 'flex';
        } else {
          setStatusMessage('Opening your email app so you can send the message directly.', 'success');
        }
      } catch (fallbackErr) {
        setStatusMessage('Please use the email link below to contact us directly.', 'error');
      }
    } finally {
      toggleSubmitButton(false);
    }
  }

  function attachContactFormHandler() {
    const form = document.getElementById(CONTACT_FORM_ID);
    if (!form) return;
    form.addEventListener('submit', handleContactSubmit);
  }



  async function loadAllSections() {
    const optionalRenderers = [
      { name: 'renderPortfolioToMainSite', fn: window.renderPortfolioToMainSite },
      { name: 'renderArtistsToMainSite', fn: window.renderArtistsToMainSite },
      { name: 'renderConfigToMainSite', fn: window.renderConfigToMainSite },
      { name: 'renderFAQsToMainSite', fn: window.renderFAQsToMainSite },
    ];

    const availableRenders = optionalRenderers.filter((entry) => typeof entry.fn === 'function');
    if (availableRenders.length === 0) {
      return Promise.resolve();
    }

    await Promise.all(availableRenders.map(async (entry) => {
      try {
        await entry.fn();
      } catch (err) {
        console.warn(`[data-loader] ${entry.name} failed`, err);
      }
    }));
  }

  window.loadAllSections = loadAllSections;

  function bindContentSyncListeners() {
    const refreshSections = () => {
      loadAllSections().catch((err) => {
        console.warn('[data-loader] loadAllSections failed', err);
      });
    };

    window.addEventListener('storage', (event) => {
      if (event.key === 'ashmija_content_sync') {
        refreshSections();
      }
    });

    window.addEventListener('ashmija:content-sync', refreshSections);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        refreshSections();
      }
    });
  }

  function initDataLoader() {
    attachContactFormHandler();
    bindContentSyncListeners();
    loadAllSections().catch((err) => {
      console.warn('[data-loader] loadAllSections failed', err);
    });
  }

  document.addEventListener('DOMContentLoaded', initDataLoader);
})();
