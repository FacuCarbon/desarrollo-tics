import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import vm from 'node:vm'
import ts from 'typescript'
import { pathToFileURL } from 'node:url'
const { chromium } = await import(pathToFileURL(path.join(os.tmpdir(), 'nube-browser-qa/node_modules/playwright/index.mjs')).href)
const root = path.resolve(import.meta.dirname, '..')
const folder = path.join(os.tmpdir(), 'notebook-ui-qa')
fs.mkdirSync(folder, { recursive: true })
const modules = new Map()
function load(file) {
  file = path.resolve(root, file)
  if (modules.has(file)) return modules.get(file)
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const exports = {}
  modules.set(file, exports)
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  vm.runInNewContext(code, { exports, require: (id) => load(path.resolve(path.dirname(file), id.endsWith('.json') ? id : `${id}.ts`)) })
  return exports
}
const { studySubjects } = load('src/data/subjects.ts')
const bank = studySubjects.find((subject) => subject.id === 'sistemas-nube').questions
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const errors = []
let page = await context.newPage()
const observe = (tab) => tab.on('pageerror', (error) => errors.push(error.message))
observe(page)
const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('study-session-v1:sistemas-nube')))
async function nav(name, width = 1440) { await page.getByRole('navigation', { name: width < 768 ? 'Navegación móvil' : 'Navegación principal', exact: true }).getByRole('button', { name, exact: true }).click() }
async function layout(label, width) {
  const measurements = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }))
  assert.ok(measurements.scroll <= measurements.width + 1, `${label} @${width}: ${measurements.scroll}`)
  if ([390, 1440].includes(width)) {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: path.join(folder, `${label}-${width}.png`), fullPage: false })
  }
}
try {
  await page.goto('http://127.0.0.1:5173')
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://desarrollo-estudio.vercel.app/')
  const image = await page.locator('meta[property="og:image"]').getAttribute('content')
  for (const data of await page.locator('script[type="application/ld+json"]').allTextContents()) assert.equal(JSON.parse(data)['@context'], 'https://schema.org')
  assert.equal(image, 'https://desarrollo-estudio.vercel.app/social/apuntes-preview-v1.png')
  for (const resource of ['/favicon.svg?v=2', '/favicon-32.png', '/apple-touch-icon.png', '/social/apuntes-preview-v1.png', '/robots.txt', '/sitemap.xml']) {
    const response = await context.request.get(`http://127.0.0.1:5173${resource}`)
    assert.equal(response.status(), 200, resource)
    if (resource.endsWith('.png')) assert.match(response.headers()['content-type'], /image\/png/, resource)
  }
  assert.equal(await page.getByRole('link', { name: /GitHub/ }).getAttribute('href'), 'https://github.com/facuCarbon')
  assert.equal(await page.getByRole('link', { name: /LinkedIn/ }).getAttribute('href'), 'https://www.linkedin.com/in/facundocarbon/')
  await page.locator('.library-subject').filter({ hasText: 'Desarrollo e implementación de sistemas en la nube' }).click()
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await nav('Estudiar', width)
    await layout('overview', width)
    await page.locator('.module-row').filter({ hasText: 'On-Premise, IaaS, PaaS, SaaS y nube híbrida' }).click()
    await page.getByRole('heading', { name: 'On-Premise, IaaS, PaaS, SaaS y nube híbrida', exact: true }).waitFor()
    await layout('reading', width)
    await page.locator('.study-subnav').getByRole('button', { name: 'Tablas comparativas', exact: true }).click()
    await page.locator('table').first().waitFor({ state: 'attached' })
    await layout('tables', width)
    assert.equal(await page.locator('table').count(), 4)
    await nav('Practicar', width)
    await layout('practice', width)
    await page.getByRole('button', { name: 'Resolver ejercicios', exact: true }).click()
    await layout('cases', width)
    await nav('Mi avance', width)
    await layout('progress', width)
  }
  console.log('PASS: 36 layouts at six widths, source tables, exercises, and personal footer.')
  await nav('Estudiar')
  await page.locator('.module-row').filter({ hasText: 'On-Premise, IaaS, PaaS, SaaS y nube híbrida' }).click()
  await page.getByRole('checkbox', { name: 'Marcar como repasado', exact: true }).check()
  await page.reload()
  assert.equal(await page.getByRole('checkbox', { name: 'Marcar como repasado', exact: true }).isChecked(), true)
  await page.getByRole('button', { name: 'Activar modo oscuro', exact: true }).click()
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark')
  await page.screenshot({ path: path.join(folder, 'dark-reading.png') })
  await page.reload()
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark')
  await page.getByRole('button', { name: 'Activar modo claro', exact: true }).click()
  await nav('Practicar')
  await page.getByRole('button', { name: 'Resolver ejercicios', exact: true }).click()
  await page.getByLabel('Elegí un caso de la actividad', { exact: true }).selectOption({ index: 1 })
  await page.getByLabel('Modelo propuesto', { exact: true }).selectOption('SaaS')
  await page.getByLabel('Requisito que determina la decisión', { exact: true }).selectOption({ index: 1 })
  await page.getByLabel('¿Qué sigue administrando el cliente en el modelo que elegiste?', { exact: true }).selectOption({ index: 4 })
  await page.locator('textarea').fill('Correo y colaboración estándar, con poco personal para mantenimiento.')
  await page.getByRole('button', { name: 'Corregir y ver explicación', exact: true }).click()
  assert.match(await page.locator('article').innerText(), /3\/3/)
  await nav('Practicar')
  await page.getByRole('button', { name: 'Preparar examen', exact: true }).click()
  await page.getByLabel('Cantidad de preguntas', { exact: true }).selectOption('5')
  await page.locator('.setup-feedback label').filter({ hasText: 'Una por una' }).click()
  await page.getByRole('button', { name: 'Empezar examen', exact: true }).click()
  const order = (await saved()).quizAttempt
  for (let index = 0; index < 5; index++) {
    const question = bank.find((q) => q.id === order[index].id)
    const option = index === 0 ? question.options.find((o) => o.id !== question.correctOptionId).id : question.correctOptionId
    await page.locator('.answer-option').filter({ has: page.locator(`input[value="${option}"]`) }).click()
    await page.getByRole('heading', { name: index === 0 ? 'Respuesta incorrecta' : 'Respuesta correcta', exact: true }).waitFor()
    if (index === 1) {
      await page.reload()
      assert.deepEqual((await saved()).quizAttempt, order)
      assert.equal(Object.keys((await saved()).answers).length, 2)
    } else if (index < 4) await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Ver resultado', exact: true }).click()
  await page.getByRole('heading', { name: 'Resultado del examen', exact: true }).waitFor()
  assert.equal((await saved()).submitted, true)
  assert.match(await page.locator('.result-score').innerText(), /4/)
  assert.equal(await page.locator('.review-item').count(), 1)
  await page.screenshot({ path: path.join(folder, 'result-desktop.png') })
  await page.close()
  page = await context.newPage(); observe(page)
  await page.goto('http://127.0.0.1:5173')
  await page.getByRole('heading', { name: 'Resultado del examen', exact: true }).waitFor()
  await nav('Mi avance')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Descargar mi avance', exact: true }).click()
  const download = await downloadEvent
  const backup = JSON.parse(fs.readFileSync(await download.path(), 'utf8'))
  assert.equal(backup.data['study-session-v1:sistemas-nube'].submitted, true)
  assert.equal(backup.data['nube-case-v1-0'].model, 'SaaS')
  assert.equal(errors.length, 0, errors.join('\n'))
  console.log(`PASS: themes, module progress, case grading, single-question exam, correction, reload/resume, results and backup. Screenshots: ${folder}`)
} finally { await browser.close() }
