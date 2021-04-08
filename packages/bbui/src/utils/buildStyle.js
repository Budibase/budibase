export default function buildStyle(styles) {
  const convertCamel = str => {
    return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
  }

  let str = ""
  for (let s in styles) {
    if (styles[s]) {
      let key = convertCamel(s)
      str += `${key}: ${styles[s]}; `
    }
  }
  return str
}
