import set from "lodash/fp/set"
import { appStore } from "./store"

export const setState = (path, value) => {
  if (!path || path.length === 0) return

  appStore.update(state => {
    state = set(path, value, state)
    return state
  })
}
