import { DomainArea, ProgramModuleTag } from '../types';

export interface SpecEvidence {
  evidence: string;
  evidence_desc: string;
  points: number; // Official target point weight in exam simulation
  item_ids: number[];
}

export interface SpecAffirmation {
  affirmation: string;
  affirmation_desc: string;
  targetPoints: number;
  evidences: SpecEvidence[];
}

export interface SpecBlock {
  id: DomainArea;
  block: string;
  name: string;
  totalPoints: number;
  affirmations: SpecAffirmation[];
}

export interface DictionaryTerm {
  id: string;
  term: string;
  area: DomainArea;
  blockName: string;
  definition: string;
  keyFormulas?: string[];
  examples?: string[];
  relatedEvidence?: string[];
  programModules?: ProgramModuleTag[];
  calculatorAllowed?: boolean;
}

export interface FormulaCategory {
  id: string;
  title: string;
  area: DomainArea;
  programModules?: ProgramModuleTag[];
  calculatorAllowed?: boolean;
  formulas: Array<{
    name: string;
    latex: string;
    description: string;
    variables?: Array<{ symbol: string; meaning: string }>;
    notes?: string;
    programModules?: ProgramModuleTag[];
  }>;
}

export { DICTIONARY_TERMS, FORMULA_CATEGORIES } from '../data/knowledgeFallback';
