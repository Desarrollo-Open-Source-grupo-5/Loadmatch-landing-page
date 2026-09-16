/**
 * LoadMatch Landing Page — config.js
 *
 * Single place where the Web Application lives.
 *
 * The project statement requires every call to action on the landing page to
 * take the visitor to the matching view of the Web Application. Until that
 * application is deployed there is no URL to point at, so:
 *
 *   · While APP_BASE_URL is empty, every call to action falls back to the
 *     matching section of this page (the value of its data-app-fallback
 *     attribute). Nothing is a dead link.
 *   · Once the Web Application is deployed, set APP_BASE_URL below — one line,
 *     no other file changes — and every call to action starts pointing at it.
 *
 * Example once deployed:
 *   var APP_BASE_URL = 'https://desarrollo-open-source-grupo-5.github.io/Loadmatch-web-application';
 */
window.LoadMatchConfig = {
  APP_BASE_URL: ''
};
