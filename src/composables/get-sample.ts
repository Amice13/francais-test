export const getSampleOfUnique = <T>(arr: readonly T[], k: number): T[] => {
  if (k > arr.length) {
    throw new RangeError('Sample size cannot exceed array length')
  }
  const copy = arr.slice()
  const result: T[] = []
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i))
    const tmp = copy[i]
    copy[i] = copy[j] as T
    copy[j] = tmp as T
    if (copy[i] !== undefined) result.push(copy[i] as T)
  }
  return result
}
