export const domDebounce = (callback, extractParams = x => x) => {
  let active = false
  let lastParams
  return (...params) => {
    lastParams = extractParams(...params)
    if (!active) {
      active = true
      requestAnimationFrame(() => {
        callback(lastParams)
        active = false
      })
    }
  }
}
