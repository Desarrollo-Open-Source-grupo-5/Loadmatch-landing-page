/**
 * LoadMatch Landing Page — config.js
 *
 * Single place where the Web Application lives.
 *
 * Every call to action on the landing page takes the visitor to the deployed
 * Web Application. The application's current public entry point is /home.
 *
 *   · While APP_BASE_URL is empty, every call to action falls back to the
 *     matching section of this page (the value of its data-app-fallback
 *     attribute). Nothing is a dead link.
 *   · Once the Web Application is deployed, set APP_BASE_URL below — one line,
 *     no other file changes — and every call to action starts pointing at it.
 *
 * Deployed application origin (without a trailing slash):
 *   https://loadmatch-frontend-application.vercel.app
 */
window.LoadMatchConfig = {
  APP_BASE_URL: 'https://loadmatch-frontend-application.vercel.app'
};
