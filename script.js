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

  // Tier toggle: switch between nieuwbouw and redesign cards
  var tierBtns = document.querySelectorAll('.tier-toggle-btn');
  var tierPanels = document.querySelectorAll('.tier-panel');
  tierBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tierBtns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      var target = btn.getAttribute('data-tier');
      tierPanels.forEach(function (panel) {
        panel.classList.toggle('active', panel.id === 'tier-' + target);
      });
    });
  });

  // Intake multi-step form
  (function () {
    var form = document.getElementById('intake-form');
    if (!form) return;
    var steps = form.querySelectorAll('.intake-step');
    var progressFill = document.getElementById('progress-fill');
    var progressSteps = document.querySelectorAll('.progress-step');
    var backBtn = document.getElementById('intake-back');
    var nextBtn = document.getElementById('intake-next');
    var submitBtn = document.getElementById('intake-submit');
    var fieldType = document.getElementById('field-type');
    var fieldPlan = document.getElementById('field-plan');
    var fieldStyle = document.getElementById('field-style');
    var fieldColor = document.getElementById('field-color');
    var summary = document.getElementById('intake-summary');
    var thanks = document.getElementById('intake-thanks');
    var detailNieuw = document.getElementById('detail-nieuw');
    var detailRedesign = document.getElementById('detail-redesign');
    var currentStep = 1;
    var totalSteps = 5;

    function updateUI() {
      steps.forEach(function (s) {
        s.classList.toggle('active', parseInt(s.getAttribute('data-step')) === currentStep);
      });
      progressSteps.forEach(function (ps) {
        var n = parseInt(ps.getAttribute('data-step'));
        ps.classList.remove('active', 'done');
        if (n === currentStep) ps.classList.add('active');
        else if (n < currentStep) ps.classList.add('done');
      });
      progressFill.style.width = ((currentStep / totalSteps) * 100) + '%';
      backBtn.hidden = currentStep === 1;
      nextBtn.hidden = currentStep === totalSteps;
      submitBtn.hidden = currentStep !== totalSteps;
      if (currentStep === totalSteps) validateGegevens();
    }

    function showDetailPanels() {
      var isNieuw = fieldType.value === 'Nieuwe website';
      detailNieuw.hidden = !isNieuw;
      detailRedesign.hidden = isNieuw;
    }

    function validateStep() {
      if (currentStep === 1 && !fieldType.value) return false;
      if (currentStep === 2 && !fieldPlan.value) return false;
      return true;
    }

    function buildSummary() {
      var tags = '';
      tags += '<span class="intake-summary-tag">' + fieldType.value + '</span>';
      tags += '<span class="intake-summary-tag">' + fieldPlan.value + '</span>';
      if (fieldStyle.value) tags += '<span class="intake-summary-tag">' + fieldStyle.value + '</span>';
      if (fieldColor.value) tags += '<span class="intake-summary-tag">' + fieldColor.value + '</span>';
      summary.innerHTML = tags;
    }

    // Stap 1: type-keuze
    var plansNieuw = document.getElementById('plans-nieuw');
    var plansRedesign = document.getElementById('plans-redesign');
    form.querySelectorAll('.intake-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        form.querySelectorAll('.intake-choice').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        fieldType.value = btn.getAttribute('data-value');
        var isNieuw = fieldType.value === 'Nieuwe website';
        plansNieuw.hidden = !isNieuw;
        plansRedesign.hidden = isNieuw;
        fieldPlan.value = '';
        form.querySelectorAll('.intake-plan').forEach(function (b) { b.classList.remove('selected'); });
      });
    });

    // Stap 2: plan-keuze (beide grids)
    form.querySelectorAll('.intake-plan').forEach(function (btn) {
      btn.addEventListener('click', function () {
        form.querySelectorAll('.intake-plan').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        fieldPlan.value = btn.getAttribute('data-value');
      });
    });

    // Stap 4: stijl-keuze
    form.querySelectorAll('.intake-style').forEach(function (btn) {
      btn.addEventListener('click', function () {
        form.querySelectorAll('.intake-style').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        fieldStyle.value = btn.getAttribute('data-value');
      });
    });

    // Stap 4: kleur-keuze
    form.querySelectorAll('.intake-color').forEach(function (btn) {
      btn.addEventListener('click', function () {
        form.querySelectorAll('.intake-color').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        fieldColor.value = btn.getAttribute('data-value');
      });
    });

    // Stap 5: hosting-keuze
    var hostingSelect = document.getElementById('intake-hosting');
    var hostingNaamWrap = document.getElementById('intake-hosting-naam-wrap');
    var hostingHint = document.getElementById('intake-hosting-hint');
    if (hostingSelect) {
      hostingSelect.addEventListener('change', function () {
        var val = hostingSelect.value;
        hostingNaamWrap.hidden = val !== 'Ja';
        hostingHint.hidden = val !== 'Nee';
      });
    }

    function validateGegevens() {
      var naam = document.getElementById('intake-naam').value.trim();
      var email = document.getElementById('intake-email').value.trim();
      submitBtn.disabled = !(naam && email);
    }

    // Stap 5: live validatie naam + e-mail
    ['intake-naam', 'intake-email'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', validateGegevens);
    });

    // Next
    nextBtn.addEventListener('click', function () {
      if (!validateStep()) return;
      if (currentStep === 2) showDetailPanels();
      if (currentStep === 4) buildSummary();
      currentStep++;
      updateUI();
    });

    // Back
    backBtn.addEventListener('click', function () {
      currentStep--;
      updateUI();
    });

    // Submit via fetch (Formspree AJAX)
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var naam = document.getElementById('intake-naam');
      var email = document.getElementById('intake-email');
      if (!naam.value || !email.value) return;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Even geduld...';
      var data = new FormData(form);
      data.append('_subject', 'Nieuwe aanvraag: ' + fieldType.value + ' — ' + fieldPlan.value);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      }).then(function () {
        window.location.href = 'bedankt.html';
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Vraag gratis uw 3 concepten aan';
      });
    });

    updateUI();
  })();

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
    var links = Array.from(nav.querySelectorAll('a'));
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
