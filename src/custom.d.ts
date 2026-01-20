/* eslint-disable */
// @ts-nocheck
// biome-ignore lint: disable
// oxlint-disable
// ------

export {}

export interface Question {
  seo_id: string
  is_public: boolean
  level: string
  theme: string
  slug: string
  seo_title: string
  meta_description: string
  question: string
  options: string[]
  correct_answer_index: number
  expanded_explanation: string
  related_themes: string[]
  secondary_variants: string[]
  category_slug: string
  themeName: string
  sujetName: string
  typeName: string
}

export interface ResponseStats {
  correct: number
  failed: number
  isKnown: boolean
}

export interface ExamenStats {
  date: string
  score: number
  time: number
}

export interface Effort {
  theme: string
  date: string
  correct: number
  failed: number
  score: number
  time: number
  isFinished: boolean
}

export interface CurrentExam {
  theme: string
  questions: Question[]
  responses: (number | null)[]
  time: number
  timePassed: number
  currentPosition: number
  date: string
}
