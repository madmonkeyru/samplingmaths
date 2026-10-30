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
import groupsJson from '../../content/bxm/matematicas/groups.json';

// Glob import all json files in content directory for Vite dynamic loading
const contentModules = import.meta.glob('../../content/**/*.json');

class DataService {
  private manifest: ContentManifest;
  private currentProgramId: string;
  private currentSubjectId: string;
  private activeSets: SetInfo[];
  private itemsMap: Map<string, Item[]>; // key: setId
  private groupsMap: Map<string, Group>;
  private isInitialized: boolean = false;

  constructor() {
    this.manifest = manifestJson as unknown as ContentManifest;
    this.currentProgramId = this.manifest.default_program || 'bxm';
    this.currentSubjectId = this.manifest.default_subject || 'matematicas';
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
      this.activeSets = defaultSubject.sets;
    }

    // Populate default sets (set_1, set_2, set_3 & set_4)
    const set1Data = set1Json as unknown as QuestionSetData;
    const set2Data = set2Json as unknown as QuestionSetData;
    const set3Data = set3Json as unknown as QuestionSetData;
    const set4Data = set4Json as unknown as QuestionSetData;

    this.itemsMap.set('set_1', set1Data.items || []);
    this.itemsMap.set('set_2', set2Data.items || []);
    this.itemsMap.set('set_3', set3Data.items || []);
    this.itemsMap.set('set_4', set4Data.items || []);

    const groupData = groupsJson as unknown as GroupBankData;
    if (groupData && Array.isArray(groupData.groups)) {
      groupData.groups.forEach((g) => {
        this.groupsMap.set(g.group_id, g);
      });
    }

    this.isInitialized = true;
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

  public getCurrentSubjectId(): string {
    return this.currentSubjectId;
  }

  public async loadSubject(programId: string, subjectId: string): Promise<void> {
    const program = this.manifest.programs.find((p) => p.id === programId);
    if (!program) throw new Error(`Program ${programId} not found`);

    const subject = program.subjects.find((s) => s.id === subjectId);
    if (!subject) throw new Error(`Subject ${subjectId} not found in program ${programId}`);

    this.currentProgramId = programId;
    this.currentSubjectId = subjectId;
    this.activeSets = subject.sets;
    this.itemsMap.clear();
    this.groupsMap.clear();

    // Load groups if path exists
    if (subject.groups) {
      const groupKey = `../../content/${subject.groups}`;
      const groupModuleLoader = contentModules[groupKey];
      if (groupModuleLoader) {
        try {
          const groupModule: any = await groupModuleLoader();
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
    for (const setInfo of subject.sets) {
      if (setInfo.file) {
        const setKey = `../../content/${setInfo.file}`;
        const setModuleLoader = contentModules[setKey];
        if (setModuleLoader) {
          try {
            const setModule: any = await setModuleLoader();
            const setData: QuestionSetData = setModule.default || setModule;
            this.itemsMap.set(setInfo.id, setData.items || []);
          } catch (err) {
            console.warn(`Failed to dynamically load set file ${setInfo.file}:`, err);
          }
        }
      }
    }

    this.isInitialized = true;
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
    return this.itemsMap.get(setId) || [];
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
      (item) => item.area_id === area || item.area?.toLowerCase().includes(area)
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
    };
  }
}

export const dataService = new DataService();
