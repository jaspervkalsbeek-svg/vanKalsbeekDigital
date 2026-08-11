// Van Kalsbeek Digital — mobile menu, theme toggle, footer year,
// scroll reveal and active-nav highlighting.
(function () {
  'use strict';

  // Mark that JS runs, so reveal animations start hidden (CSS: html.js .reveal).
  document.documentElement.classList.add('js');

  // Mobile menu
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Menu openen');
      }
    });
  }

  // Theme toggle: manual switch, choice persisted in localStorage.
  var themeToggle = document.getElementById('theme-toggle');
  function updateThemeButton() {
    if (!themeToggle) return;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', dark ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus');
  }
  if (themeToggle) {
    updateThemeButton();
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('vkd-theme', next); } catch (e) {}
      updateThemeButton();
    });
  }

  // Footer year
  var yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Highlight the active nav link while scrolling
  if (nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    var sections = links
      .map(function (link) {
        var target = link.getAttribute('href');
        if (!target || target.charAt(0) !== '#') return null;
        return document.querySelector(target);
      })
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (section) { spy.observe(section); });
    }
  }
})();
