import { useEffect, useState, useSyncExternalStore } from 'react'
import { calendarDate, daysUntilExam, defaultCloudExamDate, isCalendarDate } from './studySchedule'
import { readProgress, writeProgress } from './progressStorage'

const key = 'nube-exam-date-v1'
const changeEvent = 'nube-exam-date-change'
function readDate() {
  try {
    const stored = readProgress(key)
    return typeof stored === 'string' && isCalendarDate(stored) ? stored : defaultCloudExamDate
  } catch { return defaultCloudExamDate }
}
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(changeEvent, callback)
  return () => { window.removeEventListener('storage', callback); window.removeEventListener(changeEvent, callback) }
}
export function useCloudExamTiming() {
  const examDate = useSyncExternalStore(subscribe, readDate, () => defaultCloudExamDate)
  const [today, setToday] = useState(calendarDate)
  useEffect(() => {
    const refresh = () => setToday(calendarDate())
    const timer = window.setInterval(refresh, 30_000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh) }
  }, [])
  function setExamDate(value: string) {
    if (!isCalendarDate(value)) return
    writeProgress(key, value)
    window.dispatchEvent(new Event(changeEvent))
  }
  return { examDate, setExamDate, today, days: daysUntilExam(examDate, today) }
}
