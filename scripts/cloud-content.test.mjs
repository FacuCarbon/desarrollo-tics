import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createHash } from 'node:crypto'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const cache = new Map()
function load(relative) {
  const file = path.resolve(root, relative)
  if (cache.has(file)) return cache.get(file)
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const exports = {}
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 } }).outputText
  cache.set(file, exports)
  vm.runInNewContext(js, { exports, require: (id) => load(path.resolve(path.dirname(file), id.endsWith('.json') ? id : `${id}.ts`)) }, { filename: file })
  return exports
}
const { studySubjects } = load('src/data/subjects.ts')
const { cloudSubject, cloudCases } = load('src/data/cloudContent.ts')
const { createQuizAttempt, createDistinctQuizAttempt } = load('src/lib/quiz.ts')
const sources = load('src/data/cloudSources.json')
const { calendarDate, daysUntilExam, deadlineLabel, schedulePendingStages, isCalendarDate } = load('src/lib/studySchedule.ts')
const { evaluateCaseModel, changedCaseAlternatives } = load('src/lib/cloudPractice.ts')
const { restoreSession, serializeSession, validateProgressBackup, compatibleValue } = load('src/lib/progressStorage.ts')

test('session restore preserves question/option order, answers and independent subject data', () => {
  const attempt = createQuizAttempt(cloudSubject.questions, 'all', 5)
  const session = { version: 1, subjectId: cloudSubject.id, mode: 'quiz', selectedModuleId: 'nube-modelos', quizModuleId: 'all', quizSize: 5, quizFeedbackMode: 'perQuestion', quizAttempt: attempt, answers: { [attempt[0].id]: attempt[0].options[1].id }, revealedAnswers: { [attempt[0].id]: true }, submitted: false, reviewedModules: ['nube-modelos'], updatedAt: new Date().toISOString() }
  const saved = serializeSession(session)
  const restored = restoreSession(cloudSubject, JSON.parse(JSON.stringify(saved)))
  assert.equal(restored.mode, 'quiz')
  assert.equal(JSON.stringify(restored.quizAttempt.map((q) => [q.id, q.options.map((o) => o.id)])), JSON.stringify(attempt.map((q) => [q.id, q.options.map((o) => o.id)])))
  assert.equal(restored.answers[attempt[0].id], attempt[0].options[1].id)
  assert.equal(restored.revealedAnswers[attempt[0].id], true)
  assert.equal(restored.reviewedModules.join(','), 'nube-modelos')
  assert.equal(restoreSession(studySubjects.find((s) => s.id === 'tics'), saved), null)
  saved.quizAttempt[0].signature = 'obsolete content'
  const updated = restoreSession(cloudSubject, saved)
  assert.equal(updated.quizAttempt.length, 0)
  assert.equal(updated.mode, 'home')
  assert.equal(updated.reviewedModules.join(','), 'nube-modelos')
})

test('incomplete or malformed session/backup cannot invent a submitted result or overwrite unrelated storage', () => {
  assert.equal(restoreSession(cloudSubject, { version: 10, subjectId: cloudSubject.id }), null)
  const attempt = createQuizAttempt(cloudSubject.questions, 'all', 5)
  const saved = serializeSession({ version: 1, subjectId: cloudSubject.id, mode: 'quiz', selectedModuleId: 'missing', quizModuleId: 'all', quizSize: 5, quizFeedbackMode: 'afterAll', quizAttempt: attempt, answers: { ghost: 'a', [attempt[0].id]: 'invalid-option' }, revealedAnswers: {}, submitted: true, reviewedModules: ['missing', 'nube-red'], updatedAt: 'invalid' })
  const restored = restoreSession(cloudSubject, saved)
  assert.equal(restored.submitted, false)
  assert.equal(Object.keys(restored.answers).length, 0)
  assert.equal(restored.reviewedModules.join(','), 'nube-red')
  assert.throws(() => validateProgressBackup({ format: 'preparador-progress', version: 1, data: { authToken: 'secret' } }, studySubjects))
  assert.throws(() => validateProgressBackup({ format: 'preparador-progress', version: 1, data: { 'nube-plan-v1': 'bad' } }, studySubjects))
  assert.throws(() => validateProgressBackup({ format: 'preparador-progress', version: 1, data: { 'nube-exam-date-v1': '2026-02-30' } }, studySubjects))
  const backup = { format: 'preparador-progress', version: 1, data: { 'nube-plan-v1': ['0', '2'], 'nube-exam-date-v1': '2026-10-24', 'study-session-v1:sistemas-nube': saved } }
  assert.equal(Object.keys(validateProgressBackup(backup, studySubjects)).length, 3)
  assert.equal(compatibleValue('corrupt', []), false)
  assert.equal(compatibleValue({ reason: 1 }, { reason: '' }), false)
})

test('every cloud question has valid slide evidence and supplementary reasoning is identified', () => {
  assert.equal(cloudSubject.questions.length, 74)
  for (const question of cloudSubject.questions) {
    assert.ok(question.sourceKind, question.id)
    assert.ok(question.sources?.length, question.id)
    for (const reference of question.sources) {
      const doc = sources.find((source) => source.file === reference.file)
      assert.ok(doc, question.id)
      for (const page of reference.pages ?? []) assert.ok(doc.pages.some((sourcePage) => sourcePage.number === page), question.id)
    }
  }
  assert.equal(cloudSubject.questions.find((q) => q.id === 'nube-q-18').sourceKind, 'clarification')
  assert.match(cloudSubject.questions.find((q) => q.id === 'nube-case-2').prompt, /decide migrar a una nube pública/)
  for (const page of [30, 31, 32, 33]) assert.ok(cloudSubject.questions.some((q) => q.id.startsWith('nube-bonus-') && q.sources[0].pages.includes(page)))
})

test('case correction accepts supported alternatives instead of imposing a unique solution', () => {
  assert.equal(evaluateCaseModel(1, 'On-Premise', 'IaaS').accepted, true)
  assert.equal(evaluateCaseModel(6, 'PaaS', 'IaaS').accepted, true)
  assert.equal(evaluateCaseModel(2, 'SaaS', 'PaaS').accepted, false)
  assert.equal(evaluateCaseModel(4, 'PaaS', 'PaaS').accepted, true)
  assert.ok(changedCaseAlternatives[0].includes('On-Premise'))
  assert.ok(changedCaseAlternatives[1].includes('IaaS'))
})

test('deadline follows Buenos Aires calendar dates, including midnight and exam day', () => {
  assert.equal(calendarDate(new Date('2026-10-21T02:59:59Z')), '2026-10-20')
  assert.equal(calendarDate(new Date('2026-10-21T03:00:00Z')), '2026-10-21')
  for (const [today, expected] of [['2026-10-20', 4], ['2026-10-21', 3], ['2026-10-22', 2], ['2026-10-23', 1], ['2026-10-24', 0], ['2026-10-25', -1]]) {
    assert.equal(daysUntilExam('2026-10-24', today), expected)
  }
  assert.equal(deadlineLabel(1), 'El parcial es mañana')
  assert.equal(deadlineLabel(0), 'El parcial es hoy')
  assert.equal(deadlineLabel(-1), 'La fecha del parcial ya pasó')
  assert.equal(isCalendarDate('2026-02-30'), false)
  assert.equal(isCalendarDate('2028-02-29'), true)
})

test('schedule compresses pending stages without losing content or resetting completed work', () => {
  const original = schedulePendingStages('2026-10-20', '2026-10-24', [])
  assert.equal(Object.values(original).join(','), '2026-10-20,2026-10-21,2026-10-22,2026-10-23')
  const compressed = schedulePendingStages('2026-10-22', '2026-10-24', [])
  assert.equal(Object.keys(compressed).length, 4)
  assert.equal(new Set(Object.values(compressed)).size, 2)
  const done = ['0', '1']
  const pending = schedulePendingStages('2026-10-23', '2026-10-24', done)
  assert.equal(Object.keys(pending).join(','), '2,3')
  assert.ok(Object.values(pending).every((date) => date === '2026-10-23'))
  assert.equal(done.join(','), '0,1')
  assert.equal(Object.keys(schedulePendingStages('2026-10-24', '2026-10-24', ['0', '1', '2', '3'])).length, 0)
})

test('all existing subjects survive and every quiz has valid unique IDs and answers', () => {
  assert.equal(studySubjects.length, 4)
  for (const id of ['tics', 'mobile-frontend', 'tics-segundo-parcial', 'sistemas-nube']) assert.ok(studySubjects.find((s) => s.id === id))
  for (const subject of studySubjects) {
    assert.equal(new Set(subject.modules.map((m) => m.id)).size, subject.modules.length)
    assert.equal(new Set(subject.questions.map((q) => q.id)).size, subject.questions.length)
    for (const question of subject.questions) {
      assert.ok(subject.modules.some((m) => m.id === question.moduleId), question.id)
      assert.equal(new Set(question.options.map((o) => o.id)).size, question.options.length)
      assert.equal(question.options.filter((o) => o.id === question.correctOptionId).length, 1)
      assert.ok(question.options.every((o) => o.text && o.explanation))
    }
  }
})

test('every cloud block has theory, sources and at least five questions', () => {
  assert.equal(cloudSubject.modules.length, 7)
  assert.equal(cloudCases.length, 8)
  for (const module of cloudSubject.modules) {
    assert.ok(module.focusAreas.length >= 4)
    assert.ok(module.deepDive.length >= 3)
    assert.ok(cloudSubject.questions.filter((q) => q.moduleId === module.id).length >= 5, module.id)
    assert.ok(module.sources.length)
    for (const reference of module.sources) {
      const doc = sources.find((s) => s.file === reference.file)
      assert.ok(doc, reference.file)
      for (const page of reference.pages ?? []) assert.ok(doc.pages.some((p) => p.number === page))
    }
  }
})

test('all eight originals match import hashes and every extracted image exists', () => {
  assert.equal(sources.length, 8)
  assert.equal(sources.reduce((n, doc) => n + doc.pages.length, 0), 99)
  for (const doc of sources) {
    const original = fs.readFileSync(path.join(root, 'public', doc.href))
    assert.equal(createHash('sha256').update(original).digest('hex'), doc.sha256)
    for (const page of doc.pages) {
      for (const image of page.images ?? []) assert.ok(fs.statSync(path.join(root, 'public', image)).size > 0)
    }
  }
})

test('quizzes filter correctly, preserve grading after shuffle, and never mutate source', () => {
  const before = JSON.stringify(cloudSubject.questions)
  for (const module of cloudSubject.modules) {
    const pool = cloudSubject.questions.filter((q) => q.moduleId === module.id)
    const attempt = createQuizAttempt(cloudSubject.questions, module.id, 1000)
    assert.equal(attempt.length, pool.length)
    assert.equal(new Set(attempt.map((q) => q.id)).size, pool.length)
    assert.ok(attempt.every((q) => q.moduleId === module.id && q.options.some((o) => o.id === q.correctOptionId)))
  }
  const first = createQuizAttempt(cloudSubject.questions, 'all', 15)
  const second = createDistinctQuizAttempt(cloudSubject.questions, 'all', 15, first)
  assert.equal(second.length, 15)
  assert.notEqual(JSON.stringify(first), JSON.stringify(second))
  assert.equal(JSON.stringify(cloudSubject.questions), before)
})

test('the ambiguous game case asks about elasticity rather than imposing IaaS', () => {
  const question = cloudSubject.questions.find((q) => q.id === 'nube-case-7')
  assert.match(question.options.find((o) => o.id === question.correctOptionId).text, /IaaS o PaaS/)
})
