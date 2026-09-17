/**
 * LoadMatch Landing Page — main.js
 *
 * Progressive-enhancement behaviour for the landing page. Every component
 * works from the markup's initial state, so the page remains usable if this
 * script fails to load.
 *
 * Each function below is filled in by its own feature branch. The empty
 * functions are deliberate: they keep the call list at the bottom valid while
 * the branches that own them are still in progress.
 */
(function () {
  'use strict';

  /* ======================================================================
     Calls to action → Web Application
     Added by feature/cta-app-links
     ====================================================================== */
   function initAppLinks() {
    var config = window.LoadMatchConfig || {};
    var base = (config.APP_BASE_URL || '').replace(/\/+$/, '');

    document.querySelectorAll('[data-app-path]').forEach(function (link) {
      if (base) {
        link.setAttribute('href', base + link.getAttribute('data-app-path'));
        link.removeAttribute('data-app-pending');
      } else {
        link.setAttribute('href', link.getAttribute('data-app-fallback') || '#top');
        link.setAttribute('data-app-pending', 'true');
      }
    });
  }

  /* ======================================================================
     Mobile navigation
     ====================================================================== */
  function initMobileNav() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) { return; }

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }

    function open() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = nav.querySelector('a, button');
      if (first) { first.focus(); }
    }

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a') && nav.classList.contains('is-open')) { close(); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) { close(); }
    });
  }


  /* ======================================================================
     Audience tabs
     Added by feature/how-it-works-tabs
     ====================================================================== */
  function initTabs() {
    var tablist = document.querySelector('[role="tablist"]');
    if (!tablist) { return; }

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    if (!tabs.length) { return; }

    function select(tab) {
      tabs.forEach(function (item) {
        var isSelected = item === tab;
        var panel = document.getElementById(item.getAttribute('aria-controls'));

        item.setAttribute('aria-selected', String(isSelected));
        item.setAttribute('tabindex', isSelected ? '0' : '-1');
        item.classList.toggle('is-active', isSelected);

        if (panel) { panel.hidden = !isSelected; }
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(tab); });

      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') { next = tabs[(index + 1) % tabs.length]; }
        if (event.key === 'ArrowLeft')  { next = tabs[(index - 1 + tabs.length) % tabs.length]; }
        if (event.key === 'Home')       { next = tabs[0]; }
        if (event.key === 'End')        { next = tabs[tabs.length - 1]; }

        if (next) {
          event.preventDefault();
          select(next);
          next.focus();
        }
      });
    });
  }

  /* ======================================================================
     FAQ accordion
     Added by feature/faq-accordion
     ====================================================================== */
  function initAccordion() {
    document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));

        trigger.setAttribute('aria-expanded', String(!expanded));
        if (panel) { panel.hidden = expanded; }
      });
    });
  }

  /* ======================================================================
     Testimonials carousel
     Added by feature/testimonials-carousel
     ====================================================================== */
  function initCarousel() {
    var carousel = document.querySelector('.carousel');
    if (!carousel) { return; }
    var section = carousel.closest('section');
    var nav = section.querySelector('.carousel-nav');
    var dots = Array.prototype.slice.call(section.querySelectorAll('[data-slide]'));
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.testimonial'));
    if (!nav || !slides.length || !dots.length) { return; }
    nav.hidden = false;
    var counter = section.querySelector('[data-carousel-counter]');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function sync(index) {
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
      var label = (index + 1) + ' / ' + slides.length;
      if (counter && counter.textContent !== label) { counter.textContent = label; }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-slide'));
        var slide = slides[index];
        if (!slide) { return; }
        var bounds = carousel.getBoundingClientRect();
        var target = slide.getBoundingClientRect();
        carousel.scrollTo({
          left: carousel.scrollLeft + target.left - bounds.left + target.width / 2 - carousel.clientWidth / 2,
          behavior: reducedMotion.matches ? 'instant' : 'smooth'
        });
        sync(index);
      });
    });
    sync(0);
    var ticking = false;
    function syncFromPosition() {
      var bounds = carousel.getBoundingClientRect();
      var centre = bounds.left + carousel.clientWidth / 2;
      var closest = 0;
      var shortest = Infinity;
      slides.forEach(function (slide, i) {
        var rect = slide.getBoundingClientRect();
        var distance = Math.abs(rect.left + rect.width / 2 - centre);
        if (distance < shortest) { shortest = distance; closest = i; }
      });
      sync(closest);
      ticking = false;
    }
    function scheduleSync() {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(syncFromPosition);
    }
    carousel.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);
    scheduleSync();
  }

  /* ====================================================================== */
  /* ======================================================================
     Contact form (US14)
     Validates required fields and the email format before "sending".
     Error texts live in the markup so they follow the active language.
     ====================================================================== */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) { return; }

    var success = document.getElementById('contact-success');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var rules = {
      name: function (value) { return value.trim().length >= 2; },
      email: function (value) { return emailPattern.test(value.trim()); },
      profile: function (value) { return value !== ''; },
      message: function (value) { return value.trim().length >= 10; }
    };

    function check(field) {
      var valid = rules[field.name](field.value);
      var error = document.getElementById(field.getAttribute('aria-describedby'));
      field.setAttribute('aria-invalid', String(!valid));
      if (error) { error.hidden = valid; }
      return valid;
    }

    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      field.addEventListener('blur', function () { check(field); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') { check(field); }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      success.hidden = true;

      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        var field = form.elements[name];
        if (!check(field) && !firstInvalid) { firstInvalid = field; }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      form.reset();
      Object.keys(rules).forEach(function (name) {
        form.elements[name].removeAttribute('aria-invalid');
      });
      success.hidden = false;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAppLinks();
    initMobileNav();
    initTabs();
    initAccordion();
    initCarousel();
    initContactForm();
  });
}());
