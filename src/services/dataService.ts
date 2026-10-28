import { Item, Group, QuestionBankData, GroupBankData, DomainArea } from '../types';
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

  public getItemById(id: number): Item | undefined {
    return this.getAllItems().find((item) => item.id === id);
  }

  public getGroupById(groupId: string): Group | undefined {
    return this.groupsMap.get(groupId);
  }

  public getItemsByArea(area: DomainArea): Item[] {
    return this.getAllItems().filter(
      (item) => item.area_id === area || item.area?.toLowerCase().includes(area)
    );
  }

  public getItemsByTopic(topic: string): Item[] {
    return this.getAllItems().filter((item) => item.topic === topic);
  }

  public getTopicsByArea(area?: DomainArea): string[] {
    const items = area ? this.getItemsByArea(area) : this.getAllItems();
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
      sections: this.questionsData.sections,
    };
  }
}

export const dataService = new DataService();
