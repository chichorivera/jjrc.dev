/* ============================================================
   script.js — jjrc.dev
   - AOS initialization
   - Hero rotating phrases
   - Mobile nav toggle
   - Section title curtain reveal
   - Testimonials carousel
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
