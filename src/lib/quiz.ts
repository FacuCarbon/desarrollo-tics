import type { QuizAttemptQuestion, QuizQuestion } from '../types/study'

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

export function createQuizAttempt(
  questions: QuizQuestion[],
  moduleId: string | 'all',
  amount = 5,
) {
  const pool = getQuestionPool(questions, moduleId)

  return shuffleArray(pool)
    .slice(0, Math.min(amount, pool.length))
    .map<QuizAttemptQuestion>((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }))
}

export function getQuestionPool(questions: QuizQuestion[], moduleId: string | 'all') {
  return moduleId === 'all'
    ? questions
    : questions.filter((question) => question.moduleId === moduleId)
}

export function createDistinctQuizAttempt(
  questions: QuizQuestion[],
  moduleId: string | 'all',
  amount = 5,
  previousAttempt: QuizAttemptQuestion[] = [],
) {
  const pool = getQuestionPool(questions, moduleId)
  const maxQuestions = Math.min(amount, pool.length)

  if (pool.length <= 1 || previousAttempt.length === 0) {
    return createQuizAttempt(questions, moduleId, amount)
  }

  const previousSignature = previousAttempt
    .slice(0, maxQuestions)
    .map((question) => `${question.id}:${question.options.map((option) => option.id).join('')}`)
    .join('|')

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const nextAttempt = createQuizAttempt(questions, moduleId, amount)
    const nextSignature = nextAttempt
      .map((question) => `${question.id}:${question.options.map((option) => option.id).join('')}`)
      .join('|')

    if (nextSignature !== previousSignature) {
      return nextAttempt
    }
  }

  return createQuizAttempt(questions, moduleId, amount)
}
