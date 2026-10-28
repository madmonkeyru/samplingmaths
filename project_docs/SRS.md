# Software Requirements Specification (SRS)

**Project:** MEP‑EA‑01 – High‑Fidelity Mathematics Test Simulator
**Version:** 1.1
**Date:** 2026‑03‑30
**Status:** Implementation Phase — App Shell Wired & Visual Renderer Integrated

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements for **MEP‑EA‑01**, a high‑fidelity prototype that simulates the experience of completing the Costa Rican *Bachillerato por Madurez Suficiente* Mathematics test (convocatoria 02‑2026). The system provides both **simulation tests** (full 60‑item timed exams) and **modular practice** (topic‑ or area‑specific sessions), with rich interactive visualisations and performance feedback. This SRS serves as the single authoritative reference for design, development, and validation.

### 1.2 Scope
The product is a web‑based React + TypeScript application (desktop and tablet first) that:
- Delivers the full 60‑item multiple‑choice mathematics test under timed conditions.
- Offers selective practice by area (Geometry, Functions, Statistics) or by specific topic.
- Renders high‑fidelity question visuals (2D/3D geometry, function graphs, statistical charts, Venn diagrams, etc.) dynamically from structured JSON question data (`content/questions.json`).
- Provides immediate scoring, answer review with step‑by‑step solutions, and longitudinal performance tracking via `localStorage` persistence.
- Supports local user profiles and session management.

**Out of scope for prototype:** Real‑time remote proctoring, native mobile apps (responsive web suffices), and external LMS LTI integration.

### 1.3 Definitions, Acronyms, and Abbreviations
| Term | Definition |
|------|------------|
| **BXM** | *Bachillerato por Madurez* – the Costa Rican maturity certificate exam. |
| **MEP** | *Ministerio de Educación Pública* (Costa Rica). |
| **DGEC** | *Dirección de Gestión y Evaluación de la Calidad* – official exam specifications body. |
| **Item** | A single multiple‑choice question (A, B, C, D). |
| **Area** | One of the content domains: Geometry, Functions (Relaciones y Álgebra), Statistics & Probability. |
| **Simulation** | A full timed test of 60 items. |
| **Practice** | A user‑configured session limited by area, topic, or item count. |
| **SRS** | Software Requirements Specification (this document). |

---

## 2. Overall Description

### 2.1 Product Perspective & Current Implementation Status
MEP‑EA‑01 is an integrated React + Vite single-page application. The core application shell and rendering engine are implemented:
- **App Shell & State Wiring**: Navigation between Landing/Welcome, Practice/Test Shell, and Results/Review view is operational (`App.tsx`).
- **Visual Engine (`VisualRenderer`)**: Modular SVG component system handling Cartesian grid planes, geometric primitives, transformations, multi-view function graphs, box plots, frequency/contingency tables, and Venn diagrams.
- **Math Engine (`TextRenderer`)**: KaTeX integration rendering inline (`$...$`) and block (`$$...$$`) LaTeX formulas.
- **Persistence Layer (`storageService`)**: Local storage engine storing user profiles, active test sessions, item responses, flagged questions, and completed attempt history.
- **Testing Architecture**: Automated test suite powered by Vitest, `@testing-library/react`, and `@testing-library/jest-dom`.

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 User Management & Storage
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑U‑01 | The system shall allow users to create or switch local user accounts. | Implemented |
| FR‑U‑02 | The system shall log in / set current active user. | Implemented |
| FR‑U‑03 | The system shall persist user progress and attempt history across browser sessions. | Implemented |
| FR‑U‑04 | The system shall display first-time user encouragement messages and historical statistics on results. | Implemented |

#### 3.1.2 Welcome / Landing Page
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑W‑01 | Landing page presents three main modes: **Simulation Test**, **Practice by Area**, **Practice by Topic**. | Implemented |
| FR‑W‑02 | Users can view past attempts and score progression from the landing page. | Implemented |
| FR‑W‑03 | Landing page displays a green-to-red performance indicator derived from recent attempts. | Implemented |

#### 3.1.3 Simulation & Practice Test Shell
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑S‑01 | Simulation test contains 60 multiple-choice items following official distribution. | Implemented |
| FR‑S‑02 | Practice mode allows selection by Domain Area or Topic with configurable item count and timer settings. | Implemented |
| FR‑S‑03 | Live visible countdown timer that auto-submits when expired. | Implemented |
| FR‑S‑04 | Question navigator panel with grid view, response indicators, and flag for review functionality. | Implemented |
| FR‑S‑05 | Shared context grouping (`groups.json`) displayed above grouped items. | Implemented |
| FR‑S‑06 | Progress bar showing percentage of questions answered. | Implemented |

#### 3.1.4 Question & Visual Rendering
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑Q‑01 | Render LaTeX equations inline and in display mode using KaTeX. | Implemented |
| FR‑Q‑02 | Dynamic rendering of 2D Cartesian coordinate systems (axes, grids, circles, polygons, curves). | Implemented |
| FR‑Q‑03 | Spatial 3D geometry representation (spheres, cylinders, cross sections). | Implemented |
| FR‑Q‑04 | Function graphs (linear, quadratic, square root, exponential, logarithmic) and multi-view option grids. | Implemented |
| FR‑Q‑05 | Statistical visualisations (frequency tables, box plots, Venn diagrams). | Implemented |

#### 3.1.5 Results & Step-by-Step Review
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑R‑01 | Immediate percentage score, correct/incorrect count, and time spent metrics. | Implemented |
| FR‑R‑02 | Item-by-item review displaying chosen option, correct option, and step-by-step solution steps. | Implemented |
| FR‑R‑03 | Retry test and return home functionality. | Implemented |

---

## 4. Next Logical Steps & Development Roadmap

1. **Phase 1 (Completed)**: App Shell, Data Services, Visual Rendering Engine, Test Shell, Results Page, and Storage Layer.
2. **Phase 2 (Current)**: Documentation revision, build pipeline verification, and TypeScript strict check cleanup.
3. **Phase 3 (Next Logical Steps)**:
   - **Extended Visual Interactivity**: Add interactive parameter controls/sliders for learning mode exploration.
   - **Advanced Analytics**: Add domain topic mastery breakdown charts and targeted weakness practice recommendations.
   - **Offline PWA Capabilities**: Add service worker caching for complete offline operation without server connectivity.
   - **Expanded E2E Verification**: Complement Vitest unit tests with Playwright visual regression and full user flow e2e tests.

---

**End of SRS Revision 1.1**
