export type StandardDomainArea = 'geometry' | 'functions' | 'statistics';
export type DomainArea = StandardDomainArea | string;

export type ProgramId = 'cico' | 'iii_ciclo' | 'edad' | 'bxm' | string;

export type ProgramModuleTag =
  | 'I_II_CICLO'
  | 'III_CICLO_7'
  | 'III_CICLO_8'
  | 'III_CICLO_9'
  | 'EDAD_PARTE_1'
  | 'EDAD_PARTE_2'
  | 'BXM'
  | string;

export interface MathConceptFormula {
  name: string;
  latex: string;
  description: string;
  variables?: Array<{ symbol: string; meaning: string }>;
}

export interface ConceptRegistryEntry {
  id: string; // e.g. mep-geo-circunferencia-01
  term: string;
  domain: DomainArea;
  blockName: string;
  definition: string;
  programModules: ProgramModuleTag[];
  calculatorAllowed: boolean;
  formulas?: MathConceptFormula[];
  examples?: string[];
  relatedEvidence?: string[];
  prerequisiteConcepts?: string[];
}

export interface ProgramMetadata {
  programId: ProgramId;
  programName: string;
  subjectId: string;
  subjectName: string;
  passingScore: number;
  calculatorAllowed: boolean;
  defaultTimeLimitMinutes: number;
  totalExamQuestions: number;
  subprograms?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export interface ConvocatoriaSectionBlueprint {
  id: string;
  name: string;
  itemRange: [number, number];
  totalItems: number;
  itemIds: string[];
}

export interface ConvocatoriaManifest {
  schemaVersion: string;
  convocatoriaId: string; // e.g., '2026-c2'
  year: number;
  cycle: 1 | 2;
  programId: ProgramId;
  subprogramId?: string;
  subjectId: string;
  title: string;
  description: string;
  passingScore: number;
  calculatorAllowed: boolean;
  timeLimitMinutes: number;
  totalItems: number;
  sections: ConvocatoriaSectionBlueprint[];
  itemPool: string[]; // List of referenced item IDs
}

export interface VisualElementSpec {
  type: string;
  [key: string]: any;
}

export interface VisualSpec {
  alt?: string;
  type?: string;
  visual?: VisualSpec;
  domain?: {
    x?: [number, number];
    y?: [number, number];
  };
  grid?: boolean;
  axes?: {
    arrows?: boolean;
  };
  x_label?: string;
  y_label?: string;
  children?: VisualElementSpec[];
  elements?: VisualElementSpec[];
  layout?: {
    rows: number;
    cols: number;
  };
  views?: Array<{
    id?: string;
    label?: string;
    visual?: VisualSpec;
  }>;
  [key: string]: any;
}

export interface Option {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface SolutionStep {
  step: number;
  title: string;
  explanation: string;
}

export interface SetInfo {
  id: string;
  name: string;
  description: string;
  total_items: number;
  file?: string;
  convocatoria?: string;
}

export interface SubjectInfo {
  id: string;
  name: string;
  description: string;
  schema?: string;
  groups?: string;
  sets: SetInfo[];
  metadata?: string;
  convocatorias?: string[];
}

export interface ProgramInfo {
  id: string;
  name: string;
  description: string;
  subprograms?: Array<{ id: string; name: string; description?: string } | string>;
  calculatorAllowed?: boolean;
  passingScore?: number;
  subjects: SubjectInfo[];
}

export interface ContentManifest {
  schema_version: string;
  default_program: string;
  default_subject: string;
  programs: ProgramInfo[];
  library?: {
    math?: {
      geometry: string;
      algebra: string;
      statistics: string;
    };
  };
  items_root?: string;
}

export interface ItemSpec {
  block?: string;
  affirmation?: string;
  affirmation_desc?: string | null;
  evidence?: string;
  evidence_desc?: string;
}

export interface Item {
  id: number;
  code?: string; // Atomic string ID (e.g. item-math-geo-001)
  set_id?: string;
  area: string;
  area_id: DomainArea;
  topic: string;
  spec?: ItemSpec;
  evidence?: string;
  knowledge?: string;
  linked_concepts?: string[];
  program_applicability?: ProgramModuleTag[];
  calculator_allowed?: boolean;
  cognitive_level?: 'reproduccion' | 'conexion' | 'reflexion' | string;
  stem: string;
  options: Record<'A' | 'B' | 'C' | 'D', string> | Option[];
  correct_answer: 'A' | 'B' | 'C' | 'D';
  solution_steps: (string | SolutionStep)[];
  group_id?: string | null;
  visual_spec?: VisualSpec | null;
  widget_type?: string;
  [key: string]: any;
}

export interface Group {
  group_id: string;
  items: number[];
  title?: string;
  context_text?: string;
  visual_spec?: VisualSpec;
}

export interface QuestionSetData {
  schema_version: string;
  exam: string;
  convocatoria: string;
  language?: string;
  source?: string;
  specification?: string;
  solucionario_verified?: boolean;
  set_info?: SetInfo;
  total_items: number;
  sections?: Array<{
    id: string;
    name: string;
    item_range: [number, number];
    total_items: number;
  }>;
  notes?: string[];
  items: Item[];
}

export interface QuestionBankData {
  schema_version: string;
  exam: string;
  convocatoria: string;
  language: string;
  source: string;
  specification: string;
  solucionario_verified: boolean;
  total_items: number;
  sets?: SetInfo[];
  sections: Array<{
    id: string;
    name: string;
    item_range: [number, number];
    total_items: number;
  }>;
  notes?: string[];
  items: Item[];
}

export interface GroupBankData {
  schema_version: string;
  groups: Group[];
}

export interface ItemResponse {
  itemId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect?: boolean;
  timeSpentSeconds?: number;
  flagged?: boolean;
}

export interface PracticeConfig {
  mode: 'simulation' | 'area' | 'topic';
  programId?: string;
  subprogramId?: string;
  convocatoriaId?: string;
  setId?: string | 'all';
  area?: DomainArea | 'all';
  topic?: string | 'all';
  itemCount: number | 'all';
  enableTimer: boolean;
  timerDurationMinutes: number;
}

export interface Attempt {
  id: string;
  userId: string;
  timestamp: string; // ISO String
  mode: 'simulation' | 'area' | 'topic';
  programId?: string;
  scopeText: string;
  scorePercentage: number;
  correctCount: number;
  totalItems: number;
  durationSeconds: number;
  responses: Record<number, ItemResponse>;
}

export interface TestSession {
  sessionId: string;
  userId: string;
  config: PracticeConfig;
  itemIds: number[];
  currentResponseIndex: number;
  responses: Record<number, ItemResponse>;
  flaggedItems: Record<number, boolean>;
  startTime: string;
  elapsedSeconds: number;
  isCompleted: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
