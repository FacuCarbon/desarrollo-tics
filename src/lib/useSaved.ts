import { useState } from 'react'
import { compatibleValue, readProgress, writeProgress } from './progressStorage'

export function useSaved<T>(key: string, initial: T, validate?: (value: T) => boolean) {
  const [value, setValue] = useState<T>(() => {
    const saved = readProgress(key)
    return compatibleValue(saved, initial) && (!validate || validate(saved as T)) ? saved as T : initial
  })
  function save(next: T) { setValue(next); writeProgress(key, next) }
  return [value, save] as const
}
