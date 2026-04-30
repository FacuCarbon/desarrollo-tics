import { quizQuestions } from '../data/ticsContent'
import type { QuizAttemptQuestion } from '../types/study'

function shuffleArray<T>(items: T[]) {
  const cloned = [...items]

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = cloned[index]
    cloned[index] = cloned[randomIndex]
    cloned[randomIndex] = current
  }

  return cloned
}

export function createQuizAttempt(moduleId: string | 'all', amount = 5) {
  const pool =
    moduleId === 'all'
      ? quizQuestions
      : quizQuestions.filter((question) => question.moduleId === moduleId)

  return shuffleArray(pool)
    .slice(0, Math.min(amount, pool.length))
    .map<QuizAttemptQuestion>((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }))
}

export function getQuestionPool(moduleId: string | 'all') {
  return moduleId === 'all'
    ? quizQuestions
    : quizQuestions.filter((question) => question.moduleId === moduleId)
}

export function createDistinctQuizAttempt(
  moduleId: string | 'all',
  amount = 5,
  previousAttempt: QuizAttemptQuestion[] = [],
) {
  const pool = getQuestionPool(moduleId)
  const maxQuestions = Math.min(amount, pool.length)

  if (pool.length <= 1 || previousAttempt.length === 0) {
    return createQuizAttempt(moduleId, amount)
  }

  const previousSignature = previousAttempt
    .slice(0, maxQuestions)
    .map((question) => `${question.id}:${question.options.map((option) => option.id).join('')}`)
    .join('|')

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const nextAttempt = createQuizAttempt(moduleId, amount)
    const nextSignature = nextAttempt
      .map((question) => `${question.id}:${question.options.map((option) => option.id).join('')}`)
      .join('|')

    if (nextSignature !== previousSignature) {
      return nextAttempt
    }
  }

  return createQuizAttempt(moduleId, amount)
}
