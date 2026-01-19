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
            <div v-for="i in 40" class="w-100 bg-primary" style="margin: 1px;" />
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
            <div class="text-h5 pa-10 text-center">Que dit l'article 1er de la Constitution française ?</div>
          </v-card-text>
        </v-card>
      </div>
      <!-- Responses -->
      <div class="w-100 my-4">
        <div>
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <v-alert
                v-bind="props"
                variant="outlined"
                text="La France est une République indivisible, laïque, démocratique et sociale"
                class="mb-2 slide-fade-enter-active cursor-pointer text-grey-darken-3"
                :class="[isHovering ? 'bg-grey-lighten-2': 'bg-grey-lighten-3']"
              />
            </template>
          </v-hover>
          <v-alert text="La souveraineté nationale appartient au peuple" class="mb-2" />
          <v-alert text="La langue de la République est le français" class="mb-2" />
          <v-alert text="La devise de la République est Liberté, Égalité, Fraternité" class="mb-2" />
        </div>
      </div>
      <!-- Submit -->
      <div class="w-100 d-flex justify-space-between mt-8 mb-4">
        <v-btn color="grey-darken-4" variant="outlined">Passer</v-btn>
        <v-btn color="primary" disabled>Vérifier</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useCountdown } from '@/composables/countdown'
const target = Date.now() + 45 * 60 * 1000
const { minutes, seconds, isFinished } = useCountdown(target)

const responses = ref(Array())
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