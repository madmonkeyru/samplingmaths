import { describe, it, expect, beforeEach } from 'vitest';
import { dataService } from './dataService';
import { knowledgeService } from './knowledgeService';

describe('Multi-Program Architecture & Dynamic Decoupled Registries', () => {
  beforeEach(async () => {
    // Reset to default BXM
    await dataService.setProgram('bxm', undefined, '2026-c2');
  });

  it('loads manifest with all 4 Educación Abierta programs and library references', () => {
    const manifest = dataService.getManifest();
    expect(manifest.programs).toHaveLength(4);

    const programIds = manifest.programs.map((p) => p.id);
    expect(programIds).toContain('cico');
    expect(programIds).toContain('iii_ciclo');
    expect(programIds).toContain('edad');
    expect(programIds).toContain('bxm');

    expect(manifest.library?.math?.geometry).toBe('library/math/geometry_concepts.json');
    expect(manifest.library?.math?.algebra).toBe('library/math/algebra_concepts.json');
    expect(manifest.library?.math?.statistics).toBe('library/math/statistics_concepts.json');
  });

  it('correctly tracks and switches between programs', async () => {
    expect(dataService.getCurrentProgramId()).toBe('bxm');
    expect(dataService.isCalculatorAllowed()).toBe(true);

    // Switch to I & II Ciclo (cico)
    await dataService.setProgram('cico');
    expect(dataService.getCurrentProgramId()).toBe('cico');
    expect(dataService.isCalculatorAllowed()).toBe(false);
    expect(dataService.getPassingScore()).toBe(65);

    // Switch to EDAD
    await dataService.setProgram('edad', 'EDAD_1');
    expect(dataService.getCurrentProgramId()).toBe('edad');
    expect(dataService.getCurrentSubprogramId()).toBe('EDAD_1');
    expect(dataService.isCalculatorAllowed()).toBe(true);
    expect(dataService.getPassingScore()).toBe(70);

    // Switch to III Ciclo
    await dataService.setProgram('iii_ciclo', 'III_CICLO_7');
    expect(dataService.getCurrentProgramId()).toBe('iii_ciclo');
    expect(dataService.getCurrentSubprogramId()).toBe('III_CICLO_7');
    expect(dataService.getPassingScore()).toBe(65);
  });

  it('filters dictionary terms by domain and program modules', () => {
    const allTerms = knowledgeService.getTerms();
    expect(allTerms.length).toBeGreaterThan(15);

    // Filter by module tag
    const bxmTerms = knowledgeService.getTerms('', 'all', 'BXM');
    expect(bxmTerms.length).toBeGreaterThan(10);
    expect(bxmTerms.some((t) => t.term === 'Circunferencia')).toBe(true);

    const cicoTerms = knowledgeService.getTerms('', 'all', 'I_II_CICLO');
    expect(cicoTerms.length).toBeGreaterThan(0);
    expect(cicoTerms.some((t) => t.term.includes('Elemental') || t.term.includes('Patrones'))).toBe(true);
  });

  it('filters formula sheet categories dynamically based on calculator constraints', async () => {
    // Under BXM (calculator allowed)
    await dataService.setProgram('bxm');
    const bxmFormulas = knowledgeService.getFormulas('geometry');
    expect(bxmFormulas.length).toBeGreaterThan(0);
    const hasCircFormula = bxmFormulas[0].formulas.some((f) => f.latex.includes('(x - h)^2'));
    expect(hasCircFormula).toBe(true);

    // Under CICO (calculator prohibited)
    await dataService.setProgram('cico');
    const cicoFormulas = knowledgeService.getFormulas('geometry');
    expect(cicoFormulas.length).toBeGreaterThan(0);
    // Should filter to basic area/perímetro formulas
    const allCicoFormulaNames = cicoFormulas.flatMap((c) => c.formulas.map((f) => f.name));
    expect(allCicoFormulaNames.every((n) => n.toLowerCase().includes('área') || n.toLowerCase().includes('perímetro'))).toBe(true);
  });
});
