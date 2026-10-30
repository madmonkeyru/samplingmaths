import { describe, it, expect } from 'vitest';
import { dataService } from './dataService';

describe('DataService', () => {
  it('loads items correctly from questions.json', () => {
    const items = dataService.getAllItems();
    expect(items.length).toBe(170);
    expect(items[0].id).toBe(1);
    expect(items[169].id).toBe(170);
  });

  it('manages sets correctly', () => {
    const sets = dataService.getSets();
    expect(sets.length).toBe(4);
    expect(sets[0].id).toBe('set_1');
    expect(sets[0].total_items).toBe(60);
    expect(sets[1].id).toBe('set_2');
    expect(sets[1].total_items).toBe(70);
    expect(sets[2].id).toBe('set_3');
    expect(sets[2].total_items).toBe(20);
    expect(sets[3].id).toBe('set_4');
    expect(sets[3].total_items).toBe(20);

    const set1Items = dataService.getItemsBySet('set_1');
    expect(set1Items.length).toBe(60);

    const set3Items = dataService.getItemsBySet('set_3');
    expect(set3Items.length).toBe(20);

    const simulationItems = dataService.getSimulationItems('set_1');
    expect(simulationItems.length).toBe(60);
  });

  it('loads groups correctly from groups.json', () => {
    const group = dataService.getGroupById('g_fuel_price');
    expect(group).toBeDefined();
    expect(group?.items).toContain(53);
    expect(group?.items).toContain(54);
  });

  it('filters items by area and set correctly', () => {
    const set1Geometry = dataService.getItemsByArea('geometry', 'set_1');
    expect(set1Geometry.length).toBe(23);

    const set1Functions = dataService.getItemsByArea('functions', 'set_1');
    expect(set1Functions.length).toBe(25);

    const set1Stats = dataService.getItemsByArea('statistics', 'set_1');
    expect(set1Stats.length).toBe(12);

    const allGeometry = dataService.getItemsByArea('geometry');
    expect(allGeometry.length).toBe(64); // 23 (set1) + 27 (set2) + 7 (set3) + 7 (set4)

    const allFunctions = dataService.getItemsByArea('functions');
    expect(allFunctions.length).toBe(64); // 25 (set1) + 25 (set2) + 7 (set3) + 7 (set4)

    const allStats = dataService.getItemsByArea('statistics');
    expect(allStats.length).toBe(42); // 12 (set1) + 18 (set2) + 6 (set3) + 6 (set4)
  });

  it('retrieves unique topics by area', () => {
    const geometryTopics = dataService.getTopicsByArea('geometry');
    expect(geometryTopics.length).toBeGreaterThan(0);
    expect(geometryTopics).toContain('Circunferencia');
  });
});
