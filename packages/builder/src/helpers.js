import { last } from "lodash/fp"
import { pipe } from "components/common/core"

export const buildStyle = styles => {
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

export const capitalise = s => s.substring(0, 1).toUpperCase() + s.substring(1)

export const get_name = s => (!s ? "" : last(s.split("/")))

export const get_capitalised_name = name => pipe(name, [get_name, capitalise])
