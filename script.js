/* ===========================
   TREATMENT MASTER — SCRIPT
   Based on Tritmentolog 2.0
   =========================== */

(function () {
  'use strict';

  /* ── Scroll Progress (fallback for browsers without scroll-timeline) ── */
  const progress = document.getElementById('progress');
  if (progress && !CSS.supports('animation-timeline', 'scroll()')) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${window.scrollY / h})`;
    }, { passive: true });
  }

  /* ── Header show/hide ── */
  const header = document.getElementById('site-header');
  let lastY = 0;
  const HEADER_THRESHOLD = 100;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > HEADER_THRESHOLD) {
      header.classList.toggle('visible', y < lastY || y < 300);
    } else {
      header.classList.remove('visible');
    }
    lastY = y;
  }, { passive: true });

  /* ── Burger menu ── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.classList.toggle('active');
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Reveal on scroll (IntersectionObserver) ── */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => revealObs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }



  /* ── Dot Navigation active state ── */
  const dots = document.querySelectorAll('.dot[data-section]');
  const sections = [];
  dots.forEach(dot => {
    const id = dot.getAttribute('data-section');
    const sec = document.getElementById(id);
    if (sec) sections.push({ dot, sec });
  });

  if (sections.length) {
    const dotObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          dots.forEach(d => d.classList.remove('active'));
          const match = sections.find(s => s.sec === e.target);
          if (match) match.dot.classList.add('active');
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });

    sections.forEach(s => dotObs.observe(s.sec));
  }

  /* ── Ambient Orbs follow cursor ── */
  const orbMain = document.getElementById('orb-main');
  if (orbMain && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let orbX = mouseX;
    let orbY = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateOrb() {
      orbX += (mouseX - orbX) * 0.02;
      orbY += (mouseY - orbY) * 0.02;
      orbMain.style.left = orbX + 'px';
      orbMain.style.top = orbY + 'px';
      requestAnimationFrame(animateOrb);
    }
    animateOrb();
  }



})();
