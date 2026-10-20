import { useId, useState } from 'react'
import { cloudCases, cloudModules } from '../data/cloudContent'
import cloudSources from '../data/cloudSources.json'
import { useCloudExamTiming } from '../lib/useCloudExamTiming'
import { deadlineLabel, formatStudyDate, schedulePendingStages } from '../lib/studySchedule'
import { cloudBonusTopics } from '../data/cloudEvidence'
import { changedCaseAlternatives, evaluateCaseModel } from '../lib/cloudPractice'
import { useSaved } from '../lib/useSaved'

const models = ['On-Premise', 'IaaS', 'PaaS', 'SaaS']
const inputClass = 'w-full min-w-0 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-base text-[var(--ink)]'
const panelClass = 'rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-4'
const buttonClass = 'rounded-lg bg-[var(--accent)] px-5 py-2 font-semibold text-[var(--on-accent)] hover:bg-[var(--accent-hover)]'
const ownership = [
  ['Instalaciones, hardware y red física', 'Cliente', 'Proveedor', 'Proveedor', 'Proveedor'],
  ['Virtualización del proveedor', 'Cliente', 'Proveedor', 'Proveedor', 'Proveedor'],
  ['SO invitado y parches de base', 'Cliente', 'Cliente', 'Proveedor', 'Proveedor'],
  ['Runtime y middleware de la plataforma', 'Cliente', 'Cliente', 'Proveedor', 'Proveedor'],
  ['Operación del código de la aplicación', 'Cliente', 'Cliente', 'Cliente', 'Proveedor'],
  ['Gobierno de datos, usuarios y permisos', 'Cliente', 'Cliente', 'Cliente', 'Cliente'],
]
const requirements = [
  'Usar funciones estándar rápido, con poco mantenimiento propio.',
  'Controlar SO o red para una aplicación con requisitos específicos.',
  'Desplegar código propio delegando SO y plataforma.',
  'Mantener control de equipos locales aunque se corte Internet.',
  'Ajustar recursos al subir y bajar la cantidad de usuarios.',
]
const requiredIndex = [0, 1, 2, 3, 2, 0, 4, 1]
const duties = [
  'Toda la infraestructura, SO, aplicación, datos y accesos.',
  'SO invitado, plataforma propia, aplicación, datos y red virtual.',
  'Código propio, datos, identidades y configuración de la app.',
  'Datos, usuarios, permisos y configuración del producto contratado.',
]
const layers = ['Hardware físico', 'SO del entorno', 'Runtime/plataforma', 'Operación de la aplicación', 'Gobierno de datos y accesos']
const layerAnswers: Record<string, string[]> = {
  'On-Premise': ['Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente'],
  IaaS: ['Proveedor', 'Cliente', 'Cliente', 'Cliente', 'Cliente'],
  PaaS: ['Proveedor', 'Proveedor', 'Proveedor', 'Cliente', 'Cliente'],
  SaaS: ['Proveedor', 'Proveedor', 'Proveedor', 'Proveedor', 'Cliente'],
}
const changes = [
  { title: 'Instituto: datos obligatoriamente dentro de la institución', answer: 'Mixta', reason: 'Mantener los datos afectados y sus dependencias locales; SaaS puede continuar para funciones permitidas. Si se integra infraestructura local con nube, se propone una solución mixta. No hace falta mover automáticamente todo al mismo modelo.' },
  { title: 'Videojuego: jugadores estables todo el año', answer: 'Reevaluar', reason: 'Baja la ventaja de elasticidad, pero no obliga a abandonar cloud. Compará costo total, operación, disponibilidad y requisitos. Podría mantenerse IaaS/PaaS o evaluarse On-Premise.' },
  { title: 'Startup: contrata infraestructura y necesita controlar el SO', answer: 'IaaS', reason: 'El requisito nuevo de controlar el SO invitado favorece IaaS frente a la plataforma administrada de PaaS.' },
  { title: 'Industria: ahora es una aplicación administrativa sin control de equipos', answer: 'Reevaluar', reason: 'Desaparece la razón principal de control local. SaaS si hay producto adecuado; PaaS si es desarrollo propio compatible; IaaS si necesita SO especial. Sin esos datos no existe una elección única.' },
]
const campus = [
  ['Password de BD en código', 'Gestor de secretos', 'Exposición de credenciales en repositorios; retirar y rotar lo expuesto, usar gestor con identidad autorizada.'],
  ['Todos los desarrolladores son ADMIN', 'Mínimo privilegio / RBAC', 'Permisos excesivos amplían el radio de impacto. Asignar roles según función.'],
  ['Sin MFA', 'Autenticación multifactor', 'Una contraseña robada permite acceso; añadir factores reduce ese riesgo.'],
  ['BD con IP pública innecesaria', 'BD privada y segmentación', 'Exposición a Internet; restringir conectividad desde la capa de aplicación.'],
  ['Logs retenidos solo 24 horas', 'Retención de logs según investigación y requisitos', 'Puede perderse evidencia. Centralizar, proteger y definir retención adecuada; no hay un plazo universal.'],
  ['Backup nunca restaurado', 'Prueba de restauración', 'Se desconoce si permite recuperar el servicio; probar y documentar recuperación.'],
]

export function CloudGuide({ onStudy, onQuiz, view }: { onStudy: (id: string) => void; onQuiz: (id: string) => void; view?: 'plan' | 'tables' | 'practice' | 'sources' }) {
  const [tab, setTab] = useSaved('nube-guide-tab-v1', 'plan', (value) => ['plan', 'tables', 'practice', 'sources'].includes(value))
  const activeTab = view ?? tab
  return <section className="cloud-guide space-y-5">
    {!view && <>
    <h2 className="text-2xl font-bold sm:text-3xl">Prepará Nube desde cero</h2>
    <details className="text-sm leading-7 text-[var(--muted)]"><summary className="cursor-pointer">Sobre las fuentes y las correcciones</summary><p className="mt-2">Guía basada en los ocho archivos de la materia. Las preguntas y resoluciones son propuestas de entrenamiento, no un examen confirmado ni un solucionario oficial. Empezá por los modelos y la práctica; después cubrí todas las clases.</p></details>
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="Secciones de la guía">
      {[['plan', 'Plan de estudio'], ['tables', 'Tablas comparativas'], ['practice', 'Ejercicios con corrección'], ['sources', 'Todas las clases y fuentes']].map(([id, title]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} className={tab === id ? buttonClass : 'rounded-lg border border-[var(--line)] px-4 py-2 text-sm'}>{title}</button>)}
    </div>
    </>}
    {activeTab === 'plan' && <StudyPlan onStudy={onStudy} onQuiz={onQuiz} />}
    {activeTab === 'tables' && <ComparisonTables />}
    {activeTab === 'practice' && <PracticeWorkspace />}
    {activeTab === 'sources' && <SourceReader />}
  </section>
}

function PracticeWorkspace() {
  const [section, setSection] = useSaved('nube-practice-section-v1', 'cases', (value) => ['cases', 'layers', 'changes', 'hybrid', 'campus'].includes(value))
  const [savedCase, setSavedCase] = useSaved('nube-practice-case-v1', '0', (value) => /^[0-7]$/.test(value))
  const caseIndex = Number(savedCase)
  const setCaseIndex = (index: number) => setSavedCase(String(index))
  return <div className="space-y-5">
    <p className="text-sm leading-7 text-[var(--accent)]">Tus respuestas y apuntes se guardan en este navegador. Las resoluciones son propuestas razonadas; las justificaciones escritas se comparan con la guía y no se califican automáticamente.</p>
    <div className="sm:hidden"><Field title="Tipo de ejercicio" value={({ cases: 'Casos prácticos', layers: 'Repartir capas', changes: 'Cambian las condiciones', hybrid: 'Diseñar una solución', campus: 'Campus Cloud' } as Record<string, string>)[section]} options={['Casos prácticos', 'Repartir capas', 'Cambian las condiciones', 'Diseñar una solución', 'Campus Cloud']} onChange={(value) => { const sections = ['cases', 'layers', 'changes', 'hybrid', 'campus']; const index = ['Casos prácticos', 'Repartir capas', 'Cambian las condiciones', 'Diseñar una solución', 'Campus Cloud'].indexOf(value); if (index >= 0) setSection(sections[index]) }} /></div>
    <div className="hidden flex-wrap gap-2 sm:flex" aria-label="Tipo de ejercicio">{[['cases', 'Casos prácticos'], ['layers', 'Repartir capas'], ['changes', 'Cambian las condiciones'], ['hybrid', 'Diseñar una solución'], ['campus', 'Campus Cloud']].map(([id, label]) => <button type="button" key={id} aria-pressed={section === id} className={section === id ? buttonClass : 'rounded-xl border border-[var(--line)] px-4 py-3 text-sm'} onClick={() => setSection(id)}>{label}</button>)}</div>
    {section === 'cases' && <>
      <Field title="Elegí un caso de la actividad" options={cloudCases.map((item) => item.title)} value={cloudCases[caseIndex].title} onChange={(value) => { const index = cloudCases.findIndex((item) => item.title === value); if (index >= 0) setCaseIndex(index) }} />
      <CaseExercise key={caseIndex} index={caseIndex} />
      <div className="flex flex-wrap justify-between gap-3"><button type="button" className={buttonClass} disabled={caseIndex === 0} onClick={() => setCaseIndex(caseIndex - 1)}>Caso anterior</button><span className="self-center text-sm text-[var(--muted)]">Caso {caseIndex + 1} de {cloudCases.length}</span><button type="button" className={buttonClass} disabled={caseIndex === cloudCases.length - 1} onClick={() => setCaseIndex(caseIndex + 1)}>Caso siguiente</button></div>
    </>}
    {section === 'layers' && <LayerExercise />}
    {section === 'changes' && <ChangesExercise />}
    {section === 'hybrid' && <HybridExercise />}
    {section === 'campus' && <CampusExercise />}
  </div>
}

function StudyPlan({ onStudy, onQuiz }: { onStudy: (id: string) => void; onQuiz: (id: string) => void }) {
  const [done, setDone] = useSaved<string[]>('nube-plan-v1', [])
  const { examDate, setExamDate, today, days: daysLeft } = useCloudExamTiming()
  const schedule = schedulePendingStages(today, examDate, done)
  const days = [
    { title: 'Día 1 · Entender y elegir modelos', modules: ['nube-modelos'], tasks: 'Leé la tabla de responsabilidades; distinguí servicio y despliegue. Resolvé los ocho casos y la matriz por capas sin mirar. Cerrá con preguntas del bloque.', goal: 'Poder justificar IaaS/PaaS/SaaS/On-Premise por el requisito concreto.' },
    { title: 'Día 2 · Cubrir las bases de todas las clases', modules: ['nube-digital', 'nube-infra', 'nube-capas', 'nube-red'], tasks: 'Estudiá tecnologías, almacenamiento, CPU, interfaces, VM/contenedores, datos y controles de red. Revisá las fuentes y gráficos. Hacé preguntas por módulo.', goal: 'Clasificar ejemplos y distinguir conceptos que se parecen.' },
    { title: 'Día 3 · Arquitecturas y seguridad cloud', modules: ['nube-arquitecturas', 'nube-seguridad'], tasks: 'Compará los seis estilos de arquitectura y sus compromisos. Estudiá CIA, IAM, cifrado y DevSecOps. Resolvé Campus Cloud y los cambios de condiciones.', goal: 'Elegir arquitectura o control de seguridad y explicar el costo o riesgo.' },
    { title: 'Día 4 · Integrar y corregir errores', modules: [], tasks: 'Hacé un examen mixto con corrección al final. Anotá errores y volvé a los módulos. Repetí casos, cambios de condiciones y diseño mixto sin mirar la guía. Terminá con el machete.', goal: 'Responder por razonamiento y justificar la alternativa descartada.' },
  ]
  return <div className="space-y-4">
    <div className={panelClass}>
      <h3 className="text-xl font-bold text-[var(--accent)]">{deadlineLabel(daysLeft)}</h3>
      <ExamDateEditor key={examDate} examDate={examDate} onSave={setExamDate} />
      <p role="status" className="text-sm text-[var(--accent)]">Fecha aplicada: {formatStudyDate(examDate, true)}. El contador y el plan usan esta fecha.</p>
      <p className="text-sm text-[var(--muted)]">El plazo se actualiza con la fecha de Buenos Aires. La fecha se conserva en este navegador y se incluye en tu copia de avance.</p>
      <p className="text-sm leading-7 text-[var(--muted)]">{daysLeft > 0 ? 'Las etapas pendientes se distribuyen desde hoy hasta el día anterior al parcial. Si queda menos tiempo, se agrupan sin quitar temas.' : daysLeft === 0 ? 'Hoy priorizá repaso, tablas y errores frecuentes según el tiempo que tengas antes de rendir. Las etapas pendientes quedan disponibles.' : 'Actualizá la fecha para organizar otro parcial. Podés seguir estudiando y conservar tu avance.'}</p>
    </div>
    <p className="text-[var(--muted)]">Avance: {done.filter((id) => ['0', '1', '2', '3'].includes(id)).length}/4 etapas completadas. Usá bloques de 45 minutos con pausas; ajustá la cantidad a tu tiempo. La prioridad es una secuencia de aprendizaje, no una predicción de qué van a tomar.</p>
    {days.map((day, i) => <article key={day.title} className={panelClass}>
      <label className="flex items-center gap-3 text-xl font-bold"><input type="checkbox" checked={done.includes(String(i))} onChange={(e) => setDone(e.target.checked ? [...done, String(i)] : done.filter((id) => id !== String(i)))} />{day.title.replace('Día', 'Etapa')}</label>
      <p className="text-sm text-[var(--accent)]">{done.includes(String(i)) ? 'Completada' : daysLeft < 0 ? 'Pendiente' : `Sugerido: ${schedule[i] === today ? 'hoy' : formatStudyDate(schedule[i])}`}</p>
      <p className="text-sm leading-7 text-[var(--muted)]">{day.tasks}</p><p className="text-sm text-[var(--accent)]">Objetivo: {day.goal}</p>
      <div className="flex flex-wrap gap-2">{day.modules.map((id) => <button className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm" key={id} onClick={() => onStudy(id)}>Estudiar {cloudModules.find((m) => m.id === id)?.shortLabel}</button>)}<button className={buttonClass} onClick={() => onQuiz(day.modules.length === 1 ? day.modules[0] : 'all')}>Practicar {day.modules.length === 1 ? 'el bloque' : 'examen mixto'}</button></div>
    </article>)}
  </div>
}

function ExamDateEditor({ examDate, onSave }: { examDate: string; onSave: (value: string) => void }) {
  const [draft, setDraft] = useState(examDate)
  const changed = draft !== examDate
  return <form className="exam-date-editor" onSubmit={(event) => { event.preventDefault(); if (draft) onSave(draft) }}>
    <label className="block space-y-2 text-sm"><span>Fecha del parcial</span><input type="date" className={inputClass} required min="2000-01-01" max="2100-12-31" defaultValue={examDate} onChange={(event) => setDraft(event.target.value)} aria-describedby="exam-date-help" /></label>
    <button className={buttonClass} type="submit" disabled={!changed || !draft}>Guardar fecha</button>
    <p id="exam-date-help" role="status" className="text-sm text-[var(--muted)]">{changed ? 'Cambio pendiente. Guardá la fecha para actualizar el contador y reorganizar las etapas pendientes.' : 'La fecha aplicada aparece debajo. Podés cambiarla y guardar otra.'}</p>
  </form>
}

function Table({ caption, headings, rows }: { caption: string; headings: string[]; rows: string[][] }) {
  return <section className="space-y-3"><h3 className="text-lg font-bold text-[var(--accent)]">{caption}</h3>
    <div className="space-y-3 md:hidden">{rows.map(([label, ...cells]) => <details key={label} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><summary className="cursor-pointer font-semibold">{label}</summary><dl className="mt-3 space-y-3">{cells.map((cell, i) => <div key={i}><dt className="text-sm font-bold text-[var(--accent)]">{headings[i + 1]}</dt><dd className="mt-1 text-sm leading-7 text-[var(--muted)]">{cell}</dd></div>)}</dl></details>)}</div>
    <div className="hidden overflow-x-auto rounded-xl border border-[var(--line)] md:block" tabIndex={0} role="region" aria-label={caption}><table className="w-full min-w-[700px] text-left text-sm"><caption className="sr-only">{caption}</caption><thead className="bg-[var(--accent-soft)]"><tr>{headings.map((heading) => <th key={heading} scope="col" className="p-4">{heading}</th>)}</tr></thead><tbody>{rows.map(([label, ...cells]) => <tr key={label} className="border-t border-[var(--line)]"><th scope="row" className="p-4 font-semibold">{label}</th>{cells.map((cell, i) => <td key={i} className="p-4 align-top leading-6 text-[var(--muted)]">{cell}</td>)}</tr>)}</tbody></table></div>
  </section>
}

function ComparisonTables() {
  return <div className="space-y-5">
    <Table caption="Quién administra cada capa" headings={['Capa', ...models]} rows={ownership} />
    <p className="text-sm leading-6 text-[var(--muted)]">Es un esquema didáctico. En PaaS el cliente mantiene su código; en SaaS el proveedor opera el producto. Datos, identidades, permisos y configuración conservan responsabilidades del cliente en todos los modelos. La distribución exacta de controles depende del servicio y del contrato.</p>
    <Table caption="Comparación pedida en la actividad" headings={['Criterio', ...models]} rows={[
      ['Qué recibís', 'Infraestructura propia', 'Recursos virtuales', 'Plataforma para tu código', 'Aplicación lista'],
      ['Control del cliente', 'Alto: stack completo', 'Alto sobre SO y apps', 'Medio: código y configuración', 'Bajo sobre el stack; conserva control de uso'],
      ['Mantenimiento propio', 'Alto', 'Medio/alto: SO y apps', 'Medio/bajo: app y datos', 'Bajo sobre el producto; mantiene gobierno'],
      ['Implementación típica', 'Lenta si hay que adquirir y preparar', 'Más rápida que comprar hardware', 'Rápida si la app es compatible', 'Muy rápida si el producto cubre la necesidad'],
      ['Escalabilidad', 'Limitada por capacidad y compra', 'Flexible con diseño/configuración', 'Gestionada según capacidades de plataforma', 'Gestionada por producto, plan y límites'],
      ['Personal técnico propio', 'Alto', 'Medio/alto', 'Medio: desarrollo y configuración', 'Bajo para operar; requiere administración de uso'],
      ['Costo y riesgo', 'Inversión y capacidad ociosa', 'Pago de recursos y operación propia', 'Dependencia y límites de plataforma', 'Suscripciones, personalización y exportación de datos'],
    ]} />
    <p className="text-sm text-[var(--muted)]">Alto/medio/bajo son comparaciones orientativas, no valores universales. La app, el equipo y los requisitos cambian el resultado.</p>
    <p className="text-sm leading-7 text-[var(--warning)]">Aclaración complementaria: esta clasificación formal de despliegue viene de NIST. Las clases muestran un ejemplo cloud/On-Premise; el desafío permite combinar modelos por componente. Esto ayuda a distinguir conceptos y no confirma una pregunta del examen.</p>
    <Table caption="Despliegue: un eje diferente del modelo de servicio" headings={['Tipo', 'Qué significa', 'Pista en un ejercicio']} rows={[
      ['Pública', 'Servicios cloud ofrecidos para uso abierto por múltiples clientes.', 'Consumir recursos de un proveedor público.'],
      ['Privada', 'Nube de uso exclusivo de una organización, local o alojada.', 'Exclusividad y características cloud; no cualquier servidor local.'],
      ['Comunitaria', 'Uso exclusivo de una comunidad con necesidades comunes.', 'Varias organizaciones con requisitos compartidos.'],
      ['Híbrida', 'Integra infraestructuras cloud distintas que conservan su identidad; en clase también se trabaja la combinación cloud/local.', 'Parte local o privada integrada con nube pública. No equivale a IaaS ni a mezclar solamente PaaS y SaaS.'],
    ]} />
    <Table caption="Arquitecturas: elegir por dominio y dependencias" headings={['Estilo', 'Organización', 'Uso / compromiso']} rows={[
      ['N-tier', 'Capas horizontales', 'Sistemas tradicionales; cambios pueden afectar varias capas.'], ['Web-Queue-Worker', 'Web → cola → worker', 'Tareas largas en dominio simple; componentes pueden crecer demasiado.'], ['Microservicios', 'Capacidades de negocio independientes', 'Dominio complejo y cambios frecuentes; exige operación madura.'], ['Event-driven', 'Productores → eventos → consumidores', 'IoT y múltiples reacciones; consistencia eventual y duplicados.'], ['Big Data', 'Particiones de datos en paralelo', 'Analítica masiva y ML.'], ['Big Compute', 'Cálculos en muchos núcleos', 'Simulación, modelado y renderizado intensivo.'],
    ]} />
    <p className="text-sm text-[var(--muted)]">Contraste conceptual: <a className="text-[var(--accent)] underline" href="https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility" target="_blank" rel="noreferrer">responsabilidad compartida (Microsoft Learn)</a> y <a className="text-[var(--accent)] underline" href="https://csrc.nist.gov/pubs/sp/800/145/final" target="_blank" rel="noreferrer">modelos de servicio y despliegue (NIST SP 800-145)</a>. Las clases originales siguen disponibles en Fuentes.</p>
  </div>
}

function Field({ title, value, options, onChange }: { title: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const id = useId()
  return <div className="min-w-0 space-y-2 text-sm"><label htmlFor={id} className="block">{title}</label><select id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}><option value="">Elegí una respuesta</option>{options.map((option) => <option key={option}>{option}</option>)}</select>{value.length > 55 && <p className="text-sm leading-7 text-[var(--muted)]">Elegiste: {value}</p>}</div>
}

function CaseExercise({ index }: { index: number }) {
  const item = cloudCases[index]
  const [answer, setAnswer] = useSaved(`nube-case-v1-${index}`, { model: '', requirement: '', duty: '', reason: '' })
  const [checked, setChecked] = useState(false)
  function update(field: keyof typeof answer, value: string) { setAnswer({ ...answer, [field]: value }); setChecked(false) }
  const modelEvaluation = evaluateCaseModel(index, answer.model, item.model)
  const modelValid = modelEvaluation.accepted
  const dutyValid = answer.duty === duties[models.indexOf(answer.model)]
  const requirementValid = answer.requirement === requirements[requiredIndex[index]]
  return <article className={panelClass}>
    <h3 className="text-xl font-bold">{item.title}</h3><p className="leading-7 text-[var(--muted)]">{item.situation}</p>
    <div className="grid gap-4 md:grid-cols-2"><Field title="Modelo propuesto" value={answer.model} options={models} onChange={(v) => update('model', v)} /><Field title="Requisito que determina la decisión" value={answer.requirement} options={requirements} onChange={(v) => update('requirement', v)} /><Field title="¿Qué sigue administrando el cliente en el modelo que elegiste?" value={answer.duty} options={duties} onChange={(v) => update('duty', v)} /></div>
    <label className="block space-y-2 text-sm"><span>Justificá tu decisión: ventaja, proveedor y alternativa que descartarías con su motivo.</span><textarea className={inputClass} rows={3} value={answer.reason} onChange={(e) => update('reason', e.target.value)} placeholder="Elijo… porque el caso pide… El proveedor… Descarto… porque…" /></label>
    <button className={buttonClass} disabled={!answer.model || !answer.requirement || !answer.duty} onClick={() => setChecked(true)}>Corregir y ver explicación</button>
    {checked && <div role="status" className="space-y-3 rounded-xl border border-[var(--line)] bg-[var(--accent-soft)] p-4 text-sm leading-7">
      <p className="font-semibold">Criterios estructurados: {[modelValid, dutyValid, requirementValid].filter(Boolean).length}/3</p>
      <p>{modelValid ? modelEvaluation.conditional ? '✓ Alternativa defendible con justificación.' : '✓ Modelo compatible.' : `Revisá el modelo. Propuesta de referencia: ${item.model}.`} {modelEvaluation.explanation} {item.reason}</p>
      <p>{requirementValid ? '✓ Requisito bien identificado.' : `Revisá la pista: ${requirements[requiredIndex[index]]}`}</p>
      <p>{dutyValid ? '✓ Responsabilidades coherentes con tu modelo.' : `Para ${answer.model}, el cliente administra: ${duties[models.indexOf(answer.model)]}`}</p>
      <p>Resolución de referencia ({item.model}). Cliente: {item.client} Proveedor: {item.provider}</p><p>Ventaja: {item.advantage}</p><p>Alternativa: {item.discarded}</p>
      <p className="text-[var(--warning)]">Tu texto no se califica automáticamente. Autoevaluación: ¿citaste el requisito, el reparto de tareas y una alternativa descartada con motivo? {answer.reason.trim() ? 'Compará lo que escribiste con la guía.' : 'Todavía falta escribir tu justificación.'}</p>
    </div>}
  </article>
}

function LayerExercise() {
  const [answer, setAnswer] = useSaved<Record<string, string>>('nube-layers-v1', {})
  const [checked, setChecked] = useState(false)
  const total = models.length * layers.length
  const score = models.reduce((count, model) => count + layers.filter((_, index) => answer[`${model}-${index}`] === layerAnswers[model][index]).length, 0)
  return <article className={panelClass}><h3 className="text-xl font-bold">Ejercicio · Repartí las capas</h3><p className="text-sm text-[var(--muted)]">Completá quién opera cada capa. “Datos y accesos” representa el gobierno y los permisos a cargo del cliente; el proveedor también aplica controles sobre su infraestructura.</p>
    <div className="grid gap-4 md:grid-cols-2">{models.map((model) => <div key={model} className="space-y-3 rounded-xl border border-[var(--line)] p-4"><h4 className="font-bold text-[var(--accent)]">{model}</h4>{layers.map((layer, index) => <div key={layer}><Field title={layer} value={answer[`${model}-${index}`] ?? ''} options={['Cliente', 'Proveedor']} onChange={(value) => { setAnswer({ ...answer, [`${model}-${index}`]: value }); setChecked(false) }} />{checked && <p className="mt-1 text-sm text-[var(--accent)]">{answer[`${model}-${index}`] === layerAnswers[model][index] ? '✓ Correcto' : `Revisá: ${layerAnswers[model][index]}`}</p>}</div>)}</div>)}</div>
    <button className={buttonClass} onClick={() => setChecked(true)}>Corregir responsabilidades</button>{checked && <p role="status">Resultado: {score}/{total}. De IaaS a SaaS el proveedor opera más capas; datos y accesos conservan tareas del cliente. Consultá la tabla para repasar.</p>}
  </article>
}

function ChangesExercise() {
  const [answers, setAnswers] = useSaved<Record<string, string>>('nube-changes-v1', {})
  const [checked, setChecked] = useState(false)
  return <article className={panelClass}>
    <h3 className="text-xl font-bold">Desafío 2 · Cambian las condiciones</h3>
    <p className="text-sm leading-7 text-[var(--muted)]">La consigna pide revisar y justificar decisiones. Cuando faltan requisitos, varias alternativas pueden defenderse; la app distingue la referencia de las opciones condicionadas.</p>
    {changes.map((change, i) => <div className="space-y-2" key={change.title}>
      <Field title={change.title} value={answers[i] ?? ''} options={['On-Premise', 'IaaS', 'PaaS', 'SaaS', 'Mixta', 'Reevaluar']} onChange={(value) => { setAnswers({ ...answers, [i]: value }); setChecked(false) }} />
      {checked && <p className="text-sm leading-7 text-[var(--accent)]">{!answers[i] ? 'Falta responder.' : answers[i] === change.answer ? '✓ Propuesta de referencia.' : changedCaseAlternatives[i].includes(answers[i]) ? 'Alternativa condicionada: justificá los requisitos y costos.' : 'Revisá: no resuelve por sí sola el requisito nuevo.'} Referencia: {change.answer}. {change.reason}{i === 2 && answers[i] === 'On-Premise' ? ' On-Premise también da control del SO, pero exige asumir infraestructura propia y justificar esa inversión.' : ''}</p>}
    </div>)}
    <button className={buttonClass} onClick={() => setChecked(true)}>Corregir cambios</button>
  </article>
}

function HybridExercise() {
  const [answers, setAnswers] = useSaved<Record<string, string>>('nube-hybrid-v1', {})
  const [checked, setChecked] = useState(false)
  const parts = [
    { title: 'Servidor web', accepts: ['On-Premise', 'IaaS', 'PaaS'], reason: 'PaaS si se despliega código compatible; IaaS con control del SO; On-Premise si se justifica capacidad local. SaaS puede reemplazar la publicación por un producto de sitios, pero no da un servidor propio. Riesgo: costos, configuración y límites.' },
    { title: 'Base de datos', accepts: ['On-Premise', 'IaaS', 'PaaS'], reason: 'PaaS si se delega motor compatible; IaaS si requiere control del motor/SO; local si hay requisito de residencia o integración. Riesgo: operación, costo o dependencia según elección.' },
    { title: 'Correo corporativo', accepts: ['SaaS', 'IaaS', 'On-Premise'], reason: 'SaaS reduce operación para una función estándar con presupuesto limitado. Correo autogestionado local o en IaaS también es posible, pero debe justificarse el mantenimiento adicional. Riesgo: dependencia y condiciones de datos del proveedor.' },
    { title: 'Almacenamiento de documentos', accepts: ['SaaS', 'PaaS', 'IaaS', 'On-Premise'], reason: 'SaaS para usuarios colaborando, servicio cloud de almacenamiento para la app o local si hay residencia obligatoria. La categoría depende de qué se consume. Riesgo: permisos, privacidad y recuperación.' },
    { title: 'Aplicación propia', accepts: ['PaaS', 'IaaS', 'On-Premise'], reason: 'PaaS si es compatible y querés delegar SO; IaaS con SO especial; local con requisitos de operación local. SaaS solo si se reemplaza por un producto, algo no indicado.' },
  ]
  return <article className={panelClass}><h3 className="text-xl font-bold">Desafío 3 · Diseñá una solución mixta</h3><p className="text-sm leading-7 text-[var(--muted)]">Empresa con presupuesto limitado: asigná modelo por componente y anotá el supuesto, ventaja y riesgo. La consigna no define todos los requisitos; puede haber varias propuestas válidas.</p>{parts.map((part) => <div className="space-y-2" key={part.title}><Field title={part.title} options={models} value={answers[part.title] ?? ''} onChange={(value) => { setAnswers({ ...answers, [part.title]: value }); setChecked(false) }} /><textarea className={inputClass} aria-label={`Justificación de ${part.title}`} placeholder="Supuesto → decisión → riesgo" value={answers[`${part.title}-reason`] ?? ''} onChange={(e) => { setAnswers({ ...answers, [`${part.title}-reason`]: e.target.value }); setChecked(false) }} />{checked && <p className="text-sm leading-7 text-[var(--accent)]">{!answers[part.title] ? 'Falta elegir.' : part.accepts.includes(answers[part.title]) ? 'Opción defendible con los supuestos adecuados.' : 'Elección a justificar: puede exigir reemplazar un producto o adaptar el componente. No se califica como incorrecta automáticamente.'} {part.reason} La justificación escrita se contrasta manualmente.</p>}</div>)}<button className={buttonClass} onClick={() => setChecked(true)}>Contrastar propuesta</button>{checked && <p className="text-sm text-[var(--warning)]">Combinar modelos no demuestra despliegue híbrido. Para proponer integración local/cloud, explicá qué permanece local, qué va a cloud y cómo se conectan de forma segura. No hay un modelo siempre mejor.</p>}</article>
}

function CampusExercise() {
  const [answers, setAnswers] = useSaved<Record<string, string>>('nube-campus-v1', {})
  const [checked, setChecked] = useState(false)
  return <article className={panelClass}><h3 className="text-xl font-bold">Actividad integradora · Campus Cloud</h3><p className="text-sm text-[var(--muted)]">Relacioná los seis problemas de clase 7 con un control y explicá el riesgo.</p>{campus.map(([problem, correct, reason]) => <div className="space-y-2" key={problem}><Field title={problem} value={answers[problem] ?? ''} options={campus.map((row) => row[1])} onChange={(value) => { setAnswers({ ...answers, [problem]: value }); setChecked(false) }} />{checked && <p className="text-sm leading-7 text-[var(--accent)]">{answers[problem] === correct ? '✓ Correcto.' : `Revisá: ${correct}.`} {reason}</p>}</div>)}<button className={buttonClass} onClick={() => setChecked(true)}>Corregir controles</button>{checked && <p role="status">Resultado: {campus.filter(([problem, correct]) => answers[problem] === correct).length}/6.</p>}</article>
}

export function SourceReader({ files, pageNumbers }: { files?: string[]; pageNumbers?: number[] }) {
  const [query, setQuery] = useState('')
  const docs = cloudSources.filter((doc) => !files || files.includes(doc.file))
  return <section className="space-y-4"><h3 className="text-xl font-bold">Material por clase, sin descartar el original</h3><p className="text-sm leading-7 text-[var(--muted)]">Transcripción de texto, tablas y notas, junto con imágenes incrustadas recuperables. Los archivos originales conservan composición, diagramas, animaciones y formato que la transcripción puede no reproducir. Las diapositivas repetidas y sin texto se conservan.</p><label className="block space-y-2 text-sm"><span>Buscar en el texto de las fuentes</span><input className={inputClass} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ej.: responsabilidad, almacenamiento, microservicios" type="search" /></label>
    {(!files || files.includes('clase_6_arquitecturas.pptx')) && <details className={panelClass}>
      <summary className="cursor-pointer font-bold text-[var(--accent)]">Bonus visuales de clase 6 · diapositivas 30–34</summary>
      <p className="text-sm leading-7 text-[var(--muted)]">Estos temas aparecen en imágenes de la presentación. Se resumen para que no queden ocultos en los gráficos; “bonus” es el nombre de las diapositivas, no una garantía de que queden fuera del examen.</p>
      {cloudBonusTopics.map((topic) => <div key={topic.title}><h4 className="font-semibold">{topic.title}</h4><p className="mt-2 text-sm leading-7 text-[var(--muted)]">{topic.text}</p></div>)}
    </details>}
    {docs.map((doc) => {
      const pages = doc.pages.filter((page) => (!pageNumbers || pageNumbers.includes(page.number)) && (!query || [...page.paragraphs, ...page.notes].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().includes(query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase())))
      return <details key={doc.file} className={panelClass} open={query ? true : undefined}><summary className="cursor-pointer font-bold text-[var(--accent)]">{doc.file} · {pages.length}/{doc.pages.length} diapositivas/secciones</summary><a className="inline-block text-sm text-[var(--warning)] underline" href={doc.href} download>Descargar original completo</a>{!pages.length && <p className="text-sm text-[var(--muted)]">Sin coincidencias en el texto extraído. Los gráficos pueden contener texto adicional.</p>}{pages.map((page) => <details key={page.number} className="rounded-xl border border-[var(--line)] p-4"><summary className="cursor-pointer text-sm font-semibold">{doc.file.endsWith('.docx') ? 'Documento completo' : `Diapositiva ${page.number}`} · {page.paragraphs[0]?.slice(0, 100) || 'Contenido visual; consultar original'}</summary><div className="mt-3 space-y-3 text-sm leading-7 text-[var(--muted)]">{page.paragraphs.map((text, i) => <p key={i}>{text}</p>)}{page.notes.length > 0 && <div className="border-l-2 border-cyan-300 pl-4"><p className="font-bold">Notas de la presentación</p>{page.notes.map((text, i) => <p key={i}>{text}</p>)}</div>}{'images' in page && page.images?.map((src) => <a key={src} href={src} target="_blank" rel="noreferrer"><img className="my-3 max-h-[600px] max-w-full rounded-lg bg-white object-contain" src={src} loading="lazy" alt={`Imagen incrustada de ${doc.file}, diapositiva ${page.number}. Abrir para ampliar.`} /></a>)}</div></details>)}</details>
    })}
  </section>
}
