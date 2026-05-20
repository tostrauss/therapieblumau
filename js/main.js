// ============================================================
//  Therapiezentrum Blumau / Linz — Main JS
//  No frameworks, vanilla ES6+
// ============================================================

// ── Splash Screen (index only) ───────────────────────────────
const splash = document.getElementById('splash');
if (splash) {
  setTimeout(() => {
    splash.classList.add('splash--fade');
    splash.addEventListener('transitionend', () => splash.remove(), { once: true });
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Font Resizing ──────────────────────────────────────
  let scale = 1;
  const root = document.documentElement;

  window.adjustFontSize = (dir) => {
    if (dir === 0) { scale = 1; }
    else {
      scale += dir * 0.1;
      scale = Math.max(0.85, Math.min(1.5, scale));
    }
    root.style.setProperty('--font-scale', scale);
  };

  // ── 2. High Contrast ─────────────────────────────────────
  window.toggleContrast = () => {
    document.body.classList.toggle('high-contrast');
    const btn = document.getElementById('contrastBtn');
    if (!btn) return;
    const on = document.body.classList.contains('high-contrast');
    btn.setAttribute('aria-pressed', on);
    btn.textContent = on ? '⚫ Normal' : '👁 Kontrast';
  };

  // ── 3. Mobile Menu ────────────────────────────────────────
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const opening = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', opening);
      document.body.style.overflow = opening ? 'hidden' : '';
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // ── 4. Active Nav Link ────────────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('main-nav__link--active');
    }
  });

  // ── 5. Scroll Reveal (IntersectionObserver) ───────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    // Signal to CSS that JS is ready — only THEN hide .reveal elements
    document.body.classList.add('js-ready');

    // Small delay to let browser paint the hidden state before observing
    requestAnimationFrame(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

      reveals.forEach(el => observer.observe(el));
    });
  }
  // If no IntersectionObserver: body never gets .js-ready, so everything stays visible

  // ── 6. Auto-open <details> accordion when navigated via hash ─
  const openTargetAccordion = (hash) => {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target && target.tagName === 'DETAILS') {
      target.open = true;
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  };
  openTargetAccordion(window.location.hash);

  // ── 7. Smooth scroll for same-page anchors ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        if (target.tagName === 'DETAILS') target.open = true;
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── 8. Profile Modals ─────────────────────────────────────
  const closeModal = (backdrop) => {
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    const trigger = document.querySelector(`[data-modal="${backdrop.id}"]`);
    if (trigger) trigger.focus();
  };

  document.querySelectorAll('.profile-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modal);
      if (!modal) return;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      modal.querySelector('.profile-modal__close').focus();
    });
  });

  document.querySelectorAll('.profile-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
    backdrop.querySelector('.profile-modal__close').addEventListener('click', () => closeModal(backdrop));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.profile-modal-backdrop.is-open').forEach(closeModal);
    }
  });

});
