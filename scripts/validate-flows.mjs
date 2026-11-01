import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const base = process.env.FLOW_BASE_URL || 'http://127.0.0.1:5173';
const heading = page.getByRole('heading', { level: 1 });
try {
  await page.goto(base);
  await page.getByRole('button', { name: 'Ver Planes y Programas' }).click();
  await page.getByRole('heading', { name: 'Programas de Educación Abierta' }).waitFor();
  // Every catalog entry must open a real subject page, then return to its program.
  const programs = ['cico', 'iii_ciclo', 'edad', 'bxm'];
  let routes = 0;
  for (const program of programs) {
    await page.goto(`${base}/#/programas/${program}`);
    await page.getByRole('heading', { name: 'Elige una asignatura' }).waitFor();
    const cards = page.getByRole('region', { name: 'Asignaturas del programa' }).getByRole('button');
    const names = await cards.locator('h3').allTextContents();
    for (const name of names) {
      await page.getByRole('region', { name: 'Asignaturas del programa' }).getByRole('button').filter({ has: page.getByRole('heading', { name, exact: true }) }).click();
      if (program === 'bxm' && name === 'Matemáticas') {
        await page.getByRole('button', { name: 'Iniciar Simulación', exact: true }).waitFor();
        await page.getByRole('button', { name: 'Bachillerato por Madurez Suficiente (BXM)', exact: true }).click();
      } else {
        await heading.filter({ hasText: name }).waitFor();
        await page.getByRole('tab', { name: 'Recursos', exact: true }).click();
        await page.getByRole('heading', { name: 'Recursos en preparación' }).waitFor();
        await page.getByRole('tab', { name: 'Progreso', exact: true }).click();
        await page.getByRole('heading', { name: 'Aún no hay intentos en esta asignatura' }).waitFor();
        await page.getByRole('button', { name: 'Ver asignaturas del programa' }).click();
      }
      await page.getByRole('heading', { name: 'Elige una asignatura' }).waitFor();
      routes++;
    }
  }
  for (const [program, module] of [['iii_ciclo', 'III_CICLO_9'], ['edad', 'EDAD_2']]) {
    await page.goto(`${base}/#/programas/${program}/espanol`);
    await page.getByLabel('Nivel o parte').selectOption(module);
    await page.waitForURL(new RegExp(`nivel=${module}`));
    await page.getByLabel('Convocatoria de referencia').selectOption('2026-c1');
    await page.waitForURL(/convocatoria=2026-c1/);
    await page.reload();
    await page.getByRole('heading', { name: /Español/ }).waitFor();
    assert.equal(await page.getByLabel('Nivel o parte').inputValue(), module);
    assert.equal(await page.getByLabel('Convocatoria de referencia').inputValue(), '2026-c1');
    await page.getByTitle('Cambiar programa oficial MEP').click();
    await page.getByRole('button', { name: /I y II Ciclo CICO/ }).click();
    await page.getByRole('heading', { name: /Español · I y II/ }).waitFor();
    assert.equal(await page.getByLabel('Convocatoria de referencia').inputValue(), '2026-c1');
    assert.ok(!page.url().includes('nivel='));
    await page.goBack();
    await page.getByRole('heading', { name: new RegExp(`Español · ${program === 'edad' ? 'EDAD' : 'III Ciclo'}`) }).waitFor();
    await page.goForward();
    await page.getByRole('heading', { name: /Español · I y II/ }).waitFor();
  }
  await page.goto(`${base}/#/programas/cico/matematicas`);
  await page.getByText('Calculadora prohibida', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Iniciar simulación · Próximamente' }).isDisabled().then(assert.ok);
  await page.getByRole('button', { name: 'Practicar Matemáticas BXM' }).click();
  await page.getByRole('button', { name: 'Iniciar Simulación', exact: true }).waitFor();
  await mkdir('artifacts/flow-validation', { recursive: true });
  await page.screenshot({ path: 'artifacts/flow-validation/bxm-desktop.png', fullPage: true });
  await page.getByLabel('Convocatoria de referencia').selectOption('2026-c1');
  await page.getByRole('heading', { name: 'Banco de preguntas en preparación' }).waitFor();
  await page.getByLabel('Convocatoria de referencia').selectOption('2026-c2');
  await page.getByRole('button', { name: 'Iniciar Simulación', exact: true }).click();
  await page.getByText('1', { exact: true }).first().waitFor();
  assert.equal(await page.getByTitle('Cambiar programa oficial MEP').count(), 0);
  // Unknown routes recover to the program portal.
  await page.goto(`${base}/#/programas/unknown/no-subject`);
  await page.getByRole('heading', { name: 'Programas de Educación Abierta' }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/#/programas/edad/espanol?nivel=EDAD_2`);
  await heading.filter({ hasText: 'Español' }).waitFor();
  await page.screenshot({ path: 'artifacts/flow-validation/edad-mobile.png', fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Mobile page overflows');
  assert.deepEqual(errors, [], 'Browser errors');
  console.log(`Validated ${routes} subject routes, module and program switches, convocatoria changes, refresh, history, MVP simulation, invalid routes and mobile layout.`);
} finally {
  await browser.close();
}
