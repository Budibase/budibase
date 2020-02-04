export const buildStyle = styles => {
  let str = ""
  for (let s in styles) {
    if (styles[s]) {
      str += `${s}: ${styles[s]}; `
    }
  }
  return str
}
