# Lernmodul zum Pohlschen Resonator

Lernmodul zum Experiment "Der Pohlsche Resonator" des Grundpraktikums zur Experimentalphysik I der Georg-August Universität Göttingen.

The project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4. with strong help of Claude (Sonnet 4.5 / 4.6).


## Project Structure Tree

```
ilias_bridge.html                               // entry point from ILIAS; username + key form
.htaccess                                       // production routing: /api/* → PHP, rest → index.html
docker-compose.yml                              // local MySQL container (dev only)
.gitignore
README.md
│
├── api/                                        // PHP backend
│       config.php                              // DB credentials + module config (gitignored)
│       config.example.php                      // template for config.php
│       db.php                                  // PDO connection (singleton)
│       module.php                              // resolves MODULE_NAME → modules.id
│       router.php                              // local dev router (php -S only)
│       schema.sql                              // database schema (run once to initialise)
│       report.php                              // POST /api/report — generates Lernpfad PDF (FPDF)
│       composer.json                           // PHP dependencies (FPDF)
│       vendor/                                 // FPDF library — run `composer install`, then upload
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
│           │   app.html                        // general page structure
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
│           │           data-export.ts          // aggregates all tracking; saves to / loads from API
│           │           summary.service.ts      // builds SummaryData for Lernpfad display + PDF
│           │           dev-mode.ts             // developer mode toggle (Shift+Alt+D)
│           │           shuffle-order.ts        // utility: randomises answer order
│           │
│           └── shared/
│           │   └── footer/                     // footer component
│           │   └── header/                     // header component
│           │   └── glossary-overlay/           // inline glossary panel (triggered by anchor links)
│           │   │
│           │   └── evaluation/                 // Q+A types for learning pages (retryable)
│           │   │   └── single-choice/
│           │   │   └── multiple-choice/
│           │   │   └── multiple-choice-image/
│           │   │   └── image-choice/
│           │   │   └── drag-and-drop/
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
│               └── sidepath_features/
│               └── target_features/            // end-of-module guide download + Lernpfad summary
│
└── public/
    └── simulations/                            // standalone HTML simulation pages (static)
```


## Running Locally

**First-time setup** — copy and fill in the API config, then install PHP dependencies:
```bash
cp api/config.example.php api/config.php
# edit api/config.php with your local DB credentials

cd api && composer install && cd ..
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

1. Install PHP dependencies locally and build the Angular app:
   ```bash
   cd api && composer install && cd ..
   cd frontend && ng build --base-href "https://interapt.uni-goettingen.de/pohl/"
   ```
2. Upload to the server:
   - `frontend/dist/.../browser/` → server base path (static files), rename `browser/` to `pohl/` and upload to server
   - `api/` → server base path `/api/` (including the `vendor/` folder)
   - `ilias_bridge.html` → server base path
   - `.htaccess` → server base path
3. Create `api/config.php` on the server (from `config.example.php`) with production credentials.
4. Set `RewriteBase` in `.htaccess` to match the server sub-path.
<!-- 5. Run `api/schema.sql` once in phpMyAdmin to create the tables. -->

> **Note:** SSH is not available on the deployment server. Run `composer install` locally and upload the resulting `api/vendor/` folder via SFTP. Only needs to be repeated if `composer.json` changes.

The final structure on the server is supposed to look like this:

```
pohl/                        ← your base path
├── index.html               ← Angular app entry point
├── (Angular static files)
├── ilias_bridge.html        ← handles login / session management
├── .htaccess                ← routes Angular URLs + /api/* calls
└── api/
    ├── db.php
    ├── module.php
    ├── report.php           ← POST /api/report (PDF generation)
    ├── composer.json
    ├── vendor/              ← FPDF library (upload after composer install)
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
| POST | `/api/users/check` | `users/check.php` | Validate course key; check if username exists |
| POST | `/api/users/create` | `users/create.php` | Register a new user |
| POST | `/api/progress/save` | `progress/save.php` | Save analytics, module results, and test results |
| GET | `/api/progress/{username}` | `progress/load.php` | Load all saved progress for a user |
| POST | `/api/report` | `report.php` | Accept `SummaryData` JSON; return a formatted Lernpfad PDF |


## Database Schema

| Table | Purpose |
|-------|---------|
| `modules` | One row per learning module (e.g. `pohl`) — scopes all user data |
| `users` | One row per username per module; same username allowed across different modules |
| `page_visits` | Page visit durations per session |
| `module_results` | Learning module question answers (retryable) |
| `test_results` | Test question answers (single-submission) |

<!-- Run `api/schema.sql` once in phpMyAdmin (select the `interapt` database first, skip the first two lines).

To delete a user and all their data:
```sql
DELETE FROM users WHERE username = 'max.mustermann'
AND module_id = (SELECT id FROM modules WHERE name = 'pohl');
```
All related rows in `page_visits`, `module_results`, and `test_results` cascade automatically. -->


## Project Services

### Frontend Services

- **theme.ts:** toggles light / dark mode
- **session.ts:** reads `session_id` from URL (set by bridge page), falls back to generating a `rogue_user_` identifier for direct access; exposes `isRogueUser()`
- **analytics.ts:** tracks page visit durations on route changes
- **results-tracking.ts:** logs learning question answers; allows retries, increments `attemptCount`
- **test-tracking.ts:** logs test question answers; blocks re-submission of the same question
- **data-export.ts:** aggregates all three tracking services; calls `saveProgress()` on test completion and on `beforeunload`; calls `loadProgress()` on app startup to restore previous session; silently skips rogue users
- **summary.service.ts:** builds a `SummaryData` object from the in-memory tracking state (page visits with human-readable labels, learning questions grouped by module, test results with per-question breakdown); consumed by all target pages to render the Lernpfad summary and generate the PDF
- **shuffle-order.ts:** utility that randomises answer order for evaluation and test components
- **dev-mode.ts:** developer mode toggle; press `Shift+Alt+D` anywhere to enable/disable; state persists in `sessionStorage` across SPA navigation; when active, shows an amber badge and reveals gated back-navigation buttons on decision, simulation, learning, test, and target pages; SSR-safe


### Shared Components

- **glossary-overlay:** inline glossary panel triggered by `<a href="#glossary-{term}">` links anywhere in the app; handled via a `@HostListener('click')` on the host component that intercepts these anchors and opens the overlay without a full navigation


### Evaluation Formats (Learning Pages)

- **single-choice:** single correct answer
- **multiple-choice:** multiple correct answers
- **multiple-choice-image:** multiple choice with a reference image
- **image-choice:** choose between images arranged in a grid
- **drag-and-drop:** match items by dragging

### Test Formats

- **order-images:** sort images by dragging them up / down
- **single-choice:** single correct answer
- **multiple-choice:** multiple correct answers
- **image-choice:** single correct answer for images
- **drag-and-drop:** assign answers to images
- **test-true-false:** assess individual statements for accuracy
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

**Experimental strand (e-):**

- **e1-intro-experiment** → `/learning/e1-intro-experiment` — Einstieg: Versuchsaufbau
    - *intro-exp-1-schwungrad*
    - *intro-exp-2-feder*
    - *intro-exp-3-wirbelstrombremse*
    - *intro-exp-4-direktionsmoment*
    - *intro-exp-5-winkel-drehmoment*
    - *intro-exp-6-winkel-zeit*

- **e2-damped-oscillation** → `/learning/e2-damped-oscillations` — Experiment: Gedämpfte Schwingungen
    - *damped-osc1*
    - *damped-osc2*
    - *damped-osc3*

- **e3-driven-oscillations** → `/learning/e3-driven-oscillations` — Experiment: Getriebene Schwingungen
    - *driven-osc1* … *driven-osc7*

**Theory strand (t-):**

- **t1-intro-theory** → `/learning/t1-intro-theory` — Einstieg Theoriepfad (single page)

- **t2-free-oscillations** → `/learning/t2-free-oscillations` — Theorie: Freie Schwingung
    - *free_osc1*
    - *free_osc2*

- **t3-damped-oscillations** → `/learning/t3-damped-oscillations` — Theorie: Gedämpfte Schwingung
    - *damped_osc1* … *damped_osc5*

- **t4-driven-oscillations** → `/learning/t4-driven-oscillations` — Theorie: Getriebene Schwingung
    - *driven_osc1* … *driven_osc8*

- **t-chaos** → `/learning/t-chaos` — Nichtlineare Schwingungen und Chaos
    - *chaos_1* … *chaos_4* (URL-restorable via `?page=`)

- **t-simulation** → `/learning/t-simulation` — Grundbausteine Simulation: DGLs numerisch lösen (single page; Jupyter Notebook download)

- **t-setup** → `/learning/t-setup` — Versuchsaufbau: Der Pohlsche Resonator (single page; shared intermediate stop for three paths — routes to `tar-theory`, `tar-chaos`, or `tar-simulation` depending on `?next=` query param)


### Decision Features

Decision pages present the user with a choice between the conventional learning module, an interactive simulation, and a test. Cards are colour-coded by destination type.

**Experimental strand:**
- **dec-e-damped-oscillations** → `/decision/e-damped-oscillations` — Gedämpfte Schwingungen
- **dec-e-driven-oscillations** → `/decision/e-driven-oscillations` — Getriebene Schwingungen

**Theory strand:**
- **dec-t-damped-oscillations** → `/decision/t-damped-oscillations` — Gedämpfte Schwingungen
- **dec-t-driven-oscillations** → `/decision/t-driven-oscillations` — Getriebene Schwingungen


### Test Features

Tests use single-submission question formats. The `e-` prefix denotes the experimental strand (reached after the experiment learning modules), the `t-` prefix the theoretical strand (reached after the theory modules).

- **test-e-damped-oscillations** → `/test/e-damped-osc` — Test: Gedämpfte Schwingungen (5 questions + results)
- **test-e-driven-oscillations** → `/test/e-driven-osc` — Test: Getriebene Schwingungen (4 questions + results)
- **test-t-damped-oscillation** → `/test/t-damped-osc` — Test: Gedämpfte Schwingungen — Theorie (6 questions + results; URL-restorable via `?page=`)
- **test-t-driven-oscillation** → `/test/t-driven-osc` — Test: Getriebene Schwingungen — Theorie (5 questions + results; URL-restorable via `?page=`)


### Target Features

Target pages are reached at the end of a module strand. They offer downloadable experiment guides tailored to the student's earlier choice of focus and openness level, followed by an expandable **Lernpfad summary** (visited pages, learning questions with answers, test results). Authenticated users (non-rogue sessions) can download the full Lernpfad as a PDF via `POST /api/report`.

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
- **sim-e-damped-oscillations** → `/simulation/sim-e-damped-osc` — Simulation: Gedämpfte Schwingungen
- **sim-e-driven-oscillations** → `/simulation/sim-e-driven-osc` — Simulation: Getriebene Schwingungen

**Theory strand:**
- **sim-t-undamped** → `/simulation/sim-t-undamped` — Simulation: Freie (ungedämpfte) Schwingung
- **sim-t-damped** → `/simulation/sim-t-damped` — Simulation: Gedämpfte Schwingung
- **sim-t-driven** → `/simulation/sim-t-driven` — Simulation: Gedämpfte getriebene Schwingung
- **sim-t-driven-advanced** → `/simulation/sim-t-driven-advanced` — Simulation: Gedämpfte getriebene Drehschwingung

Standalone HTML pages (static files in `frontend/public/simulations/`, served via redirect guard):

- `/simulation/theory-undamped` — Ungedämpfte Schwingung (Einstieg)
- `/simulation/theory-damped` — Gedämpfte Schwingung (Einstieg)
- `/simulation/theory-damped-driven` — Gedämpfte getriebene Schwingung (Einstieg)
- `/simulation/theory-damped-driven-advanced` — Gedämpfte getriebene Drehschwingung (Vertiefung)
- `/simulation/experiment-damped-driven` — Getriebene Drehschwingung (Einleitung)
- `/simulation/experiment-damped-driven-advanced` — Getriebene Drehschwingung (Vertiefung)
