import { describe, it, expect } from 'vitest';
import { TestEngine } from './testEngine';
import { Item, ConvocatoriaManifest } from '../types';

describe('TestEngine', () => {
  const dummyItems: Item[] = [
    {
      id: 1,
      code: 'item-geo-001',
      area: 'Geometría',
      area_id: 'geometry',
      topic: 'Circunferencia',
      evidence_id: 'A1.1',
      concept_id: 'mep-geo-circunferencia-01',
      stem: 'Pregunta 1',
      options: { A: '1', B: '2', C: '3', D: '4' },
      correct_answer: 'A',
      solution_steps: ['Paso 1'],
    },
    {
      id: 2,
      code: 'item-geo-002',
      area: 'Geometría',
      area_id: 'geometry',
      topic: 'Circunferencia',
      evidence_id: 'A1.2',
      concept_id: 'mep-geo-circunferencia-01',
      stem: 'Pregunta 2',
      options: { A: '1', B: '2', C: '3', D: '4' },
      correct_answer: 'B',
      solution_steps: ['Paso 1'],
    },
    {
      id: 3,
      code: 'item-alg-001',
      area: 'Relaciones y Álgebra',
      area_id: 'functions',
      topic: 'Función Lineal',
      evidence_id: 'A2.1',
      concept_id: 'mep-alg-funcion-lineal-03',
      stem: 'Pregunta 3',
      options: { A: '1', B: '2', C: '3', D: '4' },
      correct_answer: 'C',
      solution_steps: ['Paso 1'],
    },
    {
      id: 4,
      code: 'item-est-001',
      area: 'Estadística y Probabilidad',
      area_id: 'statistics',
      topic: 'Probabilidad',
      evidence_id: 'A3.1',
      concept_id: 'mep-est-eventos-probabilidad-02',
      stem: 'Pregunta 4',
      options: { A: '1', B: '2', C: '3', D: '4' },
      correct_answer: 'D',
      solution_steps: ['Paso 1'],
    },
  ];

  it('assembles simulation session from blueprint and item map', () => {
    const blueprint: ConvocatoriaManifest = {
      schemaVersion: '1.0',
      convocatoriaId: '2026-c2',
      year: 2026,
      cycle: 2,
      programId: 'bxm',
      subjectId: 'matematica',
      title: 'Prueba BXM',
      description: 'Desc',
      passingScore: 70,
      calculatorAllowed: true,
      timeLimitMinutes: 150,
      totalItems: 3,
      sections: [
        {
          id: 'geometry',
          name: 'Geometría',
          itemRange: [1, 1],
          totalItems: 1,
          itemIds: ['item-geo-001'],
        },
        {
          id: 'functions',
          name: 'Álgebra',
          itemRange: [2, 2],
          totalItems: 1,
          itemIds: ['item-alg-001'],
        },
      ],
      itemPool: ['item-geo-001', 'item-alg-001'],
    };

    const map = new Map<string, Item>();
    dummyItems.forEach((i) => map.set(i.code!, i));

    const session = TestEngine.assembleSimulationSession(blueprint, map);
    expect(session.length).toBe(2);
    expect(session[0].code).toBe('item-geo-001');
    expect(session[1].code).toBe('item-alg-001');
  });

  it('assembles concept drilldown for a specific concept', () => {
    const drilldown = TestEngine.assembleConceptDrilldown('mep-geo-circunferencia-01', dummyItems);
    expect(drilldown.length).toBe(2);
    expect(drilldown.every((i) => i.concept_id === 'mep-geo-circunferencia-01')).toBe(true);
  });

  it('assembles weighted mock exam with proportional domain representation', () => {
    const mock = TestEngine.assembleWeightedMockExam(dummyItems, 4);
    expect(mock.length).toBe(4);
    expect(mock.some((i) => i.area_id === 'geometry')).toBe(true);
  });
});
