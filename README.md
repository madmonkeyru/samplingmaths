# MEP-EA-01 — Bachillerato por Madurez Suficiente (BXM) Mathematics Test Simulator

**MEP-EA-01** is a high-fidelity web-based mathematics test simulator designed for students preparing for the Costa Rican *Bachillerato por Madurez Suficiente* (BXM) exam (Convocatoria 02-2026).

---

## 🚀 Key Features

- **Full Exam Simulation**: 60-item timed simulation with realistic topic distributions (Geometry, Functions & Algebra, Statistics & Probability).
- **Modular Practice Mode**: Filter practice sessions by specific Domain Area (Geometry, Functions, Statistics) or Topic, with configurable item counts and optional timers.
- **Dynamic Math & Visual Rendering**:
  - LaTeX mathematical equations rendered via **KaTeX**.
  - Interactive and vector-based 2D/3D visualizations (Cartesian planes, circles, transformations, function graphs, box plots, frequency tables, Venn diagrams) powered by custom SVG components.
- **Answer Capture & Instant Scoring**: Single-choice selection, automatic scoring upon test submission, and persistent attempt history.
- **Detailed Step-by-Step Solutions**: Explanations and solucionario review for every question.
- **Performance Analytics**: Longitudinal performance tracking with visual indicator trends (green-to-red performance score).

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
├── content/              # Question bank and group data (JSON schema)
│   ├── questions.json
│   ├── groups.json
│   └── schema.json
├── project_docs/         # Requirements, SRS, architecture specs
│   ├── SRS.md
│   └── ...
├── src/
│   ├── components/       # UI components (common, layout, pages, practice, results, test, visuals)
│   ├── services/         # Data services (questions loader, localStorage persistence)
│   ├── types/            # TypeScript interfaces and domain types
│   ├── utils/            # Math and coordinate transformation helpers
│   ├── App.tsx
│   └── main.tsx
└── vitest.config.ts      # Vitest configuration
```

---

## 📄 License

This project is developed for educational purposes supporting student preparation for MEP BXM Mathematics exams.
