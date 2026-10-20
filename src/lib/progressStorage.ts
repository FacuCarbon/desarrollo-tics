import type { QuizAttemptQuestion, StudyMode, StudySubject } from '../types/study'
import { isCalendarDate } from './studySchedule'

export const lastSubjectKey = 'study-last-subject-v1'
export const progressChangedEvent = 'study-progress-changed'
export const progressErrorEvent = 'study-progress-error'
export const progressImportedEvent = 'study-progress-imported'
export const sessionKey = (subjectId: string) => `study-session-v1:${subjectId}`
const unsavedProgress = new Map<string, unknown>()
export function hasUnsavedProgress() { return unsavedProgress.size > 0 }
export type FeedbackMode = 'afterAll' | 'perQuestion'
export interface StudySession {
  version: 1
  subjectId: string
  mode: StudyMode
  selectedModuleId: string
  quizModuleId: string
  quizSize: number
  quizFeedbackMode: FeedbackMode
  quizAttempt: QuizAttemptQuestion[]
  answers: Record<string, string>
  revealedAnswers: Record<string, boolean>
  submitted: boolean
  reviewedModules: string[]
  updatedAt: string
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
export function readProgress(key: string): unknown {
  if (unsavedProgress.has(key)) return unsavedProgress.get(key)
  try {
    const raw = localStorage.getItem(key)
    if (key === 'nube-exam-date-v1' && raw && isCalendarDate(raw)) return raw
    return JSON.parse(raw ?? 'null')
  } catch { return null }
}
export function writeProgress(key: string, value: unknown) {
  unsavedProgress.set(key, value)
  try {
    localStorage.setItem(key, key === 'nube-exam-date-v1' && typeof value === 'string' ? value : JSON.stringify(value))
    unsavedProgress.delete(key)
    window.dispatchEvent(new Event(progressChangedEvent))
    return true
  } catch {
    window.dispatchEvent(new Event(progressErrorEvent))
    return false
  }
}
export function questionSignature(question: QuizAttemptQuestion) {
  const text = JSON.stringify([question.prompt, question.correctOptionId, [...question.options].sort((a, b) => a.id.localeCompare(b.id)).map((o) => [o.id, o.text])])
  let hash = 2166136261
  for (let index = 0; index < text.length; index++) hash = Math.imul(hash ^ text.charCodeAt(index), 16777619)
  return (hash >>> 0).toString(16)
}
export function serializeSession(session: StudySession) {
  return { ...session, quizAttempt: session.quizAttempt.map((question) => ({ id: question.id, signature: questionSignature(question), options: question.options.map((option) => option.id) })) }
}

export function restoreSession(subject: StudySubject, value: unknown): StudySession | null {
  if (!isRecord(value) || value.version !== 1 || value.subjectId !== subject.id) return null
  const moduleExists = (id: unknown): id is string => typeof id === 'string' && subject.modules.some((module) => module.id === id)
  const modes: StudyMode[] = ['home', 'study', 'quiz', 'cheatsheet', 'cloud-guide', 'practice', 'progress']
  let mode: StudyMode = modes.includes(value.mode as StudyMode) ? value.mode as StudyMode : 'home'
  if ((mode === 'cloud-guide' && subject.id !== 'sistemas-nube') || (mode === 'cheatsheet' && !subject.cheatSheetSections?.length)) mode = 'home'
  const quizModuleId = value.quizModuleId === 'all' || moduleExists(value.quizModuleId) ? value.quizModuleId : 'all'
  const attempt: QuizAttemptQuestion[] = []
  const seen = new Set<string>()
  let validAttempt = Array.isArray(value.quizAttempt) && value.quizAttempt.length <= subject.questions.length
  if (Array.isArray(value.quizAttempt) && value.quizAttempt.length <= subject.questions.length) for (const saved of value.quizAttempt) {
    if (!isRecord(saved) || typeof saved.id !== 'string' || seen.has(saved.id)) { validAttempt = false; break }
    const current = subject.questions.find((question) => question.id === saved.id)
    if (!current || (quizModuleId !== 'all' && current.moduleId !== quizModuleId) || saved.signature !== questionSignature(current) || !Array.isArray(saved.options) || saved.options.length !== current.options.length || new Set(saved.options).size !== current.options.length) { validAttempt = false; break }
    const options = saved.options.map((id) => current.options.find((option) => option.id === id))
    if (options.some((option) => !option)) { validAttempt = false; break }
    seen.add(saved.id)
    attempt.push({ ...current, options: options as QuizAttemptQuestion['options'] })
  }
  if (!validAttempt) attempt.length = 0
  const answers: Record<string, string> = {}
  const revealedAnswers: Record<string, boolean> = {}
  for (const question of attempt) {
    const answer = isRecord(value.answers) ? value.answers[question.id] : undefined
    if (typeof answer === 'string' && question.options.some((option) => option.id === answer)) answers[question.id] = answer
  }
  const feedbackMode = value.quizFeedbackMode === 'perQuestion' ? 'perQuestion' : 'afterAll'
  if (feedbackMode === 'perQuestion') for (const id of Object.keys(answers)) revealedAnswers[id] = true
  const submitted = value.submitted === true && attempt.length > 0 && Object.keys(answers).length === attempt.length
  if (mode === 'quiz' && !attempt.length) mode = 'home'
  return {
    version: 1, subjectId: subject.id, mode,
    selectedModuleId: moduleExists(value.selectedModuleId) ? value.selectedModuleId : subject.modules[0]?.id ?? '',
    quizModuleId, quizSize: typeof value.quizSize === 'number' && Number.isInteger(value.quizSize) && value.quizSize > 0 ? Math.min(value.quizSize, subject.questions.length) : Math.min(10, subject.questions.length),
    quizFeedbackMode: feedbackMode, quizAttempt: attempt, answers, revealedAnswers, submitted,
    reviewedModules: Array.isArray(value.reviewedModules) ? [...new Set(value.reviewedModules.filter(moduleExists))] : [],
    updatedAt: typeof value.updatedAt === 'string' && Number.isFinite(Date.parse(value.updatedAt)) ? value.updatedAt : '',
  }
}
export function loadSession(subject: StudySubject) { return restoreSession(subject, readProgress(sessionKey(subject.id))) }
export function saveSession(session: StudySession) { return writeProgress(sessionKey(session.subjectId), serializeSession(session)) }
export function loadStartup(subjects: StudySubject[]) {
  let last = readProgress(lastSubjectKey)
  if (typeof last !== 'string') {
    try { last = sessionStorage.getItem('study-subject-id') } catch { /* First visit. */ }
  }
  const subject = subjects.find((item) => item.id === last) ?? null
  return { subject, session: subject ? loadSession(subject) : null }
}

export function compatibleValue(value: unknown, initial: unknown): boolean {
  if (Array.isArray(initial)) return Array.isArray(value) && value.every((item) => typeof item === 'string')
  if (isRecord(initial)) return isRecord(value) && Object.values(value).every((item) => typeof item === 'string') && Object.keys(initial).every((key) => typeof value[key] === 'string')
  return typeof value === typeof initial
}

const cloudKeys = ['nube-plan-v1', 'nube-layers-v1', 'nube-changes-v1', 'nube-hybrid-v1', 'nube-campus-v1', 'nube-exam-date-v1', 'nube-guide-tab-v1', 'nube-practice-section-v1', 'nube-practice-case-v1', ...Array.from({ length: 8 }, (_, i) => `nube-case-v1-${i}`)]
function allowedKeys(subjects: StudySubject[]) { return [lastSubjectKey, ...subjects.map((subject) => sessionKey(subject.id)), ...cloudKeys] }
export function createProgressBackup(subjects: StudySubject[]) {
  const data: Record<string, unknown> = {}
  for (const key of allowedKeys(subjects)) {
    const value = readProgress(key)
    if (value !== null) data[key] = value
  }
  return { format: 'preparador-progress', version: 1, exportedAt: new Date().toISOString(), data }
}
export function validateProgressBackup(value: unknown, subjects: StudySubject[]) {
  if (!isRecord(value) || value.format !== 'preparador-progress' || value.version !== 1 || !isRecord(value.data) || !Object.keys(value.data).length) throw new Error('El archivo no es una copia de avance válida.')
  const allowed = new Set(allowedKeys(subjects))
  for (const [key, entry] of Object.entries(value.data)) {
    if (!allowed.has(key)) throw new Error('La copia contiene datos que no pertenecen al avance.')
    if (key.startsWith('study-session-v1:')) {
      const subject = subjects.find((item) => sessionKey(item.id) === key)
      if (!subject || !restoreSession(subject, entry)) throw new Error('La copia contiene una materia inválida.')
    } else if (key === lastSubjectKey) {
      if (!subjects.some((subject) => subject.id === entry)) throw new Error('La materia de la copia no está disponible.')
    } else if (key === 'nube-plan-v1') {
      if (!Array.isArray(entry) || entry.some((id) => !['0', '1', '2', '3'].includes(id))) throw new Error('El avance del plan no es válido.')
    } else if (key === 'nube-exam-date-v1') {
      if (typeof entry !== 'string' || !isCalendarDate(entry)) throw new Error('La fecha de la copia no es válida.')
    } else if (key === 'nube-guide-tab-v1') {
      if (!['plan', 'tables', 'practice', 'sources'].includes(entry as string)) throw new Error('La sección de la copia no es válida.')
    } else if (key === 'nube-practice-section-v1') {
      if (!['cases', 'layers', 'changes', 'hybrid', 'campus'].includes(entry as string)) throw new Error('El ejercicio de la copia no es válido.')
    } else if (key === 'nube-practice-case-v1') {
      if (typeof entry !== 'string' || !/^[0-7]$/.test(entry)) throw new Error('El caso de la copia no es válido.')
    } else if (!isRecord(entry) || !Object.values(entry).every((item) => typeof item === 'string')) throw new Error('Las respuestas de la copia no son válidas.')
  }
  return value.data
}
export function importProgressBackup(data: Record<string, unknown>) {
  const previous = new Map<string, string | null>()
  try {
    for (const key of Object.keys(data)) previous.set(key, localStorage.getItem(key))
    for (const [key, value] of Object.entries(data)) localStorage.setItem(key, key === 'nube-exam-date-v1' ? value as string : JSON.stringify(value))
  } catch {
    for (const [key, value] of previous) {
      try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value) } catch { /* Preserve as much previous data as possible. */ }
    }
    throw new Error('No se pudo guardar la copia. Revisá el espacio o los permisos del navegador.')
  }
  // Prevent the departing page from overwriting the import with its old in-memory session.
  window.dispatchEvent(new Event(progressImportedEvent))
}
