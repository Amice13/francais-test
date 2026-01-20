<template>
  <v-container class="fill-height d-flex align-center vh-100 py-0" max-width="900">
    <div class="d-flex w-100 flex-column vh-100 py-4 py-md-6">
      <!-- Status -->
      <div class="d-flex w-100 align-center">
        <div>
          <V-btn @click="showExitDialog = true" class="hidden-sm-and-down" icon="mdi-arrow-left" variant="tonal" />
          <V-btn @click="showExitDialog = true" class="hidden-md-and-up" size="x-small" icon="mdi-arrow-left" variant="tonal" />
        </div>
        <div class="w-100 px-4">
          <div class="w-100 d-flex" style="height: 25px">
            <div
              v-for="(response, index) in currentExam.responses"
              :key="'r-' + index"
              :class="{
                'bg-grey-lighten-1': response === null && index !== currentExam.currentPosition,
                'bg-green-lighten-1': response !== null && response === questions[index]?.correct_answer_index,
                'bg-red-lighten-1': response !== null && response !== questions[index]?.correct_answer_index,
                'bg-grey-darken-2': index === currentExam.currentPosition,
              }"
              class="w-100"
              :style="{ margin: '0.2%' }"
            />
          </div>
        </div>
        <div>
          <div class="text-md-h6 font-weight-bold">{{ minutes }}:{{ seconds }}</div>
        </div>
      </div>
      <div class="mt-4 mt-md-8 text-subtitle-2 text-md-subtitle-1 font-weight-bold text-primary">
        Question {{ currentExam.currentPosition + 1 }} de {{ questions.length }}
      </div>
      <div class="h-100 mh-100 overflow-y-auto d-flex flex-column">
        <!-- Question -->
        <div class="w-100 h-100 d-flex flex-column">
          <v-card class="mb-4 elevation-0 h-100">
            <v-card-text class="h-100 d-flex align-center justify-center w-100">
              <div v-if="currentQuestion" class="text-h6 text-md-h5 text-center">{{ currentQuestion.question }}</div>
            </v-card-text>
          </v-card>
        </div>
        <!-- Responses -->
        <div class="w-100 mt-2 my-md-4">
          <div v-for="(option, index) in options" :key="'option-' + index">
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-alert
                  v-bind="props"
                  @click="selectOption(index)"
                  :text="option"
                  class="mb-2 slide-fade-enter-active text-grey-darken-3 pa-md-4 pa-2 text-body-2 text-md-body-1"
                  :class="getColor(index, isHovering)"
                  variant="outlined"
                />
              </template>
            </v-hover>
          </div>
        </div>
      </div>
      <!-- Submit -->
      <v-bottom-sheet v-model="showTip" :scrim="false" >
        <v-container class="fill-height d-flex align-center vh-100 pb-md-6 pt-md-6 bg-white" max-width="900">
          <v-card
            class="w-100"
            flat
            :color="response === currentQuestion.correct_answer_index ? 'green-lighten-5' : 'red-lighten-5'"
            :text="currentQuestion.expanded_explanation"
          ></v-card>
          <div class="w-100 d-flex justify-space-between mt-4 mb-0 mt-md-8 mb-md-4">
            <v-spacer />
            <v-btn
              @click="goToNext"
              :color="response === currentQuestion.correct_answer_index ? 'green-darken-2' : 'red-darken-2'"
              :disabled="selectedOption === undefined"
              text="Continuer"
            />
          </div>
        </v-container>
      </v-bottom-sheet>
      <div v-if="response === null" class="w-100 d-flex justify-space-between mt-4 mt-md-8 mb-md-4">
        <v-btn @click="goToNext" color="grey-darken-4" variant="outlined">Passer</v-btn>
        <v-btn @click="verify" color="primary" :disabled="selectedOption === undefined">Vérifier</v-btn>
      </div>
      <div v-if="response !== null" class="w-100 max-w-100 d-flex justify-space-between mt-4 mt-md-8 mb-md-4">
        <v-btn
          @click="showTip = true"
          color="orange"
          :style="{ 'min-width': '48px '}"
        >
          <v-icon class="hidden-md-and-up" icon="mdi-lightbulb-on" color="white" />
          <span class="text-white hidden-sm-and-down">Expliquer</span>
        </v-btn>
        <v-spacer/>
        <v-btn
          @click="goToNext"
          color="green-darken-2"
          text="Continuer"
        />
      </div>
    </div>
    <!-- Exam is finished dialog -->
    <v-dialog v-model="showResultDialog" max-width="360">
      <v-card>
        <v-card-title primary-title class="text-center">
          L'examen est terminé
        </v-card-title>
        <v-card-text class="text-center">
          <v-icon v-if="successFinal" size="86px" color="green-darken-2">mdi-check-circle</v-icon>
          <v-icon v-if="!successFinal" size="86px" color="red-darken-2">mdi-close-circle</v-icon>
          <div class="text-h6 my-4">{{ successfullResponses.length }} / {{ questions.length }}</div>
          <div class="font-weight-bold">
            <span v-if="successFinal">Félicitations !</span>
            <span v-if="!successFinal">Désolé</span>
          </div>
          <div>Vous avez <span v-if="successFinal">réussi</span><span v-if="!successFinal">échouer à</span> l'examen !</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="finishExam"
            :color="successFinal ? 'green-darken-2' : 'red-darken-2'"
            variant="flat"
            text="Finir"
            block
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- No time dialog -->
    <v-dialog v-model="isFinished" max-width="360">
      <v-card>
        <v-card-title primary-title class="text-center">
          Le temps s'est écoulé
        </v-card-title>
        <v-card-text class="text-center">
          <v-icon v-if="successFinal" size="86px" color="green-darken-2">mdi-check-circle</v-icon>
          <v-icon v-if="!successFinal" size="86px" color="red-darken-2">mdi-close-circle</v-icon>
          <div class="text-h6 my-4">{{ successfullResponses.length }} / {{ questions.length }}</div>
          <div class="font-weight-bold">
            <span v-if="successFinal">Félicitations !</span>
            <span v-if="!successFinal">Désolé</span>
          </div>
          <div>Vous avez <span v-if="successFinal">réussi</span><span v-if="!successFinal">échouer à</span> l'examen !</div>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between">
          <v-btn
            @click="add(5 * 60 * 1000)"
            prepend-icon="mdi-timer-plus"
            color="orange-darken-1"
            variant="flat"
            text="Ajouter du temps"
          />
          <v-btn
            @click="finishExam"
            :color="successFinal ? 'green-darken-2' : 'red-darken-2'"
            variant="flat"
            text="Finir"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Exit dialog -->
    <v-dialog v-model="showExitDialog" max-width="360">
      <v-card>
        <v-card-title primary-title class="text-center">
          Fin de la session
        </v-card-title>
        <v-card-text class="text-center">
          <v-icon size="86px" color="primary">mdi-exit-run</v-icon>
          <div class="text-h6 my-4">{{ successfullResponses.length }} / {{ questions.length }}</div>
          <div class="font-weight-bold">Retour au menu !</div>
          <div>Vous pouvez savuer la session en cours et y revenir plus tard, ou y mettre fin.</div>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between">
          <v-btn
            @click="showExitDialog = false" 
            color="orange-darken-4"
            variant="plain"
            text="Anuller"
          />
          <v-spacer />
          <v-btn
            @click="finishExam"
            color="orange-darken-4"
            variant="flat"
            text="Finir"
          />
          <v-btn
            @click="saveCurrentExam"
            color="primary"
            variant="flat"
            text="Savuer"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCountdown } from '@/composables/countdown'
import type { CurrentExam, Effort, ExamenStats, Question } from '@/custom.d.ts'
import { useAppStore } from '@/stores/app'
const { getCurrentExam, saveExam, saveExamStats, saveEffort, setResponse } = useAppStore()
const router = useRouter()
const currentExam = ref<CurrentExam>(getCurrentExam()) 
const targetTime = Number(new Date()) + currentExam.value.time - currentExam.value.timePassed
const { minutes, seconds, timePassed, pause, resume, add, isFinished } = useCountdown(targetTime)

const selectedOption = ref<number | null>(null)
const showTip = ref<boolean>(false)
const showResultDialog = ref<boolean>(false)
const showExitDialog = ref<boolean>(false)

const currentQuestion = computed(() => currentExam.value.questions[currentExam.value.currentPosition] as Question)
const questions = computed(() => currentExam.value.questions)
const responses = computed(() => currentExam.value.responses)
const options = computed(() => currentQuestion.value.options)
const response = computed(() => currentExam.value.responses[currentExam.value.currentPosition])
const currentPosition = computed(() => currentExam.value.currentPosition)
const successfullResponses = computed(() => {
  return responses.value.filter((response, i: number) => response === questions.value[i]?.correct_answer_index)
})
const successFinal = computed(() => {
  return successfullResponses.value.length / questions.value.length >= 0.8
})

const goToNext = (): void => {
  selectedOption.value = null
  const currentResponses = responses.value.slice(currentExam.value.currentPosition + 1)
  const addPosition = currentResponses.indexOf(null)
  if (addPosition > -1) {
    currentExam.value.currentPosition = currentPosition.value + addPosition + 1
    showTip.value = false
    return
  }
  const firstPosition = responses.value.indexOf(null)
  if (firstPosition > -1) {
    currentExam.value.currentPosition = firstPosition
    showTip.value = false
    return
  }
  showTip.value = false
  showResultDialog.value = true
}

const selectOption = (number: number): void => {
  if (response.value !== null) return
  selectedOption.value = number
}

const verify = (): void => {
  if (response.value !== null) return
  currentExam.value.responses[currentExam.value.currentPosition] = selectedOption.value
  const result = selectedOption.value === currentQuestion.value.correct_answer_index ? 'correct' : 'failed'
  setResponse(currentQuestion.value.slug, result)
}

const getColor = (index: number, isHovering: boolean | null) => {
  // Response is given
  if (response.value !== null) {
    if (currentQuestion.value.correct_answer_index === index) return 'bg-green-lighten-4'
    if (response.value === index) return 'bg-red-lighten-4'
    return 'bg-grey-lighten-3'
  }
  // Response is not selected
  if (selectedOption.value === null) {
    return isHovering ? 'bg-grey-lighten-2 cursor-pointer': 'bg-grey-lighten-3 cursor-pointer'
  }
  // Response is selected
  if (selectedOption.value !== index) return 'bg-grey-lighten-3 cursor-pointer'
  return 'bg-indigo-lighten-5'
}

const finishExam = () => {
  saveExam(null)
  const isFinished = responses.value.filter(el => el !== null).length === questions.value.length

  if (currentExam.value.theme === 'Test examen' && isFinished) {
    const examResult: ExamenStats = {
      date: new Date().toISOString(),
      score: successfullResponses.value.length,
      time: timePassed.value
    }
    saveExamStats(examResult)
  }

  const effort: Effort = {
    theme: currentExam.value.theme,
    date: new Date().toISOString(),
    correct: successfullResponses.value.length,
    failed: questions.value.length - successfullResponses.value.length,
    score: successfullResponses.value.length / questions.value.length,
    time: timePassed.value,
    isFinished
  }
  saveEffort(effort)
  router.push('/')
}

const saveCurrentExam = () => {
  saveExam(currentExam.value)
  router.push('/')
}

</script>

<style>
.vh-100 {
  height: 100vh;
  max-height: 100vh;
}
.slide-fade-enter-active {
  transition: all 0.2s;
}
</style>