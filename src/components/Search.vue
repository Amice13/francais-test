<template>
  <v-container class="fill-height d-flex align-center py-0 px-2 px-md-4" max-width="900">
    <div class="d-flex w-100 flex-column h-100 py-2 py-md-6">
      <!-- Taskbar -->
      <div class="d-flex w-100 align-center bg-primary pa-2 pa-md-4 rounded-xl justify-space-between">
        <div class="text-h4">Quiz <span class="hidden-sm-and-down">de français</span></div>
        <v-btn
          variant="tonal"
          append-icon="mdi-chevron-down"
          size="large"
          class="rounded-pill"
          color="white"
        >
          <span class="hidden-sm-and-down">{{ levels[level] }}</span>
          <span class="hidden-md-and-up">{{ level.toUpperCase() }}</span>
          <v-menu activator="parent">
            <v-list>
              <v-list-item
                v-for="l in Object.keys(levels)"
                @click="level = l"
                :key="l"
              >
                <v-list-item-title>
                  <span class="hidden-sm-and-down">{{ levels[l] }}</span>
                  <span class="hidden-md-and-up">{{ l.toUpperCase() }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
      <!-- Search -->
      <div class="w-100 pt-4 pt-md-8 px-md-4 px-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="search"
              label="Recherche"
              density="comfortable"
              class="rounded-xl"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              rounded
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" class="pt-0 pl-6">
            <v-chip
              v-for="t in searchTypes"
              @click="searchType = t"
              :text="t"
              :variant="searchType === t ? 'flat' : 'outlined'"
              :color="searchType === t ? 'primary' : 'grey-darken-3'"
              class="mr-2 mb-1"
            />
          </v-col>
        </v-row>
      </div>
      <!-- List of themes -->
      <div class="w-100 my-0 my-md-4 flex-grow-1 min-h-0 h-0 overflow-y-auto">
        <v-list class="h-100 overflow-x-hidden" lines="one">
          <TransitionGroup name="slide-fade">
            <v-list-item
              v-for="theme of items"
              @click="startQuiz(theme)"
              subtitle="Dernière tentative: jamais"
              :disabled="theme.numberOfQuestions === 0"
              :key="theme._id"
              :title="theme.title"
            >
              <template v-slot:prepend>
                <v-avatar :color="statuses[getStatus(theme)].color" class="my-2">
                  <v-icon color="white">{{ statuses[getStatus(theme)].icon }}</v-icon>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-chip size="small" label>0 / {{ theme.numberOfQuestions }}</v-chip>
              </template>
            </v-list-item>
          </TransitionGroup>
        </v-list>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { getSampleOfUnique } from '@/composables/get-sample'
import type { CurrentExam } from '@/custom'
import questions from '@/quizes/questions.json'
import { useAppStore } from '@/stores/app'

const { questionIsKnown, getRecentEffort, setCurrentExam } = useAppStore()
const searchTypes = ['Personnel', 'Par sujet', 'Par thème'] as const

type Question = (typeof questions)[number]
type SearchTypes = typeof searchTypes[number]

interface Themes {
  _id: string
  title: string
  numberOfQuestions: number
  answers?: number
  lastDate?: string
}

const levels: Record<Question['level'], Question['typeName']> = {}
for (const question of questions) levels[question.level] = question.typeName

const themes = [...new Set(questions.map(el => el.themeName))]
const topics = [...new Set(questions.map(el => el.sujetName))]
type Theme = typeof themes[number]
type Topic = typeof topics[number]

const selectedQuestions = computed(() => {
  const currentQuestions = questions.filter(question => question.level === level.value).map(el => {
    el.themeName = el.themeName.replace(/&#x27;/g, '\'')
    el.sujetName = el.sujetName.replace(/&#x27;/g, '\'')
    return el
  })
  return currentQuestions
})

const themesList = computed(() => {
  return selectedQuestions.value.reduce((obj: Record<string, Themes | undefined>, question) => {
    const key = question.themeName
    if (obj[key] === undefined) obj[key] = {
      _id: key,
      title: key,
      numberOfQuestions: 0
    }
    if (obj[key] !== undefined) {
      const answers = obj[key].answers ?? 0
      obj[key].answers = answers + questionIsKnown(question.slug)
      obj[key].numberOfQuestions++
      obj[key].lastDate = getRecentEffort(key).date
    }
    return obj
  }, {})  
})

const topicsList = computed(() => {
  return selectedQuestions.value.reduce((obj: Record<string, Themes | undefined>, question) => {
    const key = question.sujetName
    if (obj[key] === undefined) obj[key] = {
      _id: key,
      title: key,
      numberOfQuestions: 0
    }
    if (obj[key] !== undefined) {
      const answers = obj[key].answers ?? 0
      obj[key].answers = answers + questionIsKnown(question.slug)
      obj[key].numberOfQuestions++
      obj[key].lastDate = getRecentEffort(key).date
    }
    return obj
  }, {})  
})

const allThemes = computed(() => {
  return Object.values(themesList.value).sort((a, b): number => (a?.title ?? '').localeCompare((b?.title ?? ''))) as Themes[]
})
const allTopics = computed(() => {
  return Object.values(topicsList.value).sort((a, b): number => (a?.title ?? '').localeCompare((b?.title ?? ''))) as Themes[]
})

const statuses = {
  completed: { color: 'green-darken-1', icon: 'mdi-check-circle' },
  started: { color: 'orange-lighten-1', icon: 'mdi-progress-clock' },
  notStarted: { color: 'grey-lighten-1', icon: 'mdi-circle-outline' }
}

const getStatus = (theme: Themes): keyof typeof statuses => {
  if (theme.answers === 0) return 'notStarted'
  if (theme.answers === theme.numberOfQuestions) return 'completed'
  return 'started'
}

const level = ref<keyof typeof levels>('csp')

const searchType = ref<SearchTypes>('Par thème')
const search = ref<string>('')

const items = computed<Themes[]>(() => {
  let currentThemes: Themes[] = [
    {
      _id: 'examen',
      title: 'Test examen',
      numberOfQuestions: 40,
      answers: 0
    },
    {
      _id: 'dernier',
      title: 'Continuer examen dernier',
      numberOfQuestions: 0,
      answers: 0
    },
    {
      _id: 'fauts',
      title: 'Examiner des fauts',
      numberOfQuestions: 0,
      answers: 0
    }
  ]
  if (searchType.value === 'Par thème') currentThemes = allThemes.value
  if (searchType.value === 'Par sujet') currentThemes = allTopics.value
  if (search.value) {
    const searchValue = search.value.toLowerCase().normalize('NFKD')
    return currentThemes.filter(theme => theme.title.toLowerCase().normalize('NFKD').includes(searchValue))
  }
  return currentThemes
})

const startQuiz = (theme: Themes) => {
  let questions = selectedQuestions.value
  if (searchType.value === 'Personnel' && theme.title === 'Test examen') {
    questions = getSampleOfUnique(questions, 40)
  }
  if (['Par thème', 'Par sujet'].includes(searchType.value)) {
    const key = searchType.value === 'Par thème' ? 'themeName' : 'sujetName'
    questions = selectedQuestions.value.filter(question => question[key] === theme.title)
  }
  const numberOfQuestions = searchType.value === 'Personnel' ? 40 : questions.length
  const time = numberOfQuestions * 60 * 1000 + 5 * 60 * 1000
  const responses = Array(numberOfQuestions).fill(undefined)
  const currentExam: CurrentExam = {
    questions,
    theme: theme.title,
    time,
    timePassed: 0,
    responses,
    currentPosition: 0
  }
  setCurrentExam(currentExam)
}

</script>

<style>
.vh-100 {
  height: 100vh;
  max-height: 100vh;
}

.h-0 {
  height: 0px;
}
.slide-fade-enter-active {
  transition: all 0.2s;
}
.test {
  max-height: 100%;
  overflow-y: scroll;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>