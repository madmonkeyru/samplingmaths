# Software Requirements Specification (SRS)

**Project:** MEP‑EA‑01 – High‑Fidelity Mathematics Test Simulator & Practice Platform
**Version:** 1.2
**Date:** 2026‑03‑30
**Status:** Implementation Phase — Modular Multi-Program Architecture & Expanded Question Sets Integrated

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements for **MEP‑EA‑01**, a high‑fidelity web application that simulates the experience of completing the Costa Rican *Bachillerato por Madurez Suficiente* Mathematics test (convocatoria 02‑2026) and provides comprehensive practice across the broader MEP *Educación Abierta* program framework (I&II CICO, III Ciclo, EDAD, BXM). The system provides both **simulation tests** (full 60‑item timed exams) and **modular practice** (topic‑, area‑, or set‑specific sessions), with rich interactive visualisations, Resource Library reference tools, and longitudinal performance feedback.

### 1.2 Scope
The product is a web‑based React + TypeScript application (desktop, tablet, and mobile responsive) that:
- Delivers the full 60‑item multiple‑choice mathematics test under realistic timed conditions.
- Offers modular practice across **170 high-quality question items** organized into four specialized question sets (`set_1` through `set_4`) in BXM Mathematics, filterable by Domain Area (Geometry, Functions, Statistics) or specific Topic.
- Features a multi-program central manifest registry (`content/manifest.json`) supporting modular subject content management (`content/bxm/matematicas/`) for programs CICO, III Ciclo, EDAD, and BXM.
- Dynamic asynchronous content loading via Vite `import.meta.glob` combined with instant synchronous fallback preloading.
- Renders high‑fidelity question visuals (2D Cartesian coordinate systems, function graphs, spatial 3D geometry cross-sections, box plots, frequency/contingency tables, Venn diagrams) dynamically from structured JSON question data.
- Provides immediate scoring, step-by-step solutions review, Resource Library knowledge reference tools (Specification Tables, Terms Dictionary, Formula Sheets), and longitudinal performance tracking via `localStorage` persistence.
- Supports local user profiles and session management.

---

## 2. Overall Description

### 2.1 Product Perspective & Implementation Status
MEP‑EA‑01 is an integrated React + Vite single-page application.
- **App Shell & Routing**: Navigation between Landing/Welcome, Practice/Test Shell, Resource Library, and Results/Review views is operational (`App.tsx`).
- **Data Engine & Manifest Loader (`dataService`)**: Modular loader parsing `manifest.json` and subject directories (`content/bxm/matematicas/`) with dynamic import capabilities and synchronous fallback methods.
- **Visual Engine (`VisualRenderer`)**: Modular SVG component system handling Cartesian grid planes, geometric primitives, function plots, box plots, contingency/frequency tables, and Venn diagrams with named theme token resolution.
- **Math Engine (`TextRenderer`)**: KaTeX integration rendering inline (`$...$`) and block (`$$...$$`) LaTeX formulas across questions, options, solution steps, and formula sheets.
- **Persistence Layer (`storageService`)**: Local storage engine storing user profiles, active test sessions, item responses, flagged questions, and completed attempt history.
- **Testing Architecture**: Automated unit and component test suite powered by Vitest, `@testing-library/react`, and `@testing-library/jest-dom`.

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 User Management & Storage
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑U‑01 | The system shall allow users to create or switch local user accounts. | Implemented |
| FR‑U‑02 | The system shall log in / set current active user. | Implemented |
| FR‑U‑03 | The system shall persist user progress and attempt history across browser sessions. | Implemented |
| FR‑U‑04 | The system shall display historical statistics and performance trends on results. | Implemented |

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
| FR‑S‑02 | Practice mode allows selection by Domain Area, Topic, or Question Set (`set_1` to `set_4`) with configurable item count and timer settings. | Implemented |
| FR‑S‑03 | Live visible countdown timer that auto-submits when expired. | Implemented |
| FR‑S‑04 | Question navigator panel with grid view, response indicators, and flag for review functionality. | Implemented |
| FR‑S‑05 | Shared context grouping (`groups.json`) displayed above grouped items. | Implemented |
| FR‑S‑06 | Progress bar showing percentage of questions answered. | Implemented |

#### 3.1.4 Content Bank & Modular Loader
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑M‑01 | Central manifest registry (`content/manifest.json`) defines program, subject, set, group, and schema paths. | Implemented |
| FR‑M‑02 | The system supports multi-set question banks (`set_1`, `set_2`, `set_3`, `set_4`) with independent set metadata. | Implemented |
| FR‑M‑03 | The system loads content dynamically and asynchronously while preserving synchronous access for active data. | Implemented |

#### 3.1.5 Question & Visual Rendering
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑Q‑01 | Render LaTeX equations inline and in display mode using KaTeX. | Implemented |
| FR‑Q‑02 | Dynamic rendering of 2D Cartesian coordinate systems (axes, grids, circles, polygons, curves). | Implemented |
| FR‑Q‑03 | Spatial 3D geometry representation (spheres, cylinders, cross sections). | Implemented |
| FR‑Q‑04 | Function graphs (linear, quadratic, square root, exponential, logarithmic) and multi-view option grids. | Implemented |
| FR‑Q‑05 | Statistical visualisations (frequency tables, box plots, Venn diagrams). | Implemented |

#### 3.1.6 Resource & Knowledge Library
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑K‑01 | Interactive Table of Specifications detailing blocks, affirmations, evidences, and point totals. | Implemented |
| FR‑K‑02 | Searchable Terms Dictionary for mathematical definitions and concepts. | Implemented |
| FR‑K‑03 | Formula Sheet with KaTeX rendering, search filtering, and collapsible accordion sections. | Implemented |

#### 3.1.7 Results & Step-by-Step Review
| ID | Requirement | Status |
|----|-------------|--------|
| FR‑R‑01 | Immediate percentage score, correct/incorrect count, and time spent metrics. | Implemented |
| FR‑R‑02 | Item-by-item review displaying chosen option, correct option, and step-by-step solution steps. | Implemented |
| FR‑R‑03 | Retry test and return home functionality. | Implemented |

---

## 4. Next Logical Steps & Development Roadmap

1. **Phase 1 (Completed)**: App Shell, Data Services, Visual Rendering Engine, Test Shell, Results Page, and Storage Layer.
2. **Phase 2 (Completed)**: Modular multi-program architecture (`manifest.json`), subject question set expansion (170 items), primitive color resolution, and Resource Library integration.
3. **Phase 3 (Next Logical Steps)**:
   - **Additional Program Content**: Populate question sets for III Ciclo and EDAD programs in `content/` as specified in `manifest.json`.
   - **Extended Visual Interactivity**: Add interactive parameter controls/sliders for learning mode exploration.
   - **Advanced Analytics**: Add domain topic mastery breakdown charts and targeted weakness practice recommendations.
   - **Offline PWA Capabilities**: Add service worker caching for complete offline operation without server connectivity.

---

**End of SRS Revision 1.2**
