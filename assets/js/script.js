/* ============================================================
   script.js — jjrc.dev
   - AOS initialization
   - Hero rotating phrases
   - Mobile nav toggle
   - Section title curtain reveal
   - Testimonials carousel
   - Theme toggle
   - Hero starfield warp (dark theme only)
============================================================ */

// ============================================================
// 1. AOS — Animate On Scroll
// ============================================================
AOS.init({
  duration: 800,       // default duration (ms)
  easing: 'ease-out-cubic',
  once: true,          // animate only once per element
  offset: 60,          // trigger offset from viewport edge (px)
  delay: 0,
});


// ============================================================
// 2. Hero rotating phrases
//    Fades the current phrase out, swaps text, fades back in
// ============================================================
(function () {
  const phrases = [
    'Full Stack Developer',
    'Arquitecto de Software',
    'Integrador de Sistemas',
    'Dev con IA',
    'Backend & Frontend',
    'Freelance Internacional',
    'Ecommerce Specialist',
  ];

  const el = document.getElementById('rotatingPhrase');
  if (!el) return;

  let current = 0;

  // Start with first phrase already visible
  el.textContent = phrases[0];

  function rotatePhrases() {
    // Step 1: fade out
    el.classList.add('fade-out');
    el.classList.remove('fade-in');

    setTimeout(function () {
      // Step 2: advance to next phrase
      current = (current + 1) % phrases.length;
      el.textContent = phrases[current];

      // Step 3: fade in
      el.classList.remove('fade-out');
      el.classList.add('fade-in');
    }, 500); // matches CSS transition duration
  }

  // Rotate every 3.5 seconds
  setInterval(rotatePhrases, 3500);
})();


// ============================================================
// 3. Mobile nav toggle
// ============================================================
(function () {
  const toggle  = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


// ============================================================
// 4. Header shadow on scroll
// ============================================================
(function () {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });
})();


// ============================================================
// 5. Section title curtain reveal
//    Wraps each section/CTA title in a masked span and reveals
//    it with a translateY sweep the first time it scrolls in.
// ============================================================
(function () {
  var titles = document.querySelectorAll('.section__title, .cta__title');
  if (!titles.length) return;

  var masks = [];

  titles.forEach(function (title) {
    var mask = document.createElement('div');
    mask.className = 'reveal-mask';
    title.parentNode.insertBefore(mask, title);
    mask.appendChild(title);
    masks.push(mask);
  });

  if (!('IntersectionObserver' in window)) {
    masks.forEach(function (m) { m.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

  masks.forEach(function (m) { observer.observe(m); });
})();


// ============================================================
// 6. Testimonials carousel — 3 per view, tap/hover to expand
// ============================================================
(function () {
  var track    = document.getElementById('testiTrack');
  var dotsWrap = document.getElementById('testiDots');
  var prevBtn  = document.getElementById('testiPrev');
  var nextBtn  = document.getElementById('testiNext');
  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  var cards = Array.prototype.slice.call(track.children);
  var currentPage = 0;
  var resizeTimer;

  function perView() {
    var w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 980) return 2;
    return 3;
  }

  function totalPages() {
    return Math.max(1, Math.ceil(cards.length / perView()));
  }

  function renderDots(pages) {
    dotsWrap.innerHTML = '';
    for (var i = 0; i < pages; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testi-dot' + (i === currentPage ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Ir a la página ' + (i + 1) + ' de testimonios');
      dot.addEventListener('click', (function (idx) {
        return function () { goToPage(idx); };
      })(i));
      dotsWrap.appendChild(dot);
    }
  }

  function update() {
    var pages = totalPages();
    if (currentPage > pages - 1) currentPage = pages - 1;

    var pv = perView();
    var cardRect = cards[0].getBoundingClientRect();
    var gap = parseFloat(getComputedStyle(track).gap) || 0;
    var offset = currentPage * pv * (cardRect.width + gap);
    track.style.transform = 'translateX(-' + offset + 'px)';

    var singlePage = pages <= 1;
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= pages - 1;
    prevBtn.classList.toggle('is-hidden', singlePage);
    nextBtn.classList.toggle('is-hidden', singlePage);
    dotsWrap.classList.toggle('is-hidden', singlePage);

    renderDots(pages);
  }

  function goToPage(idx) {
    currentPage = Math.max(0, Math.min(idx, totalPages() - 1));
    update();
  }

  prevBtn.addEventListener('click', function () { goToPage(currentPage - 1); });
  nextBtn.addEventListener('click', function () { goToPage(currentPage + 1); });

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(update, 150);
  });

  update();

  // Expand / collapse full quote — works as the tap target on touch
  // devices, and as a keyboard-accessible fallback everywhere else.
  cards.forEach(function (card) {
    var toggle = card.querySelector('.testi-card__toggle');
    var label  = card.querySelector('.testi-card__toggle-label');
    if (!toggle || !label) return;

    toggle.addEventListener('click', function () {
      var expanded = card.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      label.textContent = expanded ? 'Leer menos' : 'Leer más';
    });
  });
})();


// ============================================================
// 7. Theme toggle
// ============================================================
(function () {
  const buttons = document.querySelectorAll('[data-theme-toggle]');
  if (!buttons.length) return;

  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('jjrc-theme', theme);

    buttons.forEach(function (button) {
      const isActive = button.getAttribute('data-theme-toggle') === theme;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  const initialTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  setTheme(initialTheme);

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const theme = button.getAttribute('data-theme-toggle');
      if (!theme) return;
      setTheme(theme);
    });
  });
})();


// ============================================================
// 8. Hero starfield warp — dark theme only
//    Idle starfield drifts behind the hero; hovering/focusing the
//    "Conversemos" CTA accelerates it into a warp burst. Adapted
//    from borrador/starfield-warp.html, scoped to the hero canvas
//    and gated on the live data-theme attribute.
// ============================================================
(function () {
  var canvas = document.getElementById('heroStars');
  var cta = document.getElementById('heroCta');
  if (!canvas) return;

  var ctx = canvas.getContext('2d', { alpha: false });
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CFG = {
    density: 1 / 1600,
    maxStars: 900,
    zNear: 0.06,
    zFar: 1,
    idleSpeed: 0.00022,
    warpSpeed: 0.055,
    accel: 0.055,
    decel: 0.022,
    parallax: 22,
    warpSaturation: 1.5,
  };

  // [hue, saturation%, weight] — tuned to lean toward the site's pink accent
  var PALETTE = [
    [220, 10, 40],
    [210, 75, 9],
    [265, 70, 7],
    [190, 70, 6],
    [340, 75, 7],
    [35, 70, 3],
  ];

  var TOTAL_WEIGHT = PALETTE.reduce(function (a, p) { return a + p[2]; }, 0);

  function pickColor() {
    var r = Math.random() * TOTAL_WEIGHT;
    for (var i = 0; i < PALETTE.length; i++) {
      r -= PALETTE[i][2];
      if (r <= 0) return PALETTE[i];
    }
    return PALETTE[0];
  }

  var w = 0, h = 0, cx = 0, cy = 0, dpr = 1;
  var stars = [];
  var speed = CFG.idleSpeed;
  var target = CFG.idleSpeed;
  var warp = 0;
  var px = 0, py = 0, tpx = 0, tpy = 0;
  var last = performance.now();
  var running = false;
  var rafId = null;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeStar(spread) {
    var picked = pickColor();
    return {
      x: rand(-1, 1),
      y: rand(-1, 1),
      z: spread ? rand(CFG.zNear, CFG.zFar) : rand(CFG.zFar * 0.92, CFG.zFar),
      ph: rand(0, Math.PI * 2),
      tw: rand(0.35, 1),
      hue: picked[0] + rand(-12, 12),
      sat: picked[1] * rand(0.8, 1.2),
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h / 2;
    var n = Math.min(CFG.maxStars, Math.round(w * h * CFG.density));
    stars = [];
    for (var i = 0; i < n; i++) stars.push(makeStar(true));
  }

  function projX(x, z, ox) { return cx + (x / z) * (w * 0.5) + ox * z; }
  function projY(y, z, oy) { return cy + (y / z) * (h * 0.5) + oy * z; }

  function frame(now) {
    if (!running) return;
    var dt = Math.min(now - last, 50) / 16.6667;
    last = now;

    var k = target > speed ? CFG.accel : CFG.decel;
    speed += (target - speed) * (1 - Math.pow(1 - k, dt));
    warp = Math.min(1, (speed - CFG.idleSpeed) / (CFG.warpSpeed - CFG.idleSpeed));

    px += (tpx - px) * 0.06 * dt;
    py += (tpy - py) * 0.06 * dt;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(35,29,30,' + (1 - 0.72 * warp) + ')';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    var step = speed * dt;
    var t = now * 0.001;

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var zPrev = s.z;
      s.z -= step;

      if (s.z <= CFG.zNear) {
        stars[i] = makeStar(false);
        continue;
      }

      var fx = s.x + Math.sin(t * 0.35 + s.ph) * 0.005;
      var fy = s.y + Math.cos(t * 0.28 + s.ph * 1.3) * 0.005;

      var sx = projX(fx, s.z, px);
      var sy = projY(fy, s.z, py);

      if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) {
        stars[i] = makeStar(false);
        continue;
      }

      var depth = 1 - s.z;
      var r = 0.35 + depth * depth * 1.9;
      var twinkle = 1 - s.tw * 0.45 * (0.5 + 0.5 * Math.sin(t * 1.6 + s.ph));
      var alpha = Math.min(1, (0.22 + depth * 0.85) * (warp > 0.02 ? 1 : twinkle));

      var sat = Math.min(100, s.sat * (0.45 + depth * 0.75) * (1 + warp * (CFG.warpSaturation - 1)));
      var light = 72 + depth * 16;
      var color = 'hsla(' + s.hue + ',' + sat + '%,' + light + '%,' + alpha + ')';

      if (warp > 0.02) {
        var lx = projX(fx, zPrev, px);
        var ly = projY(fy, zPrev, py);
        ctx.strokeStyle = color;
        ctx.lineWidth = r * 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduced) return;
    running = true;
    resize();
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function sync() {
    if (isDark()) start(); else stop();
  }

  var engage = function () { if (!reduced) target = CFG.warpSpeed; };
  var release = function () { target = CFG.idleSpeed; };

  if (cta) {
    cta.addEventListener('pointerenter', engage);
    cta.addEventListener('pointerleave', release);
    cta.addEventListener('focus', engage);
    cta.addEventListener('blur', release);
    cta.addEventListener('touchstart', engage, { passive: true });
    cta.addEventListener('touchend', release);
  }

  window.addEventListener('pointermove', function (e) {
    if (!running) return;
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    tpx = ((e.clientX - rect.left) / rect.width - 0.5) * CFG.parallax;
    tpy = ((e.clientY - rect.top) / rect.height - 0.5) * CFG.parallax;
  });

  window.addEventListener('resize', function () {
    if (running) resize();
  });

  new MutationObserver(sync).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  sync();
})();
