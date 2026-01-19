import type { CurrentExam, Effort, ExamenStats, ResponseStats } from '@/custom'
import { defineStore } from 'pinia'
const persistStoreKey = 'francais-test'

export const useAppStore = defineStore('app', () => {
  const responses = ref<Record<string, ResponseStats>>({})
  const recentEfforts = ref<Record<string, Effort>>({})
  const examsList = ref<ExamenStats[]>([])
  const effortsList = ref<Effort[]>([])
  const currentExam = ref<Partial<CurrentExam>>({})

  const setResponse = (slug: string, value: 'correct' | 'failed'): void => {
    if (responses.value[slug] === undefined) {
      responses.value[slug] = { correct: 0, failed: 0 }
    }
    responses.value[slug][value]++
  }

  const questionIsKnown = (slug: string) => {
    if (responses.value[slug] === undefined) return 0
    return responses.value[slug].correct - responses.value[slug].failed > 0 ? 1 : 0
  }

  const saveExam = (examen: ExamenStats): void => {
    examsList.value.push(examen)
  }

  const saveEffort = (effort: Effort): void => {
    effortsList.value.push(effort)
  }

  const getRecentEffort = (theme: string): Partial<Effort> => {
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
