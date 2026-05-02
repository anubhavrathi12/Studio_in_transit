/* ═══════════════════════════════════════════
   Studio in Transit — Script
═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Smooth scroll helper ──
  window.smoothScroll = function (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Wait for DOM ──
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initHeroFadeIn();
    initScrollReveal();
    initParallax();
    initProgressBar();
    initCursorGlow();
  }

  // ── Hero fade-in sequence ──
  function initHeroFadeIn() {
    const items = document.querySelectorAll('.fade-in');
    items.forEach(function (el) {
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(function () {
        el.classList.add('active');
      }, delay);
    });
  }

  // ── Scroll Reveal (Intersection Observer) ──
  function initScrollReveal() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Parallax backgrounds ──
  function initParallax() {
    var bgs = document.querySelectorAll('.parallax-bg');
    if (!bgs.length) return;

    var ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    function updateParallax() {
      var scrollY = window.pageYOffset;
      bgs.forEach(function (bg) {
        var speed = parseFloat(bg.getAttribute('data-speed') || '0.3');
        var parent = bg.parentElement;
        var rect = parent.getBoundingClientRect();
        var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        bg.style.transform = 'translateY(' + offset + 'px)';
      });
      ticking = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();
  }

  // ── Progress bar animation ──
  function initProgressBar() {
    var fill = document.getElementById('buildFill');
    var pct = document.getElementById('buildPct');
    var progressSection = document.getElementById('buildProgress');
    if (!fill || !progressSection) return;

    var animated = false;
    var targetWidth = 42; // percent

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !animated) {
            animated = true;
            fill.style.width = targetWidth + '%';

            // Animate percentage counter
            if (pct) {
              animateCounter(pct, 0, targetWidth, 2800);
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(progressSection);
  }

  function animateCounter(el, from, to, duration) {
    var start = performance.now();
    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(from + (to - from) * eased);
      el.textContent = current + '%';
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ── Cursor glow (desktop) ──
  function initCursorGlow() {
    var glow = document.getElementById('cursorGlow');
    if (!glow) return;
    // Only on hover devices
    if (!window.matchMedia('(hover: hover)').matches) return;

    var mouseX = 0, mouseY = 0;
    var glowX = 0, glowY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!glow.classList.contains('active')) {
        glow.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', function () {
      glow.classList.remove('active');
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
      glowX = lerp(glowX, mouseX, 0.08);
      glowY = lerp(glowY, mouseY, 0.08);
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animate);
    }
    animate();
  }

})();
