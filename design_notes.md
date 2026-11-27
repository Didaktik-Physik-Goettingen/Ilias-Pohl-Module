# Design notes — Lernmodul „Pohlscher Resonator“

What was built and why: the decisions behind the module, for anyone (or any Claude session) who extends this module or builds the next one. **How to** set up, run, deploy and extend it is in `README.md` and the developer guide `.learning_module_readme.md` (gitignored, kept locally); this file doesn't repeat them.

Built by Carlo (physics education group, Göttingen) with Claude, 2026-02-13 to 2026-11-10. Test questions and formats and the chaos pages by Josefine Neuhaus (2026-06), the revision of the test selection and of the learning questions and feedback by Melissa Atik (2026-08 to 2026-10).

Related: the sister module [Ilias-Precession-Module](https://github.com/CVC97/Ilias-Precession-Module) (`../ilias-precession-module/`) took its infrastructure from here and has its own `design_notes.md`; the design of both modules was redone there first (section 2). The portal `../interapt-portal/` holds the landing page at the server root, the login shared by all modules, the PHP API and the schema (section 6); its own `design_notes.md` has the login model.


## 1 Status (2026-11-10)

Live at `https://interapt.uni-goettingen.de/pohl/`, not yet used in a course. Two strands (experiment: 3 segments, theory: 4) on seven learning routes with 30 sub-pages, three optional pages, four decision pages, four scored tests, six canvas simulations and four target pages with guides, summary and HTML report. 43 retryable learning questions, 18 test questions, 14 glossary terms. Open items: section 10.


## 2 Concept

### What the students prepare for

Versuch 3 *Der Pohlsche Resonator* (Grundpraktikum Experimentalphysik I, script chapter 3). In the lab they record, computer-controlled, the free oscillation at four positions of the eddy current brake (0, 4, 6, 8 mm, released by hand from 120°) and the forced oscillation at three dampings (4, 6, 8 mm) for 10 excitation frequencies between 150 and 600 mHz, plus five near the resonance. The Auswertung determines ω_e, the logarithmic decrement Λ and β from the decay curves, then ω₀, plots resonance and phase curves over ω/ω₀ and compares the measured ω_r with the expected one.

### Decisions

| Decision | Why |
|---|---|
| **Two strands with the same physics**: Experiment (from the real setup to the formula) and Theorie (from the equation to the setup) | Students differ in prior knowledge and interests; the module lets them choose their way in (project aim: individual learning paths). The start page shows both side by side with the shared core (DGL, ω₀, damping, resonance, phase). |
| **Decision pages before each topic**: learning module, simulation or test | Students decide how they learn: the learning pages then the simulation, the simulation then the learning pages, or straight to the test. The two learning orders cover the same pages (`flow` in the URL), the test is the shortcut for students who already know it. |
| **Scored, single-submission tests**, pass mark 80 % | A test checks whether the shortcut was justified. Passed: on to the next topic (after the driven test, to the guide). Failed: back to the decision page, where the test is then greyed out (`testDisabled`), so the way leads through the learning pages. In the precession module tests were dropped for that reason: without decision pages they'd only be a shortcut. |
| **Yellow means test** | `--physik-gelb` marks tests everywhere: headings, test buttons, the test card on decision pages, the box borders in tests. It is a meaning, not decoration. |
| **Optional deep dives**: chaos, numerical simulation, Versuchsaufbau | Offered after a passed driven test (links in the end page's message), and Versuchsaufbau is the theory strand's last station before its guide. Chaos and simulation lead to guides of their own (A, P). |
| **A guide tailored to the way taken** | Target pages offer guides by focus and openness: experiment strand E1 (setup, more concrete), E2 (setup, more open), E3 (analysis); theory strand T1 (concrete), T2 (free design); A (chaos) and P (simulation); each with the analysis notebook. Below: the student's Lernpfad and the HTML report. |
| **Infrastructure shared with the precession module** | Tracking services, summary and report are identical there. The login, the PHP API and the database `interapt` are one copy for both, in the portal (section 6). |
| **The nav is a line of stations, but only visited sub-pages of the current segment open** (Carlo, 2026-11-01) | Taken over from the precession design. Unlike there, segments, Startseite and Anleitung never open outside dev mode, so students can't jump between chapters past the decision pages. A row is *reached* (filled navy marker) when visited, a segment also when its decision page was, the Anleitung when any target page was. |
| **Tests lock the nav** | A test can be reopened and has no route guard. While it is unfinished, no row opens, since the learning rows of the same chapter hold the answers; a test row only opens once that test is finished (`isTestFinished()`, not `percentageScore`, which `endTest()` also writes for a test left half-way). |
| **Only the chosen strand on the line** (2026-11-01) | The old strand switcher looked like tabs but couldn't be clicked outside dev mode. The strand's name is plain text above segment 1; dev mode offers the other strand as a small link. On the theory strand Versuchsaufbau (`opt-setup`) is a station with a wrench instead of a number, since every way to its guide leads through it; on the experiment strand it is an optional page. |
| **No nav on the Startseite** (Carlo) | Consistent between both modules; the page grid drops the column and the content centres. |
| **The precession design, taken over** (Carlo, 2026-11-01) | Three surfaces (nav < main < boxes), no floating card, the centred 62 rem column, 15 px base font, justified and hyphenated text, boxes following the theme. Reasons: precession `design_notes.md`, section 2. Only figures and simulation canvases keep their white plates. |
| **Gated "Weiter" greyed out, never hidden** (Carlo, PR #22, 2026-10-30) | The same rule as in the precession module: the button shows that there is a way on and what blocks it. Dev mode releases it. |
| **The Lehrportal's video on Einstieg: Versuchsaufbau (1/4) and on Versuchsaufbau** (Carlo, 2026-11-09) | The German video „Praktikum zu Experimentalphysik I: 3 - Pohlscher Resonator“ replaces the photo-and-sketch figure there; (2/4) Komponenten keeps the labelled figure as reference for its questions. The HTML report can't embed a video: it shows the labelled figure with the video link as caption. Same pattern as in the precession module. |
| **Segment names like the precession module**: „Einstieg: Versuchsaufbau“, „Einstieg: Theorie“ (Carlo, 2026-11-09) | Consistency between the modules; the summary and the HTML report use the same names („[E-1] Einstieg: Versuchsaufbau“, „[T-1] Einstieg: Theorie“). |
| **Mental-effort rating after each learning route, in a pop-up** (Carlo, 2026-11-24; same in the precession module) | For research: Paas's single-item 9-point scale (1 „sehr, sehr geringe“ … 9 „sehr, sehr hohe geistige Anstrengung“), asked on the last learning sub-page's „Weiter“, while the unit is fresh. It is the learning route that is rated, not the segment: the same content for every student, whichever order they chose; the flow is stored with the rating, so learning-first and simulation-first can be compared, and with the first attempts per question the instructional efficiency per unit can be computed. Five units (E2, E3; T2 with T1's single page, T3, T4); simulations, tests and the optional pages are not rated, so test-shortcut students give no rating for that topic. Einstieg: Versuchsaufbau (E1) is not rated either (Carlo, 2026-11-25; likewise the precession module's Versuchsaufbau and Messstrategie): a guide to the apparatus rather than learning content, and each pop-up fewer is a gain for the students. A modal pop-up on a neutral surface („Begleitforschung“, „gehört nicht zum Lernmodul“) marks it as not part of the learning, and it stays out of the Lernpfad and the report. **Nine labelled buttons, nothing preselected, no slider**: a slider's thumb needs a start position, which anchors the answers and makes an untouched default look like an answer. **Voluntary**: „Keine Angabe“ stores NULL; „Weiter“ is greyed out until a choice; backdrop and Esc don't close it. Asked once per unit and student (also across devices); never for guests or in dev mode. It measures perceived mental effort, a proxy for cognitive load that doesn't separate its kinds: say so in publications. |
| **Start page cards and decision cards: hover changes background and border, nothing moves** (Carlo, 2026-11-10) | Calm, and the same on both modules and the landing page. The buttons stay for now: on decision pages a click has consequences (a test locks the nav), so a deliberate button beats a card-wide click. |
| **Weiter/Zurück: white with a navy edge, a navy tint on hover** (Carlo, 2026-11-25; same in the precession module and on the portal's login page) | Before, the fill went from just below the page colour (`--bg-primary`) to white: 1.1:1, a hover hardly visible in either theme. Now `--button-color` is `--card-bg` and `--button-color-hover` a 14 % navy tint (1.3:1 light, 1.5:1 dark); edge and text stay. Calmer than turning navy, which stays the sign of Auswerten, tests and decision buttons (filled, outline on hover). Inside a box (effort pop-up, session dialog) no shadow, the box lifts them. „Keine Angabe“ in the effort pop-up is a quiet grey button (`--quiet-fill-hover`) like the portal's guest button: a way aside, ranked below „Weiter“, with a full-size touch target. |
| **Glossar as an overlay, open to everyone** (Carlo, 2026-11-27; same in the precession module) | Students should find every term at any time without leaving the page. One dialog with two views: the list with search, and a term; a card switches to it, „← Alle Begriffe“ goes back with the search kept; links in the text open a term directly, with the same way back. No routing, so the nav's rules are untouched. All terms always (no "met so far"). The routed list page and its dev-mode nav row are gone; the term routes `/glossary/<slug>` stay for direct links and screenshots, without their back button. One registry, `features/glossary/glossary-terms.ts`, feeds the list, the dialog and the routes (before: three hand-kept lists). |
| **Glossar and Markierungen at the bottom of the nav; on phones as icons in the header** (2026-11-27) | Desktop: pinned to the bottom of the nav column, on the nav's surface, so it covers no content. Phones: the nav is a drawer and „Zurück“ sits at the bottom left, so a floating pair there would cover it; two icons beside the theme toggle instead. Not on the Startseite (Carlo). **Greyed out during an unfinished test** (Carlo: no access during tests), by the nav lock's own rule (`StudyAidsLock`, which `NavBar.isTestLocked` now uses): the glossary and the marks would be a crib sheet. The number of marks is shown on the button. |
| **Markierungen: two kinds, „Wichtig“ (green) and „Unklar“ (orange), highlighted on the page** (Carlo, 2026-11-27; same in the precession module; idea and assessment with JC) | Students mark passages on the learning pages and find them again on the page, in „Meine Markierungen“, on the Anleitung's „Offene Stellen“ (unclear ones), in the Lernpfad and in the report. **Where the colour is a highlight, and where a bar:** highlighted in running text (the page, the report, „Im Text ansehen“); in the lists („Meine Markierungen“, Offene Stellen, the Lernpfad) the quote is plain text with its kind as a bar on the left (Carlo). The overlay has three tabs, „Alle“ (first, open by default), „Wichtig“, „Unklar“; it stays where it opened with „Alle“, so a shorter tab doesn't move it. **No new controls** (Carlo): choosing a kind or a view (the bar's Wichtig/Unklar, the overlay's tabs Alle/Wichtig/Unklar) looks like the questions' answer options, outlined when chosen (`.mark-option`), with a small square in the kind's colour beside its name; „Entfernen“ is the quiet button of „Keine Angabe“ and „Geklärt“ a checkbox of the same size and quietness (`.mark-check`); „Im Text ansehen“ is a small Zurück-style `.btn`; the glossary's „← Alle Begriffe“ stays quiet, like the title it replaces. **Two steps:** select, then a small bar beside the selection's end asks „Wichtig | Unklar“ (below it on phones, where the system's own menu is above); while it asks, the passage shows in a light blue. No ✕ (Carlo): Esc or a click elsewhere closes the bar. One bar (Carlo), its options as segments without edges of their own, so no double edge; hover and the chosen kind fill a segment to the bar's edge. **Highlighted on the page for good** (Carlo, after first trying a passage that only flashed and faded): green, orange, a fainter orange for an unclear one set to „Geklärt“; a click on a mark opens the bar again, to switch its kind or „Entfernen“. A new selection that overlaps a mark is refused („Überschneidet eine Markierung“), so colours never mix. **Two kinds** (Carlo, against JC's first advice of one): „Unklar“ feeds the Offene Stellen and tells which passages students find hard. Orange, though the lamp boxes are orange too: their tint is faint, the mark's is stronger (Carlo). Not yellow (tests). **No free-text notes** (Carlo): free text can hold anything personal. **No link from a mark to its passage** (Carlo): it would bypass the nav's rules; „Im Text ansehen“ shows the passage in an overlay instead. **Formulas count whole and are kept as TeX** (`$…$`, as in the content strings): 91 of 109 text blocks contain a formula (precession: 63 of 86), so marks without them would leave little to mark; Carlo set the condition that formulas must look clean, checked on screenshots first. Words count whole too (touch selections are coarse). Only on `/learning/` pages; not in questions, feedback, simulations or controls (`MARK_EXCLUDE` in `mark-anchor.ts`); not during a test. |
| **„Offene Stellen“: the first sub-page of each Anleitung** (Carlo, 2026-11-27; precession: of the Abschluss) | Before the guide, the unclear marks by page, each with „Im Text ansehen“ and „Geklärt“; nothing has to be ticked off to go on. Purple, as part of the Anleitung; the nav's Anleitung row gets two sub-pages, (1/2) Offene Stellen and (2/2) Anleitung, as `?page=1|2` on the guide's route, so every link into a guide still lands on the first. Always there, also without unclear marks (one line then): a sub-page that only sometimes exists would make the (1/2) unreliable. **„Im Text ansehen“ is an overlay, not a jump** (Carlo): the page's text from the report registry (texts, light-bulb boxes, captions, images; no questions or simulations) with the passage highlighted and scrolled to; closing it leaves the student where they were. |

### Learning paths

| Strand | Segment | Learning route (sub-pages) | Decision | Simulation | Test |
|---|---|---|---|---|---|
| E | 1 Einstieg: Versuchsaufbau | `e1-intro-experiment` (4) | — | — | — |
| E | 2 Gedämpfte Schwingungen | `e2-damped-oscillations` (3) | `dec-e-damped` | `sim-e-damped` | `test-e-damped` (5 questions) |
| E | 3 Getriebene Schwingungen | `e3-driven-oscillations` (7) | `dec-e-driven` | `sim-e-driven` | `test-e-driven` (4) → `tar-experiment` |
| T | 1 Einstieg: Theorie | `t1-intro-theory` (1) | — | — | — |
| T | 2 Freie Schwingungen | `t2-free-oscillations` (2), links to `sim-t-free` | — | `sim-t-free` | — |
| T | 3 Gedämpfte Schwingungen | `t3-damped-oscillations` (5) | `dec-t-damped` | `sim-t-damped` | `test-t-damped` (5) |
| T | 4 Getriebene Schwingungen | `t4-driven-oscillations` (8) | `dec-t-driven` | `sim-t-driven` | `test-t-driven` (4) → `opt-setup` → `tar-theory` |
| — | optional | `opt-chaos` (2 + guide pages), `opt-simulation` (1, Jupyter notebook), `opt-setup` (1) | — | — | — |

Routes are below `/learning/`, `/decision/`, `/simulation/`, `/test/` and `/target/`. Flow parameters in the URL: `flow=learning-first` (learning pages first, then back to the decision page and on to the simulation), `path=learn|sim|test` on nav rows, `next=chaos|simulation` on `opt-setup` (picks the guide).

### Notation and figures

- The Pohl wheel as in the script: angle φ, moment of inertia Θ, restoring torque Dφ (the script writes D*, „Winkelrichtgröße“; the module says Richtmoment / Direktionsmoment), damping torque ρφ̇, driving torque A cos ωt (script: M cos ωt). Normal form with 2β = ρ/Θ, ω₀² = D/Θ, N = A/Θ (section 11).
- The theory strand starts with the generic oscillator in x with damping γ (t2, t3) and switches to the wheel's φ and β in t4, where both forms appear side by side. The experiment strand uses φ and β throughout.
- Figures keep a white plate in dark mode, as do the simulation canvases (their drawing code uses fixed colours).


## 3 Flows and gates

- **Decision page:** three cards (learning module, simulation, test), each colour-coded on hover and on its button. The learning card is greyed out once the learning pages were done in this browser session (`learning-done-<strand>-<topic>` in `sessionStorage`); the test card after a failed test.
- **Learning pages:** the last sub-page leads back to the decision page in the `learning-first` flow (then the simulation), otherwise on to the next decision page or the target. Its „Weiter“ first opens the mental-effort pop-up (section 2) where one is due; the navigation follows the answer.
- **Simulation pages:** "Weiter" waits for 9 interactions (`interactionThresholdReached`: start/stop, Neustart, view switches and redraws in static mode count); dev mode releases it. After the simulation the student continues with the learning pages (simulation-first) or to the next decision page (`learning-first`).
- **Tests:** single submission per question; the end page scores, shows a message by level (below 80 % / from 80 %) and saves progress. The nav lock (section 2) keeps the learning rows closed meanwhile; the browser's back button still leaves a test.
- **The nav reflects the flow:** the sub-pages listed depend on how the segment was entered (learn, sim or test), and visited rows stay listed (`getVisibleSubpages()` in `nav-bar.ts`).


## 4 Simulations

Six Angular components drawing on `<canvas>`, each with a „statisch“ / „dynamisch“ switch (the whole curve at once, or animated with Start/Stop and Neustart), sliders for the parameters and switches for the views. The switch's off state is grey, not red: off is no error.

| Route | Entered from | Shows | Parameters |
|---|---|---|---|
| `sim-t-free` | link on t2 | undamped oscillator in x: pendulum, x(t), phase space | spring constant, x₀, v₀ |
| `sim-e-damped` | `dec-e-damped` | damped Pohl wheel: pendulum, wheel, φ(t) | spring constant, damping, φ₀, initial velocity |
| `sim-t-damped` | `dec-t-damped` | damped oscillator in x with phase space | spring constant, damping, x₀, v₀ |
| `sim-e-driven` | `dec-e-driven` | driven damped Pohl wheel: pendulum, wheel with motor, φ(t), phase space | spring constant, damping, φ₀, initial velocity, motor amplitude and frequency |
| `sim-t-driven` | `dec-t-driven` | driven damped oscillator in x | spring constant, damping, x₀, motor amplitude and frequency |
| `sim-t-driven-advanced` | no link, on purpose | driven damped rotational oscillator in φ, like `sim-e-driven` | as `sim-e-driven` |

`sim-formulas.spec.ts` checks that every simulation page typesets its formulas.

`sim-t-driven-advanced` is deliberately not linked from any page (Carlo, 2026-11-10): it is reachable only by its URL and in dev mode. Route, nav and summary know it, so a visit is still labelled and drawn on the line.


## 5 Target pages, summary and report

- Four target pages (`tar-experiment`, `tar-theory`, `tar-chaos`, `tar-simulation`) with the guide cards (section 2) in a purple-tinted surface, `--target-h1-color` for headings.
- Below the guides the **Lernpfad**: visited pages with time spent, learning questions with the student's answers, test results. `summary.service.ts` turns IDs into labels (`MODULE_LABELS`, `TEST_LABELS`, `PAGE_LABELS`); unknown keys show the raw ID, so new pages need an entry.
- **Offene Stellen** (`shared/unclear-review/`): sub-page 1 of each guide (section 2), the unclear marks; the guides and the Lernpfad are sub-page 2.
- **Meine Markierungen** in the Lernpfad (an accordion after Lernaufgaben): the marked passages by page, in the module's order, in their colours, formulas typeset. **In the HTML report they are highlighted in place** in the page texts (`mark-context.ts` finds each quote in the registry's content strings and wraps it in `<mark>` before KaTeX), with a legend under the title; a mark whose text is no longer in the page is listed at the end („Weitere Markierungen“).
- **HTML report** (`html-report.service.ts`, replaced the earlier PDF service, 2026-08): a self-contained file generated in the browser, images embedded, page content in `learning-report-registry.ts` order with the answers at the question blocks. Simulations and target pages are left out of the report.


## 6 Data and backend (decided 2026-11-03 to 2026-11-05; login and backend moved to the portal 2026-11-17)

The login, the PHP API and the schema live in the portal (`../interapt-portal/`), one copy for all modules; its `design_notes.md` has the login model (cohort keys, codename, consent, cookie). What the module does:

- **One login for all modules.** The portal's login page (`/login/?next=pohl`) sets an HttpOnly cookie for the whole site. On startup an app initializer asks `api/auth/me` who is logged in (`Session.resolve()`), before the tracking services read their stored state, which is keyed by that id. 401: guest (`rogue_user_…`), nothing sent. Server unreachable: the stored identity stays, so answers keep being queued. The old `?session_id=` in the URL is ignored.
- **The API is called as `../api/…`**, relative to `<base href>` (`/pohl/` → `/api/`), with `MODULE_NAME` (`storage-prefix.ts`, `'pohl'`) in every call. The cookie says whose data it is; the username is no longer in URLs or request bodies. Locally `proxy.conf.json` forwards `/api` to the portal on :8000.
- **Login run out** (401 on save or load): the rows stay queued, `loginExpired` is set, and the header asks to log in again.
- **Events, not snapshots.** `question_attempts` holds one row per submitted answer, every retry included, for learning questions and tests; `page_visits` one row per visit (route, sub-page, query, duration). The data is used for research, so the first attempt must survive; the app resumes from the latest attempt per question.
- **Saving is idempotent.** Unique keys plus `ON DUPLICATE KEY UPDATE id = id`: a row sent twice is stored once, the first version counts. With `attempt_no` 1 for tests the same key enforces single submission.
- **The app sends only unconfirmed rows** (`attempt-outbox.ts`), on `pagehide`, when the tab is hidden and on the test end page, at most 60 kB per request (browsers refuse `keepalive` requests above 64 KiB).
- **Mental-effort ratings** go to `effort_ratings` (one row per unit and student, the first answer counts; rating 1–9 or NULL for „Keine Angabe“, `shown_at` and `answered_at` for the response time, `context` with `flow` and `path`). `effort-rating.ts` keeps unsent ratings in `localStorage` like the outbox, `DataExport` sends them with the batch (`ratings`), and the saved progress returns the rated units (`ratedUnits`), so a student isn't asked twice on another device. The units and their titles: `effort-units.ts`.
- **Marked passages** go to `mark_events` as events (create with the kind, resolve and reopen for „Geklärt“, delete; switching the kind is a delete and a new mark; each event has its own id; the portal's `design_notes.md`, section 4). `marks.ts` keeps the marks and the unsent events in `localStorage` per student, like the effort ratings; `DataExport` sends the events with the batch (`marks`) and drops them only when the portal's answer lists `marks` under `accepted`; the saved progress returns the current marks, and events still waiting here win over it. Guests keep their marks in the browser only.
- **Times in UTC with milliseconds** (`DATETIME(3)`), ISO strings ending in `Z` to the browser.
- **Every `localStorage` key carries the module prefix** (`storage-prefix.ts`, `'pohl:'`). Both modules run on one origin and so share one `localStorage`; without the prefix each read, showed and saved the other's data (found 2026-11-05). Only the theme is shared on purpose.
- **Resume only through the start page.** Coming in from the login page, the app goes to the last saved page; a reload or a direct link stays put.
- **The header shows the login state:** „Gast · Anmelden“, the username, or „Anmeldung abgelaufen“; a click opens one dialog (to the login page, or Abmelden for all modules). The dialog follows the theme.


## 7 Pitfalls and lessons

- **Stale components in `ng serve`:** after template or CSS edits it can show the new version in the server-rendered HTML and the old one after hydration. Restart it before debugging a missing change.
- **SSR is built but not deployed:** code that touches `window`, `document` or storage still runs during the build's prerender. Guard it, also in `.then()` callbacks: a `window` access there only shows up as `unhandledRejection` in the build log, with exit code 0.
- **Component styles beat global ones:** an override for a component goes into its own CSS. And a fixture's root component doesn't refresh host bindings, so `NavBar` is tested inside a small parent component.
- **Tests:** jsdom has no `<base>` and no canvas: add a `<base>` in specs that compare against `document.baseURI`, and call `stubCanvasContext()` for canvas components.
- **`percentageScore` is not "finished":** `endTest()` writes it for a test left half-way; use `isTestFinished()`.
- **Dark mode controls:** navy „Auswerten“ on a dark card is 1.18:1, so `--control-fill` is inverted in dark mode; check new buttons for the same problem.
- **Local API:** the portal's `php -S` needs `PHP_CLI_SERVER_WORKERS=4`: single-threaded, it hangs on an idle connection Chrome keeps open, and the login page's requests never return. `db_host` must be `127.0.0.1` (with `localhost` PHP looks for a Unix socket instead of the Docker port).
- **Puppeteer and 401:** `waitUntil: 'networkidle0'` never fires on a page whose request got a 401 (a guest's `api/auth/me`); wait for `load` and the element instead.
- **MathJax and `::highlight()`:** the marks on the page are painted with the CSS Custom Highlight API (`mark-painter.ts`), which leaves the page's DOM alone; they are found again (`locate`, whitespace-blind, prefix and suffix decide between repeats) after every re-render, by a `MutationObserver` on the main content. MathJax CHTML draws glyphs as CSS-generated content, which the Highlight API doesn't paint; a formula in a marked passage gets the colour as a background of its own, cut to the text band of its line (`fitFormulaBands`). And `selection.toString()` over a formula gives garbage (the hidden assistive MathML): the passage's text comes from `buildTextModel`, which takes each formula's TeX from MathJax.
- **A second document-wide `MathJax.typesetPromise()` nests every formula** (found 2026-11-27): the MathML input finds the hidden assistive MathML of the formulas already typeset and typesets it again inside it. Invisible, but screen readers get formulas twice; pages and target pages call such passes repeatedly. `MarkQuote` converts its formulas itself (`tex2chtmlPromise`) for that reason. A fix for the pages: load `tex-chtml.js` instead of `tex-mml-chtml.js` (no content uses MathML input), not done yet (section 10).
- **Screenshots** from a fresh load of a real build in headless Chrome (Puppeteer is a devDependency); wait for MathJax; theme via `localStorage.theme`, dev mode via `sessionStorage.devMode` before load.


## 8 Relation to the precession module

- **Shared and to be kept in sync:** the tracking services (`session.ts`, `data-export.ts`, `attempt-outbox.ts`), the mental-effort rating (`effort-rating.ts`, `shared/effort-rating-dialog/`), the glossary overlay (`shared/glossary-overlay/`), the side dock (`shared/side-dock/`), marking (`mark-anchor.ts`, `mark-context.ts`, `marks.ts`, `shared/mark-toolbar/`, `shared/marks-overlay/`, `shared/mark-context/`, `shared/unclear-review/`), the header's login state, the footer, the global styles and the design rules. A design change in one module goes to the other. The API and the schema are no longer copied: one copy in the portal.
- **Module-specific:** the glossary terms (`features/glossary/glossary-terms.ts`), `StudyAidsLock` (`study-aids-lock.ts`: here the test lock, there never locked), `pageLabel`/`markGroups` in the summary service (here without page offsets), `EFFORT_UNITS` (`effort-units.ts`), `STORAGE_PREFIX` and `MODULE_NAME` (`storage-prefix.ts`, both unique per module; the name must also be listed under `modules` in the portal's `api/config.php`), the deploy path, the nav structure, the summary labels and the report registry.
- **Different by design:** Pohl has strands, decision pages, tests and canvas simulations; precession is one linear path with retryable questions and an embedded Unity simulation. Its nav opens every visited page; Pohl's only the visited sub-pages of the current segment.


## 9 Conventions for extending the module

Registering pages, glossary terms and test question types: developer guide, *Common Maintenance Tasks*. Beyond that:

- A new glossary term: its component (extending `GlossaryBase`) and one entry in `features/glossary/glossary-terms.ts`; nothing else. Link it with `<a data-glossary="<slug>" class="glossary-link">`.
- Marking takes the text of the learning pages as it is. A block that must not be marked gets `data-no-mark`; a new question or simulation component goes into `MARK_EXCLUDE` (`mark-anchor.ts`). A page's label for the marks comes from the summary's `PAGE_LABELS`/`PAGE_TOTALS`, like the visited pages.
- Content lives outside the components: `<page>-content.ts` and `<page>-questions.ts`; the report registry imports the same strings. LaTeX with double backslashes (`$\\omega_0$`).
- Question IDs: `{module}-{n}-{description}` for learning questions, `test-{strand}-{topic}-{n}-{description}` for tests. They and the tracking IDs are stored in the database: choose once, never change. A renamed route keeps its old key as an alias in the summary's label maps.
- Retryable types: single-choice, multiple-choice, multiple-choice-image, image-choice (the learning drag-and-drop is an empty stub). Test types: single-choice, multiple-choice, image-choice, order-images, drag-and-drop, true-false.
- Feedback in tests: the student's own choices green ✓ or red ✗; options not chosen get a „Richtige Antwort“ / „Falsche Antwort“ badge.
- Colours only via the CSS variables; breakpoints 600 / 900 / 1200 px.
- Student-facing text: German, formal "Sie".


## 10 Open items

- **Mental-effort rating (2026-11-24):**
  - The German wording of the nine labels (`EFFORT_SCALE_LABELS` in `effort-rating.ts`) is a direct translation; check it against the German version the study cites before the first course use, then keep it fixed.
  - The consent text should mention the ratings.
  - Deploy the portal's `save.php` and run its `schema.sql` (new table `effort_ratings`) **before** this module. An older `save.php` answers 200 and ignores `ratings`, so the app would drop them as sent.
  - `effort_ratings` has not been tested against MySQL yet (only the module side, with stored and sent rows mocked).
- **Markierungen (2026-11-27):**
  - Deploy the portal's `schema.sql` (`mark_events`), `save.php` and `load.php`. The table's columns changed on 2026-11-27 (kinds, „Geklärt“, event ids) before it was ever deployed; a local database that has the first version needs `DROP TABLE mark_events` first. A module deployed first keeps the marks queued in the browser until then (nothing is lost, `accepted`).
  - The consent text should mention the marked passages, and that „unklar“ marks are used to see which passages are hard.
  - Tested with mouse in headless Chrome and with a programmatic selection at phone width; not yet with fingers on real phones and tablets (selection handles, the system's selection menu beside the bar).
  - Browsers without the CSS Custom Highlight API (Firefox before 140, Safari before 17.2) get no bar and no highlights, so no marking; the glossary, the list and the Offene Stellen still work.
  - „Im Text ansehen“ shows the registry's text: a passage outside it (a heading or text in a template) is found on the page but not there, and the overlay then shows only the quote.
- **MathJax typesets formulas twice on repeated passes** (section 7): switch to `tex-chtml.js` in `index.html` in both modules after checking the pages.
- **Test button contrast:** white text on `--physik-gelb` (`.test-btn`) is about 2:1.
- **Portal not deployed yet** (2026-11-17): the landing page, the login page and the shared API are in `../interapt-portal/`; deploy it before this module's next deploy, which removes `pohl/api/` from the server (order and steps: the portal's README).
- **Backend:** consent wording and data protection, the survey's codename scheme, scores computed in the browser, durations including idle time: the portal's `design_notes.md` and *Open Issues* in the developer guide.
- **Inherited:** a cold load straight onto a learning page can log `MathJax.typesetPromise is not a function` (later renders work).


## 11 Physics reference (for consistent wording)

- Equation of motion: Θφ̈ + ρφ̇ + Dφ = A cos ωt; normal form φ̈ + 2βφ̇ + ω₀²φ = N cos ωt with 2β = ρ/Θ, ω₀² = D/Θ, N = A/Θ.
- Free damped oscillation, Schwingfall (β < ω₀): φ(t) = φ₀ e^(−βt) cos(ω_e t + Φ), ω_e = √(ω₀² − β²). Aperiodischer Grenzfall β = ω₀, Kriechfall β > ω₀.
- Logarithmic decrement: Λ = ln(φ(t)/φ(t + T)) = βT.
- Stationary forced oscillation: amplitude φ₀(ω) = N / √((ω₀² − ω²)² + 4β²ω²), phase φ = arctan(2βω / (ω₀² − ω²)) between 0 and π.
- Resonance: ω_r = √(ω₀² − 2β²) for 0 < β < ω₀/√2; the stronger the damping, the lower and flatter the maximum.
- General solution: homogeneous (Einschwingvorgang, decays with e^(−βt)) plus particular solution (stationary).
- Lab safety from the script: near resonance at weak damping the amplitude must stay below 120° (Resonanzkatastrophe).
