/**
 * LoadMatch Landing Page — i18n.js
 *
 * Internationalisation for the landing page.
 * Default locale is English (en_US) as required by the project statement.
 * Supported locales: en_US, es_419 (Latin American Spanish).
 *
 * Usage in markup:
 *   <h1 data-i18n="hero.title">…</h1>                       → replaces textContent
 *   <img data-i18n="hero.imageAlt" data-i18n-attr="alt">    → replaces the attribute
 */
(function () {
  'use strict';

  var DEFAULT_LOCALE = 'en';
  var SUPPORTED = ['en', 'es'];
  var STORAGE_KEY = 'loadmatch.locale';
  var HTML_LANG = { en: 'en', es: 'es-419' };

  var cache = {};

  /**
   * Reads a dot-separated path out of a nested object.
   * @param {Object} obj
   * @param {string} path
   * @returns {string|undefined}
   */
  function lookup(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc && Object.prototype.hasOwnProperty.call(acc, key) ? acc[key] : undefined;
    }, obj);
  }

  /**
   * Applies a dictionary to every element carrying a data-i18n key.
   * @param {Object} dict
   */
  function apply(dict) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = lookup(dict, el.getAttribute('data-i18n'));
      if (value === undefined) { return; }

      var attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, value);
      } else if (el.tagName === 'TITLE') {
        document.title = value;
      } else {
        el.textContent = value;
      }
    });
  }

  /**
   * Reflects the active locale on the switch buttons.
   * @param {string} locale
   */
  function syncButtons(locale) {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === locale;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  /**
   * Loads and applies a locale, falling back silently to the markup defaults.
   * @param {string} locale
   * @returns {Promise<void>}
   */
  function setLocale(locale) {
    if (SUPPORTED.indexOf(locale) === -1) { locale = DEFAULT_LOCALE; }

    document.documentElement.lang = HTML_LANG[locale];
    syncButtons(locale);

    try { window.localStorage.setItem(STORAGE_KEY, locale); } catch (err) { /* storage unavailable */ }

    if (cache[locale]) {
      apply(cache[locale]);
      return Promise.resolve();
    }

    return fetch('assets/i18n/' + locale + '.json')
      .then(function (response) {
        if (!response.ok) { throw new Error('Locale file not found: ' + locale); }
        return response.json();
      })
      .then(function (dict) {
        cache[locale] = dict;
        apply(dict);
      })
      .catch(function (err) {
        // The page ships with English in the markup, so it stays readable.
        window.console && console.warn('[i18n]', err.message);
      });
  }

  /**
   * Resolves the initial locale: stored choice → browser language → default.
   * @returns {string}
   */
  function initialLocale() {
    var stored;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch (err) { stored = null; }
    if (stored && SUPPORTED.indexOf(stored) !== -1) { return stored; }

    var browser = (navigator.language || '').slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(browser) !== -1 ? browser : DEFAULT_LOCALE;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLocale(btn.getAttribute('data-lang'));
      });
    });

    setLocale(initialLocale());
  });

  window.LoadMatchI18n = { setLocale: setLocale };
}());
