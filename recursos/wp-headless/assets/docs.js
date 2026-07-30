/* WP Headless Mode — Docs JS */
(function () {
  'use strict';

  // ── Active sidebar link on scroll ────────────────────────────────────────────
  const headings = document.querySelectorAll('h2[id], h3[id]');
  const links    = document.querySelectorAll('.sidebar a');

  if (headings.length && links.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.sidebar a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-15% 0px -75% 0px' });

    headings.forEach(h => observer.observe(h));
  }

  // ── Framework tabs ───────────────────────────────────────────────────────────
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const container = btn.closest('.tab-container');

        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        container.querySelector(`.tab-panel[data-tab="${target}"]`).classList.add('active');
      });
    });
  });

})();
