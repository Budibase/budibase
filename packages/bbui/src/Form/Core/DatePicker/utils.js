export const cleanInput = ({ max, pad, fallback }) => {
  return e => {
    if (e.target.value) {
      const value = parseInt(e.target.value)
      if (isNaN(value)) {
        e.target.value = fallback
      } else {
        e.target.value = Math.min(max, value).toString().padStart(pad, "0")
      }
    } else {
      e.target.value = fallback
    }
  }
}
