# Changelog

All notable changes to the LoadMatch landing page are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-16

### Added
- HTML5 skeleton with SEO and Open Graph meta tags.
- Design tokens, button component with WCAG AA colours and responsive breakpoints.
- Sticky header with accessible mobile navigation below 1360px.
- Hero section with segment calls to action.
- Market indicators band with MTC sources.
- "How it works" audience tabs with application close-ups.
- Trust and verification cards.
- Segment blocks for companies and carriers.
- Testimonial cards with scroll-snap carousel.
- Commission-based pricing section.
- Accessible FAQ accordion.
- Product and team video section.
- Vehicle types catalogue with cargo capacities (US13).
- Contact form with field validation and localized messages (US14).
- Closing call-to-action band.
- Site footer with navigation, legal and contact links.
- Terms, privacy, cookie and accessibility page.
- English (en_US) and Latin American Spanish (es_419) locales.
- Calls to action connected to the Web Application through `config.js`.

### Fixed
- Stylesheets restored to their intended content; responsive rules wrapped in their breakpoints.
- Duplicated site header removed and sections ordered as in the approved design.
- Locale loader moved to `assets/js/`, where `index.html` loads it.
