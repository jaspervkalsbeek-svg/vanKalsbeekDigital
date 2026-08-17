// Compare slider — bulletproof touch + pointer handling.
(function () {
  'use strict';

  function initSlider(el) {
    var oldSide = el.querySelector('.compare-old');
    var handle = el.querySelector('.compare-handle');
    if (!oldSide || !handle) return;

    var dragging = false;

    function setPosition(x) {
      var rect = el.getBoundingClientRect();
      var pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
      oldSide.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }

    setPosition(el.getBoundingClientRect().left + el.getBoundingClientRect().width / 2);

    // -- Pointer events (desktop + mobile fallback) --
    function onPointerDown(e) {
      var rect = el.getBoundingClientRect();
      var pct = parseFloat(handle.style.left) || 50;
      var handleX = rect.left + (pct / 100) * rect.width;
      var dist = Math.abs(e.clientX - handleX);
      if (dist > 40) return;
      e.preventDefault();
      dragging = true;
      el.setPointerCapture(e.pointerId);
      el.addEventListener('pointermove', onPointerMove, { passive: false });
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);
      el.addEventListener('lostpointercapture', onPointerUp);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      e.preventDefault();
      setPosition(e.clientX);
    }

    function onPointerUp() {
      dragging = false;
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('lostpointercapture', onPointerUp);
    }

    el.addEventListener('pointerdown', onPointerDown, { passive: false });

    // -- Touch events (primary on mobile) --
    var touchId = null;

    function onTouchStart(e) {
      var t = e.changedTouches[0];
      var rect = el.getBoundingClientRect();
      var pct = parseFloat(handle.style.left) || 50;
      var handleX = rect.left + (pct / 100) * rect.width;
      var dist = Math.abs(t.clientX - handleX);
      if (dist > 40) return;
      touchId = t.identifier;
      dragging = true;
      setPosition(t.clientX);
    }

    function onTouchMove(e) {
      if (!dragging) return;
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          e.preventDefault();
          setPosition(e.changedTouches[i].clientX);
          break;
        }
      }
    }

    function onTouchEnd(e) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          dragging = false;
          touchId = null;
          break;
        }
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);

    // -- Keyboard --
    el.addEventListener('keydown', function (e) {
      var rect = el.getBoundingClientRect();
      var current = parseFloat(handle.style.left) || 50;
      var step = 2;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        var newX = rect.left + (current - step) / 100 * rect.width;
        setPosition(newX);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        var newX = rect.left + (current + step) / 100 * rect.width;
        setPosition(newX);
      }
    });
  }

  document.querySelectorAll('.compare-slider').forEach(initSlider);
})();
