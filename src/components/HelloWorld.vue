<template>
  <v-container class="fill-height d-flex align-center py-0" max-width="900">
    <div class="d-flex w-100 flex-column h-100 py-6">
      <!-- Taskbar -->
      <div class="d-flex w-100 align-center bg-primary pa-4 rounded-xl justify-space-between">
        <div class="text-h4">Quiz de français</div>
        <v-btn
          variant="tonal"
          append-icon="mdi-chevron-down"
          size="large"
          class="rounded-lg"
          color="white"
        >NAT</v-btn>
      </div>
      <!-- Search -->
      <div class="w-100 pt-8 px-4">
        <v-row>
          <v-col cols="12">
            <v-text-field
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
              class="mr-2"
            />
          </v-col>
        </v-row>
      </div>
      <!-- List of themes -->
      <div class="w-100 my-4 flex-grow-1 min-h-0">
        <v-list class="h-100 overflow-y-auto" lines="one">
            <v-list-item
              v-for="theme of items"
              :key="theme.title"
              subtitle="Dernière tentative: jamais"
              :title="theme.title"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" class="my-2">
                  <v-icon color="white">mdi-folder</v-icon>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-chip size="small" label>0 / {{ theme.numberOfQuestions }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import questions from '@/quizes/questions.json'
type Question = (typeof questions)[number]

const searchTypes = ['Personnel', 'Par sujet', 'Par thème'] as const
type SearchTypes = typeof searchTypes[number]

const levels: Record<Question['level'], Question['typeName']> = {}
for (const question of questions) levels[question.level] = question.typeName
const themes = [...new Set(questions.map(el => el.themeName))]
const topics = [...new Set(questions.map(el => el.sujetName))]
type Theme = typeof themes[number]
type Topic = typeof topics[number]

interface Themes {
  title: string
  numberOfQuestions: number
  answers?: number
  lastDate?: string
}

const themesList = questions.reduce((obj: Record<string, Themes | undefined>, question) => {
  const key = question.themeName
  if (obj[key] === undefined) obj[question.themeName] = {
    title: key,
    numberOfQuestions: 0
  }
  if (obj[key] !== undefined) {
    obj[key].numberOfQuestions++
  }
  return obj
}, {})

const topicsList = questions.reduce<Record<string, Themes>>((obj, question) => {
  const key = question.sujetName
  if (!obj[key]) {
    obj[key] = {
      title: key,
      numberOfQuestions: 0
    }
  }
  obj[key].numberOfQuestions++
  return obj
}, {})

const allThemes = Object.values(themesList) as Themes[]
const allTopics = Object.values(topicsList) as Themes[]

const statuses = {
  completed: { color: 'green-darken-1', icon: 'mdi-check-circle' },
  started: { color: 'orange-lighten-1', icon: 'mdi-progress-clock' },
  notStarted: { color: 'grey-lighten-1', icon: 'mdi-circle-outline' },
  failed: { color: 'red-darken-1', icon: 'mdi-alert-circle' }
}

const searchType = ref<SearchTypes>('Par thème')

const items = computed<Themes[]>(() => {
  if (searchType.value === 'Par thème') return allThemes
  if (searchType.value === 'Par sujet') return allTopics
  return [
    { title: 'Test examen', numberOfQuestions: 40 },
    { title: 'Continuer examen dernier', numberOfQuestions: 40 },
    { title: 'Examiner des fauts', numberOfQuestions: 40 }
  ]
})

</script>

<style>
.vh-100 {
  height: 100vh;
  max-height: 100vh;
}
.slide-fade-enter-active {
  transition: all 0.2s;
}
.test {
  max-height: 100%;
  overflow-y: scroll;
}
</style>