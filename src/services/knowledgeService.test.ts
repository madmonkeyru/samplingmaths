import { describe, it, expect } from 'vitest';
import { knowledgeService } from './knowledgeService';

describe('knowledgeService', () => {
  it('returns non-empty specification blocks with affirmations and evidences', () => {
    const blocks = knowledgeService.getSpecificationBlocks();
    expect(blocks).toHaveLength(3);

    const geomBlock = blocks.find((b) => b.id === 'geometry');
    expect(geomBlock).toBeDefined();
    expect(geomBlock?.totalPoints).toBeGreaterThan(0);
    expect(geomBlock?.affirmations.length).toBeGreaterThan(0);

    const firstAff = geomBlock?.affirmations[0];
    expect(firstAff?.evidences.length).toBeGreaterThan(0);
    expect(firstAff?.evidences[0].item_ids.length).toBeGreaterThan(0);
  });

  it('filters dictionary terms by domain and search query', () => {
    const allTerms = knowledgeService.getTerms('', 'all');
    expect(allTerms.length).toBeGreaterThan(10);

    const geomTerms = knowledgeService.getTerms('', 'geometry');
    expect(geomTerms.every((t) => t.area === 'geometry')).toBe(true);

    const searchResult = knowledgeService.getTerms('circunferencia', 'all');
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult[0].term.toLowerCase()).toContain('circunferencia');
  });

  it('retrieves formula categories by domain filter', () => {
    const allFormulas = knowledgeService.getFormulas('all');
    expect(allFormulas.length).toBe(3);

    const statsFormulas = knowledgeService.getFormulas('statistics');
    expect(statsFormulas.length).toBe(1);
    expect(statsFormulas[0].formulas.length).toBeGreaterThan(0);
  });
});
