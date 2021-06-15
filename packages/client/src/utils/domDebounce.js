export const domDebounce = callback => {
  let active = false
  return e => {
    if (!active) {
      window.requestAnimationFrame(() => {
        callback(e)
        active = false
      })
      active = true
    }
  }
}
