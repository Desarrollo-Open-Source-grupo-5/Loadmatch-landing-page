/** Language switching using the landing page's data-i18n convention. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var elements = document.querySelectorAll('[data-i18n]');
    var buttons = document.querySelectorAll('[data-lang]');
    var dictionaries = {};
    var vehicleData;
    var request = 0;
    var fallbacks = Array.prototype.map.call(elements, function (element) {
      var attribute = element.getAttribute('data-i18n-attr');
      return attribute ? element.getAttribute(attribute) : element.textContent;
    });

    function translate(dictionary, key) {
      return key.split('.').reduce(function (value, part) {
        return value && Object.prototype.hasOwnProperty.call(value, part) ? value[part] : undefined;
      }, dictionary);
    }

    function apply(language, dictionary) {
      Array.prototype.forEach.call(elements, function (element, index) {
        var value = translate(dictionary, element.getAttribute('data-i18n'));
        var translated = typeof value === 'string';
        var attribute = element.getAttribute('data-i18n-attr');
        value = translated ? value : fallbacks[index];
        if (attribute) {
          element.setAttribute(attribute, value);
        } else {
          element.textContent = value;
        }
        // Existing sections without translations keep their English fallback.
        element.setAttribute('lang', translated ? language : 'en');
      });
      document.documentElement.lang = language;
      Array.prototype.forEach.call(buttons, function (button) {
        var active = button.getAttribute('data-lang') === language;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }

    function select(language) {
      if (language !== 'en' && language !== 'es') { return; }
      var current = ++request;
      if (dictionaries[language]) {
        apply(language, dictionaries[language]);
        return;
      }
      if (!vehicleData) {
        vehicleData = loadJson('assets/data/vehicles.mock.json').catch(function (error) {
          vehicleData = null;
          throw error;
        });
      }
      Promise.all([loadJson('assets/i18n/' + language + '.json'), vehicleData])
        .then(function (results) {
          var dictionary = results[0];
          var vehicles = results[1][language];
          Object.keys(vehicles).forEach(function (key) {
            dictionary.vehicles[key] = vehicles[key];
          });
          dictionaries[language] = dictionary;
          if (current === request) { apply(language, dictionary); }
        })
        .catch(function () { /* Keep the current language if loading fails. */ });
    }

    function loadJson(path) {
      return fetch(path)
        .then(function (response) {
          if (!response.ok) { throw new Error('Locale unavailable'); }
          return response.json();
        });
    }

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        select(button.getAttribute('data-lang'));
      });
    });
    select('en');
  });
}());
