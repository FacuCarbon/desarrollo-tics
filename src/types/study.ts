export type StudyMode = 'home' | 'study' | 'quiz' | 'cheatsheet' | 'cloud-guide' | 'practice' | 'progress'

export interface StudySubject {
  id: string
  title: string
  shortLabel: string
  description: string
  summaryPdf?: string
  materialPdfs?: StudyMaterialPdf[]
  modules: StudyModule[]
  questions: QuizQuestion[]
  cheatSheetSections?: CheatSheetSection[]
}

export interface StudyMaterialPdf {
  format?: string
  title: string
  description: string
  href: string
}

export interface StudyModule {
  supplementary?: { title: string; text: string; href: string }[]
  sources?: { file: string; pages?: number[] }[]
  id: string
  title: string
  shortLabel: string
  summary: string
  focusAreas: string[]
  deepDive: string[]
  practiceTips: string[]
  examples?: StudyExample[]
}

export interface StudyExample {
  title: string
  language: string
  description: string
  code: string
}

export interface CheatSheetSection {
  title: string
  bullets: string[]
}

export interface QuestionOption {
  id: string
  text: string
  explanation: string
}

export interface QuizQuestion {
  sources?: { file: string; pages?: number[] }[]
  sourceKind?: 'class' | 'clarification' | 'practice'
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
