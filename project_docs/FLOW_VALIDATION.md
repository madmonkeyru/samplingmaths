# Multi-program flow validation

The entry page links to the program portal (Welcome Page) and directly to the functional BXM Mathematics MVP. Each program card now opens a Framework Hub with its subject catalog. Each subject has a navigable hub.

## Routes

| Page | Hash route |
| --- | --- |
| Entry | `#/` |
| Welcome / all programs | `#/programas` |
| Framework Hub | `#/programas/{program}` |
| Subject Hub | `#/programas/{program}/{subject}` |
| EDAD example | `#/programas/edad/espanol?nivel=EDAD_2&convocatoria=2026-c1` |
| Functional Mathematics MVP | `#/programas/bxm/matematicas?convocatoria=2026-c2` |

Program IDs: `cico`, `iii_ciclo`, `edad`, `bxm`. Catalog entries live in `content/manifest.json`. Science and foreign-language alternatives are shown separately and labeled as options; they do not represent additional required subjects.

Levels and convocatorias are URL context. Refresh and browser history restore that context. A program switch preserves the subject when it exists in the destination, resets the level to a valid destination level, and preserves the convocatoria. If the destination lacks the subject, it opens the Framework Hub. Invalid programs return to the portal; invalid subjects return to the program catalog.

## Availability

- BXM Mathematics, 02-2026 retains its simulation, modular practice, resources, results and history.
- Other routes expose Practice, Resources and Progress sections with explicit preparation/empty states. Their start controls are disabled. BXM Mathematics 01-2026 is also a preview; the existing 02-2026 question set is not relabeled as 01-2026.
- III Ciclo exposes 7°, 8° and 9°; EDAD exposes Parts 1 and 2. The EDAD prerequisite is explanatory only: the platform does not verify enrollment eligibility or completion records.
- Calculator restrictions are shown for Mathematics; passing scores are program context. Reference convocatorias are not live MEP registration schedules.
- Empty subject banks return no questions or sets. BXM content is never used as fallback for another subject/program.
- Simulation and results remain session views within the subject route. Reload returns to the subject hub; browser Back navigates to the previous curriculum route.

## Validation

Run `npm test` for component, service and application navigation tests; `npm run build` for type checking and bundling. `npm run test:flows` runs the browser checklist against an already-running local Vite server (default `http://127.0.0.1:5173`; override with `FLOW_BASE_URL`). The browser script uses installed Microsoft Edge and writes screenshots to `artifacts/flow-validation/`.

Manual/browser checklist:

1. Entry → Welcome → each Framework Hub → every subject → program catalog.
2. Switch levels in III Ciclo and parts in EDAD; change convocatoria, refresh and check context.
3. Switch programs in the global header; verify preserved subject, reset level and correct passing score.
4. Check calculator prohibition for CICO Mathematics and disabled start controls on preview routes.
5. Use Back/Forward, direct subject URLs, invalid program URLs and invalid subject URLs.
6. Enter BXM Mathematics directly, start a practice/simulation, submit it, inspect results, retry and return to the hub.
7. Check narrow mobile layouts and dark mode.

Browser execution was blocked by the Windows sandbox in this session; permission to run it outside the sandbox was declined. No browser screenshot or visual verification is claimed.

Verification recorded: TypeScript/Vite production build passed; lint passed with existing warnings. The suite passed 81 of 82 tests, with the remaining application test failing in jsdom computed-style handling. After narrowing its queries to action text, all 6 application flow tests passed on the focused rerun, completing verification of all 82 tests across 21 files. The application check includes submission, results, retry and returning to the hub.
