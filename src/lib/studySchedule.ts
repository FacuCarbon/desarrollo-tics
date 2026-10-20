export const defaultCloudExamDate = '2026-10-24'

export function calendarDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  return ['year', 'month', 'day'].map((type) => parts.find((part) => part.type === type)?.value).join('-')
}

// Date-only arithmetic avoids UTC offsets and daylight-saving changes.
function dateNumber(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN
  const [year, month, day] = date.split('-').map(Number)
  const value = Date.UTC(year, month - 1, day)
  return new Date(value).toISOString().slice(0, 10) === date ? value : NaN
}

export function isCalendarDate(date: string) { return Number.isFinite(dateNumber(date)) }
export function daysUntilExam(examDate: string, today = calendarDate()) {
  return Math.round((dateNumber(examDate) - dateNumber(today)) / 86_400_000)
}
export function deadlineLabel(days: number) {
  if (days < 0) return 'La fecha del parcial ya pasó'
  if (days === 0) return 'El parcial es hoy'
  if (days === 1) return 'El parcial es mañana'
  return `Faltan ${days} días para el parcial`
}
export function formatStudyDate(date: string) {
  return new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateNumber(date)))
}
export function schedulePendingStages(today: string, examDate: string, completed: string[]) {
  const pending = [0, 1, 2, 3].filter((index) => !completed.includes(String(index)))
  const slots = Math.min(Math.max(daysUntilExam(examDate, today), 1), pending.length)
  return Object.fromEntries(pending.map((stage, position) => {
    const offset = Math.floor(position * slots / pending.length)
    return [stage, new Date(dateNumber(today) + offset * 86_400_000).toISOString().slice(0, 10)]
  })) as Record<number, string>
}
