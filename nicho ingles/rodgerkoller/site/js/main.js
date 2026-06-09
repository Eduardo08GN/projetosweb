(() => {
  'use strict';

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll Animations
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // Smooth Scroll
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile menu if open
      const overlay = document.querySelector('.nav-overlay');
      if (overlay && overlay.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // Navbar Scroll Effect
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile Menu
  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const close = document.querySelector('.nav-close');
    const overlay = document.querySelector('.nav-overlay');

    if (!toggle || !overlay) return;

    toggle.addEventListener('click', openMobileMenu);
    if (close) close.addEventListener('click', closeMobileMenu);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMobileMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    const overlay = document.querySelector('.nav-overlay');
    const toggle = document.querySelector('.nav-toggle');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    const overlay = document.querySelector('.nav-overlay');
    const toggle = document.querySelector('.nav-toggle');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Active Section Highlight
  function initActiveSection() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  // Counter Animation (generic — works for hero stats and credential cards)
  function initCounters() {
    const allCounters = document.querySelectorAll('[data-target]');
    if (!allCounters.length) return;

    if (prefersReducedMotion) {
      allCounters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        counter.textContent = formatNumber(target);
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll
            ? [entry.target]
            : [];
          if (entry.target.dataset.target) {
            animateCounter(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    allCounters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * target);

      el.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatNumber(target);
      }
    }

    requestAnimationFrame(update);
  }

  function formatNumber(n) {
    const prefix = n > 100 ? '+' : '';
    const formatted = n.toLocaleString('pt-BR');
    return prefix + formatted;
  }

  // Timeline Scroll-Driven Line Fill
  function initTimeline() {
    const timelineLine = document.querySelector('.timeline-line');
    const timelineSection = document.querySelector('.timeline');

    if (!timelineLine || !timelineSection || prefersReducedMotion) {
      if (timelineLine) timelineLine.style.transform = 'scaleY(1)';
      return;
    }

    const updateTimeline = () => {
      const rect = timelineSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      const progress = Math.min(
        Math.max((windowHeight - sectionTop) / (sectionHeight + windowHeight * 0.5), 0),
        1
      );

      timelineLine.style.transform = `scaleY(${progress})`;
    };

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
  }

  // FAQ Accordion (one open at a time)
  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          faqItems.forEach(other => {
            if (other !== item && other.open) {
              other.removeAttribute('open');
            }
          });
        }
      });
    });
  }

  // Contact Form → WhatsApp
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const level = form.querySelector('#level').value;

      if (!name || !email || !level) return;

      const message = encodeURIComponent(
        `Oi Rodger! Meu nome e ${name}.\n` +
        `Email: ${email}\n` +
        `Nivel: ${level}\n\n` +
        `Vi seu site e quero saber mais sobre as aulas.`
      );

      const whatsappURL = `https://wa.me/5511999999999?text=${message}`;
      const btn = form.querySelector('.form-submit');
      const submitText = btn.querySelector('.submit-text');

      btn.classList.add('is-loading');

      setTimeout(() => {
        window.open(whatsappURL, '_blank');
        btn.classList.remove('is-loading');
        submitText.textContent = 'Enviado!';

        setTimeout(() => {
          submitText.textContent = 'Falar com Rodger';
        }, 3000);
      }, 600);
    });
  }

  // WhatsApp Button Delayed Entrance
  function initWhatsApp() {
    const btn = document.querySelector('.whatsapp-float');
    if (!btn) return;

    btn.style.transform = 'scale(0)';
    btn.style.opacity = '0';

    setTimeout(() => {
      btn.style.transition = 'transform 400ms cubic-bezier(0.34,1.56,0.64,1), opacity 300ms, box-shadow 200ms';
      btn.style.transform = 'scale(1)';
      btn.style.opacity = '1';
    }, 3000);
  }

  // Exit Intent (Desktop Only)
  function initExitIntent() {
    const overlay = document.getElementById('exit-intent');
    if (!overlay || window.innerWidth <= 768) return;

    let shown = sessionStorage.getItem('exitShown') === 'true';

    const closeExit = () => overlay.setAttribute('hidden', '');

    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 0 && !shown) {
        shown = true;
        overlay.removeAttribute('hidden');
        sessionStorage.setItem('exitShown', 'true');
      }
    });

    overlay.querySelector('.exit-close').addEventListener('click', closeExit);
    overlay.querySelector('.exit-intent-backdrop').addEventListener('click', closeExit);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) {
        closeExit();
      }
    });

    const exitForm = document.getElementById('exit-form');
    if (exitForm) {
      exitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = exitForm.querySelector('input').value.trim();
        if (!email) return;

        const message = encodeURIComponent(
          `Oi Rodger! Quero o ebook das 7 tecnicas.\nMeu email: ${email}`
        );
        window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
        closeExit();
      });
    }
  }

  function initTestimonials() {
    var cards = document.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    if (prefersReducedMotion) {
      cards.forEach(function (c) { c.classList.add('is-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(function (c) { obs.observe(c); });
  }

  // Video Showcase — Scroll-driven expansion + backlight
  function initVideoExpansion() {
    const wrapper = document.querySelector('[data-video-expand]');
    if (!wrapper) return;

    const frame = wrapper.querySelector('.video-frame');
    if (!frame) return;

    if (prefersReducedMotion) {
      wrapper.style.setProperty('--video-scale', '1');
      wrapper.style.setProperty('--video-opacity', '1');
      wrapper.style.setProperty('--backlight-opacity', '0.8');
      wrapper.style.setProperty('--video-radius', '12px');
      return;
    }

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const progress = Math.min(Math.max(1 - (center - vh * 0.5) / (vh * 0.6), 0), 1);

      const scale = 0.82 + progress * 0.18;
      const opacity = 0.5 + progress * 0.5;
      const backlight = 0.3 + progress * 0.7;
      const radius = 20 - progress * 12;

      wrapper.style.setProperty('--video-scale', scale.toFixed(3));
      wrapper.style.setProperty('--video-opacity', opacity.toFixed(3));
      wrapper.style.setProperty('--backlight-opacity', backlight.toFixed(3));
      wrapper.style.setProperty('--video-radius', radius.toFixed(1) + 'px');
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  // Video Facade — load iframe on click
  function initVideoFacade() {
    const facades = document.querySelectorAll('.video-facade[data-video-src]');
    facades.forEach(facade => {
      const activate = () => {
        const src = facade.dataset.videoSrc;
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.title = 'Rodger Koller falando sobre suas aulas';
        iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:inherit;';
        facade.textContent = '';
        facade.appendChild(iframe);
        facade.classList.remove('video-facade');
        facade.removeAttribute('role');
        facade.removeAttribute('tabindex');
        facade.style.cursor = '';
      };
      facade.addEventListener('click', activate, { once: true });
      facade.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } }, { once: true });
    });
  }

  // Preloader
  function initPreloader() {
    window.addEventListener('load', () => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('done');
        setTimeout(() => preloader.remove(), 300);
      }
    });
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initSmoothScroll();
    initNavbar();
    initMobileMenu();
    initActiveSection();
    initCounters();
    initTimeline();
    initFaq();
    initContactForm();
    initWhatsApp();
    initExitIntent();
    initTestimonials();
    initVideoExpansion();
    initVideoFacade();
  });

  initPreloader();
})();
