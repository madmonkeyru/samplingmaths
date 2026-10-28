import { describe, it, expect } from 'vitest';
import { dataService } from './dataService';

describe('DataService', () => {
  it('loads 60 items correctly from questions.json', () => {
    const items = dataService.getAllItems();
    expect(items.length).toBe(60);
    expect(items[0].id).toBe(1);
    expect(items[59].id).toBe(60);
  });

  it('loads groups correctly from groups.json', () => {
    const group = dataService.getGroupById('g_fuel_price');
    expect(group).toBeDefined();
    expect(group?.items).toContain(26);
    expect(group?.items).toContain(27);
  });

  it('filters items by area correctly', () => {
    const geometryItems = dataService.getItemsByArea('geometry');
    expect(geometryItems.length).toBe(23);

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
