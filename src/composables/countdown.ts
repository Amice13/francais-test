export function useCountdown (targetTimestamp: number) {
  const now = ref(Date.now())
  let timer: number | undefined

  const remainingMs = computed(() =>
    Math.max(targetTimestamp - now.value, 0)
  )

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

  onMounted(() => {
    timer = window.setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return {
    hours,
    minutes,
    seconds,
    isFinished
  }
}
