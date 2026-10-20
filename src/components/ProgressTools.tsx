import { useEffect, useRef, useState } from 'react'
import type { StudySubject } from '../types/study'
import { createProgressBackup, hasUnsavedProgress, importProgressBackup, lastSubjectKey, progressChangedEvent, progressErrorEvent, serializeSession, sessionKey, validateProgressBackup } from '../lib/progressStorage'
import type { StudySession } from '../lib/progressStorage'

export function ProgressTools({ subjects, resumed, conflict, currentSession, compact = false }: { subjects: StudySubject[]; resumed: boolean; conflict: boolean; currentSession: StudySession; compact?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const saved = () => setStatus(hasUnsavedProgress() ? 'error' : 'saved')
    const failed = () => setStatus('error')
    window.addEventListener(progressChangedEvent, saved)
    window.addEventListener(progressErrorEvent, failed)
    return () => { window.removeEventListener(progressChangedEvent, saved); window.removeEventListener(progressErrorEvent, failed) }
  }, [])
  function download() {
    const backup = createProgressBackup(subjects)
    backup.data[sessionKey(currentSession.subjectId)] = serializeSession(currentSession)
    backup.data[lastSubjectKey] = currentSession.subjectId
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = `mi-avance-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(href), 1000)
    setMessage('Copia descargada. Podés restaurarla en otro dispositivo usando esta misma app.')
  }
  async function restore(file?: File) {
    if (!file) return
    try {
      if (file.size > 5_000_000) throw new Error('El archivo es demasiado grande para ser una copia de avance.')
      const data = validateProgressBackup(JSON.parse(await file.text()), subjects)
      if (!window.confirm('Se reemplazará el avance de las materias y ejercicios incluidos en esta copia. Podés descargar tu avance actual antes de continuar. ¿Restaurar la copia?')) return
      importProgressBackup(data)
      window.location.reload()
    } catch (error) { setMessage(error instanceof SyntaxError ? 'No se pudo leer el archivo. Elegí una copia descargada desde esta app.' : error instanceof Error ? error.message : 'No se pudo restaurar la copia.') }
    finally { if (input.current) input.current.value = '' }
  }
  return <aside className={`progress-tools ${compact ? 'is-compact' : ''}`}>
    <p role="status" className={status === 'error' || conflict ? 'text-[var(--warning)]' : 'text-[var(--accent)]'}>{conflict ? 'Hay avance más reciente en otra pestaña. Recargá para seguir desde esa versión.' : status === 'error' ? 'El navegador no pudo guardar el avance. Evitá cerrar esta pestaña hasta descargar una copia.' : status === 'saved' ? 'Guardado automáticamente en este dispositivo' : 'El avance se guarda en este dispositivo'}</p>
    {!compact && resumed && <p className="mt-1 text-[var(--muted)]">Retomaste tu última sesión. Podés continuar con tu lectura, ejercicios o examen guardado.</p>}
    {conflict && <button type="button" className="mt-2 rounded-xl border border-amber-200/40 px-3 py-2" onClick={() => window.location.reload()}>Cargar avance de la otra pestaña</button>}
    {!compact && <details open className="mt-2 text-[var(--muted)]"><summary className="cursor-pointer">Mi avance y copia de respaldo</summary>
      <p className="mt-3">Cada navegador conserva su propio avance. No se comparte con tus compañeros ni se sincroniza entre dispositivos. Si usan el mismo perfil del navegador, comparten ese avance.</p>
      <p className="mt-2">Al borrar los datos del sitio o terminar una sesión privada, podés perder lo guardado. Para cambiar de dispositivo o conservar una copia, descargá tu avance y restauralo en esta app.</p>
      <div className="mt-3 flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-[var(--on-accent)]" onClick={download}>Descargar mi avance</button><button type="button" className="rounded-xl border border-[var(--line)] px-4 py-2" onClick={() => input.current?.click()}>Restaurar mi avance</button></div>
      <input ref={input} type="file" accept="application/json,.json" className="hidden" aria-label="Archivo de avance" onChange={(event) => { void restore(event.target.files?.[0]) }} />
    </details>}
    {message && <p role="status" className="mt-2 text-[var(--warning)]">{message}</p>}
  </aside>
}
