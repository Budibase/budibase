import { isObject } from "lodash/fp"
import { parseBinding } from "./parseBinding"

export const setState = (store, path, value) => {
  if (!path || path.length === 0) return

  const pathParts = path.split(".")

  const safeSetPath = (state, currentPartIndex = 0) => {
    const currentKey = pathParts[currentPartIndex]

    if (pathParts.length - 1 == currentPartIndex) {
      state[currentKey] = value
      return
    }

    if (
      state[currentKey] === null ||
      state[currentKey] === undefined ||
      !isObject(state[currentKey])
    ) {
      state[currentKey] = {}
    }

    safeSetPath(state[currentKey], currentPartIndex + 1)
  }

  store.update(state => {
    safeSetPath(state)
    return state
  })
}

export const setStateFromBinding = (store, binding, value) => {
  const parsedBinding = parseBinding(binding)
  if (!parsedBinding) return
  return setState(store, parsedBinding.path, value)
}
