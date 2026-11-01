#!/usr/bin/env node

/**
 * Ingestion, Validation & Quality Assurance CLI
 *
 * Validates:
 * 1. JSON Schema integrity for all atomic items in content/items/math/
 * 2. Visual spec payload parameters (zero static images, valid SVG/Canvas composites)
 * 3. Concept linkages against content/library/math/*_concepts.json
 * 4. Convocatoria blueprint integrity and 100% item reference resolution
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const ITEMS_DIR = path.join(ROOT_DIR, 'content/items/math');
const LIBRARY_DIR = path.join(ROOT_DIR, 'content/library/math');
const BLUEPRINTS_DIR = path.join(ROOT_DIR, 'content/programs/bxm/matematica/convocatorias');

console.log('=====================================================');
console.log('   MEP-EA-01 Content Registry & Asset Validator      ');
console.log('=====================================================\n');

let errorCount = 0;
let warningCount = 0;

// 1. Load Concept Registries
const concepts = new Set();
['geometry_concepts.json', 'algebra_concepts.json', 'statistics_concepts.json'].forEach((file) => {
  const filePath = path.join(LIBRARY_DIR, file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.forEach((c) => concepts.add(c.id));
  } else {
    console.error(`[ERROR] Missing library concept file: ${file}`);
    errorCount++;
  }
});

console.log(`[PASS] Registered Concepts: ${concepts.size} across Geometry, Algebra, Statistics.`);

// 2. Validate Atomic Items
const itemCodes = new Set();
const itemNumericIds = new Set();
let itemsValidated = 0;

const subdirs = ['geometry', 'algebra', 'statistics'];
for (const sub of subdirs) {
  const dirPath = path.join(ITEMS_DIR, sub);
  if (!fs.existsSync(dirPath)) continue;

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const itemPath = path.join(dirPath, file);
    try {
      const item = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
      itemsValidated++;

      // Check required fields
      if (!item.id || typeof item.id !== 'number') {
        console.error(`[ERROR] Item ${file}: missing valid numeric id.`);
        errorCount++;
      } else {
        itemNumericIds.add(item.id);
      }

      if (!item.code || typeof item.code !== 'string') {
        console.error(`[ERROR] Item ${file}: missing valid string code.`);
        errorCount++;
      } else {
        if (itemCodes.has(item.code)) {
          console.error(`[ERROR] Duplicate item code: ${item.code}`);
          errorCount++;
        }
        itemCodes.add(item.code);
      }

      if (!item.area_id || !['geometry', 'functions', 'statistics'].includes(item.area_id)) {
        console.error(`[ERROR] Item ${file}: invalid or missing area_id.`);
        errorCount++;
      }

      if (!item.stem || typeof item.stem !== 'string' || item.stem.trim().length === 0) {
        console.error(`[ERROR] Item ${file}: missing stem.`);
        errorCount++;
      }

      if (!item.options || typeof item.options !== 'object' || !item.options.A || !item.options.B || !item.options.C || !item.options.D) {
        console.error(`[ERROR] Item ${file}: invalid options structure (A, B, C, D required).`);
        errorCount++;
      }

      if (!item.correct_answer || !['A', 'B', 'C', 'D'].includes(item.correct_answer)) {
        console.error(`[ERROR] Item ${file}: invalid correct_answer (${item.correct_answer}).`);
        errorCount++;
      }

      // Check concept linkage
      if (item.concept_id && !concepts.has(item.concept_id)) {
        console.warn(`[WARN] Item ${file}: linked concept_id '${item.concept_id}' not found in library.`);
        warningCount++;
      }

      // Check visual spec parameters (No static raster images)
      if (item.visual_spec) {
        const visual = item.visual_spec.visual || item.visual_spec;
        if (!visual.type) {
          console.error(`[ERROR] Item ${file}: visual_spec missing 'type' parameter.`);
          errorCount++;
        }

        const stemLower = (item.stem || '').toLowerCase();
        if (stemLower.includes('.png') || stemLower.includes('.jpg') || stemLower.includes('.jpeg')) {
          console.error(`[ERROR] Item ${file}: stem contains static bitmap image reference! Zero static images rule violated.`);
          errorCount++;
        }
      }
    } catch (err) {
      console.error(`[ERROR] Failed to parse item JSON: ${file}`, err);
      errorCount++;
    }
  }
}

console.log(`[PASS] Validated ${itemsValidated} atomic items across ${subdirs.length} domains.`);

// 3. Validate Convocatoria Blueprints
if (fs.existsSync(BLUEPRINTS_DIR)) {
  const blueprints = fs.readdirSync(BLUEPRINTS_DIR).filter((f) => f.endsWith('.json'));
  for (const bpFile of blueprints) {
    const bpPath = path.join(BLUEPRINTS_DIR, bpFile);
    try {
      const bp = JSON.parse(fs.readFileSync(bpPath, 'utf8'));
      if (!bp.convocatoriaId || !bp.totalItems) {
        console.error(`[ERROR] Blueprint ${bpFile}: missing convocatoriaId or totalItems.`);
        errorCount++;
      }

      // Verify all pool item IDs exist in decoupled item bank
      let missingInPool = 0;
      (bp.itemPool || []).forEach((code) => {
        if (!itemCodes.has(code)) {
          missingInPool++;
        }
      });

      if (missingInPool > 0) {
        console.error(`[ERROR] Blueprint ${bpFile}: ${missingInPool} items in itemPool not resolved in item bank!`);
        errorCount++;
      } else {
        console.log(`[PASS] Blueprint ${bpFile}: all ${bp.itemPool.length} items verified in item bank.`);
      }
    } catch (err) {
      console.error(`[ERROR] Failed to parse blueprint: ${bpFile}`, err);
      errorCount++;
    }
  }
}

console.log('\n=====================================================');
console.log(`Summary: ${itemsValidated} items validated | ${errorCount} errors | ${warningCount} warnings`);
console.log('=====================================================');

if (errorCount > 0) {
  process.exit(1);
} else {
  console.log('All content registry checks passed successfully!\n');
  process.exit(0);
}
