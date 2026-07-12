'use strict';

(function () {
  const TABLE_NAME = 'faqs';

  function getDb() {
    return window.db || null;
  }

  function shouldBypassRemoteData() {
    return typeof window.shouldBypassRemoteData === 'function' && window.shouldBypassRemoteData();
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
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

  function isMissingTableError(err) {
    const message = String(err?.message || err?.details || err || '').toLowerCase();
    return message.includes('could not find the table') ||
      message.includes('schema cache') ||
      message.includes('does not exist');
  }

  function createFaqSection() {
    const section = document.createElement('section');
    section.id = 'faq-section';
    section.className = 'faq-section';
    section.innerHTML = `
      <!-- Ambient background blobs -->
      <div class="faq-blob faq-blob--1" aria-hidden="true"></div>
      <div class="faq-blob faq-blob--2" aria-hidden="true"></div>
      <div class="faq-blob faq-blob--3" aria-hidden="true"></div>

      <!-- Botanical line-art SVG decorations -->
      <svg class="faq-botanical faq-botanical--tl" aria-hidden="true" viewBox="0 0 200 200" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M30 170C30 170 50 120 90 100C130 80 170 90 170 90" stroke="currentColor" stroke-width="0.8"
          opacity="0.08" />
        <path d="M40 180C40 180 70 110 120 95C150 85 180 100 180 100" stroke="currentColor" stroke-width="0.5"
          opacity="0.06" />
        <circle cx="90" cy="100" r="3" fill="currentColor" opacity="0.06" />
        <circle cx="120" cy="95" r="2" fill="currentColor" opacity="0.05" />
        <path d="M80 105C80 105 85 80 95 70C105 60 115 65 115 65" stroke="currentColor" stroke-width="0.5"
          opacity="0.05" />
      </svg>
      <svg class="faq-botanical faq-botanical--br" aria-hidden="true" viewBox="0 0 200 200" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M170 30C170 30 150 80 110 100C70 120 30 110 30 110" stroke="currentColor" stroke-width="0.8"
          opacity="0.08" />
        <path d="M160 20C160 20 130 90 80 105C50 115 20 100 20 100" stroke="currentColor" stroke-width="0.5"
          opacity="0.06" />
        <ellipse cx="110" cy="100" rx="4" ry="6" fill="currentColor" opacity="0.04" />
      </svg>

      <!-- Section Header -->
      <div class="faq-header reveal">
        <span class="faq-label">FAQ</span>
        <h2 class="faq-title">Frequently Asked Questions</h2>
        <p class="faq-subtitle">Everything you need to know about our mural process, pricing, timelines, materials, and artistic approach.</p>
        <div class="faq-divider" aria-hidden="true"></div>
      </div>

      <!-- Two Column Layout -->
      <div class="faq-layout">
        <!-- LEFT: Info Card (35%) -->
        <div class="faq-info-card reveal">
          <div class="faq-info-card__inner">
            <!-- Decorative mini artwork -->
            <div class="faq-info-art">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="10" y="10" width="100" height="100" rx="16" fill="rgba(184,147,58,0.06)"
                  stroke="rgba(184,147,58,0.15)" stroke-width="0.5" />
                <circle cx="45" cy="50" r="12" fill="rgba(184,147,58,0.1)" />
                <circle cx="75" cy="65" r="8" fill="rgba(139,74,47,0.08)" />
                <path d="M25 85 Q40 55 60 70 Q80 85 95 60" stroke="rgba(184,147,58,0.2)" stroke-width="1" fill="none" />
                <path d="M30 90 Q50 65 70 78 Q90 90 100 72" stroke="rgba(107,124,107,0.15)" stroke-width="0.8"
                  fill="none" />
                <circle cx="45" cy="50" r="4" fill="rgba(184,147,58,0.15)" />
              </svg>
            </div>
            <!-- Decorative vase -->
            <div class="faq-info-vase" aria-hidden="true">
              <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 15 Q20 15 18 20 Q14 30 16 45 Q18 60 22 65 L38 65 Q42 60 44 45 Q46 30 42 20 Q40 15 38 15 Z"
                  fill="rgba(184,147,58,0.08)" stroke="rgba(184,147,58,0.18)" stroke-width="0.6" />
                <ellipse cx="30" cy="15" rx="9" ry="3" fill="rgba(184,147,58,0.06)" stroke="rgba(184,147,58,0.15)"
                  stroke-width="0.5" />
                <path d="M26 10 Q28 2 30 0 Q32 2 34 10" stroke="rgba(107,124,107,0.2)" stroke-width="0.6" fill="none" />
                <path d="M24 12 Q27 5 30 3" stroke="rgba(107,124,107,0.15)" stroke-width="0.4" fill="none" />
                <line x1="20" y1="65" x2="40" y2="65" stroke="rgba(184,147,58,0.12)" stroke-width="0.5" />
              </svg>
            </div>
            <h3 class="faq-info-heading">Have Questions?<br><span>We Have Answers.</span></h3>
            <p class="faq-info-desc">Our team is always ready to guide you through the creative process — from first concept to final brushstroke.</p>
            <a href="#contact-section" class="faq-info-cta">
              Contact Us <span class="faq-cta-arrow">→</span>
            </a>
          </div>
        </div>

        <!-- RIGHT: FAQ Accordion (65%) -->
        <div class="faq-accordion" id="faq-accordion"></div>
      </div>

      <!-- Bottom CTA -->
      <div class="faq-bottom-cta reveal">
        <div class="faq-bottom-cta__card">
          <h3 class="faq-bottom-cta__title">Still have questions?</h3>
          <p class="faq-bottom-cta__desc">Our team is here to help you create your dream mural. Let's start a conversation.</p>
          <a href="#contact-section" class="faq-bottom-cta__btn">
            Book a Consultation <span class="faq-cta-arrow">→</span>
          </a>
        </div>
      </div>
    `;
    return section;
  }

  function attachFaqAccordionListeners(container) {
    if (!container) return;
    container.querySelectorAll('.faq-question').forEach((questionEl) => {
      questionEl.setAttribute('role', 'button');
      questionEl.setAttribute('tabindex', '0');
      questionEl.setAttribute('aria-expanded', 'false');

      const toggleItem = () => {
        const item = questionEl.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('is-open');
        const answer = item.querySelector('.faq-answer');

        // Close all other items first
        container.querySelectorAll('.faq-item.is-open').forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            const otherQuestion = otherItem.querySelector('.faq-question');
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('is-open');
          questionEl.setAttribute('aria-expanded', 'false');
          if (answer) answer.style.maxHeight = '0';
        } else {
          item.classList.add('is-open');
          questionEl.setAttribute('aria-expanded', 'true');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      };

      questionEl.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleItem();
      });
      questionEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleItem();
        }
      });
    });
  }

  function restoreStaticFaqSection(section, originalHtml) {
    if (section && originalHtml !== null) {
      section.innerHTML = originalHtml;
    }

    const list = section?.querySelector('.faq-accordion') || section?.querySelector('.faq-list');
    if (list) {
      attachFaqAccordionListeners(list);
    }
  }

  async function renderFAQsToMainSite(dbClient) {
    let section = document.getElementById('faq-section');
    const originalHtml = section ? section.innerHTML : null;

    if (section) {
      const list = section.querySelector('.faq-accordion') || section.querySelector('.faq-list');
      if (list) {
        list.innerHTML = Array(4).fill(0).map(() => `
          <div class="skeleton-faq-item">
            <div class="skeleton-faq-text skeleton-shimmer"></div>
            <div class="skeleton-faq-icon skeleton-shimmer"></div>
          </div>
        `).join('');
      }
    }

    try {
      const db = dbClient || window.db;
      if (!db) {
        console.warn('[renderFAQsToMainSite] Database client not found.');
        restoreStaticFaqSection(section, originalHtml);
        return;
      }

      if (shouldBypassRemoteData()) {
        restoreStaticFaqSection(section, originalHtml);
        return;
      }

      const { data, error } = await db.from(TABLE_NAME)
        .select('id, question, answer')
        .order('display_order', { ascending: true });

      if (error) {
        if (!isMissingTableError(error)) {
          console.warn('[renderFAQsToMainSite] Fetch error:', error.message);
        }
        restoreStaticFaqSection(section, originalHtml);
        return;
      }

      const faqs = withFallbackPublicFaqs(data || []);
      if (!section) {
        section = createFaqSection();
        const footer = document.querySelector('footer');
        if (footer && footer.parentElement) {
          footer.parentElement.insertBefore(section, footer);
        } else {
          document.body.appendChild(section);
        }
      }

      const list = section.querySelector('.faq-accordion') || section.querySelector('.faq-list');
      if (!list) return;

      list.innerHTML = faqs.map((faq, index) => `
        <div class="faq-item reveal" style="transition-delay: ${0.05 * (index + 1)}s">
          <button type="button" class="faq-question" aria-expanded="false">
            <span class="faq-q-text">${escapeHtml(faq.question || '')}</span>
            <span class="faq-icon" aria-hidden="true"></span>
          </button>
          <div class="faq-answer">
            <div class="faq-answer__inner">
              <p>${faq.answer || ''}</p>
            </div>
          </div>
        </div>
      `).join('');

      attachFaqAccordionListeners(list);
      if (window.revealObserver) {
        const header = section.querySelector('.faq-header');
        if (header) window.revealObserver.observe(header);
        const accordion = section.querySelector('.faq-accordion') || section.querySelector('.faq-list');
        if (accordion) window.revealObserver.observe(accordion);
      }
    } catch (err) {
      console.error('[renderFAQsToMainSite] error', err);
      restoreStaticFaqSection(section, originalHtml);
    }
  }

  window.renderFAQsToMainSite = renderFAQsToMainSite;
})();
