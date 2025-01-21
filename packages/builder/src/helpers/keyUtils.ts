function handleEnter(fnc: () => void) {
  return (e: KeyboardEvent) => e.key === "Enter" && fnc()
}

export const keyUtils = {
  handleEnter,
}
