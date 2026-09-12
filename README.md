# LoadMatch — Landing Page

Static landing page for **LoadMatch**, a platform that connects companies that
need to move goods with verified carriers that have available capacity in
Metropolitan Lima.

Part of the final project for **1ASI0729 — Desarrollo de Aplicaciones Open
Source**, Universidad Peruana de Ciencias Aplicadas.

- **Startup:** CargoLink Labs
- **Product:** LoadMatch
- **Organisation:** [Desarrollo-Open-Source-grupo-5](https://github.com/Desarrollo-Open-Source-grupo-5)

---

## Technology

Per the project statement, the landing page is built with **HTML5, CSS3 and
JavaScript** only. There is no build step, no package manager and no runtime
dependency — the repository can be served as-is by any static host.

| Layer | Technology |
| :--- | :--- |
| Markup | HTML5, semantic landmarks, ARIA |
| Styles | CSS3, custom properties, Grid and Flexbox |
| Behaviour | Vanilla JavaScript (ES5-compatible, no transpiler) |
| Typography | Inter, served from Google Fonts |
| Hosting | GitHub Pages |

---

## Project structure

```
Loadmatch-landing-page/
├── index.html                      Landing page
├── README.md
├── LICENSE
├── .gitignore
├── .editorconfig
├── assets/
│   ├── css/
│   │   ├── main.css                Design tokens, reset, layout primitives
│   │   ├── components.css          Buttons, header, hero, cards, carousel…
│   │   └── responsive.css          Breakpoints 1359 / 1023 / 767 / 389
│   ├── js/
│   │   ├── config.js               Web Application base URL (single source)
│   │   ├── main.js                 CTA links, nav, tabs, accordion, carousel
│   │   └── i18n.js                 Language switching
│   ├── img/                        Optimised images
│   │   └── source/                 Uncropped application screens
│   └── i18n/
│       ├── en.json                 English (default)
│       └── es.json                 Latin American Spanish
└── docs/
    └── terms-and-conditions.html   Terms, privacy, cookies, accessibility
```

---

## Running locally

No installation is required. Any static server works:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open <http://localhost:8000>.

> Opening `index.html` directly from the file system works for layout, but the
> language switcher needs a server because it loads the locale files with
> `fetch()`.

---

## Internationalisation

The default locale is **English (`en_US`)**, as required by the project
statement. **Latin American Spanish (`es_419`)** is available through the
switcher in the header.

Every translatable string carries a `data-i18n` key:

```html
<h1 data-i18n="hero.title">Find freight transport for your goods…</h1>
<img data-i18n="hero.imageAlt" data-i18n-attr="alt" alt="…">
```

To add a string: add the key to **both** `en.json` and `es.json`, then
reference it from the markup. The English text stays in the HTML as a fallback,
so the page remains readable if the locale files fail to load.

---

## Accessibility

The page targets **WCAG 2.1 level AA** and was verified by rendering it in a
headless browser and measuring the computed styles.

| Check | Result |
| :--- | :--- |
| Contrast failures (AA) | 0 |
| Images without `alt` | 0 |
| Decorative SVGs without `aria-hidden` | 0 |
| Heading hierarchy | No skipped levels |
| `<main>` landmark and skip link | Present |
| Touch targets on mobile | ≥ 44 × 44 px |
| Keyboard focus indicator | `:focus-visible`, 2 px navy ring |

### One rule worth knowing before editing the CSS

> The primary button uses **navy `#0B1C30` text on orange `#FE6B00`** — never
> white. White on this orange measures **2.87:1** and fails WCAG AA; navy
> measures **5.98:1** and passes.

The same rule applies to the warning colour: high-luminance brand colours in
this palette take dark text, not white.

### Breakpoints

| Max width | What changes |
| :--- | :--- |
| `1359px` | Navigation collapses into the hamburger panel. The five links, the language switch and the two calls to action measure 1360 px on one line in Spanish, whose labels run longer than the English ones. |
| `1023px` | Tablet grids: hero stacks, pricing and video become one column, footer two. |
| `767px` | Mobile: metrics, steps, trust cards and audience stack; testimonials become a snap carousel. |
| `389px` | Small phones: smaller hero type and a 12 px container gutter. |

The horizontal gutter lives in a single token, `--container-pad`. The carousel
bleeds to the screen edge with `calc(var(--container-pad) * -1)`, so changing
the gutter at any breakpoint keeps the two in sync and never causes a
horizontal scrollbar.

Verified with no horizontal overflow, in both languages, at 320, 360, 390,
414, 600, 768, 834, 1024, 1280, 1359, 1360, 1440, 1600 and 1920 px.

Two containers are wider than the 1120 px reading measure: the header
(1400 px, so the brand sits near the left edge and the primary call to action
near the right one, as in the mock-up) and "How it works" (`.container--wide`,
1400 px, so the step images stay readable).

---

## Where the calls to action point

The project statement requires every call to action to take the visitor to the
matching view of the Web Application. That destination lives in **one** place:

```js
// assets/js/config.js
window.LoadMatchConfig = { APP_BASE_URL: '' };
```

Each call to action carries `data-app-path` (the view) and `data-app-fallback`
(a section of this page). While `APP_BASE_URL` is empty, `initAppLinks()` in
`main.js` points every one of them at its fallback, so nothing is a dead link
before the application exists. Set `APP_BASE_URL` once the Web Application is
deployed and all eight links follow — no other file changes.

| Call to action | `data-app-path` | Fallback while unset |
| :--- | :--- | :--- |
| I need to ship cargo | `/signup?profile=company` | `#for-companies` |
| I am a carrier | `/signup?profile=carrier` | `#for-carriers` |
| Sign in | `/login` | `#final-cta` |

---

## The step images

The images in "How it works" are **close-ups of one region** of the
application, not whole screens. A full 2400 px application screen shown in a
column this wide renders its interface text at about 14 % of its real size,
which no one can read — it fails both the minimalist-design heuristic and the
purpose of showing a screenshot at all. Each crop is normalised to 3:2 and
lands between 39 % and 80 % of its real size.

The uncropped screens are kept in `assets/img/source/` so a crop can be
redone without regenerating the artwork.

---

## Design source

The implementation follows the approved mock-ups (Chapter IV of the project
report, sections 4.3.1 and 4.3.2) at three breakpoints: 390 px, 1024 px and
1440 px.

Colour, shape and typography tokens follow the LoadMatch design system, whose
colour roles use the Material 3 naming convention (`primary`, `on-primary`,
`surface`, `on-surface`, `outline`).

---

## Contributing

### Branching — GitFlow

| Branch | Purpose |
| :--- | :--- |
| `main` | Production. Deployed to GitHub Pages. Tagged releases only. |
| `develop` | Integration branch for the next release. |
| `feature/<name>` | One branch per feature, off `develop`. |
| `release/<version>` | Release stabilisation, off `develop`. |
| `hotfix/<name>` | Urgent production fix, off `main`. |

Examples: `feature/hero-section`, `release/1.0.0`, `hotfix/footer-link`.

### Commits — Conventional Commits

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

```
feat(hero): add responsive hero section with primary CTA
fix(a11y): use navy text on primary button to meet WCAG AA
docs(readme): document the GitFlow branching model
```

### Versioning — Semantic Versioning 2.0.0

`MAJOR.MINOR.PATCH` — for example `v1.0.0`. Releases are tagged on `main`.

### Code style

- **Google HTML/CSS Style Guide**
- All identifiers, class names and file names in **English**
- CSS class names follow BEM: `.block__element--modifier`
- 2-space indentation, LF line endings (enforced by `.editorconfig`)

---

## Deployment

The site is deployed to **GitHub Pages** from the `main` branch:

1. Repository → **Settings** → **Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` · **Folder:** `/ (root)`
4. Save — the URL appears within a minute

Because the project has no build step, every merge into `main` publishes
automatically.

---

## Licence

Released under the [MIT License](LICENSE).

Testimonials and figures marked as *sample content* are illustrative material
for an academic project and do not represent real customers.
