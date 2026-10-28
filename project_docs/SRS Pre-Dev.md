\# Pre‑Development Work Plan for MEP‑EA‑01

Before writing application code, you can complete a substantial amount of high‑value work that de‑risks development, validates the SRS, and produces reusable assets. Below is a structured breakdown of what can be done \*\*pre‑development\*\*, organised by workstream.

\---

\#\# 1\. Content & Question Bank Preparation

This is the highest‑priority pre‑development workstream because \*\*content fidelity drives the visualisation requirements\*\* — you cannot finalise component specs until you know exactly what each item needs to render.

\#\#\# 1.1 Digitise & Structure the 60‑Item Pool  
\- Transcribe all 60 items from the practice PDF into a structured format (JSON schema).  
\- For each item capture: \`id\`, \`area\`, \`topic\`, \`evidence\` (from specification table), \`stem\` (text \+ LaTeX), \`options\` (A–D), \`correct\_answer\`, \`solution\_steps\`, \`group\_id\` (for grouped items), \`visual\_spec\` (see 1.3).  
\- Run a QA pass against the official solucionario (the PDF already includes answers: 1B, 2A, 3C, … 60C).

\#\#\# 1.2 Content Mapping to the Specification Table  
\- Map every item to its \*\*Bloque → Conocimiento → Afirmación → Evidencia\*\* row from the \*Tabla de especificaciones\*.  
\- Produce a coverage matrix showing which evidences are represented, and which are \*\*missing\*\* (you will likely need to author additional items later to reach a balanced 60‑item pool if the practice sample is not fully representative).  
\- Identify items with \*\*shared context\*\* (e.g., items 21–23 share the polygon transformation figure; items 26–27 share the fuel price graph; items 55–56 share the Venn diagram; items 57–58 share the employee age data; items 59–60 share the volunteer hours table). Document the grouping.

\#\#\# 1.3 Visualisation Specification Per Item  
For each item, write a \*\*visual spec\*\* that a developer can implement without guessing. Example for item 3 (circle graph):

\`\`\`json  
{  
  "item\_id": 3,  
  "visual\_type": "cartesian\_2d",  
  "elements": \[  
    { "type": "axes", "x\_range": \[-6, 6\], "y\_range": \[-2, 6\], "grid": false },  
    { "type": "circle", "center": \[0, 2\], "radius": 3, "label": "c" },  
    { "type": "point", "coords": \[0, 2\], "label": "O" },  
    { "type": "point", "coords": \[0, 5\], "label": "5", "dashed\_to\_axis": "y" },  
    { "type": "point", "coords": \[0, \-1\], "label": "-1", "dashed\_to\_axis": "y" }  
  \]  
}  
\`\`\`

Doing this for all 60 items yields a \*\*de facto component specification\*\* — you will see the exact primitives, ranges, labels, and interactions needed, and can deduplicate them into a component library.

\#\#\# 1.4 Author Supplementary Items (Optional but Recommended)  
\- If the coverage matrix reveals gaps (e.g., no ellipse item, no logarithmic model item, no cylinder cross‑section item), author draft items now.  
\- Have a subject‑matter expert review them before development.

\#\#\# 1.5 Build the Answer/Solution Content  
\- Expand each solucionario entry into \*\*step‑by‑step explanations\*\* (the PDF gives only letter answers). This is needed for FR‑R‑02.  
\- Write in es‑CR, with LaTeX for formulas.

\*\*Deliverables:\*\* \`questions.json\`, \`coverage\_matrix.xlsx\`, \`visual\_specs/\` (one file per item or a combined file), \`solutions/\`.

\---

\#\# 2\. Visualisation Component Design & Prototyping

You can design, prototype, and even build \*\*static or Storybook‑style\*\* components before the app exists. The visual spec work from §1.3 feeds directly into this.

\#\#\# 2.1 Component Inventory (derive from visual specs)  
From the 60 items and the \*General Project Ideas\*, the minimum viable component set is:

\| \# \| Component \| Items that need it \|  
\|---\|-----------\|--------------------\|  
\| 1 \| \`CartesianPlane\` (axes, grid, ticks, arrows, origin) \| 3, 5, 6, 9, 12, 13, 19, 20, 21–23, 26–27, 29, 36, 39 \|  
\| 2 \| \`Circle\` (center, radius, dashed radius, label) \| 1–9 \|  
\| 3 \| \`Line\` (secant, tangent, vertical/horizontal, slope) \| 10, 11, 28–30, 39 \|  
\| 4 \| \`Point\` \+ \`Label\` \+ dashed projection lines \| many \|  
\| 5 \| \`Polygon\` (regular/irregular, vertices, apothem, radius, angles) \| 14, 15, 19, 20, 21–23 \|  
\| 6 \| \`FunctionPlot\` (linear, quadratic, sqrt, exp, log, piecewise) \| 29, 36, 38, 39, 26–27 \|  
\| 7 \| \`CurveRegion\` (smooth bounded curve, e.g. bridge/metal part) \| 12, 13 \|  
\| 8 \| \`BoxPlot\` \| 52, 57–58 \|  
\| 9 \| \`DistributionCurve\` (skewness visual) \| 51 \|  
\| 10 \| \`VennDiagram\` (2‑set, 3‑set, region highlighting) \| 53–56 \|  
\| 11 \| \`Table\` (frequency, weighted, contingency) \| 49, 50, 53–54, 59–60 \|  
\| 12 \| \`3DSolid\` (sphere, cylinder, cross‑section plane) \| 16–18 \|  
\| 13 \| \`TransformationOverlay\` (translation arrows, rotation centre, homothety rays, symmetry axes) \| 5–7, 19–23 \|  
\| 14 \| \`MultiViewGrid\` (2×2 mini coordinate planes for A/B/C/D options) \| 6, 24, 36, 39 \|  
\| 15 \| \`InteractiveControls\` (sliders, layer toggles, coordinate inspector, animation player) \| learning mode (optional) \|

\#\#\# 2.2 Design Tokens & Style Guide  
\- Define a visual language: stroke widths, colours (primary/secondary/grid/axis/dashed), font sizes, label placement rules, arrowhead styles.  
\- Match the official exam aesthetic (clean black‑and‑white line art, dashed helpers, labelled points).  
\- Produce Figma (or similar) mockups for each component in its “resting” state and interactive states.

\#\#\# 2.3 Build a Component Library Skeleton (Storybook / Ladle)  
\- Even before the app shell exists, you can scaffold a Storybook (or Ladle) project and implement the \*\*static\*\* versions of components 1–6 and 11–12 using dummy data.  
\- This validates that the spec is implementable and gives the team a shared vocabulary.  
\- Add stories for the trickiest items: item 6 (four option graphs), item 13 (curve region), item 21–23 (four transformed polygons), item 53–56 (Venn \+ contingency table).

\#\#\# 2.4 Rendering Technology Spike  
\- Decide and document: SVG vs. Canvas for 2D (recommend \*\*SVG\*\* for accessibility and crispness), and WebGL/Three.js vs. CSS 3D for the 3D solids (recommend \*\*Three.js\*\* if time allows, otherwise orthographic SVG illustrations).  
\- Build a throwaway proof of concept for: a circle from an equation, a parabola with vertex/axis of symmetry, and a sphere cut by a plane. This de‑risks the hardest rendering pieces.

\*\*Deliverables:\*\* \`design\_tokens.md\`, Figma mockups, Storybook skeleton with static components, tech‑spike repo/report.

\---

\#\# 3\. Data & Question Schema Finalisation

\- Finalise the JSON schema (or JSON Schema) for items, groups, visual specs, and solutions.  
\- Write a \*\*validator\*\* (script) that checks every item: has 4 options, one correct answer, a visual spec that parses, a solution, and a valid evidence mapping.  
\- Set up the question bank repo with versioning (semantic versioning for content releases).

\*\*Deliverable:\*\* \`schema.json\`, \`validate.js\`, populated \`questions.json\` passing validation.

\---

\#\# 4\. UX / UI Design

\- Wireframe the landing page (three entry points \+ performance indicator).  
\- Wireframe the test/practice shell: header with timer, progress bar, question position, flag button; question panel (stem \+ visual \+ options); navigator sidebar; submit flow.  
\- Wireframe the results page: score, breakdown, expandable solutions, retry/home CTAs, performance graph (first‑time vs. returning user states).  
\- Design the \*\*grouped‑context\*\* pattern (context shown once, sub‑items navigable).  
\- Design the \*\*practice configuration\*\* flow (area → topic → count → timer).  
\- Accessibility annotations (focus order, ARIA roles for graphs, colour‑contrast checks).

\*\*Deliverables:\*\* Figma (or equivalent) wireframes \+ clickable prototype for 1–2 key flows (landing → simulation → results; landing → practice config → results).

\---

\#\# 5\. Technical Spikes & Infrastructure Prep

\- \*\*Timer accuracy spike:\*\* Validate that a \`setInterval\`/\`requestAnimationFrame\`‑based countdown stays within ±1 s over 3 hours (use monotonic clock, resync on visibility change).  
\- \*\*Auto‑save spike:\*\* Prototype IndexedDB/localStorage persistence of answers with periodic flush and restore‑on‑reload.  
\- \*\*Analytics spike:\*\* Prototype a minimal \`attempts\` table and a trend chart (scores over time) with a colour gradient.  
\- \*\*Backend scaffold (no app logic):\*\* Set up the project skeleton (repo structure, CI, linting, env config) and a stub API with \`/health\`, \`/auth/register\`, \`/auth/login\`, \`/attempts\` endpoints returning mock data.  
\- \*\*Auth spike:\*\* Password hashing (bcrypt) and JWT issuance validated in isolation.

\*\*Deliverables:\*\* Spike reports, repo skeleton, CI pipeline green on empty tests.

\---

\#\# 6\. QA & Validation Prep

\- Build the \*\*test item review checklist\*\* (content correctness, spec alignment, solucionario match, visual spec completeness).  
\- Build the \*\*visual accuracy checklist\*\* (e.g., “circle center/radius match equation”, “vertex and axis of symmetry correct”, “3D cross‑section is a circle when plane is perpendicular to axis”).  
\- Draft the \*\*usability test script\*\* for the 5‑student pilot (tasks: complete a 10‑item practice, interpret results, find a solution).  
\- Prepare a \*\*performance test plan\*\* (100 concurrent users) using k6 or Artillery scripts.

\*\*Deliverables:\*\* checklists, pilot script, load‑test scripts.

\---

\#\# 7\. Content & Legal/Administrative

\- Confirm usage rights for the practice PDF content (MEP/DGEC materials are generally public, but confirm).  
\- Confirm the official exam duration and any rules (calculator allowed? formula sheet?) — this affects the timer default and UI (e.g., a formula reference panel).  
\- Draft the Spanish UI copy (labels, buttons, encouragement messages, error states).

\---

\#\# Recommended Sequencing (Pre‑Development Timeline)

\| Week \| Workstream \|  
\|------\|------------\|  
\| 1 \| §1.1–1.2 (digitise \+ map items); §3 (schema draft); §4 (wireframes start) \|  
\| 2 \| §1.3 (visual specs for all 60); §2.2 (design tokens); §5 (repo \+ auth spike) \|  
\| 3 \| §2.3–2.4 (Storybook skeleton \+ tech spikes); §1.4–1.5 (supplementary items \+ solutions); §4 (clickable prototype) \|  
\| 4 \| §3 (validator \+ passing bank); §6 (checklists \+ pilot script); §5 (timer/autosave spikes); go/no‑go review \|

\---

\#\# Summary: What You Can Complete Before Development

\| Workstream \| Pre‑dev deliverable \|  
\|------------\|---------------------\|  
\| \*\*Question bank\*\* \| 60 structured items \+ coverage matrix \+ visual specs \+ step‑by‑step solutions; optional supplementary items for coverage gaps \|  
\| \*\*Visualisation\*\* \| Component inventory, design tokens, Figma mockups, Storybook skeleton with static components 1–6/11–12, tech‑spike decisions (SVG/Three.js) \|  
\| \*\*Data\*\* \| Finalised JSON schema \+ validator \+ versioned bank \|  
\| \*\*UX/UI\*\* \| Wireframes \+ clickable prototype for key flows \+ accessibility annotations \|  
\| \*\*Technical\*\* \| Repo skeleton, CI, stub API, timer/autosave/auth/analytics spikes \|  
\| \*\*QA\*\* \| Content & visual checklists, pilot script, load‑test plan \|  
\| \*\*Admin\*\* \| Rights confirmation, exam rules, Spanish UI copy \|

The single most valuable pre‑development artefact is the \*\*per‑item visual specification\*\* — it converts the vague “rich visualisations” goal into a concrete, testable component backlog, and it can be produced entirely from the PDFs you already have.  
