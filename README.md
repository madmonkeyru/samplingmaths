# MEP-EA-01 — Costa Rican Educación Abierta Test Simulator & Practice Platform

**MEP-EA-01** is a high-fidelity web-based test simulator and learning practice platform designed for students preparing for the Costa Rican *Bachillerato por Madurez Suficiente* (BXM) exam (Convocatoria 02-2026) and the broader *Educación Abierta* framework (CICO, III Ciclo, EDAD, BXM).

---

## 🚀 Key Features

- **Full Exam Simulation**: 60-item timed simulation following official MEP specifications and distributions across Geometry, Functions & Algebra, and Statistics & Probability.
- **Modular Practice Engine**: Filter practice sessions by specific Domain Area (Geometry, Functions, Statistics) or Topic across **170 high-quality question items** distributed in 4 specialized sets (`set_1` through `set_4`), with configurable item counts and optional timers.
- **Multi-Program Content Architecture**:
  - Centralized content manifest registry (`content/manifest.json`) supporting the four MEP Educación Abierta programs: **I&II CICO**, **III Ciclo**, **EDAD**, and **BXM**.
  - Subject-modular question bank management with set-specific metadata, dedicated group files (`groups.json`), and schema validation (`schema.json`).
  - Dynamic asynchronous loading via Vite `import.meta.glob` combined with instant synchronous preloading for seamless user navigation.
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

Run Vitest in watch mode:

```bash
npx vitest
```

### Linting

Run Oxlint:

```bash
npm run lint
```

---

## 📂 Project Structure

```
├── content/                     # Question bank and manifest registry
│   ├── manifest.json            # Central registry mapping programs, subjects, sets, schemas
│   └── bxm/
│       └── matematicas/         # BXM Mathematics subject content
│           ├── set_1.json       # Official Simulation Set (60 items)
│           ├── set_2.json       # Additional Practice Expansion Set (70 items)
│           ├── set_3.json       # Intensive Practice Refinement Set (20 items)
│           ├── set_4.json       # Advanced Mastery & Real-world Contexts Set (20 items)
│           ├── groups.json      # Shared context stimulus items
│           └── schema.json      # Subject JSON schema validator
├── project_docs/                # Requirements, SRS, architecture specs
│   ├── SRS.md
│   └── ...
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
