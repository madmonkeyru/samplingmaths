import { Item, PracticeConfig, DomainArea, ConvocatoriaManifest } from '../types';

export interface DynamicAssemblyOptions {
  totalItems?: number;
  areaDistribution?: {
    geometry?: number;
    functions?: number;
    statistics?: number;
  };
  cognitiveDistribution?: {
    reproduccion?: number;
    conexion?: number;
    reflexion?: number;
  };
  filterByConvocatoria?: string;
  excludeItemIds?: number[];
}

export class TestEngine {
  /**
   * Deterministically assemble an official convocatoria exam simulation
   * using the convocatoria blueprint and the decoupled item pool.
   */
  public static assembleSimulationSession(
    blueprint: ConvocatoriaManifest,
    itemsMap: Map<string, Item>
  ): Item[] {
    const assembled: Item[] = [];

    // Prioritize ordered section itemIds if defined
    if (blueprint.sections && blueprint.sections.length > 0) {
      for (const section of blueprint.sections) {
        for (const code of section.itemIds) {
          const item = itemsMap.get(code);
          if (item) {
            assembled.push(item);
          }
        }
      }
    }

    // Fallback to itemPool if sections were empty or incomplete
    if (assembled.length === 0 && blueprint.itemPool && blueprint.itemPool.length > 0) {
      for (const code of blueprint.itemPool) {
        const item = itemsMap.get(code);
        if (item) {
          assembled.push(item);
        }
      }
    }

    return assembled;
  }

  /**
   * Assemble a Targeted Concept Drilldown test containing questions
   * linked directly to a specific concept ID.
   */
  public static assembleConceptDrilldown(
    conceptId: string,
    allItems: Item[],
    limit: number | 'all' = 10
  ): Item[] {
    const filtered = allItems.filter(
      (item) =>
        item.concept_id === conceptId ||
        (item.linked_concepts && item.linked_concepts.includes(conceptId))
    );

    if (limit === 'all' || limit >= filtered.length) {
      return [...filtered];
    }
    return filtered.slice(0, limit);
  }

  /**
   * Dynamically assemble a mock exam matching official DGEC weight matrices:
   * ~38.3% Geometry, ~41.7% Relations & Algebra, ~20.0% Statistics.
   */
  public static assembleWeightedMockExam(
    allItems: Item[],
    totalQuestions: number = 60
  ): Item[] {
    const geoItems = allItems.filter((i) => i.area_id === 'geometry');
    const algItems = allItems.filter((i) => i.area_id === 'functions');
    const estItems = allItems.filter((i) => i.area_id === 'statistics');

    if (totalQuestions >= allItems.length) {
      return [...allItems];
    }

    const geoCount = Math.max(1, Math.round(totalQuestions * (23 / 60)));
    const algCount = Math.max(1, Math.round(totalQuestions * (25 / 60)));
    const estCount = Math.max(0, totalQuestions - geoCount - algCount);

    const sampleBalanced = (pool: Item[], count: number): Item[] => {
      if (count <= 0) return [];
      if (pool.length <= count) return [...pool];

      // Bucket items by evidence criterion to maximize curricular breadth
      const evidenceMap = new Map<string, Item[]>();
      pool.forEach((item) => {
        const ev = item.evidence_id || (item.spec && item.spec.evidence) || 'generic';
        if (!evidenceMap.has(ev)) evidenceMap.set(ev, []);
        evidenceMap.get(ev)!.push(item);
      });

      const selected: Item[] = [];
      const evidenceKeys = Array.from(evidenceMap.keys());
      let keyIdx = 0;

      while (selected.length < count && keyIdx < count * 5) {
        const ev = evidenceKeys[keyIdx % evidenceKeys.length];
        const bucket = evidenceMap.get(ev);
        if (bucket && bucket.length > 0) {
          selected.push(bucket.shift()!);
        }
        keyIdx++;
      }

      // If we still need items, fill from remaining pool
      if (selected.length < count) {
        const chosenIds = new Set(selected.map((i) => i.id));
        const remaining = pool.filter((i) => !chosenIds.has(i.id));
        selected.push(...remaining.slice(0, count - selected.length));
      }

      return selected;
    };

    const selectedGeo = sampleBalanced(geoItems, geoCount);
    const selectedAlg = sampleBalanced(algItems, algCount);
    const selectedEst = sampleBalanced(estItems, estCount);

    const assembled = [...selectedGeo, ...selectedAlg, ...selectedEst];

    // If assembled count differs from requested total due to small pools, top off or trim
    if (assembled.length < totalQuestions) {
      const chosenIds = new Set(assembled.map((i) => i.id));
      const remaining = allItems.filter((i) => !chosenIds.has(i.id));
      assembled.push(...remaining.slice(0, totalQuestions - assembled.length));
    }

    return assembled.slice(0, totalQuestions);
  }

  /**
   * Assemble items for practice by area or topic with optional limit.
   */
  public static assemblePracticeSession(
    config: PracticeConfig,
    allItems: Item[]
  ): Item[] {
    let pool = [...allItems];

    if (config.mode === 'concept_drilldown' && config.conceptId) {
      return this.assembleConceptDrilldown(config.conceptId, allItems, config.itemCount);
    }

    if (config.mode === 'dynamic_mock') {
      const count = config.itemCount === 'all' ? 60 : Number(config.itemCount) || 60;
      return this.assembleWeightedMockExam(allItems, count);
    }

    if (config.area && config.area !== 'all') {
      pool = pool.filter(
        (i) => i.area_id === config.area || i.area?.toLowerCase().includes(String(config.area).toLowerCase())
      );
    }

    if (config.topic && config.topic !== 'all') {
      pool = pool.filter((i) => i.topic === config.topic);
    }

    if (config.mode === 'random_practice') {
      // Deterministic pseudo-random shuffle
      pool = [...pool].sort(() => 0.5 - Math.random());
    }

    if (config.itemCount !== 'all' && typeof config.itemCount === 'number') {
      return pool.slice(0, config.itemCount);
    }

    return pool;
  }
}
