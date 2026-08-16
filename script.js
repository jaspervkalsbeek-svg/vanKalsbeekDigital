// Van Kalsbeek Digital — cookie consent, analytics, mobile menu,
// theme toggle, footer year, scroll reveal and active-nav highlighting.
(function () {
  'use strict';

  // Cookie consent & analytics. GA_ID is empty until a Google Analytics
  // measurement ID is provided per project; no tracking runs without consent.
  var COOKIE_KEY = 'vkd-cookie-consent';
  var GA_ID = '';

  function loadGA() {
    if (!GA_ID || document.getElementById('ga-script')) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.id = 'ga-script';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  var cookieBanner = document.getElementById('cookie-banner');
  var cookieConsent = null;
  try { cookieConsent = localStorage.getItem(COOKIE_KEY); } catch (e) {}

  if (cookieConsent === 'accepted') {
    loadGA();
  } else if (!cookieConsent && cookieBanner) {
    cookieBanner.style.display = 'flex';
  }

  if (cookieBanner) {
    document.getElementById('cookie-accept').addEventListener('click', function () {
      try { localStorage.setItem(COOKIE_KEY, 'accepted'); } catch (e) {}
      window.location.reload();
    });
    document.getElementById('cookie-reject').addEventListener('click', function () {
      try { localStorage.setItem(COOKIE_KEY, 'rejected'); } catch (e) {}
      window.location.reload();
    });
  }
  var cookieSettingsBtn = document.getElementById('cookie-settings');
  if (cookieSettingsBtn) {
    cookieSettingsBtn.addEventListener('click', function () {
      if (cookieBanner) cookieBanner.style.display = 'flex';
    });
  }

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

  // Hero headline rotation. Skipped when the user prefers reduced motion.
  var heroTitle = document.getElementById('hero-title');
  if (heroTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var headlines = [
      'Uw website werkt <em>voor u</em>, terwijl u onderneemt',
      'Drie gratis concepten <em>binnen twee dagen</em>',
      'Uw zaak professioneel online, <em>zonder gedoe</em>'
    ];
    var headlineIndex = 0;
    window.setInterval(function () {
      heroTitle.classList.add('is-hidden');
      window.setTimeout(function () {
        headlineIndex = (headlineIndex + 1) % headlines.length;
        heroTitle.innerHTML = headlines[headlineIndex];
        heroTitle.classList.remove('is-hidden');
      }, 300);
    }, 5000);
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
