import { describe, it, expect } from 'vitest';
import { dataService } from './dataService';

describe('DataService', () => {
  it('loads items correctly from questions.json', () => {
    const items = dataService.getAllItems();
    expect(items.length).toBe(87);
    expect(items[0].id).toBe(1);
    expect(items[86].id).toBe(87);
  });

  it('loads groups correctly from groups.json', () => {
    const group = dataService.getGroupById('g_fuel_price');
    expect(group).toBeDefined();
    expect(group?.items).toContain(53);
    expect(group?.items).toContain(54);
  });

  it('filters items by area correctly', () => {
    const geometryItems = dataService.getItemsByArea('geometry');
    expect(geometryItems.length).toBe(50);

    const functionItems = dataService.getItemsByArea('functions');
    expect(functionItems.length).toBe(25);

    const statsItems = dataService.getItemsByArea('statistics');
    expect(statsItems.length).toBe(12);
  });

  it('retrieves unique topics by area', () => {
    const geometryTopics = dataService.getTopicsByArea('geometry');
    expect(geometryTopics.length).toBeGreaterThan(0);
    expect(geometryTopics).toContain('Circunferencia');
  });
});
