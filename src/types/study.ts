export type StudyMode = 'home' | 'study' | 'quiz'

export interface StudyModule {
  id: string
  title: string
  shortLabel: string
  summary: string
  focusAreas: string[]
  deepDive: string[]
  practiceTips: string[]
}

export interface QuestionOption {
  id: string
  text: string
  explanation: string
}

export interface QuizQuestion {
  id: string
  moduleId: string
  prompt: string
  options: QuestionOption[]
  correctOptionId: string
  correctFeedback: string
  incorrectFeedback: string
}

export interface QuizAttemptQuestion extends Omit<QuizQuestion, 'options'> {
  options: QuestionOption[]
}
