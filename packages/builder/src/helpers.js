export const buildStyle = styles => {
  let str = ""
  for (let s in styles) {
    if (styles[s]) {
      str += `${s}: ${styles[s]}; `
    }
  }
  return str
}

export const convertCamel = str => {
  return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
}
