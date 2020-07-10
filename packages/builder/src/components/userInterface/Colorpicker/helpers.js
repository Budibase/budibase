export function buildStyle(styles) {
  let str = ""
  for (let s in styles) {
    if (styles[s]) {
      let key = convertCamel(s)
      str += `${key}: ${styles[s]}; `
    }
  }
  return str
}

export const convertCamel = str => {
  return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
}

export const debounce = (fn, milliseconds, callImmediately) => {
  const debouncedFn = () => {
    setTimeout(fn, milliseconds)
  }
  if (callImmediately) {
    debouncedFn()
  }
  return debouncedFn
}
