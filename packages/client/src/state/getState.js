// import { isUndefined, isObject } from "lodash/fp"
import { get } from "svelte/store"
import getOr from "lodash/fp/getOr"
import { appStore } from "./store"

export const getState = (path, fallback) => {
  if (!path || path.length === 0) return fallback

  return getOr(fallback, path, get(appStore))
}
