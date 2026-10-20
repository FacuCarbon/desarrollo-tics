import { useEffect, useMemo, useRef, useState } from 'react'
import { studySubjects } from './data/subjects'
import { StudyWorkspace } from './components/StudyWorkspace'
import { lastSubjectKey, loadSession, loadStartup, progressImportedEvent, saveSession, sessionKey, writeProgress } from './lib/progressStorage'
import { createDistinctQuizAttempt, getQuestionPool } from './lib/quiz'
import type {
  QuizAttemptQuestion,
  StudyMode,
} from './types/study'

type QuizFeedbackMode = 'afterAll' | 'perQuestion'
function App() {
  const [initial] = useState(() => loadStartup(studySubjects))
  const [mode, setMode] = useState<StudyMode>(initial.session?.mode ?? 'home')
  const [didResume, setDidResume] = useState(Boolean(initial.session))
  const [storageConflict, setStorageConflict] = useState(false)
  const conflictRef = useRef(false)
  const previousMode = useRef(mode)
  useEffect(() => {
    if (previousMode.current !== mode) {
      document.querySelector('[data-study-content]')?.scrollIntoView({ block: 'start' })
      previousMode.current = mode
    }
  }, [mode])
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    () => initial.subject?.id ?? null,
  )
  const [selectedModuleId, setSelectedModuleId] = useState(
    () => initial.session?.selectedModuleId ?? initial.subject?.modules[0]?.id ?? '',
  )
  const [quizModuleId, setQuizModuleId] = useState<string | 'all'>(initial.session?.quizModuleId ?? 'all')
  const [quizSize, setQuizSize] = useState(initial.session?.quizSize ?? (initial.subject ? Math.min(10, initial.subject.questions.length) : 5))
  const [quizFeedbackMode, setQuizFeedbackMode] =
    useState<QuizFeedbackMode>(initial.session?.quizFeedbackMode ?? 'afterAll')
  const [pendingQuizFeedbackMode, setPendingQuizFeedbackMode] = useState<QuizFeedbackMode>('afterAll')
  const [pendingQuizModuleId, setPendingQuizModuleId] = useState<string | 'all' | null>(
    null,
  )
  const [quizAttempt, setQuizAttempt] = useState<QuizAttemptQuestion[]>(() => {
    if (initial.session?.quizAttempt.length) return initial.session.quizAttempt
    const storedSubject = initial.subject

    if (!storedSubject) {
      return []
    }

    const defaultQuizSize = Math.min(10, storedSubject.questions.length)

    return createDistinctQuizAttempt(storedSubject.questions, 'all', defaultQuizSize)
  })
  const [answers, setAnswers] = useState<Record<string, string>>(initial.session?.answers ?? {})
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>(initial.session?.revealedAnswers ?? {})
  const [submitted, setSubmitted] = useState(initial.session?.submitted ?? false)
  const [reviewedModules, setReviewedModules] = useState<string[]>(initial.session?.reviewedModules ?? [])

  useEffect(() => {
    if (!selectedSubjectId || storageConflict) return
    const persist = () => {
      if (conflictRef.current) return
      writeProgress(lastSubjectKey, selectedSubjectId)
      saveSession({ version: 1, subjectId: selectedSubjectId, mode, selectedModuleId, quizModuleId, quizSize, quizFeedbackMode, quizAttempt, answers, revealedAnswers, submitted, reviewedModules, updatedAt: new Date().toISOString() })
    }
    persist()
    window.addEventListener('pagehide', persist)
    return () => window.removeEventListener('pagehide', persist)
  }, [selectedSubjectId, mode, selectedModuleId, quizModuleId, quizSize, quizFeedbackMode, quizAttempt, answers, revealedAnswers, submitted, reviewedModules, storageConflict])

  useEffect(() => {
    const changedElsewhere = (event: StorageEvent) => {
      if (selectedSubjectId && event.key === sessionKey(selectedSubjectId)) { conflictRef.current = true; setStorageConflict(true) }
    }
    window.addEventListener('storage', changedElsewhere)
    const importing = () => { conflictRef.current = true }
    window.addEventListener(progressImportedEvent, importing)
    return () => { window.removeEventListener('storage', changedElsewhere); window.removeEventListener(progressImportedEvent, importing) }
  }, [selectedSubjectId])

  const selectedSubject = useMemo(
    () => studySubjects.find((subject) => subject.id === selectedSubjectId) ?? null,
    [selectedSubjectId],
  )

  const selectedModule = useMemo(() => {
    if (!selectedSubject) {
      return null
    }

    return (
      selectedSubject.modules.find((module) => module.id === selectedModuleId) ??
      selectedSubject.modules[0] ??
      null
    )
  }, [selectedModuleId, selectedSubject])

  const moduleQuestions = useMemo(() => {
    if (!selectedSubject || !selectedModule) {
      return []
    }

    return selectedSubject.questions.filter(
      (question) => question.moduleId === selectedModule.id,
    )
  }, [selectedModule, selectedSubject])

  const isPerQuestionMode = quizFeedbackMode === 'perQuestion'
  const unanswered = quizAttempt.length - Object.keys(answers).length
  const score = quizAttempt.reduce((accumulator, question) => {
    return answers[question.id] === question.correctOptionId ? accumulator + 1 : accumulator
  }, 0)

  const activateSubject = (subjectId: string, nextMode?: StudyMode) => {
    const nextSubject = studySubjects.find((subject) => subject.id === subjectId)

    if (!nextSubject) {
      return
    }

    const firstModuleId = nextSubject.modules[0]?.id ?? ''
    const defaultQuizSize = Math.min(10, nextSubject.questions.length)
    const saved = loadSession(nextSubject)

    setSelectedSubjectId(nextSubject.id)
    writeProgress(lastSubjectKey, nextSubject.id)
    setSelectedModuleId(saved?.selectedModuleId ?? firstModuleId)
    setQuizModuleId(saved?.quizModuleId ?? 'all')
    setQuizSize(saved?.quizSize ?? defaultQuizSize)
    setQuizFeedbackMode(saved?.quizFeedbackMode ?? 'afterAll')
    setPendingQuizModuleId(null)
    setQuizAttempt(
      saved?.quizAttempt.length ? saved.quizAttempt : createDistinctQuizAttempt(nextSubject.questions, 'all', defaultQuizSize),
    )
    setAnswers(saved?.answers ?? {})
    setRevealedAnswers(saved?.revealedAnswers ?? {})
    setSubmitted(saved?.submitted ?? false)
    setReviewedModules(saved?.reviewedModules ?? [])
    setDidResume(Boolean(saved))
    setStorageConflict(false)
    conflictRef.current = false
    setMode(nextMode ?? saved?.mode ?? 'home')
  }

  const openQuizSetup = (moduleId: string | 'all') => {
    if (!selectedSubject) {
      return
    }

    setPendingQuizModuleId(moduleId)
    setPendingQuizFeedbackMode(quizFeedbackMode)
  }

  const startQuiz = (moduleId: string | 'all', feedbackMode = quizFeedbackMode, amount = quizSize) => {
    if (!selectedSubject) {
      return
    }

    const nextPool = getQuestionPool(selectedSubject.questions, moduleId)
    const nextQuizSize = Math.min(amount, nextPool.length)
    const nextAttempt = createDistinctQuizAttempt(
      selectedSubject.questions,
      moduleId,
      nextQuizSize,
      quizAttempt,
    )

    setQuizModuleId(moduleId)
    setQuizSize(nextQuizSize)
    setQuizFeedbackMode(feedbackMode)
    setQuizAttempt(nextAttempt)
    setAnswers({})
    setRevealedAnswers({})
    setSubmitted(false)
    setPendingQuizModuleId(null)
    setMode('quiz')
  }

  const handleAnswerChange = (questionId: string, optionId: string) => {
    if (submitted || revealedAnswers[questionId]) {
      return
    }

    setAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }))

    if (isPerQuestionMode) {
      setRevealedAnswers((current) => ({
        ...current,
        [questionId]: true,
      }))
    }
  }

  return <StudyWorkspace
    subjects={studySubjects} subject={selectedSubject} module={selectedModule} mode={mode}
    onMode={setMode} onSubject={activateSubject} onModule={setSelectedModuleId}
    reviewed={reviewedModules}
    onReview={(id, checked) => setReviewedModules(checked ? [...new Set([...reviewedModules, id])] : reviewedModules.filter((item) => item !== id))}
    moduleQuestions={moduleQuestions}
    progress={{ resumed: didResume, conflict: storageConflict, currentSession: selectedSubject ? { version: 1, subjectId: selectedSubject.id, mode, selectedModuleId, quizModuleId, quizSize, quizFeedbackMode, quizAttempt, answers, revealedAnswers, submitted, reviewedModules, updatedAt: new Date().toISOString() } : null }}
    quiz={{ attempt: quizAttempt, answers, revealed: revealedAnswers, submitted, perQuestion: isPerQuestionMode, size: quizSize, moduleId: quizModuleId, score, unanswered,
      onAnswer: handleAnswerChange, onSubmit: () => setSubmitted(true), onSetup: openQuizSetup,
      pendingModule: pendingQuizModuleId, pendingFeedback: pendingQuizFeedbackMode,
      onPendingFeedback: setPendingQuizFeedbackMode, onCancel: () => setPendingQuizModuleId(null),
      onStart: (amount) => startQuiz(pendingQuizModuleId ?? 'all', pendingQuizFeedbackMode, amount),
    }}
  />
}

export default App
