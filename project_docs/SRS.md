# Software Requirements Specification (SRS)

**Project:** MEP‑EA‑01 – High‑Fidelity Mathematics Test Simulator & Practice Platform
**Version:** 2.0
**Date:** 2026‑10‑31
**Status:** Implemented — Multi-Program Architecture, Decoupled Concept Library, and Dynamic Convocatoria Blueprints

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements and architectural topology for **MEP‑EA‑01**, a high‑fidelity web application that simulates official examinations and delivers practice modules across the 4 programs of the Costa Rican Ministry of Public Education (*Educación Abierta*):
1. **I & II Ciclo (CICO)**: Single monolithic exam with strict calculator prohibition.
2. **III Ciclo**: 3 lower secondary exams (7°, 8°, and 9° Año).
3. **EDAD**: 2 upper secondary exams (Parte 1 / 10° Año, Parte 2 / 11° Año).
4. **BXM (Bachillerato por Madurez Suficiente)**: Unified monolithic exam covering 10° & 11° Año.

The platform provides timed full exam simulations, modular practice by area and topic, interactive mathematical visualisations, Resource Library reference tools, and longitudinal progress tracking.

### 1.2 Scope
- **Multi-Program Curriculum Switching**: Seamless macro-level context switching between CICO, III Ciclo, EDAD, and BXM via global header controls.
- **Biannual Convocatoria Blueprints**: Dynamic assembly blueprints decoupling exam instances (e.g. Convocatoria 01-2026, 02-2026) from static question sets.
- **Decoupled Math Concept Library**: Centralized mathematical taxonomy under `content/library/math/` (`geometry_concepts.json`, `algebra_concepts.json`, `statistics_concepts.json`) defining concept metadata, formulas, curriculum module tags, and official criteria links.
- **Decoupled Item Repository**: Centralized atomic question assets under `content/items/math/` with linked concepts, evidence criteria, cognitive levels, and calculator rule flags.
- **Calculator Constraint Rule Enforcement**: Automatic detection and enforcement of exam rules—such as strictly prohibiting calculator widgets and filtering advanced formulas for I & II Ciclo.
- **Resource & Knowledge Library**: Specification tables, terms dictionary, and formula sheets dynamically adapting to the active curriculum track.
- **Verified Question Bank**: 170+ high-quality question items across sets 1 through 4 in BXM Mathematics with step-by-step KaTeX solutions and SVG composite visuals.

---

## 2. System Architecture & Content Topology

```
content/
├── library/                           # Central Math Concept Registry
│   └── math/
│       ├── geometry_concepts.json     # Geometry concepts & formulas
│       ├── algebra_concepts.json      # Relations & algebra concepts
│       └── statistics_concepts.json   # Statistics & probability concepts
│
├── items/                             # Reusable Atomic Item Repository
│   └── math/
│       ├── geometry/
│       ├── algebra/
│       └── statistics/
│
├── programs/                          # Program Rules & Convocatoria Assembly Blueprints
│   ├── bxm/
│   │   └── matematica/
│   │       ├── subject-metadata.json  # Passing score (70), calculator allowed, item count (60)
│   │       └── convocatorias/
│   │           ├── 2026-c1.json       # Assembly blueprint
│   │           └── 2026-c2.json       # Assembly blueprint
│   ├── edad/
│   │   └── matematica/
│   │       ├── subject-metadata.json  # Module definitions: Parte 1 (10°) & Parte 2 (11°)
│   │       ├── parte-1-10mo/convocatorias/
│   │       └── parte-2-11mo/convocatorias/
│   ├── iii_ciclo/
│   │   └── matematica/
│   │       ├── subject-metadata.json  # 7°, 8°, 9° Año subprograms
│   │       └── 7mo/convocatorias/
│   └── i_ii_ciclo/
│       └── matematica/
│           ├── subject-metadata.json  # Passing score (65), calculatorAllowed: false
│           └── convocatorias/
│
└── bxm/
    └── matematicas/                   # Production-verified sets (set_1 - set_4) & groups
```

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Macro Curriculum & Program Management
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑P‑01 | Global Header shall provide an interactive program switcher between CICO, III Ciclo, EDAD, and BXM. | Implemented |
| FR‑P‑02 | The system shall display calculator constraint badges in the header indicating whether calculators are permitted. | Implemented |
| FR‑P‑03 | `dataService` shall provide observable subscription patterns notifying all UI components on program changes. | Implemented |
| FR‑P‑04 | Convocatoria selector shall allow targeting specific exam windows (Convocatoria 01-2026 vs 02-2026). | Implemented |

#### 3.1.2 Concept Library & Taxonomies
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑C‑01 | Concepts shall be stored in decoupled JSON registries in `content/library/math/`. | Implemented |
| FR‑C‑02 | Each concept entry shall include unique ID, term, domain, module tags (`I_II_CICLO`, `EDAD_PARTE_1`, `BXM`, etc.), definition, KaTeX formulas, and evidence codes. | Implemented |
| FR‑C‑03 | `knowledgeService` shall filter terms and formulas dynamically according to the selected program track and calculator constraints. | Implemented |

#### 3.1.3 Simulation & Practice Test Shell
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑S‑01 | Simulation test delivers timed exam following official specification distributions. | Implemented |
| FR‑S‑02 | Test shell displays active program and topic context in the header bar. | Implemented |
| FR‑S‑03 | Test shell dynamically respects calculator rule flags, disabling or warning about calculator use when prohibited. | Implemented |
| FR‑S‑04 | Modular practice allows filtering by Area, Topic, or Set with configurable timers and question counts. | Implemented |

#### 3.1.4 Resource & Knowledge Library
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑K‑01 | Interactive Table of Specifications displaying affirmations, evidences, and point targets. | Implemented |
| FR‑K‑02 | Searchable Terms Dictionary supporting keyword search and domain filtering. | Implemented |
| FR‑K‑03 | Formula Sheet displaying KaTeX-rendered equations with interactive area filters. | Implemented |

---

## 4. Quality Assurance & Verification

- **Automated Tests**: 57 unit and component tests passing across 15 test suites in Vitest.
- **Frontend Verification**: Visual screenshots verifying the macro program switcher, calculator constraint badges, and dynamic view updates across light and dark modes.
- **Type Safety & Build**: Zero TypeScript compilation errors (`tsc -b`), clean Vite production bundle.

---

**End of SRS Revision 2.0**
