import { DictionaryTerm, FormulaCategory } from '../types/knowledge';
import geomConcepts from '../../content/library/math/geometry_concepts.json';
import algConcepts from '../../content/library/math/algebra_concepts.json';
import statConcepts from '../../content/library/math/statistics_concepts.json';
import { ConceptRegistryEntry } from '../types';

const allConcepts: ConceptRegistryEntry[] = [
  ...(geomConcepts as ConceptRegistryEntry[]),
  ...(algConcepts as ConceptRegistryEntry[]),
  ...(statConcepts as ConceptRegistryEntry[]),
];

export const DICTIONARY_TERMS: DictionaryTerm[] = allConcepts.map((c) => ({
  id: c.id,
  term: c.term,
  area: c.domain as any,
  blockName: c.blockName,
  definition: c.definition,
  keyFormulas: c.formulas?.map((f) => f.latex),
  examples: c.examples,
  relatedEvidence: c.relatedEvidence,
  programModules: c.programModules,
  calculatorAllowed: c.calculatorAllowed,
}));

export const FORMULA_CATEGORIES: FormulaCategory[] = [
  {
    id: 'geom-formulas',
    title: 'Geometría y Geometría Analítica',
    area: 'geometry',
    formulas: (geomConcepts as ConceptRegistryEntry[])
      .flatMap((c) => c.formulas || [])
      .map((f) => ({
        name: f.name,
        latex: f.latex,
        description: f.description,
        variables: f.variables,
      })),
  },
  {
    id: 'algebra-formulas',
    title: 'Relaciones y Álgebra',
    area: 'functions',
    formulas: (algConcepts as ConceptRegistryEntry[])
      .flatMap((c) => c.formulas || [])
      .map((f) => ({
        name: f.name,
        latex: f.latex,
        description: f.description,
        variables: f.variables,
      })),
  },
  {
    id: 'stats-formulas',
    title: 'Estadística y Probabilidad',
    area: 'statistics',
    formulas: (statConcepts as ConceptRegistryEntry[])
      .flatMap((c) => c.formulas || [])
      .map((f) => ({
        name: f.name,
        latex: f.latex,
        description: f.description,
        variables: f.variables,
      })),
  },
];
