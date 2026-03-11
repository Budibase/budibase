export const createAutoRefresh = () => {
  let interval: ReturnType<typeof setInterval>

  const setUp = (
    autoRefresh: number | null | undefined,
    callback?: () => void
  ) => {
    clearInterval(interval)
    if (autoRefresh && callback) {
      interval = setInterval(callback, Math.max(10000, autoRefresh * 1000))
    }
  }

  const clear = () => {
    clearInterval(interval)
  }

  return {
    setUp,
    clear,
  }
}
