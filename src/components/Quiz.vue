<template>
  <v-container class="fill-height d-flex align-center vh-100 py-0" max-width="900">
    <div class="d-flex w-100 flex-column vh-100 py-6">
      <!-- Status -->
      <div class="d-flex w-100 align-center">
        <div>
          <V-btn icon="mdi-arrow-left" variant="tonal" />
        </div>
        <div class="w-100 px-4">
          <div class="w-100 d-flex" style="height: 25px">
            <div
              v-for="(response, index) in currentExam.responses"
              :key="'r-' + index"
              :class="{
                'bg-grey-lighten-1': response === null && index !== currentExam.currentPosition,
                'bg-green-lighten-1': response === true && index !== currentExam.currentPosition,
                'bg-red-lighten-1': response === false && index !== currentExam.currentPosition,
                'bg-grey-darken-2': index === currentExam.currentPosition,
              }"
              class="w-100"
              style="margin: 1px;"
            />
          </div>
        </div>
        <div>
          <div class="text-h6">{{ minutes }}:{{ seconds }}</div>
        </div>
      </div>
      <!-- Question -->
      <div class="w-100 h-100">
        <v-card class="mb-4 elevation-0 h-100">
          <v-card-text class="h-100 d-flex align-center justify-center w-100">
            <div v-if="currentQuestion" class="text-h5 pa-10 text-center">{{ currentQuestion.question }}</div>
          </v-card-text>
        </v-card>
      </div>
      <!-- Responses -->
      <div class="w-100 my-4">
        <div v-for="(option, index) in currentQuestion?.options" :key="'option-' + index">
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <v-alert
                v-bind="props"
                @click="selectedOption = index"
                :text="option"
                class="mb-2 slide-fade-enter-active text-grey-darken-3 cursor-pointer"
                :class="getColor(index, isHovering)"
                variant="outlined"
              />
            </template>
          </v-hover>
        </div>
      </div>
      <!-- Submit -->
      <div class="w-100 d-flex justify-space-between mt-8 mb-4">
        <v-btn @click="goToNext" color="grey-darken-4" variant="outlined">Passer</v-btn>
        <v-btn @click="verify" color="primary" :disabled="selectedOption === undefined">Vérifier</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useCountdown } from '@/composables/countdown'
import { type CurrentExam, type Question } from '@/custom'
import { useAppStore } from '@/stores/app'
const { getCurrentExam } = useAppStore()
const currentExam = ref<CurrentExam>(getCurrentExam()) 
const targetTime = Number(new Date()) + currentExam.value.time - currentExam.value.timePassed
const { minutes, seconds, pause, resume, add, isFinished } = useCountdown(targetTime)
const selectedOption = ref<number | undefined>(undefined)
const currentQuestion = computed(() => {
  return currentExam.value.questions[currentExam.value.currentPosition] as Question
})

const goToNext = (): void => {
  const responses = currentExam.value.responses.slice(currentExam.value.currentPosition + 1)
  const addPosition = responses.indexOf(null)
  if (addPosition > -1) {
    currentExam.value.currentPosition = currentExam.value.currentPosition + addPosition + 1
    return
  }
  const firstPosition = currentExam.value.responses.indexOf(null)
  if (firstPosition > -1) {
    currentExam.value.currentPosition = firstPosition
    return
  }
}

const verify = (): void => {
  currentExam.value.responses[currentExam.value.currentPosition] = currentQuestion.value.correct_answer_index === selectedOption.value
}

const getColor = (index: number, isHovering: boolean | null) => {
  if (selectedOption.value === undefined) {
    return isHovering ? 'bg-grey-lighten-2': 'bg-grey-lighten-3'
  }
  if (selectedOption.value !== index) return 'bg-grey-lighten-3'
  if (currentExam.value.responses[currentExam.value.currentPosition] === null) return 'bg-indigo-lighten-5'
  if (currentExam.value.responses[currentExam.value.currentPosition] === true) return 'bg-green-lighten-4'
  if (currentExam.value.responses[currentExam.value.currentPosition] === false) return 'bg-red-lighten-4'
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