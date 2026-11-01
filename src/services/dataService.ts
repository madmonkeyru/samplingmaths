import {
  Item,
  Group,
  GroupBankData,
  DomainArea,
  SetInfo,
  ContentManifest,
  QuestionSetData,
  ProgramInfo,
} from '../types';

import manifestJson from '../../content/manifest.json';
import set1Json from '../../content/bxm/matematicas/set_1.json';
import set2Json from '../../content/bxm/matematicas/set_2.json';
import set3Json from '../../content/bxm/matematicas/set_3.json';
import set4Json from '../../content/bxm/matematicas/set_4.json';
import set5Json from '../../content/bxm/matematicas/set_5.json';
import groupsJson from '../../content/bxm/matematicas/groups.json';

// Glob import all json files in content directory for dynamic resolution
const contentModules = import.meta.glob('../../content/**/*.json');

class DataService {
  private manifest: ContentManifest;
  private currentProgramId: string;
  private currentSubprogramId: string | undefined;
  private currentSubjectId: string;
  private currentConvocatoriaId: string | undefined;
  private activeSets: SetInfo[];
  private itemsMap: Map<string, Item[]>; // key: setId
  private groupsMap: Map<string, Group>;
  private isInitialized: boolean = false;
  private loadVersion = 0;
  private listeners: Array<() => void> = [];

  constructor() {
    this.manifest = manifestJson as unknown as ContentManifest;
    this.currentProgramId = this.manifest.default_program || 'bxm';
    this.currentSubjectId = this.manifest.default_subject || 'matematicas';
    this.currentConvocatoriaId = '2026-c2';
    this.activeSets = [];
    this.itemsMap = new Map();
    this.groupsMap = new Map();

    // Default synchronous load of bxm/matematicas bundle so synchronous getters work immediately
    this.loadDefaultSubjectSync();
  }

  private loadDefaultSubjectSync(): void {
    const defaultProgram = this.manifest.programs.find((p) => p.id === this.currentProgramId);
    const defaultSubject = defaultProgram?.subjects.find((s) => s.id === this.currentSubjectId);

    if (defaultSubject) {
      this.activeSets = defaultSubject.sets || [];
    }

    // Populate default sets (set_1, set_2, set_3, set_4 & set_5)
    const set1Data = set1Json as unknown as QuestionSetData;
    const set2Data = set2Json as unknown as QuestionSetData;
    const set3Data = set3Json as unknown as QuestionSetData;
    const set4Data = set4Json as unknown as QuestionSetData;
    const set5Data = set5Json as unknown as QuestionSetData;

    this.itemsMap.set('set_1', set1Data.items || []);
    this.itemsMap.set('set_2', set2Data.items || []);
    this.itemsMap.set('set_3', set3Data.items || []);
    this.itemsMap.set('set_4', set4Data.items || []);
    this.itemsMap.set('set_5', set5Data.items || []);

    const groupData = groupsJson as unknown as GroupBankData;
    if (groupData && Array.isArray(groupData.groups)) {
      groupData.groups.forEach((g) => {
        this.groupsMap.set(g.group_id, g);
      });
    }

    this.isInitialized = true;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Error in DataService listener:', e);
      }
    });
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;
    await this.loadSubject(this.currentProgramId, this.currentSubjectId);
  }

  public getManifest(): ContentManifest {
    return this.manifest;
  }

  public getPrograms(): ProgramInfo[] {
    return this.manifest.programs;
  }

  public getCurrentProgramId(): string {
    return this.currentProgramId;
  }

  public getCurrentProgram(): ProgramInfo | undefined {
    return this.manifest.programs.find((p) => p.id === this.currentProgramId);
  }

  public getCurrentSubprogramId(): string | undefined {
    return this.currentSubprogramId;
  }

  public getCurrentSubjectId(): string {
    return this.currentSubjectId;
  }

  public getCurrentConvocatoriaId(): string | undefined {
    return this.currentConvocatoriaId;
  }

  public setConvocatoriaId(convocatoriaId: string): void {
    this.currentConvocatoriaId = convocatoriaId;
    this.notify();
  }

  public isCalculatorAllowed(): boolean {
    const program = this.getCurrentProgram();
    if (program?.calculatorAllowed !== undefined) {
      return program.calculatorAllowed;
    }
    // I & II Ciclo strictly prohibits calculators
    if (this.currentProgramId === 'cico' || this.currentProgramId === 'i_ii_ciclo') {
      return false;
    }
    return true;
  }

  public getPassingScore(): number {
    const program = this.getCurrentProgram();
    return program?.passingScore || 70;
  }

  public async setProgram(
    programId: string,
    subprogramId?: string,
    convocatoriaId?: string
  ): Promise<void> {
    const program = this.manifest.programs.find((p) => p.id === programId);
    if (!program) {
      console.warn(`Program ${programId} not found`);
      return;
    }

    this.currentProgramId = programId;
    this.currentSubprogramId = subprogramId;
    this.currentConvocatoriaId = convocatoriaId || '2026-c1';

    const subject = program.subjects[0];
    if (subject) await this.loadSubject(programId, subject.id);
    else this.notify();
  }

  public async loadSubject(programId: string, subjectId: string): Promise<void> {
    const program = this.manifest.programs.find((p) => p.id === programId);
    if (!program) throw new Error(`Program ${programId} not found`);

    const subject = program.subjects.find((s) => s.id === subjectId);
    if (!subject) throw new Error(`Subject ${subjectId} not found in program ${programId}`);

    const version = ++this.loadVersion;
    this.currentProgramId = programId;
    this.currentSubjectId = subjectId;
    this.activeSets = subject.sets || [];
    this.itemsMap.clear();
    this.groupsMap.clear();

    // Load groups if path exists
    if (subject.groups) {
      const groupKey = `../../content/${subject.groups}`;
      const groupModuleLoader = contentModules[groupKey];
      if (groupModuleLoader) {
        try {
          const groupModule: any = await groupModuleLoader();
          if (version !== this.loadVersion) return;
          const groupData: GroupBankData = groupModule.default || groupModule;
          if (groupData && Array.isArray(groupData.groups)) {
            groupData.groups.forEach((g) => {
              this.groupsMap.set(g.group_id, g);
            });
          }
        } catch (err) {
          console.warn(`Failed to dynamically load groups for ${subject.groups}:`, err);
        }
      }
    }

    // Load each set
    for (const setInfo of subject.sets || []) {
      if (setInfo.file) {
        const setKey = `../../content/${setInfo.file}`;
        const setModuleLoader = contentModules[setKey];
        if (setModuleLoader) {
          try {
            const setModule: any = await setModuleLoader();
            if (version !== this.loadVersion) return;
            const setData: QuestionSetData = setModule.default || setModule;
            this.itemsMap.set(setInfo.id, setData.items || []);
          } catch (err) {
            console.warn(`Failed to dynamically load set file ${setInfo.file}:`, err);
          }
        }
      }
    }

    this.isInitialized = true;
    this.notify();
  }

  public getAllItems(): Item[] {
    const allItems: Item[] = [];
    this.itemsMap.forEach((items) => {
      allItems.push(...items);
    });
    return allItems;
  }

  public getSets(): SetInfo[] {
    return this.activeSets;
  }

  public getSetById(setId: string): SetInfo | undefined {
    return this.getSets().find((s) => s.id === setId);
  }

  public getItemsBySet(setId: string): Item[] {
    if (!setId || setId === 'all') return this.getAllItems();
    const items = this.itemsMap.get(setId);
    return items || [];
  }

  public getSimulationItems(setId: string = 'set_1'): Item[] {
    return this.getItemsBySet(setId);
  }

  public getItemById(id: number): Item | undefined {
    return this.getAllItems().find((item) => item.id === id);
  }

  public getGroupById(groupId: string): Group | undefined {
    return this.groupsMap.get(groupId);
  }

  public getItemsByArea(area: DomainArea, setId?: string): Item[] {
    const baseItems = setId && setId !== 'all' ? this.getItemsBySet(setId) : this.getAllItems();
    return baseItems.filter(
      (item) => item.area_id === area || item.area?.toLowerCase().includes(String(area).toLowerCase())
    );
  }

  public getItemsByTopic(topic: string, setId?: string): Item[] {
    const baseItems = setId && setId !== 'all' ? this.getItemsBySet(setId) : this.getAllItems();
    return baseItems.filter((item) => item.topic === topic);
  }

  public getTopicsByArea(area?: DomainArea, setId?: string): string[] {
    const items = area
      ? this.getItemsByArea(area, setId)
      : setId && setId !== 'all'
      ? this.getItemsBySet(setId)
      : this.getAllItems();
    const topicsSet = new Set<string>();
    items.forEach((item) => {
      if (item.topic) {
        topicsSet.add(item.topic);
      }
    });
    return Array.from(topicsSet);
  }

  public getQuestionBankInfo() {
    const set1Data = set1Json as unknown as QuestionSetData;
    return {
      exam: set1Data.exam,
      convocatoria: set1Data.convocatoria,
      totalItems: this.getAllItems().length,
      sets: this.getSets(),
      sections: set1Data.sections || [],
      calculatorAllowed: this.isCalculatorAllowed(),
      passingScore: this.getPassingScore(),
    };
  }
}

export const dataService = new DataService();
