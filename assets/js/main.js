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
  function initAppLinks() {}

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
  function initAccordion() {}

  /* ======================================================================
     Testimonials carousel
     Added by feature/testimonials-carousel
     ====================================================================== */
  function initCarousel() {}

  /* ====================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initAppLinks();
    initMobileNav();
    initTabs();
    initAccordion();
    initCarousel();
  });
}());
