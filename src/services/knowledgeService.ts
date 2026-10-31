import { DomainArea, ProgramModuleTag } from '../types';
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
   * Search dictionary terms by keyword, domain area, and optional program module tag.
   * Dynamically filters based on active program track and calculator constraints.
   */
  getTerms(
    searchQuery: string = '',
    domainFilter: DomainArea | 'all' = 'all',
    moduleFilter?: ProgramModuleTag | 'all'
  ): DictionaryTerm[] {
    const query = searchQuery.trim().toLowerCase();
    const isCalcAllowed = dataService.isCalculatorAllowed();

    return DICTIONARY_TERMS.filter((term) => {
      const matchesDomain = domainFilter === 'all' || term.area === domainFilter;
      if (!matchesDomain) return false;

      // Module filtering
      if (moduleFilter && moduleFilter !== 'all' && term.programModules) {
        if (!term.programModules.includes(moduleFilter)) {
          return false;
        }
      }

      // Check calculator constraint: if calculator strictly prohibited, flag accordingly
      if (!isCalcAllowed && term.calculatorAllowed === true && !term.programModules?.includes('I_II_CICLO')) {
        // Can still show, but for I & II Ciclo prioritize elementary concepts
      }

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
   * Get formula sheet categories by domain area, filtered by active program module
   */
  getFormulas(domainFilter: DomainArea | 'all' = 'all'): FormulaCategory[] {
    const isCalcAllowed = dataService.isCalculatorAllowed();

    let categories = FORMULA_CATEGORIES;
    if (domainFilter !== 'all') {
      categories = categories.filter((cat) => cat.area === domainFilter);
    }

    // If calculator is not allowed (I & II Ciclo), filter out advanced formulas
    if (!isCalcAllowed) {
      return categories
        .map((cat) => ({
          ...cat,
          formulas: cat.formulas.filter(
            (f) =>
              f.name.toLowerCase().includes('área') ||
              f.name.toLowerCase().includes('perímetro') ||
              f.latex.includes('P =') ||
              f.latex.includes('b \\cdot h')
          ),
        }))
        .filter((cat) => cat.formulas.length > 0);
    }

    return categories;
  }
}

export const knowledgeService = new KnowledgeService();
