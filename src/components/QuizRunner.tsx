import { useState } from 'react'
import type { QuizAttemptQuestion, StudySubject } from '../types/study'
import { NotebookIcon } from './NotebookIcon'

export interface NotebookQuiz {
  attempt: QuizAttemptQuestion[]
  answers: Record<string, string>
  revealed: Record<string, boolean>
  submitted: boolean
  perQuestion: boolean
  size: number
  moduleId: string
  score: number
  unanswered: number
  onAnswer: (questionId: string, optionId: string) => void
  onSubmit: () => void
  onSetup: (moduleId: string) => void
  pendingModule: string | null
  pendingFeedback: 'afterAll' | 'perQuestion'
  onPendingFeedback: (mode: 'afterAll' | 'perQuestion') => void
  onCancel: () => void
  onStart: (size: number) => void
}

export function QuizRunner({ quiz, subject, onStudy, onPractice }: { quiz: NotebookQuiz; subject: StudySubject; onStudy: (id: string) => void; onPractice: () => void }) {
  const [cursor, setCursor] = useState(() => {
    const next = quiz.attempt.findIndex((question) => !quiz.answers[question.id])
    return next < 0 ? Math.max(0, quiz.attempt.length - 1) : next
  })
  const question = quiz.attempt[cursor]
  const module = subject.modules.find((item) => item.id === question?.moduleId)
  const errors = quiz.attempt.filter((item) => quiz.answers[item.id] !== item.correctOptionId)
  const answered = quiz.attempt.length - quiz.unanswered
  if (!question) return <div className="empty-state"><h1>Preparar un examen</h1><button className="button primary" onClick={() => quiz.onSetup('all')}>Preparar un examen</button></div>
  if (quiz.submitted) return <section className="exam-results" data-study-content>
    <p className="eyebrow">Resultado del intento</p><h1>Resultado del examen</h1>
    <div className="result-score"><strong>{quiz.score}<span> / {quiz.attempt.length}</span></strong><div><p>respuestas correctas</p><p className="muted">{errors.length ? `${errors.length} oportunidades para repasar.` : 'Resolviste todas las preguntas de este intento.'}</p></div></div>
    <div className="action-row"><button className="button primary" onClick={() => quiz.onSetup(quiz.moduleId)}>Preparar otro examen <NotebookIcon name="arrow" /></button><button className="button secondary" onClick={onPractice}>Volver a la práctica</button></div>
    <div className="section-heading"><h2>{errors.length ? 'Volvé sobre estos temas' : 'Repasá tus respuestas'}</h2><span>{errors.length || quiz.attempt.length} preguntas</span></div>
    {(errors.length ? errors : quiz.attempt).map((item, index) => {
      const correct = item.options.find((option) => option.id === item.correctOptionId)
      const chosen = item.options.find((option) => option.id === quiz.answers[item.id])
      return <article className="review-item" key={item.id}><span className="item-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{item.prompt}</h3>{errors.length > 0 && <p className="muted">Tu respuesta: {chosen?.text}</p>}<p><strong>Respuesta:</strong> {correct?.text}</p><p className="muted">{item.correctFeedback}</p><button className="text-button" onClick={() => onStudy(item.moduleId)}>Leer el tema <NotebookIcon name="arrow" size={16} /></button></div></article>
    })}
    {errors.length > 0 && <details className="source-details"><summary>Ver también las respuestas acertadas</summary>{quiz.attempt.filter((item) => quiz.answers[item.id] === item.correctOptionId).map((item) => <div key={item.id} className="review-answer"><h3>{item.prompt}</h3><p>{item.correctFeedback}</p></div>)}</details>}
  </section>
  const revealed = quiz.submitted || Boolean(quiz.revealed[question.id])
  const selected = quiz.answers[question.id]
  const correct = selected === question.correctOptionId
  return <section className="exam-sheet" data-study-content>
    <div className="exam-heading"><div><p className="eyebrow">{quiz.perQuestion ? 'Práctica guiada' : 'Simulación de parcial'}</p><h1>{quiz.moduleId === 'all' ? 'Examen mixto' : subject.modules.find((item) => item.id === quiz.moduleId)?.title}</h1></div><span className="quiet-badge">{answered} de {quiz.attempt.length} respondidas</span></div>
    <div className="exam-track" aria-label="Preguntas del examen">{quiz.attempt.map((item, index) => <button key={item.id} type="button" aria-label={`Ir a pregunta ${index + 1}${quiz.answers[item.id] ? ', respondida' : ''}`} aria-current={index === cursor ? 'step' : undefined} className={`${index === cursor ? 'is-current' : ''} ${quiz.answers[item.id] ? 'is-answered' : ''}`} onClick={() => setCursor(index)}>{index + 1}</button>)}</div>
    <div className="question-context"><span>Pregunta {String(cursor + 1).padStart(2, '0')}</span><span>{module?.shortLabel}</span></div>
    <fieldset className="question"><legend>{question.prompt}</legend><div className="answer-options">{question.options.map((option, index) => {
      const isSelected = selected === option.id
      const isCorrect = revealed && option.id === question.correctOptionId
      const isWrong = revealed && isSelected && !isCorrect
      return <label key={option.id} className={`answer-option ${isSelected ? 'is-selected' : ''} ${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}`}><input type="radio" name={question.id} checked={isSelected} disabled={revealed} onChange={() => quiz.onAnswer(question.id, option.id)} value={option.id} /><span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span>{option.text}</span>{isCorrect && <NotebookIcon name="check" />}</label>
    })}</div></fieldset>
    {revealed && <div role="status" className={`answer-feedback ${correct ? 'correct' : 'incorrect'}`}><h3>{correct ? 'Respuesta correcta' : 'Respuesta incorrecta'}</h3><p>{correct ? question.correctFeedback : question.incorrectFeedback}</p><p className="muted">{question.options.find((option) => option.id === selected)?.explanation}</p><details><summary>Entender todas las alternativas</summary>{question.options.map((option) => <p key={option.id}><strong>{option.text}</strong> {option.explanation}</p>)}</details>{question.sources?.length ? <p className="source-caption">{question.sourceKind === 'clarification' ? 'Aclaración técnica' : question.sourceKind === 'practice' ? 'Adaptación de la actividad' : 'Material de clase'} · {question.sources.map((source) => `${source.file} (${source.pages?.join(', ') ?? ''})`).join('; ')}</p> : null}</div>}
    <div className="exam-navigation"><button className="button secondary" disabled={cursor === 0} onClick={() => setCursor(cursor - 1)}>Anterior</button><span className="muted">{cursor + 1} / {quiz.attempt.length}</span>{cursor < quiz.attempt.length - 1 ? <button className="button primary" onClick={() => setCursor(cursor + 1)}>Siguiente <NotebookIcon name="arrow" size={17} /></button> : <button className="button primary" disabled={quiz.unanswered > 0} onClick={quiz.onSubmit}>{quiz.perQuestion ? 'Ver resultado' : 'Corregir examen'}</button>}</div>
    {cursor === quiz.attempt.length - 1 && quiz.unanswered > 0 && <p className="inline-note">Quedan {quiz.unanswered} preguntas sin responder. Podés volver a ellas desde los números de arriba.</p>}
    <p className="exam-save-note">Podés salir y volver: este intento se guarda con tus respuestas.</p>
  </section>
}
