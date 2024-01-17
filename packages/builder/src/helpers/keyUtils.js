function handleEnter(fnc) {
  return e => e.key === "Enter" && fnc()
}

export const keyUtils = {
  handleEnter,
}
