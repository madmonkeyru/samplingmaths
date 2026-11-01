# MEP-EA-01: Unified Content Registry & Asset Management Architecture

**Document Version:** 1.0.0
**Target System:** MEP-EA-01 Costa Rican Educación Abierta Test Simulator & Practice Platform
**Scope:** Architecture Specification for Decoupled Content Registry, Dynamic Test Assembly Engine, Parametric Visual Assets, and Curriculum Ingestion Pipelines across I&II Ciclo (CICO), III Ciclo (7°, 8°, 9°), EDAD (Parte 1 & Parte 2), and BXM.

---

## 1. Executive Summary & Problem Context

### 1.1 The Operational Challenge
The Costa Rican *Ministerio de Educación Pública* (MEP) through the *Dirección de Gestión y Evaluación de la Calidad* (DGEC) administers open high-school and adult education certification examinations across four primary tracks:
- **I y II Ciclo (CICO)**: Primary school equivalency (5 subject examinations; strictly prohibits calculator usage).
- **III Ciclo**: Lower secondary equivalency divided into three distinct grade-level evaluations: **7° Año**, **8° Año**, and **9° Año**.
- **EDAD**: Distance secondary education split into two modular testing cycles: **Parte 1 (10° Año)** and **Parte 2 (11° Año)**.
- **BXM (Bachillerato por Madurez Suficiente)**: Comprehensive single-sitting exit examination synthesizing 10° and 11° grade secondary curricula.

Each calendar year, MEP conducts two official test convocatorias (**Convocatoria 01** and **Convocatoria 02**). In monolithic test applications, binding items directly to fixed exam sets (`set_1.json`, etc.) introduces severe engineering friction:
1. **Curriculum Drift & Item Redundancy**: Items assessing identical skills (e.g., circular translations, slope calculations, standardized scores) are duplicated across different convocatorias or practice banks.
2. **Brittle Test Blueprints**: Changes in question phrasing or official weighting require manual surgery across multiple static exam files.
3. **Impedance to Adaptive & Targeted Learning**: Diagnostic quizzes, remediation drilldowns, and topic filters cannot dynamically pull from a verified unified repository.
4. **Maintenance Overhead of Graphical Artifacts**: Storing raster or static image assets creates visual degradation, theme inconsistency, and impossible parametric editing.

### 1.2 Core Architectural Objectives
- **Centralized Normalized Content Repository**: Decouple questions from specific test instances and store them as atomic, independently addressable items tagged by concept, evidence criterion, cognitive level, and difficulty tier.
- **Dynamic Test Assembly Engine**: Generate timed full exam simulations, weighted mock tests following official DGEC specification tables, targeted concept drilldowns, topic practice, and large random test sessions on the fly.
- **Parametric Vector Visualizations (Zero Static Bitmaps)**: Represent all geometric figures, function graphs, coordinate planes, 3D spatial solids, and statistical diagrams as lightweight JSON parameter payloads rendered natively by SVG/Canvas components.
- **Deterministic Maintenance & Ingestion Pipeline**: Provide a standardized directory tree and CLI validation tooling to ingest new convocatorias, lint content schemas, and verify 100% curriculum coverage.

---

## 2. Granular Concept & Curriculum Taxonomy Schema

### 2.1 Taxonomy Hierarchy
The content model organizes educational standards into a strict five-tier normalized hierarchy:

```
[Program] (e.g., III Ciclo, EDAD, BXM, CICO)
  └── [Subprogram / Grade Level] (e.g., 7mo, 8vo, 9no, Parte 1, Parte 2)
        └── [Domain / Area] (e.g., Geometría, Relaciones y Álgebra, Estadística)
              └── [Affirmation / Subdomain] (e.g., A1, A2, A5)
                    └── [Evidence / Competency Skill] (e.g., A1.2, A5.3)
                          └── [Atomic Concept Registry Entry] (e.g., mep-geo-circunferencia-01)
```

### 2.2 Entity Schemas

#### 2.2.1 Concept Registry Entry (`content/library/math/*_concepts.json`)
```typescript
interface ConceptRegistryEntry {
  id: string; // Unique slug: 'mep-geo-circunferencia-01'
  term: string; // 'Circunferencia'
  domain: 'geometry' | 'functions' | 'statistics';
  blockName: string; // '1. Geometría - Geometría Analítica'
  subdomain?: string;
  definition: string; // Formal mathematical definition
  programModules: ProgramModuleTag[]; // ['EDAD_PARTE_1', 'BXM']
  gradeLevel?: '7mo' | '8vo' | '9no' | '10mo' | '11mo' | 'primaria';
  calculatorAllowed: boolean;
  formulas?: Array<{
    name: string;
    latex: string;
    description: string;
    variables?: Array<{ symbol: string; meaning: string }>;
  }>;
  examples?: string[];
  relatedEvidence?: string[]; // ['A1.1', 'A1.2', 'A1.3']
  prerequisiteConcepts?: string[];
}
```

#### 2.2.2 Decoupled Atomic Item (`content/items/math/{domain}/item-*.json`)
```typescript
interface Item {
  id: number; // Global numeric ID for backwards runtime compatibility
  code: string; // Decoupled alphanumeric slug: 'item-geo-bxm-001'
  area: string; // Display area title: 'Geometría'
  area_id: 'geometry' | 'functions' | 'statistics';
  topic: string; // Granular topic: 'Circunferencia'
  spec: {
    block: string; // '1. Geometría'
    affirmation: string; // 'A1'
    affirmation_desc?: string | null;
    evidence: string; // 'A1.2'
    evidence_desc: string; // MEP official evidence description
  };
  evidence_id?: string; // 'A1.2'
  concept_id?: string; // Primary linked concept
  linked_concepts?: string[]; // Array of concept IDs reinforced
  program_applicability: Array<
    'I_II_CICLO' | 'III_CICLO_7' | 'III_CICLO_8' | 'III_CICLO_9' | 'EDAD_PARTE_1' | 'EDAD_PARTE_2' | 'BXM'
  >;
  calculator_allowed: boolean;
  cognitive_level: 'reproduccion' | 'conexion' | 'reflexion';
  difficulty_tier: 1 | 2 | 3; // 1 = Básico, 2 = Intermedio, 3 = Avanzado
  historical_convocatoria?: string[]; // e.g. ['2026-c2']
  stem: string; // Question markdown with KaTeX LaTeX ($...$)
  options: Record<'A' | 'B' | 'C' | 'D', string>;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  solution_steps: string[];
  group_id?: string | null;
  visual_spec?: VisualSpec | null;
}
```

#### 2.2.3 Convocatoria Blueprint (`content/programs/{program}/{subject}/convocatorias/{year}-{cycle}.json`)
A convocatoria blueprint does not contain questions; it contains an ordered specification and item pool referencing atomic item IDs:
```typescript
interface ConvocatoriaManifest {
  schemaVersion: '1.0' | '2.0';
  convocatoriaId: string; // '2026-c2'
  year: number; // 2026
  cycle: 1 | 2; // 2
  programId: 'bxm' | 'edad' | 'iii_ciclo' | 'cico';
  subprogramId?: string;
  subjectId: string; // 'matematica'
  title: string;
  description: string;
  passingScore: number; // 70 for BXM/EDAD, 65 for CICO/III Ciclo
  calculatorAllowed: boolean;
  timeLimitMinutes: number; // 150 minutes
  totalItems: number; // 60
  sections: Array<{
    id: string; // 'geometry'
    name: string; // 'Geometría'
    itemRange: [number, number]; // [1, 23]
    totalItems: number; // 23
    itemIds: string[]; // Ordered list of item codes
  }>;
  itemPool: string[]; // Master pool of eligible items for simulation
}
```

---

## 3. Item Bank & Dynamic Test Engine

### 3.1 Practice Modes Supported
The dynamic test engine (`src/services/testEngine.ts`) compiles sessions dynamically from the item bank:
1. **Full Exam Simulation**:
   - Reconstitutes the official 60-item exam blueprint from `convocatorias/{id}.json` with strict sequential positioning (e.g. Items 1–23: Geometry, Items 24–48: Relations & Algebra, Items 49–60: Statistics).
   - Enforces the official 150-minute exam timer and calculator prohibition flags.
2. **Targeted Concept Drilldown**:
   - Filter items where `concept_id === requestedConceptId` or `linked_concepts.includes(requestedConceptId)`.
   - Allows students to drill down into specific weak areas identified in diagnostic tests.
3. **Practice by Area & Topic**:
   - Selects items filtered by `area_id` or specific topic string, supporting configurable item counts (5, 10, 20, all).
4. **Weighted Dynamic Mock Test (Proportional Sampling)**:
   - Compiles a randomized practice test mirroring the official MEP Table of Specifications weight matrix:
     * Geometría: 23 items (38.3%)
     * Relaciones y Álgebra: 25 items (41.7%)
     * Estadística y Probabilidad: 12 items (20.0%)
   - Distributes cognitive levels proportionally across *Reproducción* (~30%), *Conexión* (~50%), and *Reflexión* (~20%).
5. **Quick Random Practice**:
   - Randomizes items across all domains or active filters for agile, low-friction study sessions.

### 3.2 Dynamic Assembly Algorithm
When generating a weighted mock test of size $N$ (default 60):
1. Compute domain quota:
   $$Q_{\text{geo}} = \mathrm{round}(N \times 0.3833), \quad Q_{\text{alg}} = \mathrm{round}(N \times 0.4167), \quad Q_{\text{est}} = N - Q_{\text{geo}} - Q_{\text{alg}}$$
2. For each domain, bucket eligible items by official evidence criteria ($A_i$).
3. Uniformly sample across distinct evidence criteria to ensure balanced curricular breadth without clustering.
4. Shuffle options or renumber items deterministically while maintaining step-by-step solution integrity.

---

## 4. Parametric Visual Asset Specification (Zero Static Images)

### 4.1 Visual Architectural Rule
Under no circumstances are static raster images (PNG, JPEG, WebP) or static static-sized SVGs embedded for mathematical figures. All visual assets must be parameter-driven, theme-aware SVG composite objects that adapt dynamically to viewport scale and light/dark mode CSS tokens (`--visual-*`).

### 4.2 Standard Visual Types & Parameters

| Visual Type | Component Renderer | Core Parameters Passed in Payload |
| :--- | :--- | :--- |
| `cartesian_2d` | `CartesianCanvas` / `CartesianPlane` | `domain: { x: [min, max], y: [min, max] }`, `grid: boolean`, `children: [points, lines, circles, polygons]` |
| `function_plot` | `FunctionPlotter` | `form: 'linear' \| 'quadratic' \| 'sqrt' \| 'exponential' \| 'logarithmic'`, `params: { a, b, c, m, k }`, `annotations` |
| `solid_3d` | `Solid3D` | `shape: 'sphere' \| 'cylinder' \| 'cone' \| 'frustum' \| 'prism'`, `parameters: { radius, height, distance, cutAngle }`, `labels` |
| `box_plot` | `BoxPlotComposite` | `groups: Array<{ name, min, q1, med, q3, max }>`, `scale: [min, max]`, `step` |
| `curve_region` | `CurveRegionVisual` | `path: SVGPathDescription`, `straight_segments: []`, `shadedRegion: boolean` |
| `table` | `TableVisual` | `variant: 'frequency' \| 'contingency' \| 'stats'`, `headers: []`, `rows: [][]` |
| `venn_diagram` | `VennDiagram` | `sets: ['A', 'B']`, `region_values: { onlyA, onlyB, intersection, outside }` |
| `multi_view_grid` | `MultiViewGrid` | `layout: { rows, cols }`, `views: Array<{ label, visual: VisualSpec }>` |

### 4.3 Example Parametric Specification: 3D Spatial Solid Cut
```json
{
  "alt": "Sección plana circular en una esfera",
  "visual": {
    "type": "solid_3d",
    "shape": "sphere",
    "width": 380,
    "height": 280,
    "parameters": {
      "radius": 85,
      "distance": 32,
      "showCenter": true,
      "showAxis": true,
      "showRightAngle": true
    },
    "labels": {
      "center": "M",
      "sectionCenter": "O",
      "sectionLeft": "P",
      "sectionRight": "N"
    },
    "referenceBox": {
      "lines": [
        "P — O — N",
        "M: centro de la esfera",
        "O: centro de la sección plana"
      ]
    },
    "showCrossSection": true,
    "showAxes": true
  }
}
```

---

## 5. File Directory Structure & Content Maintenance Pipeline

### 5.1 Canonical Directory Layout
```
content/
├── manifest.json                        # Central program and subject registry
├── item.schema.json                     # JSON Schema definition for atomic items
├── taxonomy.schema.json                 # JSON Schema definition for curriculum taxonomy
├── library/                             # Centralized Curriculum Concept Libraries
│   └── math/
│       ├── geometry_concepts.json       # Geometry concepts & formulas
│       ├── algebra_concepts.json        # Algebra & function concepts
│       └── statistics_concepts.json     # Statistics & probability concepts
├── items/                               # Centralized Atomic Reusable Question Bank
│   └── math/
│       ├── geometry/                    # item-geo-*.json
│       ├── algebra/                     # item-alg-*.json
│       └── statistics/                  # item-est-*.json
└── programs/                            # Program blueprints & official specifications
    ├── bxm/
    │   └── matematica/
    │       ├── subject-metadata.json    # Program metadata & rules
    │       └── convocatorias/
    │           ├── 2026-c1.json         # Convocatoria 01-2026 blueprint
    │           └── 2026-c2.json         # Convocatoria 02-2026 blueprint
    ├── edad/
    │   └── matematica/
    │       ├── parte-1-10mo/convocatorias/2026-c1.json
    │       └── parte-2-11mo/convocatorias/2026-c1.json
    ├── iii_ciclo/
    │   └── matematica/
    │       ├── 7mo/convocatorias/2026-c1.json
    │       ├── 8vo/convocatorias/2026-c1.json
    │       └── 9no/convocatorias/2026-c1.json
    └── i_ii_ciclo/
        └── matematica/
            └── convocatorias/2026-c1.json
```

### 5.2 Naming Conventions
- **Concept IDs**: `mep-{domain_abbr}-{slug}-{index}` (e.g., `mep-geo-circunferencia-01`).
- **Atomic Item Codes**: `item-{domain_abbr}-{descriptor}-{index}` (e.g., `item-geo-circ-001`, `item-alg-quad-014`).
- **Convocatoria IDs**: `{YYYY}-c{1|2}` (e.g., `2026-c2`).

### 5.3 PDF Ingestion & Content Maintenance Pipeline

```
[Official MEP Exam PDF] + [Tabla de Especificaciones PDF]
               │
               ▼
[Step 1: Text & Coordinate Extraction] (scripts/extract-pdf.mjs / pdfplumber)
               │
               ▼
[Step 2: Skill & Evidence Alignment]
   - Parse affirmation (A1–A11) and evidence (A1.1–A11.4)
   - Assign primary concept_id from content/library/math/
   - Tag cognitive level (reproducción / conexión / reflexión)
               │
               ▼
[Step 3: Programmatic Visual Generation]
   - Translate geometric diagrams to parametric Solid3D / CartesianCanvas specs
   - Standardize KaTeX mathematical notation in stem & options
               │
               ▼
[Step 4: Atomic Item Generation]
   - Write standalone JSON to content/items/math/{domain}/item-*.json
               │
               ▼
[Step 5: Convocatoria Blueprint Assembly]
   - Append item codes to content/programs/{program}/{subject}/convocatorias/{id}.json
               │
               ▼
[Step 6: Automated Quality Assurance CLI]
   - Run: node scripts/ingest-validate-content.mjs
   - Validates JSON schemas, verify 100% evidence coverage, and test rendering
```

---

## 6. Summary of Architectural Benefits

1. **Zero Content Redundancy**: Items assessing identical curricular competencies are stored exactly once and reused across BXM, EDAD, and III Ciclo according to their `program_applicability` tags.
2. **Curricular Integrity**: Every single item is programmatically mapped to official MEP DGEC evidence criteria, affirmations, and cognitive levels.
3. **Infinite Dynamic Simulation**: Students can generate unlimited custom exams mirroring official weight distributions or drill down into specific concepts.
4. **Resolution-Independent Graphics**: 100% parameter-driven SVG rendering guarantees crisp visuals across Retina displays and seamless dark mode support.
