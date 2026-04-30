import { useMemo, useState } from 'react'
import { quizQuestions, studyModules } from './data/ticsContent'
import { createDistinctQuizAttempt, getQuestionPool } from './lib/quiz'
import type {
  QuestionOption,
  QuizAttemptQuestion,
  StudyMode,
} from './types/study'

const quizSizeOptions = [5, 10, 15]

function App() {
  const defaultQuizSize = Math.min(10, quizQuestions.length)
  const [mode, setMode] = useState<StudyMode>('home')
  const [selectedModuleId, setSelectedModuleId] = useState(studyModules[0].id)
  const [quizModuleId, setQuizModuleId] = useState<string | 'all'>('all')
  const [quizSize, setQuizSize] = useState(defaultQuizSize)
  const [quizAttempt, setQuizAttempt] = useState<QuizAttemptQuestion[]>(() =>
    createDistinctQuizAttempt('all', defaultQuizSize),
  )
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const selectedModule = useMemo(
    () => studyModules.find((module) => module.id === selectedModuleId) ?? studyModules[0],
    [selectedModuleId],
  )

  const moduleQuestions = useMemo(
    () => quizQuestions.filter((question) => question.moduleId === selectedModule.id),
    [selectedModule.id],
  )
  const activePool = useMemo(() => getQuestionPool(quizModuleId), [quizModuleId])
  const activeQuizSizeOptions = useMemo(() => {
    return quizSizeOptions.filter((size) => size < activePool.length)
  }, [activePool.length])

  const unanswered = quizAttempt.length - Object.keys(answers).length
  const score = quizAttempt.reduce((accumulator, question) => {
    return answers[question.id] === question.correctOptionId ? accumulator + 1 : accumulator
  }, 0)

  const startQuiz = (moduleId: string | 'all') => {
    const nextPool = getQuestionPool(moduleId)
    const nextQuizSize = Math.min(quizSize, nextPool.length)
    const nextAttempt = createDistinctQuizAttempt(moduleId, nextQuizSize, quizAttempt)
    setQuizModuleId(moduleId)
    setQuizSize(nextQuizSize)
    setQuizAttempt(nextAttempt)
    setAnswers({})
    setSubmitted(false)
    setMode('quiz')
  }

  const updateQuizSize = (nextSize: number) => {
    const safeQuizSize = Math.min(nextSize, activePool.length)
    const nextAttempt = createDistinctQuizAttempt(quizModuleId, safeQuizSize, quizAttempt)
    setQuizSize(safeQuizSize)
    setQuizAttempt(nextAttempt)
    setAnswers({})
    setSubmitted(false)
  }

  const handleAnswerChange = (questionId: string, optionId: string) => {
    if (submitted) {
      return
    }

    setAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }))
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1d4ed8_0%,#0f172a_38%,#020617_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
                  Preparador TICs
                </p>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Modo estudio + modo parcial con preguntas aleatorias
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Preparado sobre el resumen de TIC, redes, protocolos y Linux, más
                  los dos temas aislados que marcó el profe: configuración de red y
                  ejercicio de comandos. Si responde mal, explicamos el error; si
                  responde bien, profundizamos para que no se quede solo con memoria.
                </p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-200 sm:grid-cols-3 lg:w-[26rem] lg:grid-cols-1">
                <MetricCard label="Módulos" value={String(studyModules.length)} />
                <MetricCard label="Preguntas cargadas" value={String(quizQuestions.length)} />
                <MetricCard label="Examen actual" value={`${quizSize} preguntas random`} />
              </div>
            </div>

            <nav className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setMode('home')}
                className={getNavButtonClass(mode === 'home')}
              >
                Inicio
              </button>
              <button
                type="button"
                onClick={() => setMode('study')}
                className={getNavButtonClass(mode === 'study')}
              >
                Profundizar por módulo
              </button>
              <button
                type="button"
                onClick={() => startQuiz('all')}
                className={getNavButtonClass(mode === 'quiz')}
              >
                Hacer examen random
              </button>
              <a
                href="/resumen-tic.pdf"
                download="resumen-tic.pdf"
                className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/15"
              >
                Descargar resumen PDF
              </a>
            </nav>
          </div>

          {mode === 'home' ? (
            <section className="space-y-5 px-4 py-6 sm:px-8">
              <div className="rounded-[1.75rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  Cómo funciona
                </p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-200">
                  <p>1. Se elige un módulo para estudiar y profundizar ideas clave.</p>
                  <p>2. O se arranca un examen con preguntas y opciones mezcladas.</p>
                  <p>3. La corrección siempre devuelve una explicación útil.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {studyModules.map((module) => (
                  <article
                    key={module.id}
                    className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {module.shortLabel}
                    </p>
                    <h2 className="mt-3 text-xl font-bold text-white">
                      {module.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {module.summary}
                    </p>
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModuleId(module.id)
                          setMode('study')
                        }}
                        className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 sm:w-auto"
                      >
                        Estudiar módulo
                      </button>
                      <button
                        type="button"
                        onClick={() => startQuiz(module.id)}
                        className="w-full rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-200 hover:text-cyan-100 sm:w-auto"
                      >
                        Quiz de este módulo
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {mode === 'study' ? (
            <section className="grid gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[18rem_1fr]">
              <aside className="space-y-3 rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-4">
                <p className="px-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  Elegí un módulo
                </p>
                {studyModules.map((module) => (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => setSelectedModuleId(module.id)}
                    className={`w-full rounded-2xl px-4 py-4 text-left transition ${
                      module.id === selectedModule.id
                        ? 'bg-cyan-300/15 text-white ring-1 ring-cyan-300/40'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {module.shortLabel}
                    </p>
                    <p className="mt-2 text-base font-semibold">{module.title}</p>
                  </button>
                ))}
              </aside>

              <div className="space-y-6">
                <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                    Profundización
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-white">
                    {selectedModule.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                    {selectedModule.summary}
                  </p>

                  <div className="mt-6 grid gap-4 xl:grid-cols-3">
                    <StudyCard title="Qué no puede faltar" items={selectedModule.focusAreas} />
                    <StudyCard title="Cómo profundizar" items={selectedModule.deepDive} />
                    <StudyCard title="Cómo practicar" items={selectedModule.practiceTips} />
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
                        Entrenamiento rápido
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-white">
                        Posibles preguntas de este módulo
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => startQuiz(selectedModule.id)}
                      className="w-full rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 sm:w-auto"
                    >
                      Probarme en este módulo
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {moduleQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Pregunta {index + 1}
                        </p>
                        <p className="mt-2 text-base font-semibold text-white">
                          {question.prompt}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          Respuesta esperada:{' '}
                          {getCorrectOption(question.options, question.correctOptionId)?.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          ) : null}

          {mode === 'quiz' ? (
            <section className="px-4 py-6 sm:px-8">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">
                      Simulación de parcial
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-white">
                      {quizModuleId === 'all'
                        ? 'Examen mixto de todos los módulos'
                        : `Examen sobre ${studyModules.find((module) => module.id === quizModuleId)?.title}`}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                      Cada intento mezcla preguntas y respuestas para que la práctica
                      no salga igual. Elegí una opción por consigna y corregí cuando
                      quieras.
                    </p>
                  </div>

                  <div className="grid w-full gap-3 lg:flex lg:w-auto lg:flex-wrap lg:items-end">
                    <label className="flex min-w-0 flex-col gap-2 text-sm text-slate-300 lg:min-w-[15rem]">
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Cantidad de preguntas
                      </span>
                      <select
                        value={quizSize}
                        onChange={(event) => updateQuizSize(Number(event.target.value))}
                        className="w-full rounded-full border border-white/15 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {activeQuizSizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {size} preguntas
                          </option>
                        ))}
                        <option value={activePool.length}>
                          Todas las disponibles ({activePool.length})
                        </option>
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => startQuiz(quizModuleId)}
                      className="w-full rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-200 hover:text-cyan-100 lg:w-auto"
                    >
                      Generar otro examen
                    </button>
                    <button
                      type="button"
                      onClick={() => startQuiz('all')}
                      className="w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 lg:w-auto"
                    >
                      Mezclar todos los módulos
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    Preguntas: {quizAttempt.length}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    Sin responder: {submitted ? 0 : unanswered}
                  </span>
                  {submitted ? (
                    <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-emerald-100">
                      Puntaje: {score}/{quizAttempt.length}
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 space-y-5">
                  {quizAttempt.map((question, index) => {
                    const selectedOptionId = answers[question.id]
                    const isCorrect = selectedOptionId === question.correctOptionId
                    const selectedOption = question.options.find(
                      (option) => option.id === selectedOptionId,
                    )

                    return (
                      <article
                        key={question.id}
                        className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Pregunta {index + 1}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-white">
                          {question.prompt}
                        </h3>

                        <div className="mt-4 grid gap-3">
                          {question.options.map((option) => {
                            const checked = selectedOptionId === option.id
                            const showCorrect = submitted && option.id === question.correctOptionId
                            const showIncorrect = submitted && checked && option.id !== question.correctOptionId

                            return (
                              <label
                                key={option.id}
                                className={`cursor-pointer rounded-2xl border p-4 transition ${
                                  showCorrect
                                    ? 'border-emerald-300/40 bg-emerald-300/10'
                                    : showIncorrect
                                      ? 'border-rose-300/40 bg-rose-300/10'
                                      : checked
                                        ? 'border-cyan-300/40 bg-cyan-300/10'
                                        : 'border-white/10 bg-slate-950/30 hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value={option.id}
                                    checked={checked}
                                    disabled={submitted}
                                    onChange={() => handleAnswerChange(question.id, option.id)}
                                    className="peer sr-only"
                                  />
                                  <span
                                    aria-hidden="true"
                                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                                      showCorrect
                                        ? 'border-emerald-200 bg-emerald-200/20'
                                        : showIncorrect
                                          ? 'border-rose-200 bg-rose-200/20'
                                          : checked
                                            ? 'border-cyan-200 bg-cyan-200/20'
                                            : 'border-slate-400/70 bg-slate-900/80'
                                    }`}
                                  >
                                    <span
                                      className={`h-2.5 w-2.5 rounded-full transition ${
                                        checked
                                          ? showCorrect
                                            ? 'bg-emerald-100'
                                            : showIncorrect
                                              ? 'bg-rose-100'
                                              : 'bg-cyan-100'
                                          : 'bg-transparent'
                                      }`}
                                    />
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium text-white">{option.text}</p>
                                    {submitted ? (
                                      <p className="mt-2 text-sm leading-6 text-slate-300">
                                        {option.explanation}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              </label>
                            )
                          })}
                        </div>

                        {submitted && selectedOption ? (
                          <div
                            className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${
                              isCorrect
                                ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-50'
                                : 'border-rose-300/35 bg-rose-300/10 text-rose-50'
                            }`}
                          >
                            <p className="font-bold">
                              {isCorrect ? 'Respuesta correcta' : 'Respuesta incorrecta'}
                            </p>
                            <p className="mt-2">
                              {isCorrect
                                ? question.correctFeedback
                                : question.incorrectFeedback}
                            </p>
                          </div>
                        ) : null}
                      </article>
                    )
                  })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={submitted || unanswered > 0}
                    onClick={() => setSubmitted(true)}
                    className="w-full rounded-full bg-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 sm:w-auto"
                  >
                    Corregir examen
                  </button>
                  {submitted ? (
                    <button
                      type="button"
                      onClick={() => startQuiz(quizModuleId)}
                      className="w-full rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-200 hover:text-cyan-100 sm:w-auto"
                    >
                      Intentar otra versión
                    </button>
                  ) : (
                    <p className="self-center text-sm text-slate-400">
                      Respondé todo para habilitar la corrección.
                    </p>
                  )}
                </div>
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </main>
  )
}

function getNavButtonClass(isActive: boolean) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-white text-slate-950'
      : 'border border-white/15 bg-white/5 text-slate-200 hover:border-white/30 hover:bg-white/10'
  }`
}

function getCorrectOption(options: QuestionOption[], correctOptionId: string) {
  return options.find((option) => option.id === correctOptionId)
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function StudyCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </section>
  )
}

export default App
