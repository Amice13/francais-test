export function useCountdown (targetTimestamp: number) {
  const remainingMs = ref(Math.max(targetTimestamp - Date.now(), 0))
  const isPaused = ref(false)
  let timer: number | undefined

  const tick = () => {
    if (isPaused.value || remainingMs.value === 0) return
    remainingMs.value = Math.max(remainingMs.value - 1000, 0)
  }

  const seconds = computed(() =>
    String(Math.floor(remainingMs.value / 1000) % 60).padStart(2, '0')
  )

  const minutes = computed(() =>
    String(Math.floor(remainingMs.value / (1000 * 60)) % 60).padStart(2, '0')
  )

  const hours = computed(() =>
    String(Math.floor(remainingMs.value / (1000 * 60 * 60))).padStart(2, '0')
  )

  const isFinished = computed(() => remainingMs.value === 0)

  const pause = () => {
    isPaused.value = true
  }

  const resume = () => {
    isPaused.value = false
  }

  const reset = (newTargetTimestamp: number) => {
    remainingMs.value = Math.max(newTargetTimestamp - Date.now(), 0)
    isPaused.value = false
  }

  const add = (miliseconds: number) => {
    remainingMs.value = remainingMs.value + miliseconds
  }

  onMounted(() => {
    timer = window.setInterval(tick, 1000)
  })

  onUnmounted(() => {
    if (timer !== undefined) {
      clearInterval(timer)
    }
  })

  return {
    hours,
    minutes,
    seconds,
    isFinished,
    isPaused,
    add,
    pause,
    resume,
    reset
  }
}
