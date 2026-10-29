import { Item, Group, QuestionBankData, GroupBankData, DomainArea, SetInfo } from '../types';
import questionsJson from '../../content/questions.json';
import groupsJson from '../../content/groups.json';

class DataService {
  private questionsData: QuestionBankData;
  private groupsData: GroupBankData;
  private groupsMap: Map<string, Group>;

  constructor() {
    this.questionsData = questionsJson as unknown as QuestionBankData;
    this.groupsData = groupsJson as unknown as GroupBankData;
    this.groupsMap = new Map();

    if (this.groupsData && Array.isArray(this.groupsData.groups)) {
      this.groupsData.groups.forEach((g) => {
        this.groupsMap.set(g.group_id, g);
      });
    }
  }

  public getAllItems(): Item[] {
    return this.questionsData.items || [];
  }

  public getSets(): SetInfo[] {
    return this.questionsData.sets || [];
  }

  public getSetById(setId: string): SetInfo | undefined {
    return this.getSets().find((s) => s.id === setId);
  }

  public getItemsBySet(setId: string): Item[] {
    if (!setId || setId === 'all') return this.getAllItems();
    return this.getAllItems().filter((item) => (item.set_id || 'set_1') === setId);
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
    const items = area ? this.getItemsByArea(area, setId) : (setId && setId !== 'all' ? this.getItemsBySet(setId) : this.getAllItems());
    const topicsSet = new Set<string>();
    items.forEach((item) => {
      if (item.topic) {
        topicsSet.add(item.topic);
      }
    });
    return Array.from(topicsSet);
  }

  public getQuestionBankInfo() {
    return {
      exam: this.questionsData.exam,
      convocatoria: this.questionsData.convocatoria,
      totalItems: this.questionsData.total_items,
      sets: this.questionsData.sets,
      sections: this.questionsData.sections,
    };
  }
}

export const dataService = new DataService();
