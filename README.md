# MEP-EA-01 — Costa Rican Educación Abierta Test Simulator & Practice Platform

**MEP-EA-01** is a high-fidelity web-based test simulator and learning practice platform designed for students preparing for the Costa Rican *Bachillerato por Madurez Suficiente* (BXM) exam (Convocatorias 01-2026 & 02-2026) and the broader *Educación Abierta* framework (I&II Ciclo CICO, III Ciclo, EDAD, BXM).

---

## 🚀 Key Features

- **Multi-Program Architecture Across 4 Testing Tracks**:
  - **I & II Ciclo (CICO)**: Single monolithic primary-level exam with strict calculator prohibition rules (`calculatorAllowed: false`).
  - **III Ciclo**: 3 lower secondary-level exams (7°, 8°, and 9° Año).
  - **EDAD**: 2 upper secondary-level exams separated into distinct testing modules (Parte 1 / 10° Año, Parte 2 / 11° Año).
  - **BXM**: Single monolithic exam covering combined 10° & 11° grade concepts.
- **Biannual Convocatoria Blueprints**:
  - Decoupled exam assembly manifests supporting multiple annual testing windows (e.g. Convocatoria 01-2026 and 02-2026) with passing score thresholds, item weights, and section boundaries.
- **Decoupled Math Concept Library**:
  - Centralized concept item bank located in `content/library/math/` (`geometry_concepts.json`, `algebra_concepts.json`, `statistics_concepts.json`).
  - Standardized concept metadata: unique ID, domain, curriculum module tags, formal definitions, KaTeX formulas, examples, and official criteria links.
- **Decoupled Item Repository**:
  - Atomic question assets located in `content/items/math/`, tagged with linked concepts, evidence targets, cognitive levels, and calculator constraints.
- **Full Exam Simulation & Practice Engine**:
  - Timed 60-item simulation following official MEP specifications and distributions across Geometry, Functions & Algebra, and Statistics & Probability.
  - Modular practice filterable by Domain Area, Topic, or Question Set across **170+ high-quality question items**, with configurable item counts and optional timers.
- **Dynamic Math & Visual Rendering Engine**:
  - LaTeX mathematical equations rendered via **KaTeX** with inline (`$...$`) and block (`$$...$$`) support.
  - Interactive and vector-based 2D/3D visualizations (Cartesian planes, circles, transformations, function graphs, box plots, frequency/contingency tables, Venn diagrams) powered by custom SVG composite components.
- **Resource & Knowledge Library**:
  - Official Table of Specifications (Affirmations, Evidences, Points per block).
  - Searchable Terms Dictionary and Formula Sheets with KaTeX LaTeX rendering and collapsible accordion sections.
- **Answer Capture, Instant Scoring & Analytics**: Single-choice selection, question flag/review grid, automatic scoring upon submission, step-by-step solutions, and longitudinal attempt history with green-to-red performance indicator trends.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Math Rendering**: [KaTeX](https://katex.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library (React & Jest DOM)](https://testing-library.com/) + [Playwright](https://playwright.dev/)

---

## 📦 Getting Started

### Prerequisites

Ensure you have **Node.js** (v20+ recommended) and **npm** installed.

### Installation

```bash
# Clone repository and install dependencies
npm install
```

### Development Server

Run the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Production Build

Type-check and build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Testing & Quality Assurance

### Unit & Component Tests

Run unit tests using Vitest:

```bash
npx vitest run
```

### Linting

Run Oxlint:

```bash
npm run lint
```

---

## 📂 Project Structure

```
├── content/                     # Question bank, concept library, and blueprints
│   ├── manifest.json            # Central registry mapping programs, libraries, subjects
│   ├── schema.json              # Item content JSON schema validator
│   ├── library/                 # Centralized Math Concept Registry
│   │   └── math/
│   │       ├── geometry_concepts.json
│   │       ├── algebra_concepts.json
│   │       └── statistics_concepts.json
│   ├── items/                   # Centralized Reusable Item Repository
│   │   └── math/
│   │       ├── geometry/
│   │       ├── algebra/
│   │       └── statistics/
│   ├── programs/                # Program-specific rules & convocatoria assembly blueprints
│   │   ├── bxm/                 # BXM subject metadata & convocatorias
│   │   ├── edad/                # EDAD modules (Parte 1 & Parte 2) & convocatorias
│   │   ├── iii_ciclo/           # III Ciclo subprograms (7°, 8°, 9°) & convocatorias
│   │   └── i_ii_ciclo/          # I & II Ciclo (CICO) blueprints (calculator prohibited)
│   └── bxm/
│       └── matematicas/         # BXM verified sets (set_1 through set_4) & groups
├── project_docs/                # Requirements, SRS, architecture specs
│   ├── SRS.md                   # System Requirements Specification (v2.0)
│   ├── Strategy_for_Developing_Reusable_Visualisation_Components.md
│   ├── images/                  # Architecture and UI screenshots
│   └── reference_dumps/         # Raw text and PDF extractions
├── src/
│   ├── components/              # UI components (common, knowledge, layout, pages, practice, test, visuals)
│   ├── services/                # Services (dataService, storageService, knowledgeService)
│   ├── types/                   # TypeScript interfaces and domain types
│   ├── utils/                   # Math, coordinate transform, and tick helpers
│   ├── App.tsx
│   └── main.tsx
└── vitest.config.ts             # Vitest configuration
```

---

## 📄 License

This project is developed for educational purposes supporting student preparation for MEP Educación Abierta exams.
