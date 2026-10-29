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
import { OFFICIAL_SPECIFICATION_TABLE } from '../types/officialSpecs';
import { dataService } from './dataService';

class KnowledgeService {
  /**
   * Returns complete Official Specification Table from the MEP PDF (Convocatoria 02-2026),
   * enriched with mapped question IDs from the question bank.
   * Total points equal the official 60-item exam weight (23 Geometría, 25 Relaciones y Álgebra, 12 Estadística).
   */
  getSpecificationBlocks(): SpecBlock[] {
    const allItems = dataService.getAllItems();

    // Map existing question IDs by area/block and evidence code
    const itemIdsByEvidence: Record<string, number[]> = {};

    allItems.forEach((item) => {
      if (!item.spec || !item.spec.evidence) return;
      const evCode = item.spec.evidence;
      const blockName = item.spec.block || item.area || 'Geometría';
      const key = `${blockName}_${evCode}`;

      if (!itemIdsByEvidence[key]) {
        itemIdsByEvidence[key] = [];
      }
      itemIdsByEvidence[key].push(item.id);
    });

    // Construct enriched blocks from official specification structure
    const resultBlocks: SpecBlock[] = OFFICIAL_SPECIFICATION_TABLE.map((officialBlock) => {
      const affirmations: SpecAffirmation[] = officialBlock.affirmations.map((offAff) => {
        const evidences: SpecEvidence[] = offAff.evidences.map((offEv) => {
          const key = `${officialBlock.blockCode}_${offEv.code}`;
          const mappedIds = itemIdsByEvidence[key] || [];

          return {
            evidence: offEv.code,
            evidence_desc: offEv.desc,
            points: Math.max(1, Math.round(offAff.targetPoints / offAff.evidences.length)),
            item_ids: mappedIds,
          };
        });

        return {
          affirmation: offAff.code,
          affirmation_desc: offAff.desc,
          targetPoints: offAff.targetPoints,
          evidences,
        };
      });

      return {
        id: officialBlock.areaId,
        block: officialBlock.blockCode,
        name: officialBlock.name,
        totalPoints: officialBlock.totalPoints,
        affirmations,
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
