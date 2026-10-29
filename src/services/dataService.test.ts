import { describe, it, expect } from 'vitest';
import { dataService } from './dataService';

describe('DataService', () => {
  it('loads items correctly from questions.json', () => {
    const items = dataService.getAllItems();
    expect(items.length).toBe(130);
    expect(items[0].id).toBe(1);
    expect(items[129].id).toBe(130);
  });

  it('manages sets correctly', () => {
    const sets = dataService.getSets();
    expect(sets.length).toBe(2);
    expect(sets[0].id).toBe('set_1');
    expect(sets[0].total_items).toBe(60);
    expect(sets[1].id).toBe('set_2');
    expect(sets[1].total_items).toBe(70);

    const set1Items = dataService.getItemsBySet('set_1');
    expect(set1Items.length).toBe(60);

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
    expect(allGeometry.length).toBe(50);

    const allFunctions = dataService.getItemsByArea('functions');
    expect(allFunctions.length).toBe(50);

    const allStats = dataService.getItemsByArea('statistics');
    expect(allStats.length).toBe(30);
  });

  it('retrieves unique topics by area', () => {
    const geometryTopics = dataService.getTopicsByArea('geometry');
    expect(geometryTopics.length).toBeGreaterThan(0);
    expect(geometryTopics).toContain('Circunferencia');
  });
});
