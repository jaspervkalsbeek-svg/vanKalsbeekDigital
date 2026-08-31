/* Van Kalsbeek Digital - technical showcase redesign extras.
   Loads after script.js which handles theme, cookie consent, mobile nav and intake. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* --- Functional scroll helpers: always active --- */

  var progressBar = document.getElementById('vkd-scroll-progress');
  var backBtn = document.getElementById('vkd-back');
  var header = document.getElementById('header');
  var ticking = false;

  function onScroll() {
    var top = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (max > 0 ? (top / max) * 100 : 0) + '%';
    if (backBtn) backBtn.hidden = top < 600;
    if (header) header.classList.toggle('is-scrolled', top > 8);
    root.style.setProperty('--grid-y', (-top * 0.3) + 'px');
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* --- Typewriter rotator: always active; reduce shows first word only --- */

  (function () {
    var svg = document.querySelector('.vkd-rot-svg');
    if (!svg) return;
    var textEl = svg.querySelector('.vkd-rot-svg-text');
    var cursor = document.querySelector('.vkd-rot-cursor');
    var words = ['groeien.', 'bloeien.', 'stralen.', 'winnen.'];
    var i = 0;
    var ctx = document.createElement('canvas').getContext('2d');

    /* Box height = cap height of the title font (not line-height), so the word
       occupies the same vertical space as the surrounding letters and never
       widens its text row's track. Baseline (y) sits on the box bottom edge =
       the sentence baseline; descenders/dots hang below via SVG overflow. */
    var PAD = 8;
    var CAP = 0.72;

    if (reduceMotion) {
      textEl.textContent = words[0];
      fitSvg(words[0]);
      if (cursor) cursor.style.display = 'none';
      return;
    }

    function measure(text) {
      var style = getComputedStyle(document.querySelector('.vkd-title'));
      ctx.font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
      var w = ctx.measureText(text).width;
      // Before the web font is ready measureText can return NaN: fall back to a
      // rough width estimate so the SVG viewBox never gets a NaN dimension.
      return isFinite(w) ? w : text.length * parseFloat(style.fontSize) * 0.55;
    }

    var MAX_W = 0;

    function fitSvg(text) {
      var style = getComputedStyle(document.querySelector('.vkd-title'));
      var fs = parseFloat(style.fontSize);
      /* Fixed box width = longest word, so resizing/typing avoids re-flowing the
         surrounding sentence (it stays on its original row count). */
      if (!MAX_W) {
        for (var wi = 0; wi < words.length; wi++) MAX_W = Math.max(MAX_W, Math.ceil(measure(words[wi])) + PAD);
        var style2 = getComputedStyle(document.querySelector('.vkd-title'));
        MAX_W = Math.round(MAX_W);
      }
      var w = MAX_W;
      var h = Math.round(fs * CAP);
      svg.setAttribute('height', h + 'px');
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.setAttribute('width', w + 'px');
      textEl.setAttribute('y', String(h));
      placeCursor(text);
    }

    function placeCursor(text) {
      if (!cursor || !cursor.style) return;
      var tw = measure(text);
      var lh = parseFloat(getComputedStyle(document.querySelector('.vkd-title')).lineHeight);
      cursor.style.left = (tw + 3) + 'px';
      cursor.style.height = (0.9 * lh) + 'px';
      cursor.style.bottom = (lh * 0.06) + 'px';
    }

    function type(word, cb) {
      var j = 0;
      textEl.textContent = '';
      fitSvg('');
      (function next() {
        j++;
        textEl.textContent = word.slice(0, j);
        fitSvg(word.slice(0, j));
        if (j < word.length) setTimeout(next, 95 + Math.random() * 55);
        else setTimeout(cb, 2000);
      })();
    }

    function del(cb) {
      var t = textEl.textContent;
      var j = t.length;
      (function next() {
        j--;
        textEl.textContent = t.slice(0, j);
        fitSvg(t.slice(0, j));
        if (j > 0) setTimeout(next, 55);
        else setTimeout(cb, 500);
      })();
    }

    function cycle() {
      type(words[i], function () {
        del(function () {
          i = (i + 1) % words.length;
          cycle();
        });
      });
    }

    function start() {
      if (started) return;
      started = true;
      cycle();
    }

    var started = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
      setTimeout(start, 1200); /* fallback: never leave the typewriter stalled */
    } else {
      start();
    }
  })();

  /* --- Over-mij modal: open/close from the trust card, always active --- */

  var trustBtn = document.getElementById('vkdTrustBtn');
  var modal = document.getElementById('vkdModal');
  var lastFocus = null;
  var knobRest = null;
  var knobAnchor = { x: 0, y: 0 };
  var hasAnime = typeof anime !== 'undefined';

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    var backdrop = modal.querySelector('.vkd-modal-backdrop');
    var card = modal.querySelector('.vkd-modal-card');
    // Set overflow before measuring so the page cannot shift behind the morph.
    document.body.style.overflow = 'hidden';
    modal.hidden = false;
    modal.classList.add('is-open');
    if (hasAnime && !reduceMotion) {
      growToModal(backdrop, card);
    } else {
      backdrop.style.opacity = '1';
      card.style.opacity = '1';
      card.style.transformOrigin = '';
      card.style.transform = 'scale(1) translateY(0)';
      var rc = card.querySelector('.vkd-modal-about');
      if (rc) rc.style.opacity = '';
    }
    modal.querySelector('.vkd-modal-close').focus();
  }

  // The real modal card (with its real content) grows out from the trust
  // button. The button is pinned to its spot so the hero stays put; the card is
  // placed (non-uniformly scaled + shifted) exactly over the button's rect,
  // then grows to its natural rect while the button fades out. The last frame
  // is the open modal, so nothing pops when the button is gone. Transform on
  // the card is safe because the modal sits in <body> with no transformed
  // ancestor, so transform-origin behaves; the button itself only fades.
  function growToModal(backdrop, card) {
    // Force the card to its resting end state before measuring so its natural
    // rect is exact (the is-open CSS transition must not be mid-flight).
    card.style.transition = 'none';
    card.style.transformOrigin = '0 0';
    card.style.transform = 'scale(1) translateY(0)';
    card.style.opacity = '1';
    // eslint-disable-next-line no-unused-expressions
    card.offsetHeight; // flush layout so the rect reflects the resting state
    knobRest = trustBtn.getBoundingClientRect();
    var cr = card.getBoundingClientRect();
    pinKnob(knobRest);
    backdrop.style.transition = 'none';
    backdrop.style.opacity = '0';

    var sx = knobRest.width / cr.width;
    var sy = knobRest.height / cr.height;
    var dx = knobRest.left - cr.left;
    var dy = knobRest.top - cr.top;

    // Place the card exactly over the button, then grow it out to its natural
    // rect while the button fades. e: 0 = knob rect, 1 = natural card.
    card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
    card.offsetHeight; // eslint-disable-line no-unused-expressions

    tween(620, easeOutExpo, function (raw, k) {
      var kx = sx + (1 - sx) * k;
      var ky = sy + (1 - sy) * k;
      var tx = dx * (1 - k);
      var ty = dy * (1 - k);
      card.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + kx + ',' + ky + ')';
    }, function () {
      card.style.transform = '';
    });
    anime.animate(trustBtn, { opacity: 0, duration: 180, ease: 'outQuad' });
    anime.animate(backdrop, { opacity: 1, duration: 300, ease: 'outQuad' });
  }

  // Pin the real button to a fixed position matching its current viewport spot
  // so its space is reserved in the hero while it fades during the morph.
  // Because a transformed hero ancestor owns the containing block, pin at
  // left/top 0, measure the anchor, then offset by it. Pointer events are off so
  // the invisible (faded) knob cannot block clicks on the modal behind it.
  function pinKnob(rect) {
    trustBtn.style.transition = 'none';
    trustBtn.style.animation = 'none';
    trustBtn.style.position = 'fixed';
    trustBtn.style.left = '0px';
    trustBtn.style.top = '0px';
    trustBtn.style.width = rect.width + 'px';
    trustBtn.style.height = rect.height + 'px';
    trustBtn.style.margin = '0';
    trustBtn.style.transform = 'none';
    trustBtn.style.zIndex = '1002';
    trustBtn.style.pointerEvents = 'none';
    trustBtn.style.opacity = '';
    var r0 = trustBtn.getBoundingClientRect();
    knobAnchor = { x: r0.left, y: r0.top };
    trustBtn.style.left = (rect.left - knobAnchor.x) + 'px';
    trustBtn.style.top = (rect.top - knobAnchor.y) + 'px';
  }

  // Reverse of growToModal: the card shrinks back over the (re-shown) button
  // while the two intro paragraphs fade out at the same time, so the text
  // disappears mid-morph rather than fading before the card moves. The photo,
  // heading, list and CTA stay visible the whole way.
  function shrinkToKnob(backdrop, card) {
    if (!knobRest) { modal.hidden = true; return; }
    card.style.transition = 'none';
    backdrop.style.transition = 'none';
    backdrop.style.opacity = '0';
    trustBtn.style.transition = 'none';
    trustBtn.style.animation = 'none';
    trustBtn.style.opacity = ''; // re-show the button (it sits over the card)
    var intro = card.querySelectorAll('.vkd-modal-about .about-text p:not(.eyebrow)');

    // Card is at its natural identity after open.
    var cr = card.getBoundingClientRect();
    var sx = knobRest.width / cr.width;
    var sy = knobRest.height / cr.height;
    var dx = knobRest.left - cr.left;
    var dy = knobRest.top - cr.top;

    // e: 0 = natural card, 1 = knob rect.
    tween(480, easeInCubic, function (raw, k) {
      var kx = 1 + (sx - 1) * k;
      var ky = 1 + (sy - 1) * k;
      var tx = dx * k;
      var ty = dy * k;
      card.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + kx + ',' + ky + ')';
    }, function () {
      card.style.transform = '';
      card.style.opacity = '1';
      intro.forEach(function (p) { p.style.opacity = ''; });
      modal.hidden = true;
      modal.classList.remove('is-open');
      restoreKnob();
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    });

    if (intro.length) {
      // Parallel fade, slightly shorter than the shrink so the text is gone
      // before the card reaches the button.
      tween(320, easeInCubic, function (raw, k) {
        intro.forEach(function (p) { p.style.opacity = String(1 - k); });
      });
    }
    anime.animate(backdrop, { opacity: 0, duration: 240, ease: 'inCubic' });
  }

  // Put the real button back into the hero flow exactly as it was.
  function restoreKnob() {
    trustBtn.style.transition = '';
    // Keep the (already completed) hero entrance animation disabled so it does
    // not restart and shift the restored button by its 16px from-frame.
    trustBtn.style.animation = 'none';
    trustBtn.style.position = '';
    trustBtn.style.left = '';
    trustBtn.style.top = '';
    trustBtn.style.width = '';
    trustBtn.style.height = '';
    trustBtn.style.margin = '';
    trustBtn.style.transform = '';
    trustBtn.style.translate = '';
    trustBtn.style.scale = '';
    trustBtn.style.zIndex = '';
    trustBtn.style.pointerEvents = '';
    trustBtn.style.opacity = '';
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    var backdrop = modal.querySelector('.vkd-modal-backdrop');
    var card = modal.querySelector('.vkd-modal-card');
    document.body.style.overflow = '';
    if (hasAnime && !reduceMotion) {
      shrinkToKnob(backdrop, card);
    } else {
      modal.classList.remove('is-open');
      modal.hidden = true;
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }
  }

  if (trustBtn && modal) {
    trustBtn.addEventListener('click', openModal);
    document.querySelectorAll('[data-open-modal]').forEach(function (el) {
      el.addEventListener('click', openModal);
    });
    modal.addEventListener('click', function (e) {
      var closeEl = e.target.closest('[data-close]');
      if (!closeEl) return;
      var href = closeEl.getAttribute ? closeEl.getAttribute('href') : null;
      if (closeEl.tagName === 'A' && href && href.charAt(0) === '#') {
        // Fragment link inside the modal: body overflow is locked while the
        // modal is open, so the default #jump cannot scroll. Close first (this
        // unlocks overflow), then scroll to the target and move focus there,
        // so the delayed close focus-return does not yank the page back up.
        e.preventDefault();
        closeModal();
        var target = document.querySelector(href);
        if (target) {
          window.location.hash = href;
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      } else {
        closeModal();
      }
    });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* --- SVG logo: header static filled, hero draws its outline once with anime.js createDrawable --- */

  var brandAnchor = document.querySelector('.brand');
  var headerLogo = document.querySelector('.brand-logo-svg');
  if (brandAnchor && headerLogo) {
    brandAnchor.classList.add('svg-active');
    headerLogo.classList.add('show');
  }

  var heroLogo = document.querySelector('.vkd-hero-logo .vkd-logo');
  if (heroLogo) {
    if (reduceMotion || typeof anime === 'undefined') {
      heroLogo.classList.add('show');
    } else {
      var paths = Array.prototype.slice.call(heroLogo.querySelectorAll('path'));
      var drawables = anime.svg.createDrawable(paths);
      var n = paths.length;
      var progress = { t: 0 };
      var filled = {};
      anime.animate(progress, {
        t: [0, 1],
        duration: 1800,
        ease: 'inOutQuad',
        onUpdate: function () {
          var p = progress.t;
          for (var i = 0; i < n; i++) {
            var v = Math.max(0, Math.min(1, p * n - i));
            drawables[i].setAttribute('draw', '0 ' + v.toFixed(3));
            if (v >= 1 && !filled[i]) {
              filled[i] = true;
              paths[i].style.fillOpacity = 1;
            }
          }
        },
        onComplete: function () {
          heroLogo.classList.add('show');
        }
      });
    }
  }

  if (reduceMotion) return;

  /* --- Spotlight glow cards: follow the pointer, one delegated listener --- */

  document.addEventListener('pointermove', function (e) {
    var el = e.target.closest ? e.target.closest('.vkd-spot') : null;
    if (!el) return;
    var rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', (e.clientX - rect.left) + 'px');
    el.style.setProperty('--spot-y', (e.clientY - rect.top) + 'px');
  });

  /* On touch there is no hover: pulse the spotlight over each card once it
     enters the viewport. Mouse users keep the pointer-follow behaviour. */
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches &&
      'IntersectionObserver' in window) {
    var spotObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('auto-glow');
        spotObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(document.querySelectorAll('.vkd-spot'), function (el) {
      spotObserver.observe(el);
    });
  }

  /* --- Proof counters: animejs-style easeOutExpo, no dependency --- */

  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function easeInCubic(t) { return t * t * t; }

  // Minimal rAF tween: calls onUpdate(progress 0..1, eased 0..1) each frame and
  // then onComplete. Used for the card transform because anime's translate/scale
  // composition proved unreliable once a transform is pre-set on an element.
  function tween(duration, ease, onUpdate, onComplete) {
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var raw = Math.min((ts - start) / duration, 1);
      onUpdate(raw, ease ? ease(raw) : raw);
      if (raw < 1) requestAnimationFrame(step);
      else if (onComplete) onComplete();
    }
    requestAnimationFrame(step);
  }

  var stats = document.querySelectorAll('[data-target]');
  if (stats.length && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        statObserver.unobserve(el);
        var target = parseFloat(el.getAttribute('data-target'));
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1200, 1);
          el.textContent = prefix + Math.round(easeOutExpo(p) * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        el.textContent = prefix + '0' + suffix;
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { statObserver.observe(el); });
  }
})();
