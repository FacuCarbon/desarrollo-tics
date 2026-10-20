import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ProgressTools } from './ProgressTools'
import { SubjectPicker } from './SubjectPicker'
import { QuizRunner } from './QuizRunner'
import type { NotebookQuiz } from './QuizRunner'
import { NotebookIcon } from './NotebookIcon'
import type { NotebookIconName } from './NotebookIcon'
import { useSaved } from '../lib/useSaved'
import { useCloudExamTiming } from '../lib/useCloudExamTiming'
import { deadlineLabel, formatStudyDate } from '../lib/studySchedule'
import type { StudySession } from '../lib/progressStorage'
import type { QuizQuestion, StudyMode, StudyModule, StudySubject } from '../types/study'

const CloudGuide = lazy(() => import('./CloudGuide').then((module) => ({ default: module.CloudGuide })))
const SourceReader = lazy(() => import('./CloudGuide').then((module) => ({ default: module.SourceReader })))

type GuideView = 'plan' | 'tables' | 'practice' | 'sources'
interface Props {
  subjects: StudySubject[]
  subject: StudySubject | null
  module: StudyModule | null
  mode: StudyMode
  onMode: (mode: StudyMode) => void
  onSubject: (id: string, mode?: StudyMode) => void
  onModule: (id: string) => void
  reviewed: string[]
  onReview: (id: string, checked: boolean) => void
  moduleQuestions: QuizQuestion[]
  progress: { resumed: boolean; conflict: boolean; currentSession: StudySession | null }
  quiz: NotebookQuiz
}

export function StudyWorkspace({ subjects, subject, module, mode, onMode, onSubject, onModule, reviewed, onReview, moduleQuestions, progress, quiz }: Props) {
  const [theme, setTheme] = useSaved('study-theme-v1', 'light', (value) => value === 'light' || value === 'dark')
  const [guideView, setGuideView] = useSaved('nube-guide-tab-v1', 'plan', (value) => ['plan', 'tables', 'practice', 'sources'].includes(value))
  const [practiceModule, setPracticeModule] = useState('all')
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const active = mode === 'quiz' || mode === 'practice' || (mode === 'cloud-guide' && guideView === 'practice') ? 'practice' : mode === 'progress' || (mode === 'cloud-guide' && guideView === 'plan') ? 'progress' : 'study'
  const isCloud = subject?.id === 'sistemas-nube'
  const openModule = (id: string) => { onModule(id); onMode('study') }
  const openGuide = (view: GuideView) => { setGuideView(view); onMode('cloud-guide') }
  const navigation: { id: string; title: string; icon: NotebookIconName; mode: StudyMode }[] = [
    { id: 'study', title: 'Estudiar', icon: 'book', mode: 'home' },
    { id: 'practice', title: 'Practicar', icon: 'practice', mode: 'practice' },
    { id: 'progress', title: 'Mi avance', icon: 'progress', mode: 'progress' },
  ]
  const moduleIndex = subject?.modules.findIndex((item) => item.id === module?.id) ?? 0
  const examComplete = quiz.submitted || (quiz.perQuestion && quiz.unanswered === 0 && Object.keys(quiz.answers).length > 0)
  const hasAnswers = Object.keys(quiz.answers).length > 0
  const progressTools = (compact = false) => subject && progress.currentSession ? <ProgressTools subjects={subjects} resumed={progress.resumed} conflict={progress.conflict} currentSession={progress.currentSession} compact={compact} /> : null

  return <div className="notebook-app">
    <a className="skip-link" href="#workspace-content">Ir al contenido</a>
    <aside className="notebook-sidebar">
      <a className="notebook-brand" href="#" onClick={(event) => { event.preventDefault(); onMode('home') }}><span className="brand-mark"><NotebookIcon name="book" size={23} /></span><span>Apuntes<small>Teoría y práctica</small></span></a>
      <span className="subject-label" id="subject-picker-label">Tu materia</span>
      <SubjectPicker id="subject-picker" subjects={subjects} value={subject?.id ?? ''} onChange={onSubject} />
      <nav className="main-navigation" aria-label="Navegación principal">{navigation.map((item) => <button key={item.id} type="button" disabled={!subject} aria-current={active === item.id ? 'page' : undefined} onClick={() => onMode(item.mode)}><NotebookIcon name={item.icon} /><span>{item.title}</span>{active === item.id && <span className="nav-indicator" />}</button>)}</nav>
      {subject && <div className="sidebar-index"><p className="eyebrow">Índice de la materia <span>{subject.modules.length}</span></p>{subject.modules.map((item, index) => <button key={item.id} type="button" className={mode === 'study' && module?.id === item.id ? 'is-current' : ''} onClick={() => openModule(item.id)}><span className={`module-index ${reviewed.includes(item.id) ? 'is-reviewed' : ''}`}>{reviewed.includes(item.id) ? <NotebookIcon name="check" size={13} /> : String(index + 1).padStart(2, '0')}</span><span>{item.title}</span></button>)}</div>}
      <div className="sidebar-bottom">{progressTools(true)}<p className="sidebar-footnote">El avance se guarda en este navegador.</p></div>
    </aside>

    <div className="notebook-main">
      <header className="notebook-topbar"><div className="topbar-context"><span className="mobile-brand"><NotebookIcon name="book" /> Apuntes</span><span className="desktop-context">Preparador de materias</span><span className="context-divider">/</span><span>{subject?.shortLabel ?? 'Materias'}</span></div><button type="button" className="icon-button" aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'} title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}><NotebookIcon name={theme === 'light' ? 'moon' : 'sun'} /></button></header>
      <div className="mobile-subject"><span id="mobile-subject-label">Materia</span><SubjectPicker id="mobile-subject" subjects={subjects} value={subject?.id ?? ''} onChange={onSubject} /></div>
      {subject && active === 'study' && <nav className="study-subnav" aria-label="Recursos para estudiar"><button aria-current={mode === 'home' || mode === 'study' ? 'page' : undefined} onClick={() => onMode('home')}>Módulos</button>{isCloud && <button aria-current={mode === 'cloud-guide' && guideView === 'tables' ? 'page' : undefined} onClick={() => openGuide('tables')}>Tablas comparativas</button>}{subject.cheatSheetSections?.length ? <button aria-current={mode === 'cheatsheet' ? 'page' : undefined} onClick={() => onMode('cheatsheet')}>Repaso express</button> : null}{isCloud && <button aria-current={mode === 'cloud-guide' && guideView === 'sources' ? 'page' : undefined} onClick={() => openGuide('sources')}>Material de clase</button>}{subject.summaryPdf && <a href={subject.summaryPdf} download>Resumen PDF</a>}</nav>}
      <main id="workspace-content" className={`workspace-content ${mode === 'study' ? 'reading-workspace' : ''}`} tabIndex={-1}>
        {!subject ? <section className="welcome-page" data-study-content><p className="eyebrow">Material de estudio</p><h1>¿Qué materia<br />vas a preparar?</h1><p className="page-intro">Apuntes de clase, ejercicios y preguntas para practicar los parciales.</p><div className="subject-library">{subjects.map((item, index) => <button key={item.id} className="library-subject" onClick={() => onSubject(item.id, 'home')}><span className="item-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{item.title}</strong><small>{item.modules.length} módulos · {item.questions.length} preguntas</small></span><NotebookIcon name="arrow" /></button>)}</div></section> : <>
          {mode === 'home' && <section className="overview-page" data-study-content>
            <div className="page-heading"><p className="eyebrow">{progress.resumed ? 'Retomar estudio' : 'Apuntes de clase'}</p><h1>{subject.id === 'sistemas-nube' ? 'Sistemas en la nube' : subject.title}</h1><p className="page-intro">{subject.modules.length} módulos · {subject.questions.length} preguntas para practicar{isCloud ? ' · Actividad práctica de clase 5' : ''}</p></div>
            <div className="overview-layout"><div>
              <article className="continue-reading"><span className="bookmark-tab" aria-hidden="true" /><p className="eyebrow">{reviewed.length ? 'Continuar lectura' : 'Empezá por acá'} · módulo {String(moduleIndex + 1).padStart(2, '0')}</p><h2>{module?.title}</h2><p>{module?.summary}</p><button className="button primary" onClick={() => onMode('study')}>{progress.resumed ? 'Continuar estudiando' : 'Abrir el módulo'}<NotebookIcon name="arrow" size={17} /></button><div className="reading-progress"><span>{reviewed.length} de {subject.modules.length} módulos repasados</span><div className="progress-line"><span style={{ width: `${reviewed.length / subject.modules.length * 100}%` }} /></div></div></article>
              <div className="section-heading"><h2>Recorrido de la materia</h2><span>{subject.modules.length} módulos</span></div>
              <div className="module-list">{subject.modules.map((item, index) => <button key={item.id} className="module-row" onClick={() => openModule(item.id)}><span className={`item-number ${reviewed.includes(item.id) ? 'done' : ''}`}>{reviewed.includes(item.id) ? <NotebookIcon name="check" size={18} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.title}</strong><small>{reviewed.includes(item.id) ? 'Repasado' : item.shortLabel.replace(/^\d+ · /, '')}</small></span><NotebookIcon name="arrow" size={18} /></button>)}</div>
            </div><aside className="overview-aside">{isCloud && <ExamNote onPlan={() => openGuide('plan')} />}
              <section className="margin-note"><p className="eyebrow">Práctica</p><h3>Multiple choice</h3><p>Elegí los temas y la cantidad de preguntas. Podés corregir al final o después de cada respuesta.</p><button className="text-button" onClick={() => onMode('practice')}>Preparar un intento <NotebookIcon name="arrow" size={16} /></button></section>
              {hasAnswers && <section className="margin-note"><p className="eyebrow">Tu último intento</p><h3>{examComplete ? `${quiz.score} de ${quiz.attempt.length} correctas` : `${Object.keys(quiz.answers).length} de ${quiz.attempt.length} respondidas`}</h3><button className="text-button" onClick={() => onMode('quiz')}>{examComplete ? 'Ver mis respuestas' : 'Continuar examen'}<NotebookIcon name="arrow" size={16} /></button></section>}
            </aside></div>
          </section>}

          {mode === 'study' && module && <section className="reading-page" data-study-content>
            <div className="reading-breadcrumb"><button className="text-button" onClick={() => onMode('home')}>Todos los módulos</button><span>/</span><span>{String(moduleIndex + 1).padStart(2, '0')} de {subject.modules.length}</span></div>
            <div className="mobile-module-label"><label htmlFor="reading-module">Cambiar de módulo</label><select id="reading-module" value={module.id} onChange={(event) => onModule(event.target.value)}>{subject.modules.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.title}</option>)}</select></div>
            <header className="reading-heading"><p className="eyebrow">Módulo {String(moduleIndex + 1).padStart(2, '0')} · {subject.shortLabel}</p><h1>{module.title}</h1><p className="reading-lead">{module.summary}</p><div className="reading-tools"><label className="review-toggle"><input type="checkbox" checked={reviewed.includes(module.id)} onChange={(event) => onReview(module.id, event.target.checked)} />Marcar como repasado</label><button className="text-button" onClick={() => quiz.onSetup(module.id)}>Practicar este tema <NotebookIcon name="arrow" size={16} /></button></div></header>
            {isCloud && module.id === 'nube-modelos' && <div className="reading-callout"><NotebookIcon name="file" /><div><strong>Tené la comparación a mano.</strong><p>Responsabilidades, diferencias y criterios de elección en un solo lugar.</p></div><button className="text-button" onClick={() => openGuide('tables')}>Abrir tablas <NotebookIcon name="arrow" size={16} /></button></div>}
            <div className="reading-body"><ReadingSection number="01" title="Las ideas centrales" items={module.focusAreas} /><ReadingSection number="02" title="Para entenderlo mejor" items={module.deepDive} />
              {module.examples?.length ? <section className="reading-section"><p className="section-number">03 / Ejemplos</p><h2>Ejemplos del tema</h2>{module.examples.map((example) => <div className="code-example" key={example.title}><h3>{example.title}</h3><p>{example.description}</p><pre><code>{example.code}</code></pre></div>)}</section> : null}
              <section className="reading-section practice-note"><p className="section-number">Práctica del módulo</p><h2>Para repasar</h2><ul>{module.practiceTips.map((tip) => <li key={tip}>{tip}</li>)}</ul><button className="button primary" onClick={() => quiz.onSetup(module.id)}>Practicar este módulo <NotebookIcon name="arrow" size={17} /></button></section>
              {module.supplementary?.length ? <details className="source-details"><summary>Aclaraciones técnicas complementarias</summary><p className="muted">Ayudan a interpretar las clases; no confirman preguntas del parcial.</p>{module.supplementary.map((note) => <div className="reference-note" key={note.title}><h3>{note.title}</h3><p>{note.text}</p><a href={note.href} target="_blank" rel="noreferrer">Consultar la referencia</a></div>)}</details> : null}
              {module.sources?.length ? <details className="source-details"><summary>Consultar el material de este módulo</summary>{module.sources.map((source) => <Suspense key={source.file} fallback={<p className="muted">Cargando material…</p>}><SourceReader files={[source.file]} pageNumbers={source.pages} /></Suspense>)}</details> : null}
              <details className="source-details"><summary>Preguntas de repaso · {moduleQuestions.length}</summary>{moduleQuestions.map((question) => <details className="review-answer" key={question.id}><summary>{question.prompt}</summary><p>{question.options.find((option) => option.id === question.correctOptionId)?.text}</p><p className="muted">{question.correctFeedback}</p></details>)}</details>
            </div>
            <div className="reading-navigation"><button className="button secondary" disabled={moduleIndex === 0} onClick={() => openModule(subject.modules[moduleIndex - 1].id)}>Módulo anterior</button>{moduleIndex < subject.modules.length - 1 && <button className="button primary" onClick={() => openModule(subject.modules[moduleIndex + 1].id)}>Siguiente módulo <NotebookIcon name="arrow" size={17} /></button>}</div>
          </section>}

          {mode === 'practice' && <section className="practice-page" data-study-content><div className="page-heading"><p className="eyebrow">Entrenamiento</p><h1>Práctica</h1><p className="page-intro">Elegí un examen de preguntas o resolvé los casos de la actividad. Las respuestas incluyen corrección y explicación.</p></div>
            {hasAnswers && <div className="resume-exam"><div><p className="eyebrow">{examComplete ? 'Último resultado' : 'Tu examen sigue acá'}</p><h3>{examComplete ? `${quiz.score} de ${quiz.attempt.length} respuestas correctas` : `${Object.keys(quiz.answers).length} de ${quiz.attempt.length} respuestas guardadas`}</h3></div><button className="button secondary" onClick={() => onMode('quiz')}>{examComplete ? 'Revisar resultado' : 'Continuar examen'}<NotebookIcon name="arrow" size={17} /></button></div>}
            <div className="practice-choices"><article className="practice-choice"><span className="choice-index">01 / Preguntas</span><NotebookIcon name="practice" size={29} /><h2>Preguntas multiple choice</h2><p>Mezclá los temas o elegí uno puntual. Las preguntas y alternativas cambian de orden en cada intento.</p><div className="practice-module-control"><label htmlFor="practice-module">¿Qué querés practicar?</label><select id="practice-module" value={practiceModule} onChange={(event) => setPracticeModule(event.target.value)}><option value="all">Todos los módulos</option>{subject.modules.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></div><button className="button primary" onClick={() => quiz.onSetup(practiceModule)}>Preparar examen <NotebookIcon name="arrow" size={17} /></button><small>{subject.questions.length} preguntas disponibles en esta materia.</small></article>
              {isCloud && <article className="practice-choice case-choice"><span className="choice-index">02 / Casos y decisiones</span><NotebookIcon name="file" size={29} /><h2>Actividad práctica de Nube</h2><p>Casos de IaaS, PaaS, SaaS y On-Premise. Repartí responsabilidades, revisá condiciones y diseñá una solución.</p><ul><li>8 escenarios de la actividad</li><li>Capas, cambios y seguridad</li><li>Corrección explicada y notas propias</li></ul><button className="button secondary" onClick={() => openGuide('practice')}>Resolver ejercicios <NotebookIcon name="arrow" size={17} /></button></article>}
            </div></section>}

          {mode === 'quiz' && <QuizRunner key={quiz.attempt.map((item) => `${item.id}:${item.options.map((option) => option.id).join('')}`).join('|')} quiz={quiz} subject={subject} onStudy={openModule} onPractice={() => onMode('practice')} />}

          {mode === 'progress' && <section className="progress-page" data-study-content><div className="page-heading"><p className="eyebrow">Progreso por materia</p><h1>Mi avance</h1><p className="page-intro">Módulos repasados, plan de estudio y copias de tu progreso.</p></div><div className="progress-summary"><div><strong>{reviewed.length}<span> / {subject.modules.length}</span></strong><p>módulos marcados como repasados</p></div><div className="progress-summary-track"><div className="progress-line"><span style={{ width: `${reviewed.length / subject.modules.length * 100}%` }} /></div><p>{reviewed.length === subject.modules.length ? 'Recorriste todos los módulos. Volvé a los que necesites reforzar.' : `${subject.modules.length - reviewed.length} módulos para seguir recorriendo.`}</p></div></div>
            <section className="progress-storage-section"><h2>Guardado y copias de respaldo</h2>{progressTools()}</section>{isCloud && <section className="plan-section"><div className="section-heading"><h2>Organizá lo que sigue</h2><span>Plan de estudio</span></div><Suspense fallback={<p className="muted">Cargando el plan…</p>}><CloudGuide view="plan" onStudy={openModule} onQuiz={quiz.onSetup} /></Suspense></section>}
          </section>}

          {mode === 'cheatsheet' && <section className="recap-page" data-study-content><div className="page-heading"><p className="eyebrow">Repaso express</p><h1>Repaso express</h1><p className="page-intro">Una pasada breve para recordar lo que ya estudiaste. Volvé al módulo si algo necesita más contexto.</p></div>{subject.cheatSheetSections?.map((section, index) => <article key={section.title} className="recap-section"><span className="section-number">{String(index + 1).padStart(2, '0')}</span><div><h2>{section.title}</h2><ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></article>)}</section>}

          {mode === 'cloud-guide' && isCloud && <section className="guide-page" data-study-content><div className="reading-breadcrumb"><button className="text-button" onClick={() => onMode(guideView === 'practice' ? 'practice' : guideView === 'plan' ? 'progress' : 'home')}>{guideView === 'practice' ? 'Toda la práctica' : guideView === 'plan' ? 'Mi avance' : 'Estudiar'}</button><span>/</span><span>{({ plan: 'Plan de estudio', tables: 'Tablas', practice: 'Ejercicios', sources: 'Material de clase' } as Record<string, string>)[guideView]}</span></div><div className="page-heading"><p className="eyebrow">Sistemas en la nube</p><h1>{({ plan: 'Plan de estudio', tables: 'Modelos y responsabilidades', practice: 'Ejercicios de Nube', sources: 'Material de clase' } as Record<string, string>)[guideView]}</h1></div><Suspense fallback={<p className="muted">Cargando material…</p>}><CloudGuide view={guideView as GuideView} onStudy={openModule} onQuiz={quiz.onSetup} /></Suspense></section>}

          <footer className="workspace-footer"><span>Preparador de materias · {subject.shortLabel}</span><div>{subject.cheatSheetSections?.length ? <button onClick={() => onMode('cheatsheet')}>Repaso express</button> : null}{isCloud && <button onClick={() => openGuide('tables')}>Tablas comparativas</button>}{isCloud && <button onClick={() => openGuide('sources')}>Material de clase</button>}{subject.summaryPdf && <a href={subject.summaryPdf} download>Resumen PDF</a>}</div></footer>
          {!isCloud && subject.materialPdfs?.length ? <details className="source-details standalone-materials"><summary>Materiales de la materia · {subject.materialPdfs.length}</summary>{subject.materialPdfs.map((material) => <a className="material-link" key={material.href} href={material.href} target="_blank" rel="noreferrer"><NotebookIcon name="file" /><span><strong>{material.title}</strong><small>{material.description}</small></span><NotebookIcon name="arrow" size={16} /></a>)}</details> : null}
        </>}
        <footer className="personal-footer"><div><strong>Preparador de materias</strong><p>Apuntes y ejercicios para preparar los parciales.</p></div><div className="personal-links"><a href="https://github.com/facuCarbon" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a><a href="https://www.linkedin.com/in/facundocarbon/" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></div></footer>
      </main>
    </div>
    {subject && <nav className="mobile-navigation" aria-label="Navegación móvil">{navigation.map((item) => <button key={item.id} aria-current={active === item.id ? 'page' : undefined} onClick={() => onMode(item.mode)}><NotebookIcon name={item.icon} /><span>{item.title}</span></button>)}</nav>}
    {subject && quiz.pendingModule !== null && <ExamSetup quiz={quiz} subject={subject} />}
  </div>
}

function ReadingSection({ number, title, items }: { number: string; title: string; items: string[] }) {
  return <section className="reading-section"><p className="section-number">{number} / Lectura</p><h2>{title}</h2>{items.map((item) => <p key={item}>{item}</p>)}</section>
}

function ExamNote({ onPlan }: { onPlan: () => void }) {
  const { examDate, days } = useCloudExamTiming()
  return <section className="exam-note"><div className="note-rule" /><p className="eyebrow">Próximo parcial</p><h3>{deadlineLabel(days)}</h3><p>{formatStudyDate(examDate)}</p><button className="text-button" onClick={onPlan}>Organizar mi estudio <NotebookIcon name="arrow" size={16} /></button></section>
}

function ExamSetup({ quiz, subject }: { quiz: NotebookQuiz; subject: StudySubject }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const pool = subject.questions.filter((question) => quiz.pendingModule === 'all' || question.moduleId === quiz.pendingModule)
  const [amount, setAmount] = useState(Math.min(quiz.size, pool.length))
  useEffect(() => { const node = dialog.current; node?.showModal(); return () => node?.close() }, [])
  const sizes = [...new Set([5, 10, 15, pool.length])].filter((size) => size > 0 && size <= pool.length).sort((a, b) => a - b)
  if (!sizes.includes(amount) && amount > 0) sizes.push(amount)
  return <dialog className="notebook-dialog" ref={dialog} aria-labelledby="exam-setup-title" onCancel={(event) => { event.preventDefault(); quiz.onCancel() }}><div className="dialog-heading"><p className="eyebrow">Preparar un intento</p><button type="button" className="icon-button" aria-label="Cerrar configuración" onClick={quiz.onCancel}><NotebookIcon name="close" /></button></div><h2 id="exam-setup-title">¿Cómo querés practicar?</h2><p className="muted">{quiz.pendingModule === 'all' ? `Todos los módulos de ${subject.shortLabel}.` : subject.modules.find((module) => module.id === quiz.pendingModule)?.title}</p><div className="setup-amount"><label htmlFor="exam-amount">Cantidad de preguntas</label><select id="exam-amount" value={amount} onChange={(event) => setAmount(Number(event.target.value))}>{sizes.map((size) => <option key={size} value={size}>{size === pool.length ? `Todas (${size})` : `${size} preguntas`}</option>)}</select></div>
    <fieldset className="setup-feedback"><legend>¿Cuándo ves la corrección?</legend>{([{ id: 'afterAll', title: 'Al terminar', description: 'Respondé todo y revisá el resultado al final.' }, { id: 'perQuestion', title: 'Una por una', description: 'Recibí una explicación después de cada respuesta.' }] as const).map((choice) => <label key={choice.id} className={quiz.pendingFeedback === choice.id ? 'is-selected' : ''}><input type="radio" name="feedback-mode" checked={quiz.pendingFeedback === choice.id} onChange={() => quiz.onPendingFeedback(choice.id)} /><span><strong>{choice.title}</strong><small>{choice.description}</small></span></label>)}</fieldset>
    {!quiz.submitted && Object.keys(quiz.answers).length > 0 && <p className="inline-note">Al empezar se reemplaza tu intento de {Object.keys(quiz.answers).length} respuestas guardadas. Cancelá si querés continuarlo.</p>}
    <div className="dialog-actions"><button className="button secondary" onClick={quiz.onCancel}>Cancelar</button><button className="button primary" disabled={!pool.length} onClick={() => quiz.onStart(amount)}>Empezar examen <NotebookIcon name="arrow" size={17} /></button></div>
  </dialog>
}
