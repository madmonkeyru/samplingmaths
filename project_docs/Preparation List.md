Here's a consolidated component inventory to serve this sample test, synthesized from the SRS, Pre-Dev work plan, the Visual Components document, and the Strategy. It's split into **visualization components** (the reusable, data-driven renderers) and **application/UI components** (the app shell around them).

## 1. Visualization components

These are the data-driven components that render item figures from `visual_spec`. Only the ones actually exercised by this 60-item sample are "needed"; the rest are deferred (but schema stubs kept for the specification table).

### 1.1 Composites (renderer registry entries)

| Component | Sample items it serves | Variant / notes |
|---|---|---|
| `CartesianPlane` | 3, 5, 6, 9, 12, 13, 19, 20, 21–23, 24, 26–27, 29, 36, 39 | Owns the coordinate transform, axes/ticks/grid; accepts primitive children. ~18 items → highest reuse |
| `MultiViewGrid` | 6 (2×2), 24 (2×2), 39 (1 original + 4) | `layout{rows,cols}` + per-view label + nested visual |
| `FunctionPlot` | 29, 36 | Quadratic only in this sample; `form`, `params`, `annotations` (vertex, roots, axis of symmetry, dashed projections) |
| `CurveRegion` | 12, 13 | Bounded curve + straight segments + base (metal piece, bridge ramp) |
| `TransformationOverlay` | 21–23 (shared group `g_transformations`) | 4 labeled polygons on a plane |
| `Table` | 49, 50, 52, 53–54, 59–60 | 5 variants: `frequency`, `weighted`, `summary`, `contingency`, `stats` |
| `BoxPlot` | 57–58 (shared `g_emp_ages`) | Grouped/dual rendering |
| `DistributionCurve` | 51 | `negative` skew + dashed median/mode markers |
| `VennDiagram` | 55–56 (shared `g_venn_3set`) | 3-set, canonical 8-region schema |

### 1.2 Primitives (Layer 0, used by composites)

| Primitive | Used by |
|---|---|
| `Point` + `Label` (KaTeX-capable) | Nearly all visual items |
| `DashedProjection` | 3, 5, 9, 26–27, 29, 51 |
| `Line`, `Ray` | 24, 39 (plus 10–11 conceptually; no figure in sample) |
| `Polyline` | 26–27 (piecewise fuel price) |
| `Path`/`Curve` | 12, 13, 24 (arbitrary/smooth curves) |
| `Circle` | 1–9 |
| `Polygon` | 19, 20, 21–23 |
| `Arrow`, `AxisTick`, `GridLine` | Internal to `CartesianPlane`/overlays |

### 1.3 Deferred — not required by this sample

- **`3DSolid`** (sphere/cylinder cross-sections) — items 16–18 are word problems with no figure; needed only if high-fidelity 3D illustrations are added later.
- **`InteractiveControls`** (sliders, coordinate inspector, layer toggles, animation player) — learning-mode enhancement only (FR-Q-08).
- **Extended `FunctionPlot` samplers** (sqrt, exponential, logarithmic, inverse) — required by the specification table but not exercised by this sample's figures.

## 2. Application / UI components

### 2.1 Welcome / landing page (FR-W-01..03)

| Component | Purpose |
|---|---|
| `LandingPage` | Hosts the three entry points |
| `ModeEntryCard` | Simulation Test / Practice by Area / Practice by Topic |
| `PastAttemptsPanel` | Recent attempts list (FR-W-02) |
| `PerformanceIndicator` | Subtle green→red gradient (FR-W-03, FR-AN-03) |

### 2.2 Selection component (practice configuration, FR-P-01..05)

| Component | Purpose |
|---|---|
| `PracticeConfig` (selection flow) | Area → Topic → count → timer |
| `AreaSelector` | Geometry / Functions / Statistics |
| `TopicSelector` | Topic list filtered by area |
| `ItemCountSelector` | 5 / 10 / 20 / all available |
| `TimerToggle` + `DurationPicker` | Enable/disable timer and set length |

### 2.3 Test / practice shell (FR-S, FR-Q, FR-A)

| Component | Purpose |
|---|---|
| `TestShell` | Exam-layout container |
| `Timer` | Countdown, auto-submit on expiry (FR-S-03, NFR-P-03) |
| `ProgressBar` | Proportion answered (FR-S-09) |
| `QuestionPositionIndicator` | "Question X of 60" (FR-S-10) |
| `QuestionNavigator` | Jump + flagged status (FR-S-07, FR-S-08) |
| `FlagToggle` | Flag for review (FR-S-08) |
| `QuestionPanel` | Stem + visual + options |
| `OptionSelector` | Single choice A–D (FR-A-01) |
| `SubmitButton` / `SubmitFlow` | Auto-score on submission (FR-A-02) |
| `TextRenderer` | Text + KaTeX/LaTeX (FR-Q-01) |
| `VisualRenderer` | Registry wrapper + error boundary (FR-Q-02..07) |
| `GroupVisual` | Renders shared context once for grouped items (FR-S-06) |

### 2.4 Results & review page (FR-R-01..06)

| Component | Purpose |
|---|---|
| `ResultsSummary` | Score, correct/incorrect counts, time (FR-R-01, FR-A-04) |
| `ItemReviewList` | Per-item review (FR-R-02) |
| `ItemReviewCard` | User answer + correct answer |
| `SolutionSteps` (expandable) | Step-by-step explanation (FR-R-02) |
| `RetryButton` / `NewTestButton` / `HomeButton` | FR-R-03, FR-R-04 |
| `PerformanceGraph` | Trend of past attempts (FR-R-05) |
| `FirstTimeMessage` | "Keep practising…" (FR-R-06, FR-U-04) |

### 2.5 Performance analytics (FR-AN-01..04)

| Component | Purpose |
|---|---|
| `TrendChart` (line/bar) | Scores over time |
| `PerformanceLevelIndicator` | Green→red gradient |
| `AnalyticsFilter` | Filter by area/topic |

### 2.6 Shared / cross-cutting

| Component | Purpose |
|---|---|
| `AuthForms` (register/login/logout) | FR-U-01..03 |
| `ErrorBoundary` + render-failure fallback | NFR-M-03 (log `{item_id, visual_type, error}`, render `alt`) |
| `A11yFigureWrapper` | `<figure role="img" aria-label={alt}>` + `<title>/<desc>` (NFR-U-03) |

**Bottom line:** the sample needs **9 visual composites** (backed by ~12 primitives) plus a full app shell of roughly **25–30 UI components** across landing, selection, test, results, and analytics. `3DSolid` and `InteractiveControls` are the only two inventory items that can be safely deferred for this specific sample.