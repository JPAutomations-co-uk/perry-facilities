/* ═══════════════════════════════════════════════
   Apex FM — Shared JavaScript
   Runs on every page
   ══════════════════════════════════════════════ */

/* ── Scroll progress bar ── */
(function () {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }, { passive: true });
})();

/* ── Nav: scroll state ── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* ── Nav: mobile toggle ── */
(function () {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });
  window.closeMobile = function () {
    toggle.classList.remove('open');
    menu.classList.remove('open');
  };
})();

/* ── Reveal on scroll ── */
(function () {
  const ro = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
})();

/* ── Counter animation ── */
(function () {
  function animCount(el, target, suffix, dur = 1800) {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(e * target) + (p < 1 ? '' : suffix);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const co = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target, +e.target.dataset.count, e.target.dataset.suffix || '');
        co.unobserve(e.target);
      }
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));
})();

/* ── Card tilt effect ── */
(function () {
  document.querySelectorAll('.tiltable').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      c.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(4px)`;
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });
})();

/* ── Smooth anchor scroll ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });
})();

/* ── Extended reveal: left / right / scale variants ── */
(function () {
  const rx = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); rx.unobserve(e.target); }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale').forEach(el => rx.observe(el));
})();

/* ── Section title: line-by-line reveal ── */
(function () {
  document.querySelectorAll('.section-title').forEach(el => {
    const raw = el.innerHTML;
    const lines = raw.split(/<br\s*\/?>/i);
    if (lines.length < 2) return;
    el.innerHTML = lines
      .map(l => `<span class="title-line"><span class="title-line-inner">${l}</span></span>`)
      .join('');
    el.classList.add('title-animate');
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
  });
})();

/* ── Custom cursor (desktop only) ── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (!document.getElementById('cursor-dot')) {
    const dot  = document.createElement('div'); dot.id  = 'cursor-dot';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    document.body.append(dot, ring);
  }
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

  document.querySelectorAll('a, button, [role="button"], .tiltable').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  });

  (function tick() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();
})();

/* ── Magnetic buttons ── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.20;
      const y = (e.clientY - r.top  - r.height / 2) * 0.20;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 560);
    });
  });
})();

/* ── Parallax backgrounds ── */
(function () {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  function update() {
    els.forEach(el => {
      const parent = el.parentElement;
      const rect   = parent.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * 0.18}px) scale(1.12)`;
    });
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
})();
