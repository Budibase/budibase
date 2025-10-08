interface Input {
  max: number
  pad: number
  fallback: string
}

export const cleanInput = ({ max, pad, fallback }: Input) => {
  return (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.value) {
      const value = parseInt(target.value)
      if (isNaN(value)) {
        target.value = fallback
      } else {
        target.value = Math.min(max, value).toString().padStart(pad, "0")
      }
    } else {
      target.value = fallback
    }
  }
}
