import type { CurrentExam, Effort, ExamenStats, ResponseStats } from '@/custom.d.ts'
import { defineStore } from 'pinia'
const persistStoreKey = 'francais-test'

export const useAppStore = defineStore('app', () => {
  const responses = ref<Record<string, ResponseStats>>({})
  const recentEfforts = ref<Record<string, Effort>>({})
  const examsList = ref<ExamenStats[]>([])
  const effortsList = ref<Effort[]>([])
  const currentExam = ref<Partial<CurrentExam>>({})
  const savedExam = ref<CurrentExam | null>(null)

  const setResponse = (slug: string, value: 'correct' | 'failed'): void => {
    if (responses.value[slug] === undefined) {
      responses.value[slug] = { correct: 0, failed: 0, isKnown: false }
    }
    responses.value[slug][value]++
    responses.value[slug].isKnown = value === 'correct' 
  }

  const questionIsKnown = (slug: string) => {
    if (responses.value[slug] === undefined) return 0
    return responses.value[slug].isKnown
  }

  const saveExamStats = (examen: ExamenStats): void => {
    examsList.value.push(examen)
  }

  const saveExam = (examen: CurrentExam | null): void => {
    savedExam.value = examen
  }

  const getErrors = (): string[] => {
    return Object.entries(responses.value)
      .filter(([_, stats]: [string, ResponseStats]) => stats.isKnown === false)
      .map(([slug, _]: [string, ResponseStats]) => slug)
  }

  const getSavedExam = (): CurrentExam | null => {
    return savedExam.value
  }

  const saveEffort = (effort: Effort): void => {
    recentEfforts.value[effort.theme] = effort
    effortsList.value.push(effort)
  }

  const getRecentEffort = (theme: string): Partial<Effort> => {
    // console.log(recentEfforts.value, theme)
    return recentEfforts.value[theme] ?? {}
  }

  const setCurrentExam = (exam: CurrentExam): void => {
    currentExam.value = exam
  }

  const getCurrentExam = (): CurrentExam => {
    return currentExam.value as CurrentExam
  }

  return {
    currentExam,
    responses,
    examsList,
    effortsList,
    recentEfforts,
    saveEffort,
    saveExam,
    saveExamStats,
    getSavedExam,
    getErrors,
    questionIsKnown,
    getRecentEffort,
    setResponse,
    setCurrentExam,
    getCurrentExam
  }
}, {
  persist: {
    key: persistStoreKey
  },
  share: {
    enable: true,
    initialize: true
  }
})
