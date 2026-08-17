// Compare slider for redesign examples — draggable before/after splitter.
// Usage: add class="compare-slider" to a container with .compare-old and .compare-new children.
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

    function onPointerDown(e) {
      var rect = el.getBoundingClientRect();
      var pct = parseFloat(handle.style.left) || 50;
      var handleX = rect.left + (pct / 100) * rect.width;
      var dist = Math.abs(e.clientX - handleX);
      if (dist > 40) return;
      e.preventDefault();
      dragging = true;
      el.setPointerCapture(e.pointerId);
      setPosition(e.clientX);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      e.preventDefault();
      setPosition(e.clientX);
    }

    function onPointerUp() {
      dragging = false;
    }

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('lostpointercapture', onPointerUp);

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
