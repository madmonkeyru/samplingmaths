\# Strategy for Developing the Reusable Visualisation Components (MEP-EA-01)

\#\# 0\. Guiding Principles

The three source documents converge on a clear mandate: \*\*every graphic must be rendered dynamically from structured data\*\* (SRS FR‑Q‑07, FR‑C‑01/02), \*\*components must be modular and reusable\*\* (NFR‑M‑02), and \*\*the visual spec per item is the de facto component specification\*\* (Pre‑Dev §1.3). The strategy below is therefore built on five principles:

1\. \*\*JSON‑first, never item‑specific code.\*\* No component named \`Item3Circle\`. Every figure is a serialisable \`visual\_spec\` interpreted by a generic renderer registry.  
2\. \*\*Primitive → composite → item composition.\*\* Build a small set of SVG primitives, compose them into reusable composites (\`CartesianPlane\`, \`MultiViewGrid\`, \`Table\`, etc.), and express each item’s figure purely as data on top of those composites.  
3\. \*\*SVG‑first for 2D, defer 3D and optional interactivity.\*\* The sample’s visuals need no WebGL (3D items 16–18 are word problems with no figure). Keep the registry pluggable so \`solid\_3d\` can be added later without rework.  
4\. \*\*Library‑first, Storybook‑driven, test‑heavy.\*\* The component package is developed and validated independently of the app shell. Each component ships with stories, unit tests, accessibility checks, and visual‑regression baselines.  
5\. \*\*Forward compatibility with the specification table.\*\* Even though the sample does not exercise every topic, the schema and composites should anticipate \`A5\` (3D solids), \`A6\` (symmetry), and exponential/logarithmic/inverse function plots, which the \*Tabla de especificaciones\* requires.

\---

\#\# 1\. Component Inventory and Layering

The Visual Components document identifies the exact union of components needed by the 60 items. I recommend organising them into three layers so reuse is explicit and testing is tractable.

\#\#\# Layer 0 — Primitives (pure SVG, data‑coordinate aware)

\| Primitive \| Used by \|  
\|---\|---\|  
\| \`Point\`, \`Label\` (KaTeX‑capable), \`DashedProjection\` \| Nearly all geometry/function items \|  
\| \`Line\`, \`Ray\`, \`Polyline\`, \`Path\`/\`Curve\` \| Items 10–11, 24, 26–27, 28–30, 39 \|  
\| \`Circle\` \| Items 1–9 \|  
\| \`Polygon\` \| Items 14–15, 19–23 \|  
\| \`Arrow\`, \`AxisTick\`, \`GridLine\` \| Composites (\`CartesianPlane\`, overlays) \|

\#\#\# Layer 1 — Composites

\| Composite \| Items \| Notes \|  
\|---\|---\|---\|  
\| \`CartesianPlane\` \| 3, 5, 6, 9, 12, 13, 19–23, 24, 26–27, 29, 36, 39 \| Owns the coordinate transform; accepts primitive children \|  
\| \`MultiViewGrid\` \| 6 (2×2), 24 (2×2), 39 (1+4) \| Flexible rows × cols, per‑view spec and option label \|  
\| \`FunctionPlot\` \| 29, 36 \| Linear/quadratic/piecewise; vertex, intercepts, axis of symmetry \|  
\| \`CurveRegion\` \| 12, 13 \| Smooth bounded curve \+ straight segments \+ base \|  
\| \`TransformationOverlay\` \| 5–7, 19–23 \| Symmetry axes, translation arrows, rotation centre/arc, homothety rays, multi‑state polygons \|  
\| \`Table\` \| 49, 50, 52, 53–54, 59–60 \| One component, five variants: \`frequency\`, \`weighted\`, \`summary\`, \`contingency\`, \`stats\` \|  
\| \`BoxPlot\` \| 57–58 \| Single and grouped/dual rendering \|  
\| \`DistributionCurve\` \| 51 \| Skewness parameter \+ dashed marker projections \|  
\| \`VennDiagram\` \| 55–56 \| 2‑set and 3‑set with canonical region schema \|

\#\#\# Layer 2 — Item compositions (data only)

Examples: \`circle\_on\_plane\` (CartesianPlane \+ Circle \+ Point/Label \+ dashed projections), \`piecewise\_price\_graph\` (CartesianPlane \+ Polyline \+ Point \+ Label), \`contingency\_context\` (Table variant \+ group context). These are \*\*not new components\*\*; they are JSON specs composed from Layer 0/1.

\*\*Reuse matrix (key evidence for NFR‑M‑02):\*\* \`CartesianPlane\` appears in ≥ 18 items, \`Point\`/\`Label\` in \~all visual items, \`Table\` in 6 items across three sub‑variants, \`MultiViewGrid\` in 3 items. This justifies the layered approach.

\---

\#\# 2\. Rendering Architecture and Technical Decisions

\#\#\# 2.1 Rendering stack

\- \*\*React \+ SVG\*\* for all 2D visuals. Rationale: crisp scaling, DOM inspectability, accessibility (ARIA roles, \`\<title\>\`/\`\<desc\>\`), and straightforward Storybook snapshots.  
\- \*\*D3 modules as math utilities only\*\* (\`d3-scale\`, \`d3-shape\`, \`d3-path\`), not for DOM mutation. This matches the SRS stack (§4) while keeping components React‑idiomatic.  
\- \*\*KaTeX\*\* for LaTeX in stems, labels, and solution steps (items 14–15 are formula images → rendered via KaTeX, not a geometry component).  
\- \*\*Three.js deferred.\*\* Define \`visual\_type: "solid\_3d"\` in the schema and registry now; implement only when 3D items gain figures (or after pilot).  
\- \*\*No Canvas for 2D.\*\* SVG meets the 1 s/render budget (NFR‑P‑02) for these figures and gives free accessibility. Canvas remains an escape hatch for pathological curve counts, not a default.

\#\#\# 2.2 Coordinate transform module

A single \`createTransform({ xDomain, yDomain, width, height, padding })\` returns \`toPixel(x,y)\` and \`toData(px,py)\`. All primitives receive data coordinates; \`CartesianPlane\` and \`MultiViewGrid\` own the transform and pass it down. This isolates all scaling/aspect‑ratio logic and makes the math unit‑testable.

\#\#\# 2.3 Renderer registry and validation

\`\`\`  
\<VisualRenderer spec={visualSpec} alt={...} onInteraction={...} /\>  
  → validate against JSON Schema (build time \+ runtime guard)  
  → look up spec.type in registry  
  → render composite → children recursively  
  → wrap in \<figure role="img" aria-label={alt}\> \+ error boundary  
\`\`\`

\- \*\*Schema versioning\*\* tied to the question‑bank version (Pre‑Dev §3). The validator (\`validate.js\`) runs in CI so a malformed \`visual\_spec\` never ships.  
\- \*\*Error boundary fallback\*\*: on parse/render failure, render the \`alt\` text and log \`{ item\_id, visual\_type, error }\` (NFR‑M‑03).

\#\#\# 2.4 Group‑level “render‑once” contract

The sample has shared contexts (\`fuel\_price\` 26–27, \`g\_cont\_table\` 53–54, \`g\_venn\_3set\` 55–56, \`g\_emp\_ages\` 57–58, \`g\_volunteer\` 59–60, and 21–23). Implement this at the \*\*content‑model level\*\*, not inside individual items:

\- \`groups.json\` (or a \`groups\` array in the bank) holds \`{ id, context\_text?, visual\_spec }\`.  
\- The item page renders \`groups\[item.group\_id\].visual\_spec\` \*\*once\*\* above the item stem; navigation within the group does not re‑render the visual.  
\- The review page renders the group visual alongside each grouped item.  
\- The component library exposes a plain \`\<GroupVisual spec={...} /\>\` so the app controls placement; no hidden state inside the library.

\#\#\# 2.5 Accessibility contract

Every composite emits an SVG with \`\<title\>\`/\`\<desc\>\` generated from the spec (e.g., “Circle centred at (0, 2\) with radius 3; y‑intercepts at 5 and −1”) and accepts an author‑supplied \`alt\` for complex figures. \`Table\` renders as semantic \`\<table\>\`; charts include a “show data” alternative. This satisfies NFR‑U‑03 (WCAG 2.1 AA) and NFR‑U‑02 (tooltips/legends for interactive elements).

\---

\#\# 3\. Visual Specification Schema (the linchpin)

Per Pre‑Dev §1.3, the per‑item visual spec is the highest‑value pre‑dev artefact. Finalise it \*\*before\*\* component coding, covering every \`visual\_type\` in the inventory. Minimum fields:

\`\`\`jsonc  
{  
  "schema\_version": "1.0",  
  "item\_id": 3,  
  "group\_id": null,  
  "alt": "Circle c centred at (0,2), radius 3, with y-intercepts at 5 and \-1",  
  "visual": {  
    "type": "cartesian\_2d",  
    "domain": { "x": \[-6, 6\], "y": \[-2, 6\] },  
    "grid": false,  
    "children": \[  
      { "type": "circle", "center": \[0, 2\], "radius": 3, "label": "c" },  
      { "type": "point",  "coords": \[0, 2\], "label": "O" },  
      { "type": "dashed\_projection", "from": \[0, 5\], "to\_axis": "y", "label": "5" },  
      { "type": "dashed\_projection", "from": \[0, \-1\], "to\_axis": "y", "label": "-1" }  
    \]  
  }  
}  
\`\`\`

For composites, the schema has type‑specific payloads:

\- \`multi\_view\_grid\`: \`{ layout: { rows, cols }, views: \[{ label: "A", visual: {...} }, ...\] }\` (covers 2×2 and 1+4).  
\- \`function\_plot\`: \`{ form: "quadratic" \| "linear" \| "piecewise", params, annotations: { vertex, intercepts, axis\_of\_symmetry } }\` — annotate computed points so rendering is deterministic.  
\- \`transformation\_overlay\`: \`{ preimage, image, operations: \[{ type: "translation", vector }, { type: "rotation", centre, angle }, { type: "homothety", centre, factor }, { type: "reflection", axis }\], show\_symmetry\_axes: bool }\`.  
\- \`table\`: \`{ variant: "frequency" \| "weighted" \| "summary" \| "contingency" \| "stats", data: {...} }\`.  
\- \`venn\_diagram\`: \`{ sets: \[...\], region\_values: { "A": n, "B": n, "AB": n, "ABC": n, ... }, highlight: \[...\] }\` — canonical 8‑region schema for 3‑set.  
\- \`box\_plot\`: \`{ groups: \[{ label, min, q1, median, q3, max }\], axis: {...} }\`.  
\- \`distribution\_curve\`: \`{ skew: "negative" \| "positive" \| "symmetric", markers: \[{ value, label }\] }\`.  
\- \`curve\_region\`: \`{ path: \[...\], straight\_segments: \[...\], base: {...} }\`.

\*\*Deliverable:\*\* one \`visual\_specs.json\` with 60 validated specs, plus a coverage test asserting every \`visual\_type\` in the inventory has ≥ 1 spec and every spec validates.

\---

\#\# 4\. Development Phases and Timeline

The plan is \*\*library‑first and vertical‑slice‑driven\*\*: each phase ends with one or more real items rendering end‑to‑end from JSON, not just isolated components.

\| Phase \| Weeks \| Scope \| Reference items (exit criteria) \|  
\|---\|---\|---\|---\|  
\| \*\*A. Foundations & core 2D\*\* \| 1–3 \| Tech spike (SVG/KaTeX/d3), schema v1.0 \+ validator, transform module, L0 primitives (\`Point\`, \`Label\`, \`Line\`, \`Ray\`, \`Polyline\`, \`Path\`, \`Circle\`, \`Polygon\`, \`DashedProjection\`, \`Arrow\`), \`CartesianPlane\`, Storybook \+ CI \+ visual‑regression baseline \| \*\*Item 3\*\* fully rendered from JSON; story for every primitive \|  
\| \*\*B. Multi‑view & function plots\*\* \| 3–5 \| \`MultiViewGrid\` (2×2, 1+4), \`FunctionPlot\` (linear/quadratic/piecewise; vertex/intercepts/axis), \`Polyline\`‑based piecewise, generic \`Path\` for non‑functions, math utils (samplers, root/vertex) \| Items \*\*6, 24, 26–27, 29, 36, 39\*\*; visual snapshots \|  
\| \*\*C. Transformation & curve regions\*\* \| 5–7 \| \`CurveRegion\`, \`TransformationOverlay\` (symmetry axes, translation arrows, rotation centre/arc, homothety rays, multi‑state polygons) \| Items \*\*12, 13, 5–7, 19–23\*\*; golden‑image tests \|  
\| \*\*D. Statistics components\*\* \| 6–8 (overlaps C) \| \`Table\` (one component, five variants), \`BoxPlot\` (single/grouped/dual), \`DistributionCurve\`, \`VennDiagram\` (2‑set/3‑set, canonical regions), group context integration \| Items \*\*49–60\*\*; snapshot for each variant \|  
\| \*\*E. Integration, a11y & hardening\*\* \| 8–9 \| \`GroupVisual\` \+ item‑page integration, error boundaries/fallbacks, ARIA/alt generation, keyboard/contrast audit, performance pass (memoisation, path sampling), author documentation \| All \*\*60 items\*\* render from JSON; axe clean; render \< 1 s/item \|  
\| \*\*F. Deferred (post‑pilot)\*\* \| — \| \`solid\_3d\` (Three.js or orthographic SVG), \`FunctionPlot\` extensions (sqrt, exponential, logarithmic, inverse), \`InteractiveControls\` (sliders, inspector, animation player) \| Schema \+ registry stubs now; implementation later \|

\*\*Parallelism:\*\* Phase A's schema/transform work gates everything; B and D can run in parallel once the registry contract is fixed; C depends on A's primitives only.

\*\*Why vertical slices:\*\* rendering Item 3 end‑to‑end in Phase A proves the JSON → registry → SVG → a11y → snapshot pipeline. Item 24 (Phase B) proves \`MultiViewGrid\` \+ arbitrary curves. Item 57 (Phase D) proves grouped box plots \+ group context. These three “reference items” de‑risk the entire library early.

\---

\#\# 5\. Design System and Conventions

A shared \`design\_tokens\` module (Pre‑Dev §2.2) applied to every component:

\- \*\*Strokes/colours:\*\* axis stroke, grid stroke, primary figure stroke, dashed helper stroke, label fill, highlight fill; WCAG AA contrast verified.  
\- \*\*Typography:\*\* label sizes relative to viewBox; KaTeX font metrics aligned with SVG text.  
\- \*\*Geometry conventions:\*\* label placement rules (offset from point, quadrant avoidance), arrowhead geometry, tick spacing, padding/aspect‑ratio defaults per visual type.  
\- \*\*Exam aesthetic:\*\* clean black‑and‑white line art with dashed helpers and labelled points, matching the practice PDF.  
\- \*\*Responsive viewBox:\*\* every composite sets \`viewBox\` \+ \`preserveAspectRatio\`; no fixed pixel dimensions. Minimum/maximum render sizes documented per composite.

\---

\#\# 6\. Testing and QA Strategy

\| Layer \| Technique \| Tools \|  
\|---\|---\|---\|  
\| \*\*Unit\*\* \| Transform math, function samplers, circle‑from‑equation, five‑number parsing, Venn region lookup, schema validators \| Vitest/Jest \|  
\| \*\*Storybook\*\* \| One story per component state \+ one story per real item spec (fixtures) \| Storybook/Ladle \|  
\| \*\*Visual regression\*\* \| Snapshots of every story and all 60 item renders (catches label drift, axis scaling) \| Chromatic or Playwright screenshots \|  
\| \*\*Accessibility\*\* \| axe on every story; keyboard focus order for interactive elements \| jest‑axe, axe‑core \|  
\| \*\*Item integration\*\* \| CI job renders \`visual\_specs.json\` for all 60 items; asserts no console errors, non‑empty SVG, alt present \| Playwright \|  
\| \*\*Performance\*\* \| Render‑time budget (\< 1 s/item), large‑curve stress test \| Playwright traces / custom timing \|  
\| \*\*Content QA\*\* \| Visual‑accuracy checklist from Pre‑Dev §6 (circle centre/radius, vertex/axis, 3D cross‑section, box‑plot five‑number match) \| Manual SME review with side‑by‑side PDF \|

The \*\*visual‑regression suite is the safety net\*\* for NFR‑M‑02 (reusability without regressions): any primitive change ripples through all 60 item snapshots, making unintended breakage visible immediately.

\---

\#\# 7\. Repository Structure and Integration Contract

\`\`\`  
packages/  
  visuals/                      \# standalone, versioned npm package  
    src/  
      primitives/               \# Point, Label, Line, Ray, Polyline, Path, Circle, Polygon, ...  
      composites/               \# CartesianPlane, MultiViewGrid, FunctionPlot, CurveRegion,  
                                \# TransformationOverlay, Table, BoxPlot, DistributionCurve, VennDiagram  
      renderer/                 \# VisualRenderer, registry, error boundary, a11y wrapper  
      math/                     \# transform, samplers, geometry  
      schema/                   \# JSON Schema \+ validator  
      styles/                   \# design tokens  
      index.ts  
    stories/  
    tests/  
  content/                      \# questions.json, groups.json, visual\_specs.json, solutions/  
  app/                          \# React SPA (auth, timer, navigation, results)  
\`\`\`

\*\*Integration contract:\*\*

\- The app passes \`{ spec, alt, onInteraction? }\` to \`\<VisualRenderer\>\`. It never imports primitives directly for item figures.  
\- The app resolves \`group\_id\` → \`groups\[group\_id\].visual\_spec\` and renders it once via \`\<GroupVisual\>\`.  
\- \`onInteraction\` is optional and never affects scoring (FR‑A‑01/02 unaffected).  
\- The package is consumed as a versioned dependency; the app pins a visuals version compatible with the content schema version.

\---

\#\# 8\. Risks and Mitigations

\| Risk \| Mitigation \|  
\|---\|---\|  
\| \*\*\`FunctionPlot\` generality\*\* (sample needs quadratic; spec table also needs sqrt/exp/log/inverse) \| Design \`FunctionPlot\` around a sampler interface now; ship linear/quadratic/piecewise in Phase B; add samplers later without changing the schema \|  
\| \*\*\`TransformationOverlay\` complexity\*\* (rotation, homothety, multi‑state) \| Implement incrementally in Phase C; use multi‑state polygons as the first test; golden images per operation \|  
\| \*\*Venn region schema ambiguity\*\* \| Lock the canonical 8‑region 3‑set schema in Phase D before authoring items 55–56; validate region keys in CI \|  
\| \*\*Group context layout drift\*\* \| Treat groups as first‑class content; one \`GroupVisual\` contract; snapshot every grouped item in review mode \|  
\| \*\*Accessibility of charts\*\* \| Make \`alt\` required in the schema; auto‑describe simple specs; require data‑table alternative for \`BoxPlot\`/\`DistributionCurve\` \|  
\| \*\*3D scope creep\*\* \| Defer \`solid\_3d\`; keep registry pluggable; if pilot needs it, prefer orthographic SVG illustrations over WebGL for accuracy and a11y \|  
\| \*\*Content spec errors\*\* \| Build‑time validation \+ item integration job rendering all 60 specs; fail CI on any schema or render error \|

\---

\#\# 9\. Prioritisation Summary

\| Priority \| Components \| Items unlocked \|  
\|---\|---\|---\|  
\| \*\*P0 (must)\*\* \| \`CartesianPlane\`, \`Point/Label/DashedProjection\`, \`Circle\`, \`Line\`, \`MultiViewGrid\` \| 3, 5, 6, 9, 19, 20, 24, 39 (\~40 % of visual items) \|  
\| \*\*P1 (high)\*\* \| \`FunctionPlot\`, \`Polyline\`, \`Path\`, \`Table\` (5 variants), \`BoxPlot\`, \`VennDiagram\` \| 26–27, 29, 36, 49–60 \|  
\| \*\*P2 (medium)\*\* \| \`CurveRegion\`, \`TransformationOverlay\`, \`DistributionCurve\` \| 12, 13, 21–23, 51, 5–7 \|  
\| \*\*P3 (deferred)\*\* \| \`3DSolid\`, \`InteractiveControls\`, extended function samplers \| Future items for spec‑table A5/A6 and learning mode \|

\---

\*\*Bottom line:\*\* the Visual Components document already gives you a concrete, item‑backed backlog. The winning strategy is to \*\*freeze the visual‑spec schema first\*\*, build the \*\*L0 primitives and \`CartesianPlane\` as a vertical slice (Item 3)\*\*, then expand in dependency order — \`MultiViewGrid\`/\`FunctionPlot\`, then statistics, then transformation/curve composites — with \*\*Storybook \+ visual‑regression \+ item‑integration tests\*\* enforcing reuse and fidelity from day one. This converts “rich visualisations” from an open‑ended goal into a finite, testable component programme that satisfies SRS FR‑Q‑01 through FR‑Q‑08 and NFR‑M‑02 without over‑investing in 3D or interactivity the sample does not yet need.  
