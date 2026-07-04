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
│       │   styles.css                          // main stylesheet
│       │   styles_glossary.css                 // stylesheet for the glossary
│       │   styles_evaluation.css               // stylesheet for the evaluation types
│       │   styles_test.css                     // stylesheet for the test evaluations
│       │
│       └── assets/                             // images, icons, etc.
│       │
│       └── app/
│           │   app.html                        // general page structure
│           │   app.routes.ts                   // contains all the routing
│           │
│           └── core/
│           │   └── services/                   // project-wide services
│           │           theme.ts                // light / dark mode toggling
│           │           session.ts              // session ID management + rogue user detection
│           │           analytics.ts            // page visit tracking
│           │           results-tracking.ts     // learning module answer logging
│           │           test-tracking.ts        // test answer logging (single-submission)
│           │           data-export.ts          // aggregates all tracking; saves to / loads from API
│           │
│           └── shared/
│           │   └── footer/                     // footer component
│           │   └── header/                     // header component
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
│           │       └── drag-and-drop/
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
│               └── learning_features/          // standard content pages
│               └── decision_features/          // decision between (next) content page, simulation, or test 
│               └── test_features/
│               └── sidepath_features/
│               └── target_features/
│
└── public/
    └── simulations/                            // standalone HTML simulation pages (static)
```


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

1. Build the Angular app:
   ```bash
   cd frontend && ng build --base-href ng build --base-href "https://interapt.uni-goettingen.de/pohl/"
   ```
2. Upload to the server:
   - `frontend/dist/.../browser/` → server base path (static files), rename `browser/` to `pohl/` and upload to server
   - `api/` → server base path `/api/`
   - `ilias_bridge.html` → server base path
   - `.htaccess` → server base path
3. Create `api/config.php` on the server (from `config.example.php`) with production credentials.
4. Set `RewriteBase` in `.htaccess` to match the server sub-path.
<!-- 5. Run `api/schema.sql` once in phpMyAdmin to create the tables. -->

The final structure on the server is supposed to look like this:

```
pohl/                        ← your base path
├── index.html               ← Angular app entry point
├── (Angular static files)
├── ilias_bridge.html        ← handles login / session management
├── .htaccess                ← routes Angular URLs + /api/* calls
└── api/
    ├── db.php               ← shared DB connection
    ├── module.php           ← shared getModuleId() helper
    ├── users/
    │   ├── check.php        ← POST /api/users/check
    │   └── create.php       ← POST /api/users/create
    └── progress/
        ├── save.php         ← POST /api/progress/save
        └── load.php         ← GET  /api/progress/load?username=...
```


## API

| Method | Endpoint | File | Description |
|--------|----------|------|-------------|
| POST | `/api/users/check` | `users/check.php` | Validate course key; check if username exists |
| POST | `/api/users/create` | `users/create.php` | Register a new user |
| POST | `/api/progress/save` | `progress/save.php` | Save analytics, module results, and test results |
| GET | `/api/progress/{username}` | `progress/load.php` | Load all saved progress for a user |


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
- **drag-and-drop:** assign answers to images
- **image-choice:** single correct answer for images
- **test-true-false:** assess individual statements for accuracy


## Features

### Glossary Features

- **amplitude** ("Amplitude")
- **angular-frequency** ("Kreisfrequenz")
- **angular-momentum** ("Drehmoment")
- **critical-damping** ("Aperiodischer Grenzfall")
- **damping-coefficient** ("Dämpfungskoeffizient")
- **exponential-ansatz** ("Exponentialansatz")
- **hom-dgl** ("Homogene Differentialgleichung")
- **inhom-dgl** ("Inhomogene Differentialgleichung")
- **moment-of-inertia** ("Trägheitsmoment")
- **natural-frequency** ("Eigenschwingfrequenz")
- **spring-constant** ("Federkonstante")


### Learning Features

- **intro-experiment:**
    - *intro-exp-1-schwungrad*
    - *intro-exp-2-feder*
    - *intro-exp-3-wirbelstrombremse*
    - *intro-exp-4-direktionsmoment*
    - *intro-exp-5-winkel-drehmoment*
    - *intro-exp-6-winkel-zeit*


### Decision Features



### Test Features

- **damped-oscillations:**
    - *damped-osc-1-daempfungsstaerke*
    - *damped-osc-2-federkonstante*
    - *damped-osc-3-frequency-damping*
    - *damped-osc-4-log-decrement*
    - *damped-osc-5-phase-space*


### Sidepath Features

### Target Features

- **simulation:**
- **chaos:**
- **common-free:**
- **common-technical:**
- **setup-free:**
- **setup-concrete:**
- **evaluation-comparison:**


### Simulation Features

Angular component:
- **damped-oscillations-experiment** → `/simulation/damped-oscillations-experiment`

Standalone HTML pages (in `frontend/public/simulations/`):
- **undamped-linear** → `/simulation/undamped-linear`
- **damped-linear** → `/simulation/damped-linear`
- **damped-driven-linear** → `/simulation/damped-driven-linear`
- **damped-driven-rot** → `/simulation/damped-driven-rot`
- **damped-rot** → `/simulation/damped-rot`
- **damped-rot-advanced** → `/simulation/damped-rot-advanced`
- **damped-rot-v2** → `/simulation/damped-rot-v2`
- **damped-driven-rot-intro** → `/simulation/damped-driven-rot-intro`
- **damped-driven-rot-advanced** → `/simulation/damped-driven-rot-advanced`
