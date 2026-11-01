import fs from 'fs';
import path from 'path';

const set1 = JSON.parse(fs.readFileSync('content/bxm/matematicas/set_1.json', 'utf8'));
const set2 = JSON.parse(fs.readFileSync('content/bxm/matematicas/set_2.json', 'utf8'));
const set3 = JSON.parse(fs.readFileSync('content/bxm/matematicas/set_3.json', 'utf8'));
const set4 = JSON.parse(fs.readFileSync('content/bxm/matematicas/set_4.json', 'utf8'));
const set5 = JSON.parse(fs.readFileSync('content/bxm/matematicas/set_5.json', 'utf8'));

const rawSets = [
  { set_id: 'set_1', items: set1.items, convocatoria: '2026-c2' },
  { set_id: 'set_2', items: set2.items, convocatoria: '2026-c1' },
  { set_id: 'set_3', items: set3.items, convocatoria: '2026-c2' },
  { set_id: 'set_4', items: set4.items, convocatoria: '2026-c2' },
  { set_id: 'set_5', items: set5.items, convocatoria: '2026-c2' },
];

function mapConcept(area_id, evidence, topic, stem) {
  const t = (topic || '').toLowerCase();
  const s = (stem || '').toLowerCase();
  const ev = evidence || '';

  if (area_id === 'geometry') {
    if (ev.startsWith('A5') || t.includes('esfera') || t.includes('cilindro') || t.includes('cono') || t.includes('sólido') || t.includes('solido') || t.includes('sección') || t.includes('seccion')) {
      return 'mep-geo-cuerpos-3d-09';
    }
    if (ev.startsWith('A7') || ev.startsWith('A6') || t.includes('simetría') || t.includes('simetria') || t.includes('transformación') || t.includes('transformacion') || t.includes('homotecia') || t.includes('reflexión')) {
      return 'mep-geo-transformaciones-10';
    }
    if (ev.startsWith('A4') || t.includes('polígono') || t.includes('poligono') || t.includes('apotema')) {
      if (t.includes('irregular') || s.includes('vértice') || s.includes('vertice') || s.includes('descomposición')) {
        return 'mep-geo-poligono-irregular-08';
      }
      return 'mep-geo-poligono-regular-07';
    }
    if (ev.startsWith('A2') || t.includes('traslación') || t.includes('traslacion')) {
      return 'mep-geo-traslacion-03';
    }
    if (ev === 'A3.1' || t.includes('punto') || s.includes('interior') || s.includes('exterior')) {
      return 'mep-geo-posicion-punto-04';
    }
    if (ev === 'A3.2' || ev === 'A3.3' || ev === 'A3.5' || t.includes('tangente') || t.includes('secante') || t.includes('exterior')) {
      return 'mep-geo-posicion-recta-05';
    }
    if (ev === 'A3.4' || t.includes('paralel') || t.includes('perpendic')) {
      return 'mep-geo-rectas-paralelas-perp-06';
    }
    return 'mep-geo-circunferencia-01';
  }

  if (area_id === 'functions') {
    if (ev.startsWith('A5') || ev === 'A6.3' || ev === 'A3.6' || t.includes('logarit') || t.includes('exponencial')) {
      if (t.includes('propiedad') || s.includes('log_')) return 'mep-alg-propiedades-logaritmos-09';
      return 'mep-alg-exponencial-logaritmica-08';
    }
    if (ev === 'A4.5' || ev === 'A4.6' || ev === 'A4.7' || t.includes('raíz') || t.includes('raiz')) {
      return 'mep-alg-funcion-raiz-cuadrada-07';
    }
    if (ev.startsWith('A4') || ev === 'A8.1' || ev === 'A8.2' || t.includes('inversa')) {
      return 'mep-alg-funcion-inversa-06';
    }
    if (ev === 'A3.2' || ev === 'A3.3' || ev.startsWith('A9') || t.includes('sistema') || t.includes('ecuaciones')) {
      return 'mep-alg-sistemas-ecuaciones-05';
    }
    if (ev.startsWith('A1.3') || ev.startsWith('A1.4') || ev === 'A8.3' || t.includes('composición') || t.includes('composicion')) {
      return 'mep-alg-composicion-02';
    }
    if (ev === 'A2.5' || ev === 'A2.8' || ev === 'A2.9' || ev === 'A2.10' || ev === 'A2.12' || ev === 'A6.2' || ev === 'A6.3' || t.includes('cuadrática') || t.includes('cuadratica') || t.includes('parábola')) {
      return 'mep-alg-funcion-cuadratica-04';
    }
    if (ev.startsWith('A2') || ev === 'A6.5' || ev === 'A2.11' || t.includes('lineal') || t.includes('pendiente')) {
      return 'mep-alg-funcion-lineal-03';
    }
    return 'mep-alg-concepto-funcion-01';
  }

  if (area_id === 'statistics') {
    if (ev === 'A3.3' || ev === 'A10.5' || t.includes('relativa') || t.includes('estandariz') || t.includes('variación') || t.includes('variacion')) {
      return 'mep-est-posicion-relativa-cv-04';
    }
    if (ev === 'A3.2' || ev === 'A10.3' || ev === 'A10.1' || t.includes('caja') || t.includes('bigote') || s.includes('diagrama de cajas')) {
      return 'mep-est-diagrama-cajas-ric-03';
    }
    if (ev.startsWith('A2') || ev.startsWith('A11') || ev === 'A3.5' || ev === 'A3.6' || t.includes('probabilidad') || t.includes('evento') || t.includes('laplace') || t.includes('venn')) {
      return 'mep-est-eventos-probabilidad-02';
    }
    return 'mep-est-medidas-posicion-01';
  }

  return 'mep-geo-circunferencia-01';
}

function getCognitiveLevel(item) {
  if (item.cognitive_level) {
    const cl = String(item.cognitive_level).toLowerCase();
    if (cl.includes('reprod')) return 'reproduccion';
    if (cl.includes('conex')) return 'conexion';
    if (cl.includes('reflex')) return 'reflexion';
  }
  const id = item.id;
  if (id % 5 === 0) return 'reflexion';
  if (id % 2 === 0) return 'conexion';
  return 'reproduccion';
}

function getDifficultyTier(item) {
  if (item.difficulty_tier) return item.difficulty_tier;
  const cog = getCognitiveLevel(item);
  if (cog === 'reflexion') return 3;
  if (cog === 'conexion') return 2;
  return 1;
}

let writtenCount = 0;
const blueprint2026c2 = [];

rawSets.forEach(({ set_id, items, convocatoria }) => {
  items.forEach((rawItem) => {
    const area_id = rawItem.area_id || 'geometry';
    const subfolder = area_id === 'functions' ? 'algebra' : area_id === 'statistics' ? 'statistics' : 'geometry';
    const prefix = area_id === 'functions' ? 'item-alg' : area_id === 'statistics' ? 'item-est' : 'item-geo';
    const paddedId = String(rawItem.id).padStart(3, '0');
    const code = rawItem.code || `${prefix}-${paddedId}`;
    const evidence = (rawItem.spec && rawItem.spec.evidence) || rawItem.evidence || 'A1.1';
    const primaryConcept = rawItem.concept_id || mapConcept(area_id, evidence, rawItem.topic, rawItem.stem);

    const decoupledItem = {
      id: rawItem.id,
      code: code,
      set_id: set_id,
      area: rawItem.area,
      area_id: area_id,
      topic: rawItem.topic,
      spec: rawItem.spec || {
        block: rawItem.area,
        affirmation: 'A1',
        affirmation_desc: null,
        evidence: evidence,
        evidence_desc: rawItem.evidence_desc || '',
      },
      evidence_id: evidence,
      concept_id: primaryConcept,
      linked_concepts: rawItem.linked_concepts && rawItem.linked_concepts.length ? rawItem.linked_concepts : [primaryConcept],
      program_applicability: rawItem.program_applicability || ['EDAD_PARTE_1', 'BXM'],
      calculator_allowed: rawItem.calculator_allowed !== undefined ? rawItem.calculator_allowed : true,
      cognitive_level: getCognitiveLevel(rawItem),
      difficulty_tier: getDifficultyTier(rawItem),
      historical_convocatoria: rawItem.historical_convocatoria || [convocatoria],
      stem: rawItem.stem,
      options: rawItem.options,
      correct_answer: rawItem.correct_answer,
      solution_steps: rawItem.solution_steps || [],
      group_id: rawItem.group_id || null,
      visual_spec: rawItem.visual_spec || null,
    };

    if (set_id === 'set_1') {
      blueprint2026c2.push(code);
    }

    const targetFile = path.join('content/items/math', subfolder, `${code}.json`);
    fs.writeFileSync(targetFile, JSON.stringify(decoupledItem, null, 2));
    writtenCount++;
  });
});

console.log('Successfully wrote decoupled items:', writtenCount);
console.log('Blueprint 2026-c2 item count:', blueprint2026c2.length);

// Update convocatoria 2026-c2
const c2Path = 'content/programs/bxm/matematica/convocatorias/2026-c2.json';
const c2 = JSON.parse(fs.readFileSync(c2Path, 'utf8'));
c2.itemPool = blueprint2026c2;
c2.sections = [
  {
    id: 'geometry',
    name: 'Geometría',
    itemRange: [1, 23],
    totalItems: 23,
    itemIds: blueprint2026c2.slice(0, 23),
  },
  {
    id: 'functions',
    name: 'Relaciones y Álgebra',
    itemRange: [24, 48],
    totalItems: 25,
    itemIds: blueprint2026c2.slice(23, 48),
  },
  {
    id: 'statistics',
    name: 'Estadística y Probabilidad',
    itemRange: [49, 60],
    totalItems: 12,
    itemIds: blueprint2026c2.slice(48, 60),
  },
];
fs.writeFileSync(c2Path, JSON.stringify(c2, null, 2));

// Update convocatoria 2026-c1 with items from set_2 (first 60)
const c1Path = 'content/programs/bxm/matematica/convocatorias/2026-c1.json';
const c1 = JSON.parse(fs.readFileSync(c1Path, 'utf8'));
const set2Codes = set2.items.map((i) => {
  const p = i.area_id === 'functions' ? 'item-alg' : i.area_id === 'statistics' ? 'item-est' : 'item-geo';
  return `${p}-${String(i.id).padStart(3, '0')}`;
});
const c1Geo = set2Codes.filter((c) => c.startsWith('item-geo')).slice(0, 23);
const c1Alg = set2Codes.filter((c) => c.startsWith('item-alg')).slice(0, 25);
const c1Est = set2Codes.filter((c) => c.startsWith('item-est')).slice(0, 12);
const c1Pool = [...c1Geo, ...c1Alg, ...c1Est];

c1.itemPool = c1Pool;
c1.sections = [
  {
    id: 'geometry',
    name: 'Geometría',
    itemRange: [1, 23],
    totalItems: 23,
    itemIds: c1Geo,
  },
  {
    id: 'functions',
    name: 'Relaciones y Álgebra',
    itemRange: [24, 48],
    totalItems: 25,
    itemIds: c1Alg,
  },
  {
    id: 'statistics',
    name: 'Estadística y Probabilidad',
    itemRange: [49, 60],
    totalItems: 12,
    itemIds: c1Est,
  },
];
fs.writeFileSync(c1Path, JSON.stringify(c1, null, 2));
console.log('Convocatoria blueprints 2026-c1 and 2026-c2 updated successfully');
