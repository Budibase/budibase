export const createSaveCoordinator = (persist: () => Promise<boolean>) => {
  let flushPromise: Promise<boolean> | null = null
  let saveAgain = false

  const save = (): Promise<boolean> => {
    saveAgain = true

    if (!flushPromise) {
      flushPromise = Promise.resolve().then(async () => {
        let result = false
        while (saveAgain) {
          saveAgain = false
          result = await persist()
        }
        flushPromise = null
        return result
      })
    }

    return flushPromise
  }

  return { save }
}
