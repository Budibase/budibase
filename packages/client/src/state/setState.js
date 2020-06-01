import set from "lodash/fp/set"
import { appStore } from "./store"

export const setState = (path, value) => {
  if (!path || path.length === 0) return

  appStore.update(state => {
    state = set(path, value, state)
    return state
  })
}

// export const setStateFromBinding = (store, binding, value) => {
//   const parsedBinding = parseBinding(binding)
//   if (!parsedBinding) return
//   return setState(store, parsedBinding.path, value)
// }
