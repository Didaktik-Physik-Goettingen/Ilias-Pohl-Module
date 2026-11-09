# Lernmodul zum Pohlschen Resonator

Lernmodul zum Experiment "Der Pohlsche Resonator" des Grundpraktikums zur Experimentalphysik I der Georg-August Universität Göttingen.

The project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4. with strong help of Claude (Sonnet 4.5 / 4.6).


## Project Structure Tree

<details>
<summary>Project Structure Tree</summary>

```
ilias_bridge.html                               // entry point from ILIAS; username + key form
.htaccess                                       // production routing: /api/* → PHP, rest → index.html
docker-compose.yml                              // local MySQL container (dev only)
.gitignore
README.md
│
├── .github/
│   └── workflows/
│           deploy.yml                          // CI/CD: build + SFTP deploy on push to master
│
├── api/                                        // PHP backend
│       config.php                              // DB credentials + module config (gitignored)
│       config.example.php                      // template for config.php
│       lib.php                                 // shared by all endpoints: responses, input checks, course key, user lookup
│       db.php                                  // PDO connection (singleton)
│       module.php                              // resolves MODULE_NAME → modules.id
│       router.php                              // local dev router (php -S only)
│       schema.sql                              // database schema (run once to initialise)
│       │
│       ├── users/
│       │       check.php                       // POST /api/users/check
│       │       create.php                      // POST /api/users/create
│       │
│       └── progress/
│               save.php                        // POST /api/progress/save
│               load.php                        // GET  /api/progress/{username}
│
├── frontend/                                   // Angular application
│   │   angular.json                            // defines location of stylesheets, icons, etc.
│   │   proxy.conf.json                         // dev proxy: /api → localhost:8000
│   │
│   └── src/
│       │   index.html                          // main .html
│       │   main.ts                             // Angular bootstrap entry point
│       │   main.server.ts                      // SSR bootstrap entry point
│       │   server.ts                           // Express server for SSR (Node)
│       │   build-info.ts                       // BUILD_TIMESTAMP constant; injected by CI at build time
│       │   styles.css                          // main stylesheet (color palette, layout, buttons)
│       │   styles_glossary.css                 // stylesheet for the glossary
│       │   styles_evaluation.css               // stylesheet for the evaluation types
│       │   styles_test.css                     // stylesheet for the test pages
│       │   styles_decision.css                 // stylesheet for the decision pages
│       │   styles_target.css                   // stylesheet for the target pages + Lernpfad summary
│       │   styles_summary.css                  // stylesheet for the summary accordion sections
│       │   styles_simulation.css               // stylesheet for the simulation pages
│       │
│       └── assets/                             // images, icons, downloadable files, etc.
│       │
│       └── app/
│           │   app.ts                          // root component
│           │   app.html                        // general page structure
│           │   app.css                         // root-level styles
│           │   app.config.ts                   // Angular providers (router, HTTP, SSR)
│           │   app.config.server.ts            // SSR-specific provider overrides
│           │   app.routes.ts                   // client-side routing (all routes)
│           │   app.routes.server.ts            // SSR render-mode per route (Prerender / Client)
│           │
│           └── core/
│           │   └── services/                   // project-wide services
│           │           theme.ts                // light / dark mode toggling
│           │           session.ts              // session ID management + rogue user detection
│           │           analytics.ts            // page visit tracking
│           │           results-tracking.ts     // learning module answer logging
│           │           test-tracking.ts        // test answer logging (single-submission)
│           │           attempt-outbox.ts       // submitted answers waiting for the server's confirmation
│           │           data-export.ts          // saves to / loads from API
│           │           visited-pages.ts        // sub-pages opened so far, for the nav-bar
│           │           summary.service.ts      // builds SummaryData for Lernpfad display
│           │           html-report.service.ts  // generates HTML Lernpfad report (browser download)
│           │           learning-report-registry.ts  // maps page routes → ordered content blocks
│           │           report-mode.ts          // utility: isSolutionsMode() for dev ?solutions=1
│           │           dev-mode.ts             // developer mode toggle (Shift+Alt+D)
│           │           nav-drawer.ts           // open / closed state of the mobile navigation drawer
│           │           shuffle-order.ts        // utility: randomises answer order
│           │           storage-prefix.ts       // module prefix for every localStorage key
│           │
│           └── shared/
│           │   └── footer/                     // footer component
│           │   └── header/                     // header component
│           │   └── nav-bar/                    // sidebar navigation: the chosen strand as a line of stations
│           │   └── glossary-overlay/           // inline glossary panel (triggered by anchor links)
│           │   │
│           │   └── evaluation/                 // Q+A types for learning pages (retryable)
│           │   │   │   question.types.ts       // shared TypeScript interfaces for question data
│           │   │   └── single-choice/
│           │   │   └── multiple-choice/
│           │   │   └── multiple-choice-image/
│           │   │   └── image-choice/
│           │   │   └── drag-and-drop/            // empty stub, not used by any page
│           │   │
│           │   └── test/                       // Q+A types for test pages (single-submission)
│           │       └── order-images/
│           │       └── single-choice/
│           │       └── multiple-choice/
│           │       └── image-choice/
│           │       └── drag-and-drop/
│           │       └── test-true-false/
│           │       └── end-page/               // results display; triggers progress save
│           │
│           └── features/                       // individual pages
│               └── home/
│               └── glossary/
│               └── glossary_features/          // individual glossary entries
│               │   │   glossary-base.ts
│               │   └── amplitude/
│               │   └── ...
│               │
│               └── learning_features/          // multi-page content modules
│               └── decision_features/          // choice between learning, simulation, or test
│               └── simulation_features/        // Angular-based interactive simulations
│               └── test_features/              // single-submission test pages
│               └── target_features/            // end-of-module guide download + Lernpfad summary
|
```

</details>


## Running Locally

**First-time setup** — copy and fill in the API config:
```bash
cp api/config.example.php api/config.php
# edit api/config.php with your local DB credentials
```

Three processes must be running simultaneously, each in its own terminal:

**1. Database (Docker):**
```bash
sudo docker compose up
```

**2. PHP API** (run from project root):
```bash
php -S localhost:8000 api/router.php
```

**3. Angular dev server:**
```bash
cd frontend && ng serve
```

Then open **`http://localhost:8000/bridge`** — serve `ilias_bridge.html` from the PHP server
so the bridge and API share the same origin.  
The Angular app is also accessible directly at **`http://localhost:4200`** (rogue user session, no DB writes).


## Deploying to the Server

### Automatic (CI/CD — primary method)

Pushing to `master` triggers `.github/workflows/deploy.yml` automatically:
1. GitHub spins up an Ubuntu runner
2. Installs Node, runs `npm ci`, builds the Angular app
3. Writes a production `.htaccess` (`RewriteBase /pohl/`) into the build output
4. Uploads via SFTP: Angular dist incl. that `.htaccess` → `pohl/`, `api/` (excluding `config.php` and the development files), `ilias_bridge.html`

**One-time setup** — add the following five secrets in GitHub → repo → Settings → Secrets and variables → Actions. Ask a maintainer for the values:
`SFTP_HOST`, `SFTP_PORT`, `SFTP_USER`, `SFTP_PASS`, `SFTP_REMOTE_DIR`

To skip the pipeline for a specific commit, include `[skip ci]` in the commit message:
```bash
git commit -m "Update docs [skip ci]"
```

You can also trigger a deploy manually via **GitHub → Actions → Build & Deploy → Run workflow**.

### Manual (fallback)

1. Build the Angular app:
   ```bash
   cd frontend && ng build --base-href "https://interapt.uni-goettingen.de/pohl/"
   ```
2. In `.htaccess`, change `RewriteBase /` to `RewriteBase /pohl/`
3. Upload via SFTP:
   - `frontend/dist/ilias-pohl-module/browser/` → server `pohl/` (the folder contents, not the folder itself)
   - `api/` (excluding `config.php`, `schema.sql`, `router.php`, `config.example.php`) → server `pohl/api/`
   - `ilias_bridge.html` and `.htaccess` → server `pohl/`
4. Revert the `.htaccess` change locally after uploading.

### First-time server setup

1. Create `api/config.php` on the server (copy from `config.example.php`) with production credentials.
<!-- 2. Run `api/schema.sql` once in phpMyAdmin to create the tables. -->

The final structure on the server looks like this:

```
pohl/                        ← your base path
├── index.html               ← Angular app entry point
├── (Angular static files)
├── ilias_bridge.html        ← handles login / session management
├── .htaccess                ← routes Angular URLs + /api/* calls
└── api/
    ├── lib.php
    ├── db.php
    ├── module.php
    ├── users/
    │   ├── check.php
    │   └── create.php
    └── progress/
        ├── save.php
        └── load.php
```


## API

| Method | Endpoint | File | Description |
|--------|----------|------|-------------|
| POST | `/api/users/check` | `users/check.php` | Validate username and course key; check if the user exists |
| POST | `/api/users/create` | `users/create.php` | Register a new user (needs the course key) |
| POST | `/api/progress/save` | `progress/save.php` | Save page visits and question attempts; a row sent twice is stored once |
| GET | `/api/progress/{username}` | `progress/load.php` | Load page visits and the latest attempt per question |


## Database Schema

| Table | Purpose |
|-------|---------|
| `modules` | One row per learning module (e.g. `pohl`) — scopes all user data |
| `users` | One row per username per module; same username allowed across different modules |
| `page_visits` | One row per page visit: route, sub-page, query string, duration |
| `question_attempts` | One row per submitted answer, for learning questions (each retry) and tests (single-submission) |

<!-- Run `api/schema.sql` once in phpMyAdmin (select the `interapt` database first, skip the first two lines).

To delete a user and all their data:
```sql
DELETE FROM users WHERE username = 'max.mustermann'
AND module_id = (SELECT id FROM modules WHERE name = 'pohl');
```
All related rows in `page_visits` and `question_attempts` cascade automatically. -->


## Project Services

### Frontend Services

- **theme.ts:** toggles light / dark mode
- **session.ts:** reads `session_id` from URL (set by bridge page), falls back to generating a `rogue_user_` identifier for direct access; exposes `isRogueUser()`
- **analytics.ts:** tracks page visit durations on route changes
- **results-tracking.ts:** logs learning question answers; allows retries and sends each attempt; per student in `localStorage`
- **test-tracking.ts:** logs test question answers; blocks re-submission of the same question; per student in `localStorage`; `isTestFinished()` tells whether every question of a test was submitted
- **attempt-outbox.ts:** holds each submitted answer, also across reloads, until the server has confirmed it
- **data-export.ts:** sends what the server hasn't confirmed yet, on test completion, when the tab is hidden and on `pagehide`; calls `loadProgress()` on app startup to restore the previous session, and resumes on the last page when entering through the start page; silently skips rogue users
- **visited-pages.ts:** the sub-pages a student has opened, per session id in `localStorage` plus the visits from the saved progress; the nav-bar draws the path reached so far from it and opens the visited sub-pages of the current segment
- **summary.service.ts:** builds a `SummaryData` object from the in-memory tracking state (page visits with human-readable labels, learning questions grouped by module, test results with per-question breakdown); consumed by all target pages to render the Lernpfad summary
- **html-report.service.ts:** generates a self-contained HTML Lernpfad report and triggers a browser download; embeds images as base64 data URIs, renders page content in registry order, and inlines question answers with correct/incorrect feedback; MathJax CDN is included for LaTeX rendering
- **learning-report-registry.ts:** maps every content page route + page number to an ordered list of `ReportBlock[]` entries (text, image, question, spoiler); used by `html-report.service.ts` to produce the report in the correct page-by-page order; also exposes `PAGE_LOOKUP` as a `Map<string, PageDefinition>` for O(1) lookups
- **report-mode.ts:** utility function `isSolutionsMode()` — returns `true` when running in Angular dev mode with `?solutions=1` in the URL; used to gate answer reveals during development
- **storage-prefix.ts:** `'pohl:'`, the prefix of every `localStorage` key holding this module's state; the modules share one origin and so one `localStorage`, and must not read each other's data
- **shuffle-order.ts:** utility that randomises answer order for evaluation and test components
- **nav-drawer.ts:** open / closed state of the sidebar drawer below 900 px; the header's menu button toggles it
- **dev-mode.ts:** developer mode toggle; press `Shift+Alt+D` anywhere to enable/disable; state persists in `sessionStorage` across SPA navigation; when active, shows an amber badge and reveals gated back-navigation buttons on decision, simulation, learning, test, and target pages; SSR-safe


### Shared Components

- **Navigation bar:** the chosen strand as a line of stations, rendered inside `.page-body`: Startseite → the strand's numbered segments → Anleitung. The outer `.nav-bar` fills the grid column from header to footer, and the inner `.nav-bar-container` sticks below the header stripes and scrolls on its own if the viewport is too short. The nav isn't shown on the Startseite: the `nav-hidden` host class makes the page grid drop its column, so the content centres.

  **Reached and clickable** are separate. A row is *reached* (filled marker, dark line, navy text) when it was visited, using `VisitedPages`; a segment also when its decision page was visited, the Anleitung when any target page was. Outside dev-mode only the visited sub-pages of the current segment are *clickable* (`disabled` otherwise, so the tab order skips them). Segments, Startseite and Anleitung aren't, so a box on a row means it can be opened and only appears in dev-mode.

  **Tests:** while an open test is unfinished (`TestTracking.isTestFinished()`), nothing in the nav is clickable, since the learning rows hold the answers. A Test row only opens once its test is finished.

  **Strand:** the chosen strand is shown as plain text above segment 1 and persisted in `localStorage`. In dev-mode a small link beside it switches to the other strand, and Glossar is a plain row below the line.

  **Sub-pages:** the current segment expands its list, except on a decision page. The rows depend on how the student entered the segment (learn / simulation / test flow), and visited rows stay listed. The active sub-page is matched using `router.url` with the `?page=` query param, defaulting to page 1 when the param is absent. Clicking a row within the same page keeps the URL's `flow`; the current row does nothing.

  **Optional deep dives** (`opt-chaos`, `opt-simulation`, and `opt-setup` on the experiment strand) sit below the line under the headline *Optionale Vertiefungen*, without markers. Their segment IDs are strand-neutral, so opening one keeps the current strand. Outside dev-mode the group only appears while one of these pages is open. On the theory strand `opt-setup` is a station of the line, with an icon instead of a number, since every way to the Anleitung leads through it.

- **Glossary overlay:** inline glossary panel triggered by `<a data-glossary="{term}" class="glossary-link">` links in content strings and templates; a `@HostListener('click')` on each learning component intercepts these anchors (using `closest('a[data-glossary]')`) and opens the overlay without navigation. The `data-glossary` attribute (rather than `href="#glossary-"`) prevents the browser from offering "Open in new tab" in the context menu.


### Evaluation Formats (Learning Pages)

- **single-choice:** single correct answer
- **multiple-choice:** multiple correct answers
- **multiple-choice-image:** multiple choice with a reference image
- **image-choice:** choose between images arranged in a grid
- ~~drag-and-drop~~ — empty stub (`shared/evaluation/drag-and-drop`), not used by any page

### Test Formats

- **order-images:** sort images by dragging them up / down
- **single-choice:** single correct answer
- **multiple-choice:** multiple correct answers
- **image-choice:** single correct answer for images
- **drag-and-drop:** assign answers to images
- **test-true-false:** assess individual statements for accuracy; the buttons use the same hover and selection style as the other test options, and a second click on it takes the answer back
- **end-page:** aggregates scores, shows performance feedback, triggers progress save


## Features

### Glossary Features

- **amplitude** ("Amplitude")
- **angular-frequency** ("Kreisfrequenz")
- **angular-momentum** ("Drehmoment")
- **critical-damping** ("Aperiodischer Grenzfall")
- **damping-coefficient** ("Dämpfungskoeffizient")
- **directive-moment** ("Richtmoment")
- **exponential-ansatz** ("Exponentialansatz")
- **hom-dgl** ("Homogene Differentialgleichung")
- **inhom-dgl** ("Inhomogene Differentialgleichung")
- **moment-of-inertia** ("Trägheitsmoment")
- **natural-frequency** ("Eigenschwingfrequenz")
- **resonance-frequency** ("Resonanzfrequenz")
- **spring-constant** ("Federkonstante")


### Learning Features

Question IDs follow the convention `{module}-{n}-{description}` for learning questions and `test-{strand}-{module}-{n}-{description}` for test questions.

**Experimental strand (e-):**

- **e1-intro-experiment** → `/learning/e1-intro-experiment` — Einstieg: Versuchsaufbau (page 1 embeds the Lehrportal's video from YouTube)

<details>
<summary>Questions (6)</summary>

  - `e1-intro-exp-1-schwungrad`
  - `e1-intro-exp-2-feder`
  - `e1-intro-exp-3-wirbelstrombremse`
  - `e1-intro-exp-4-direktionsmoment`
  - `e1-intro-exp-5-winkel-drehmoment`
  - `e1-intro-exp-6-winkel-zeit`

</details>

- **e2-damped-oscillation** → `/learning/e2-damped-oscillations` — Experiment: Gedämpfte Schwingungen

<details>
<summary>Questions (1)</summary>

  - `e2-damped-osc-1-schwungrad`

</details>

- **e3-driven-oscillations** → `/learning/e3-driven-oscillations` — Experiment: Getriebene Schwingungen

<details>
<summary>Questions (8)</summary>

  - `e3-driven-osc-1-dgl-loesen`
  - `e3-driven-osc-2-inhom-dgl`
  - `e3-driven-osc-3-swinging-process`
  - `e3-driven-osc-4-max-amp`
  - `e3-driven-osc-5-damping-resonance-freq`
  - `e3-driven-osc-6-damping-resonance-freq-exp`
  - `e3-driven-osc-7-exciting-frequency`
  - `e3-driven-osc-8-measure-time-delta`

</details>

**Theory strand (t-):**

- **t1-intro-theory** → `/learning/t1-intro-theory` — Einstieg: Theorie

<details>
<summary>Questions (1)</summary>

  - `t1-intro-theory-1-dgl-solutions`

</details>

- **t2-free-oscillations** → `/learning/t2-free-oscillations` — Theorie: Freie Schwingung

<details>
<summary>Questions (6)</summary>

  - `t2-free-osc-1-oscillator`
  - `t2-free-osc-2-reality`
  - `t2-free-osc-3-dgl-matching`
  - `t2-free-osc-4-phase`
  - `t2-free-osc-5-phase-matching`
  - `t2-free-osc-6-pohl`

</details>

- **t3-damped-oscillations** → `/learning/t3-damped-oscillations` — Theorie: Gedämpfte Schwingung

<details>
<summary>Questions (10)</summary>

  - `t3-damped-osc-1-exp-ansatz`
  - `t3-damped-osc-2-gen-solution`
  - `t3-damped-osc-3-schwingfall-condition`
  - `t3-damped-osc-4-schwingfall-matching`
  - `t3-damped-osc-5-exp-factor`
  - `t3-damped-osc-6-amplitude-ratio`
  - `t3-damped-osc-7-log-dekrement`
  - `t3-damped-osc-8-aper-grenzfall`
  - `t3-damped-osc-9-summary-matching`
  - `t3-damped-osc-10-gebaude`

</details>

- **t4-driven-oscillations** → `/learning/t4-driven-oscillations` — Theorie: Getriebene Schwingung

<details>
<summary>Questions (11)</summary>

  - `t4-driven-osc-1-driven-oscillator`
  - `t4-driven-osc-2-pohl-term`
  - `t4-driven-osc-3-gesamtloesung`
  - `t4-driven-osc-4-partikular-ansatz`
  - `t4-driven-osc-5-partikular-loesung`
  - `t4-driven-osc-6-einschwing`
  - `t4-driven-osc-7-amplitude-params`
  - `t4-driven-osc-8-damping-amplitude`
  - `t4-driven-osc-9-versuch`
  - `t4-driven-osc-10-resonanz-phase`
  - `t4-driven-osc-11-messung`

</details>

- **opt-chaos** → `/learning/opt-chaos` — Nichtlineare Schwingungen und Chaos (2 pages; no questions)

- **opt-simulation** → `/learning/opt-simulation` — Grundbausteine Simulation: DGLs numerisch lösen (single page; Jupyter Notebook download; no questions)

- **opt-setup** → `/learning/opt-setup` — Versuchsaufbau: Der Pohlsche Resonator (single page with the Lehrportal's video; shared intermediate stop for three paths — routes to `tar-theory`, `tar-chaos`, or `tar-simulation` depending on `?next=` query param)


### Decision Features

Decision pages present the user with a choice between the conventional learning module, an interactive simulation, and a test. Cards are colour-coded by destination type.

**Experimental strand:**
- **dec-e-damped-oscillations** → `/decision/dec-e-damped` — Gedämpfte Schwingungen
- **dec-e-driven-oscillations** → `/decision/dec-e-driven` — Getriebene Schwingungen

**Theory strand:**
- **dec-t-damped-oscillations** → `/decision/dec-t-damped` — Gedämpfte Schwingungen
- **dec-t-driven-oscillations** → `/decision/dec-t-driven` — Getriebene Schwingungen


### Test Features

Tests use single-submission question formats. The `e-` prefix denotes the experimental strand, the `t-` prefix the theoretical strand.

- **test-e-damped-oscillations** → `/test/test-e-damped` — Test: Gedämpfte Schwingungen

<details>
<summary>Questions (5)</summary>

  - `test-e-damped-osc-1-daempfungsstaerke`
  - `test-e-damped-osc-2-federkonstante`
  - `test-e-damped-osc-3-frequency-damping`
  - `test-e-damped-osc-4-log-decrement`
  - `test-e-damped-osc-5-phase-space`

</details>

- **test-e-driven-oscillations** → `/test/test-e-driven` — Test: Getriebene Schwingungen

<details>
<summary>Questions (4)</summary>

  - `test-e-driven-osc-1-gesamtgleichung`
  - `test-e-driven-osc-2-einschwingen`
  - `test-e-driven-osc-3-resonance-freq`
  - `test-e-driven-osc-4-resonance-damping`

</details>

- **test-t-damped-oscillation** → `/test/test-t-damped` — Test: Gedämpfte Schwingungen — Theorie (URL-restorable via `?page=`)

<details>
<summary>Questions (5)</summary>

  - `test-t-damped-osc-1-daempfungsstaerke`
  - `test-t-damped-osc-2-federkonstante`
  - `test-t-damped-osc-3-frequency-damping`
  - `test-t-damped-osc-4-log-decrement`
  - `test-t-damped-osc-5-phase-space`

</details>

- **test-t-driven-oscillation** → `/test/test-t-driven` — Test: Getriebene Schwingungen — Theorie (URL-restorable via `?page=`)

<details>
<summary>Questions (4)</summary>

  - `test-t-driven-osc-1-gesamtgleichung`
  - `test-t-driven-osc-2-einschwingen`
  - `test-t-driven-osc-3-resonance-freq`
  - `test-t-driven-osc-4-resonance-damping`

</details>


### Target Features

Target pages are reached at the end of a module strand. They offer downloadable experiment guides tailored to the student's earlier choice of focus and openness level, followed by an expandable **Lernpfad summary** (visited pages, learning questions with answers, test results). All users can download the full Lernpfad as a self-contained HTML file.

- **tar-experiment** → `/target/tar-experiment` — Anleitung: Versuchsdurchführung (Experimentalpfad)
    - Guide E1: Fokus Charakterisierung des Aufbaus (konkretere Angaben) — `Anleitung_E1.pdf`
    - Guide E2: Fokus Charakterisierung des Aufbaus (freierer Versuchsgestaltung) — `Anleitung_E2.pdf`
    - Guide E3: Fokus Auswertemethoden — `Anleitung_E3.pdf`
    - Analysis notebook — `Analysehilfe_2.ipynb`

- **tar-theory** → `/target/tar-theory` — Anleitung: Theoretische Analyse (Theoriepfad)
    - Guide T1: Analytische Auswertung — `Anleitung_T1.pdf`
    - Guide T2: Numerische Auswertung — `Anleitung_T2.pdf`
    - Analysis notebook — `Analysehilfe_2.ipynb`

- **tar-chaos** → `/target/tar-chaos` — Anleitung: Nichtlineare Schwingungen (Chaospfad)
    - Guide A — `Anleitung_A.pdf`
    - Analysis notebook — `Analysehilfe_2.ipynb`

- **tar-simulation** → `/target/tar-simulation` — Anleitung: Simulation (Simulationspfad)
    - Guide P — `Anleitung_P.pdf`
    - Analysis notebook — `Analysehilfe_2.ipynb`


### Simulation Features

Angular components (interactive, use canvas / MathJax — served client-side):

**Experimental strand:**
- **sim-e-damped-oscillations** → `/simulation/sim-e-damped` — Simulation: Gedämpfte Schwingungen
- **sim-e-driven-oscillations** → `/simulation/sim-e-driven` — Simulation: Getriebene Schwingungen

**Theory strand:**
- **sim-t-free** → `/simulation/sim-t-free` — Simulation: Freie (ungedämpfte) Schwingung
- **sim-t-damped** → `/simulation/sim-t-damped` — Simulation: Gedämpfte Schwingung
- **sim-t-driven** → `/simulation/sim-t-driven` — Simulation: Gedämpfte getriebene Schwingung
- **sim-t-driven-advanced** → `/simulation/sim-t-driven-advanced` — Simulation: Gedämpfte getriebene Drehschwingung