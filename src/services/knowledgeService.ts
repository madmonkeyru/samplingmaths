import { Item, DomainArea } from '../types';
import {
  SpecBlock,
  SpecAffirmation,
  SpecEvidence,
  DictionaryTerm,
  FormulaCategory,
  DICTIONARY_TERMS,
  FORMULA_CATEGORIES,
} from '../types/knowledge';
import { dataService } from './dataService';

class KnowledgeService {
  /**
   * Generates dynamic Specs Table derived directly from question specifications.
   * `setIdFilter` controls which set determines the official item/points count.
   * By default, `setIdFilter = 'set_1'` gives the official 60-item simulation count (23 Geometría, 25 Relaciones y Álgebra, 12 Estadística).
   * Passing `'all'` gives the grand total across the entire question bank.
   */
  getSpecificationBlocks(setIdFilter: string | 'all' = 'set_1'): SpecBlock[] {
    const allItems = dataService.getAllItems();

    // Map by domain area + evidence code
    const evidenceMap: Record<
      string,
      {
        evidence: string;
        evidence_desc: string;
        block: string;
        affirmation: string;
        affirmation_desc: string | null;
        points: number;
        item_ids: number[];
      }
    > = {};

    allItems.forEach((item) => {
      if (!item.spec || !item.spec.evidence) return;
      const evCode = item.spec.evidence;
      const blockName = item.spec.block || item.area || 'Geometría';
      const mapKey = `${blockName}_${evCode}`;

      const matchesSet = setIdFilter === 'all' || (item.set_id || 'set_1') === setIdFilter;

      if (!evidenceMap[mapKey]) {
        evidenceMap[mapKey] = {
          evidence: evCode,
          evidence_desc: item.spec.evidence_desc || '',
          block: blockName,
          affirmation: item.spec.affirmation || 'A1',
          affirmation_desc: item.spec.affirmation_desc || null,
          points: 0,
          item_ids: [],
        };
      }

      if (matchesSet) {
        evidenceMap[mapKey].points += 1;
      }
      evidenceMap[mapKey].item_ids.push(item.id);
    });

    // Group into domain blocks
    const blockDefs: Array<{ id: DomainArea; block: string; name: string }> = [
      { id: 'geometry', block: '1. Geometría', name: 'Geometría' },
      { id: 'functions', block: '2. Relaciones y Álgebra', name: 'Relaciones y Álgebra' },
      { id: 'statistics', block: '3. Estadística y Probabilidad', name: 'Estadística y Probabilidad' },
    ];

    const resultBlocks: SpecBlock[] = blockDefs.map((bDef) => {
      const blockEvidences = Object.values(evidenceMap).filter(
        (ev) => ev.block.includes(bDef.name) || ev.block.startsWith(bDef.block.split('.')[0])
      );

      // Group evidences by affirmation
      const affirmationMap: Record<string, { affirmation: string; affirmation_desc: string; evidences: SpecEvidence[] }> = {};

      blockEvidences.forEach((ev) => {
        const affCode = ev.affirmation;
        if (!affirmationMap[affCode]) {
          affirmationMap[affCode] = {
            affirmation: affCode,
            affirmation_desc: ev.affirmation_desc || `Afirmación ${affCode}`,
            evidences: [],
          };
        }

        const existing = affirmationMap[affCode].evidences.find((e) => e.evidence === ev.evidence);
        if (!existing) {
          // If filtering by set_1 and this evidence has 0 points in set_1, only keep if it has items or filter
          affirmationMap[affCode].evidences.push({
            evidence: ev.evidence,
            evidence_desc: ev.evidence_desc,
            points: ev.points,
            item_ids: ev.item_ids,
          });
        }
      });

      // Filter out evidences with 0 points if filtering by specific set (unless 'all')
      if (setIdFilter !== 'all') {
        Object.keys(affirmationMap).forEach((affKey) => {
          affirmationMap[affKey].evidences = affirmationMap[affKey].evidences.filter(
            (e) => e.points > 0
          );
        });
      }

      // Sort affirmations
      const sortedAffirmations = Object.values(affirmationMap)
        .filter((aff) => aff.evidences.length > 0)
        .sort((a, b) => a.affirmation.localeCompare(b.affirmation, undefined, { numeric: true }));

      // Calculate total points for this block
      const totalPoints = sortedAffirmations.reduce(
        (sum, aff) => sum + aff.evidences.reduce((evSum, ev) => evSum + ev.points, 0),
        0
      );

      return {
        id: bDef.id,
        block: bDef.block,
        name: bDef.name,
        totalPoints,
        affirmations: sortedAffirmations,
      };
    });

    return resultBlocks;
  }

  /**
   * Search dictionary terms by keyword and/or domain area
   */
  getTerms(searchQuery: string = '', domainFilter: DomainArea | 'all' = 'all'): DictionaryTerm[] {
    const query = searchQuery.trim().toLowerCase();

    return DICTIONARY_TERMS.filter((term) => {
      const matchesDomain = domainFilter === 'all' || term.area === domainFilter;
      if (!matchesDomain) return false;

      if (!query) return true;

      return (
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query) ||
        term.blockName.toLowerCase().includes(query) ||
        (term.keyFormulas && term.keyFormulas.some((f) => f.toLowerCase().includes(query)))
      );
    });
  }

  /**
   * Get formula sheet categories by domain area
   */
  getFormulas(domainFilter: DomainArea | 'all' = 'all'): FormulaCategory[] {
    if (domainFilter === 'all') {
      return FORMULA_CATEGORIES;
    }
    return FORMULA_CATEGORIES.filter((cat) => cat.area === domainFilter);
  }
}

export const knowledgeService = new KnowledgeService();
