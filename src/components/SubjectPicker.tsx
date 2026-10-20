import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { StudySubject } from '../types/study'
import { NotebookIcon } from './NotebookIcon'

export function SubjectPicker({ id, subjects, value, onChange }: {
  id: string
  subjects: StudySubject[]
  value: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const search = useRef({ text: '', time: 0 })
  const selected = subjects.find((subject) => subject.id === value)

  useEffect(() => {
    if (!open) return
    list.current?.focus()
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  useEffect(() => {
    if (open) list.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  function show() {
    setActiveIndex(Math.max(0, subjects.findIndex((subject) => subject.id === value)))
    setOpen(true)
  }

  function choose(index: number) {
    onChange(subjects[index].id)
    setOpen(false)
    trigger.current?.focus()
  }

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Tab') { setOpen(false); trigger.current?.focus(); return }
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.current?.focus(); return }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(activeIndex); return }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      setActiveIndex((index) => event.key === 'Home' ? 0 : event.key === 'End' ? subjects.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + subjects.length) % subjects.length)
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      const now = event.timeStamp
      search.current = { text: (now - search.current.time < 700 ? search.current.text : '') + event.key.toLocaleLowerCase('es'), time: now }
      const next = subjects.findIndex((subject) => `${subject.shortLabel} ${subject.title}`.toLocaleLowerCase('es').startsWith(search.current.text))
      if (next >= 0) setActiveIndex(next)
    }
  }

  return <div className="subject-picker" ref={root} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <button ref={trigger} id={id} type="button" className="subject-picker-trigger" aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? `${id}-list` : undefined} onClick={() => open ? setOpen(false) : show()} onKeyDown={(event) => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); show() } }}>
      <span id={`${id}-value`}>{selected?.shortLabel ?? 'Elegí una materia'}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={open ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} /></svg>
    </button>
    {open && <div ref={list} id={`${id}-list`} className="subject-picker-list" role="listbox" tabIndex={-1} aria-labelledby={`${id}-label`} aria-activedescendant={`${id}-option-${activeIndex}`} onKeyDown={navigate}>
      {subjects.map((subject, index) => <div key={subject.id} id={`${id}-option-${index}`} role="option" aria-selected={value === subject.id} className={`subject-picker-option ${activeIndex === index ? 'is-active' : ''}`} onPointerMove={() => setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(index)}>
        <span>{subject.title}</span>{subject.id === value && <NotebookIcon name="check" size={17} />}
      </div>)}
    </div>}
  </div>
}
