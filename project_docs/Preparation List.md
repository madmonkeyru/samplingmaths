# Preparation and Execution Log

**Project:** MEP-EA-01 — Educación Abierta Test Simulator & Practice Platform
**Updated:** 2026-10-31

---

## 1. System Overhaul Summary

The platform has been transitioned from a BXM-only application to a modular, multi-program architecture supporting all 4 MEP Educación Abierta programs across biannual test cycles (convocatorias):

1. **I & II Ciclo (CICO)**:
   - Status: Architecture implemented; calculator prohibition rule active (`calculatorAllowed: false`); passing score threshold set to 65.
2. **III Ciclo (7°, 8°, 9° Año)**:
   - Status: Subprogram modular layout configured with independent convocatoria blueprints; passing score threshold set to 65.
3. **EDAD (Educación Diversificada a Distancia)**:
   - Status: Dual-module layout established (Parte 1 / 10° Año, Parte 2 / 11° Año) with separate convocatorias; passing score threshold set to 70.
4. **BXM (Bachillerato por Madurez Suficiente)**:
   - Status: Full production data active across 170+ items in 4 sets (`set_1` through `set_4`); passing score threshold set to 70.

---

## 2. Decoupled Content Structure

- **Concept Library**: Located in `content/library/math/` (`geometry_concepts.json`, `algebra_concepts.json`, `statistics_concepts.json`). Concepts are independent of test dates and mapped to curriculum module tags.
- **Item Repository**: Located in `content/items/math/` (`geometry/`, `algebra/`, `statistics/`). Reusable atomic question items.
- **Convocatoria Blueprints**: Located in `content/programs/<program>/<subject>/convocatorias/`. Maps item references, sections, passing scores, and time limits per test window (2026-C1, 2026-C2).

---

## 3. Verification Checklist

- [x] Multi-program TypeScript types & JSON schemas defined.
- [x] Standardized math concepts extracted into centralized registries.
- [x] Program blueprints for CICO, III Ciclo, EDAD, and BXM created.
- [x] `dataService` and `knowledgeService` upgraded with dynamic program switching and rule enforcement.
- [x] Global Header switcher and calculator constraint badges added.
- [x] Full test suite passing (57 tests).
- [x] Clean documentation directory hierarchy established.
