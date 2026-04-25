/*
 * MAESTRO Redesign — minimal site script
 * - Theme toggle (default: dark, persisted in localStorage)
 * - Header scroll state
 * - Mobile menu
 * - Tabs
 * - Cookie banner
 * - SVG icon hydration (replaces <img src="*.svg"> with inline <svg> so they
 *   inherit currentColor from CSS — works for icon containers + social icons)
 */

(function () {
  'use strict';

  /* ---------- Theme ---------- */
  var THEME_KEY = 'maestro-theme';
  var root = document.documentElement;

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function setStoredTheme(value) {
    try { localStorage.setItem(THEME_KEY, value); } catch (e) {}
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#fafafa' : '#0a0a0a');
  }

  // Default to dark unless user previously chose light
  var initial = getStoredTheme() || 'dark';
  applyTheme(initial);

  document.addEventListener('DOMContentLoaded', function () {
    /* Theme toggle button */
    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        var next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        setStoredTheme(next);
      });
    }

    /* Header scroll state */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        if (window.scrollY > 8) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Mobile menu */
    var hamburger = document.querySelector('.hamburger');
    var navList = document.querySelector('.site-header nav ul');
    if (hamburger && navList) {
      hamburger.addEventListener('click', function () {
        var open = navList.classList.toggle('is-open');
        hamburger.classList.toggle('is-open', open);
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      navList.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navList.classList.remove('is-open');
          hamburger.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* Tabs */
    var tabButtons = document.querySelectorAll('.tab-btn');
    var tabPanes = document.querySelectorAll('.tab-pane');
    if (tabButtons.length && tabPanes.length) {
      tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          tabButtons.forEach(function (b) { b.classList.remove('active'); });
          tabPanes.forEach(function (p) { p.classList.remove('active'); });
          btn.classList.add('active');
          var target = document.getElementById(btn.getAttribute('data-tab'));
          if (target) target.classList.add('active');
        });
      });
      // Ensure one is active
      var anyActive = Array.prototype.some.call(tabButtons, function (b) { return b.classList.contains('active'); });
      if (!anyActive) {
        tabButtons[0].classList.add('active');
        if (tabPanes[0]) tabPanes[0].classList.add('active');
      }
    }

    /* Hero demo form — no backend needed.
       On submit we (1) validate required fields, (2) compose a structured
       email body from the form values, and (3) open the user's mail client
       with everything pre-filled, addressed to the configured inbox.
       The recipient is taken from the form's `data-mailto` attribute so it
       can be changed in HTML without touching JS. */
    var demoForm = document.querySelector('[data-demo-form]');
    if (demoForm) {
      demoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var recipient = demoForm.getAttribute('data-mailto') || 'sales@ranbiolinks.com';
        var btn = demoForm.querySelector('button[type="submit"]');
        var statusEl = demoForm.querySelector('[data-form-status]');

        var nameField = demoForm.querySelector('[name="full-name"]');
        var emailField = demoForm.querySelector('[name="email"]');
        var orgField = demoForm.querySelector('[name="org"]');

        var name = nameField ? nameField.value.trim() : '';
        var email = emailField ? emailField.value.trim() : '';
        var org = orgField ? orgField.value.trim() : '';

        var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!name || !emailValid) {
          if (statusEl) {
            statusEl.textContent = 'Please enter your name and a valid work email.';
            statusEl.classList.add('is-error');
          }
          (name ? emailField : nameField) && (name ? emailField : nameField).focus();
          return;
        }
        if (statusEl) statusEl.classList.remove('is-error');

        var subject = 'MAESTRO demo request — ' + (org || name);
        var bodyLines = [
          'Hello MAESTRO team,',
          '',
          'I would like to schedule a demo of the platform.',
          '',
          'Name:         ' + name,
          'Work email:   ' + email,
          'Organization: ' + (org || '—'),
          '',
          'Sent from maestro.ranbiolinks.com'
        ];
        var href = 'mailto:' + encodeURIComponent(recipient) +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(bodyLines.join('\n'));

        if (btn) {
          var label = btn.textContent;
          btn.disabled = true;
          btn.textContent = 'Opening your email…';
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = label;
          }, 2400);
        }

        if (statusEl) {
          statusEl.textContent = 'Opening your email app — just hit Send to finish your request.';
        }

        window.location.href = href;
      });
    }

    /* SVG icon hydration — turn <img src="...svg"> inside icon-y containers into
       inline <svg> so they pick up currentColor from CSS (theme + brand aware). */
    (function hydrateIcons() {
      var SELECTOR = [
        '.icon img[src$=".svg"]',
        '.icon-circle img[src$=".svg"]',
        '.social-icons a img[src$=".svg"]',
        'img.icon-svg[src$=".svg"]',
        '.logo-row img[src$=".svg"]',
        '.cloud-strip img[src$=".svg"]'
      ].join(', ');
      var imgs = document.querySelectorAll(SELECTOR);
      var cache = {};
      imgs.forEach(function (img) {
        var src = img.getAttribute('src');
        if (!src) return;
        var fetchPromise = cache[src] || (cache[src] = fetch(src).then(function (r) { return r.text(); }));
        fetchPromise.then(function (text) {
          var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
          var svg = doc.querySelector('svg');
          if (!svg) return;
          // Carry over alt → aria-label and decorative role
          var alt = img.getAttribute('alt') || '';
          if (alt) {
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', alt);
          } else {
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');
          }
          // Preserve any classes from the img on the svg
          if (img.className) svg.setAttribute('class', img.className);
          img.replaceWith(svg);
        }).catch(function () { /* leave img in place if fetch fails */ });
      });
    })();

    /* Cookie banner (lightweight) */
    var COOKIE_KEY = 'maestro-cookie-consent';
    var banner = document.querySelector('[data-cookie-banner]');
    if (banner) {
      var stored = null;
      try { stored = localStorage.getItem(COOKIE_KEY); } catch (e) {}
      if (!stored) {
        setTimeout(function () { banner.classList.add('is-open'); }, 800);
      }
      banner.querySelectorAll('[data-cookie-action]').forEach(function (b) {
        b.addEventListener('click', function () {
          try { localStorage.setItem(COOKIE_KEY, b.getAttribute('data-cookie-action')); } catch (e) {}
          banner.classList.remove('is-open');
        });
      });
    }
  });
})();

/* Ambient parallax — faint clinical-trial background motifs that drift at
   different speeds as the user scrolls. Single rAF loop, passive scroll
   listener, and bails out for prefers-reduced-motion users. Each shape's
   data-speed attribute is the parallax factor: values < 1 make the shape
   appear to scroll slower than the page (depth illusion). */
(function ambientParallax() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var shapes = Array.prototype.slice.call(document.querySelectorAll('.ambient-shape'));
  if (!shapes.length) return;

  var scrollY = window.scrollY || window.pageYOffset || 0;
  var ticking = false;

  function update() {
    for (var i = 0; i < shapes.length; i++) {
      var s = shapes[i];
      var speed = parseFloat(s.getAttribute('data-speed'));
      if (isNaN(speed)) speed = 0.6;
      var offset = scrollY * (1 - speed);
      s.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    }
    ticking = false;
  }

  function onScroll() {
    scrollY = window.scrollY || window.pageYOffset || 0;
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
