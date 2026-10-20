import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
import { pathToFileURL } from 'node:url'
const { chromium } = await import(pathToFileURL(path.join(os.tmpdir(), 'nube-browser-qa/node_modules/playwright/index.mjs')).href)
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage()
const folder = path.join(os.tmpdir(), 'study-theme-qa')
fs.mkdirSync(folder, { recursive: true })
const errors = []
const interactionOnly = process.argv.includes('--interaction-only')
page.on('pageerror', (error) => errors.push(error.message))
const cache = new Map()
function load(file) {
  file = path.resolve(import.meta.dirname, '..', file)
  if (cache.has(file)) return cache.get(file)
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const exports = {}
  cache.set(file, exports)
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  vm.runInNewContext(code, { exports, require: (id) => load(path.resolve(path.dirname(file), id.endsWith('.json') ? id : `${id}.ts`)) })
  return exports
}
const { studySubjects } = load('src/data/subjects.ts')
let checks = 0

async function contrast(label) {
  checks++
  const failures = await page.evaluate(() => {
    const rgba = (color) => color.match(/[\d.]+/g).map(Number)
    const over = (front, back) => [0, 1, 2].map((i) => front[i] * (front[3] ?? 1) + back[i] * (1 - (front[3] ?? 1)))
    const luminance = (rgb) => rgb.slice(0, 3).map((value) => value / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0)
    const issues = []
    for (const element of document.querySelectorAll('body *')) {
      const text = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent.trim()).join(' ').trim()
      if (!text || !element.getClientRects().length || element.closest('.context-divider,script,style,option')) continue
      const style = getComputedStyle(element)
      if (style.visibility !== 'visible') continue
      const ancestors = []
      for (let node = element; node; node = node.parentElement) ancestors.unshift(node)
      let background = [255, 255, 255]
      let opacity = 1
      for (const node of ancestors) {
        const computed = getComputedStyle(node)
        background = over(rgba(computed.backgroundColor), background)
        opacity *= Number(computed.opacity)
      }
      const foreground = rgba(style.color)
      foreground[3] = (foreground[3] ?? 1) * opacity
      const a = luminance(over(foreground, background)), b = luminance(background)
      const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
      const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseFloat(style.fontWeight) >= 700)
      if (ratio < (large ? 3 : 4.5)) issues.push({ text: text.slice(0, 90), ratio: Number(ratio.toFixed(2)), color: style.color, background })
    }
    return issues
  })
  assert.deepEqual(failures, [], `${label}: insufficient text contrast`)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), label)
}

try {
  await page.goto('http://127.0.0.1:5173')
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const picker = page.locator(width < 768 ? '#mobile-subject' : '#subject-picker')
    const nav = page.getByRole('navigation', { name: width < 768 ? 'Navegación móvil' : 'Navegación principal', exact: true })
    for (const theme of ['light', 'dark']) {
      const current = await page.locator('html').getAttribute('data-theme')
      if (current !== theme) await page.getByRole('button', { name: theme === 'dark' ? 'Activar modo oscuro' : 'Activar modo claro', exact: true }).click()
      await picker.click()
      await page.getByRole('listbox').waitFor()
      assert.equal(await page.locator('.notebook-sidebar select,.mobile-subject select').count(), 0)
      await contrast(`${theme} ${width}: subject menu`)
      if (width !== 320) await page.screenshot({ path: path.join(folder, `${theme}-menu-${width}.png`) })
      await page.getByRole('option', { name: 'Desarrollo e implementación de sistemas en la nube', exact: true }).click()
      await nav.getByRole('button', { name: 'Estudiar', exact: true }).click()
      await contrast(`${theme} ${width}: overview`)
      await picker.focus()
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('End')
      assert.match(await page.getByRole('listbox').getAttribute('aria-activedescendant'), /option-3$/)
      await page.keyboard.press('Escape')
      assert.equal(await picker.getAttribute('aria-expanded'), 'false')
      assert.equal(await picker.evaluate((element) => element === document.activeElement), true)
      await picker.click()
      await page.keyboard.press('Tab')
      assert.equal(await picker.getAttribute('aria-expanded'), 'false')
      assert.equal(await picker.evaluate((element) => element === document.activeElement), false)
      await picker.click()
      await page.keyboard.press('Home')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      assert.match(await picker.innerText(), /TICs/)
      await page.reload()
      assert.match(await picker.innerText(), /TICs/)
      await picker.click()
      await page.keyboard.press('Home')
      await page.keyboard.press('Enter')
      await nav.getByRole('button', { name: 'Estudiar', exact: true }).click()
      await page.locator('.module-row').first().click()
      await contrast(`${theme} ${width}: reading`)
      await page.locator('.study-subnav').getByRole('button', { name: 'Tablas comparativas', exact: true }).click()
      await page.locator('table').first().waitFor({ state: 'attached' })
      await contrast(`${theme} ${width}: tables`)
      await nav.getByRole('button', { name: 'Practicar', exact: true }).click()
      await contrast(`${theme} ${width}: practice`)
      await page.getByRole('button', { name: 'Resolver ejercicios', exact: true }).click()
      await page.getByLabel('Modelo propuesto', { exact: true }).waitFor()
      await contrast(`${theme} ${width}: exercises`)
      await nav.getByRole('button', { name: 'Mi avance', exact: true }).click()
      await page.getByRole('button', { name: 'Descargar mi avance', exact: true }).waitFor()
      await contrast(`${theme} ${width}: progress`)
      await picker.click()
      await page.getByRole('button', { name: theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro', exact: true }).click()
      assert.equal(await picker.getAttribute('aria-expanded'), 'false')
    }
  }
  for (const width of interactionOnly ? [] : [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const picker = page.locator(width < 768 ? '#mobile-subject' : '#subject-picker')
    const nav = page.getByRole('navigation', { name: width < 768 ? 'Navegación móvil' : 'Navegación principal', exact: true })
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.getByRole('button', { name: theme === 'dark' ? 'Activar modo oscuro' : 'Activar modo claro', exact: true }).click()
      for (const subject of studySubjects) {
        await picker.click()
        await page.getByRole('option', { name: subject.title, exact: true }).click()
        await nav.getByRole('button', { name: 'Estudiar', exact: true }).click()
        for (let index = 0; index < subject.modules.length; index++) {
          await page.locator('.module-row').nth(index).click()
          await page.locator('.reading-page').waitFor()
          await page.locator('.reading-page details').evaluateAll((nodes) => nodes.forEach((node) => { node.open = true }))
          await contrast(`${theme} ${width}: ${subject.id} module ${index}`)
          await nav.getByRole('button', { name: 'Estudiar', exact: true }).click()
        }
        const recap = page.locator('.study-subnav').getByRole('button', { name: 'Repaso express', exact: true })
        if (await recap.count()) { await recap.click(); await contrast(`${theme} ${width}: ${subject.id} recap`) }
        await nav.getByRole('button', { name: 'Practicar', exact: true }).click()
        await page.getByRole('button', { name: 'Preparar examen', exact: true }).click()
        await contrast(`${theme} ${width}: ${subject.id} exam dialog`)
        await page.getByLabel('Cantidad de preguntas', { exact: true }).selectOption('5')
        await page.locator('.setup-feedback label').filter({ hasText: 'Una por una' }).click()
        await page.getByRole('button', { name: 'Empezar examen', exact: true }).click()
        await contrast(`${theme} ${width}: ${subject.id} unanswered exam`)
        const attempt = await page.evaluate((id) => JSON.parse(localStorage.getItem(`study-session-v1:${id}`)).quizAttempt, subject.id)
        for (let index = 0; index < 5; index++) {
          const question = subject.questions.find((item) => item.id === attempt[index].id)
          const answer = index === 0 ? question.options.find((option) => option.id !== question.correctOptionId).id : question.correctOptionId
          await page.locator('.answer-option').filter({ has: page.locator(`input[value="${answer}"]`) }).click()
          await page.locator('.answer-feedback').waitFor()
          await page.locator('.answer-feedback details').evaluate((node) => { node.open = true })
          await contrast(`${theme} ${width}: ${subject.id} feedback ${index}`)
          if (index === 0 && subject.id === 'sistemas-nube') await page.screenshot({ path: path.join(folder, `${theme}-feedback-${width}.png`), fullPage: true })
          if (index < 4) await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
        }
        await page.getByRole('button', { name: 'Ver resultado', exact: true }).click()
        await page.locator('.exam-results details').evaluateAll((nodes) => nodes.forEach((node) => { node.open = true }))
        await contrast(`${theme} ${width}: ${subject.id} result`)
        await nav.getByRole('button', { name: 'Mi avance', exact: true }).click()
        await contrast(`${theme} ${width}: ${subject.id} progress`)
        if (subject.id === 'sistemas-nube') {
          await nav.getByRole('button', { name: 'Estudiar', exact: true }).click()
          await page.locator('.study-subnav').getByRole('button', { name: 'Material de clase', exact: true }).click()
          await page.getByRole('heading', { name: 'Material por clase, sin descartar el original' }).waitFor()
          await page.locator('.cloud-guide details').evaluateAll((nodes) => nodes.forEach((node) => { node.open = true }))
          await contrast(`${theme} ${width}: all cloud sources`)
          await nav.getByRole('button', { name: 'Practicar', exact: true }).click()
          await page.getByRole('button', { name: 'Resolver ejercicios', exact: true }).click()
          for (const [section, button] of [['Casos prácticos', 'Corregir y ver explicación'], ['Repartir capas', 'Corregir responsabilidades'], ['Cambian las condiciones', 'Corregir cambios'], ['Diseñar una solución', 'Contrastar propuesta'], ['Campus Cloud', 'Corregir controles']]) {
            if (width < 640) await page.getByRole('combobox', { name: 'Tipo de ejercicio', exact: true }).selectOption(section)
            else await page.getByRole('button', { name: section, exact: true }).click()
            if (section === 'Casos prácticos') {
              await page.getByLabel('Modelo propuesto', { exact: true }).selectOption('SaaS')
              await page.getByLabel('Requisito que determina la decisión', { exact: true }).selectOption({ index: 1 })
              await page.getByLabel('¿Qué sigue administrando el cliente en el modelo que elegiste?', { exact: true }).selectOption({ index: 4 })
            }
            await page.getByRole('button', { name: button, exact: true }).click()
            await contrast(`${theme} ${width}: exercise ${section} with feedback`)
            if (section === 'Repartir capas') await page.screenshot({ path: path.join(folder, `${theme}-exercise-${width}.png`), fullPage: true })
          }
        }
        console.log(`PASS: ${theme} ${width}px ${subject.id}: all modules, exam setup/answers/results, progress${subject.id === 'sistemas-nube' ? ', sources and five exercise types' : ''}`)
      }
    }
  }
  assert.deepEqual(errors, [])
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  await phone.goto('http://127.0.0.1:5173')
  for (const theme of ['light', 'dark']) {
    if (await phone.locator('html').getAttribute('data-theme') !== theme) await phone.getByRole('button', { name: 'Activar modo oscuro', exact: true }).tap()
    await phone.locator('#mobile-subject').tap()
    await phone.getByRole('option', { name: studySubjects[0].title, exact: true }).tap()
    assert.equal(await phone.locator('#mobile-subject').getAttribute('aria-expanded'), 'false')
    assert.match(await phone.locator('#mobile-subject').innerText(), /Nube/)
  }
  await phone.close()
  console.log(`PASS: ${checks} contrast/layout checks; themed custom subject menus, keyboard, outside click and saved selection at 320/390/1440px. Screenshots: ${folder}`)
} finally { await browser.close() }
