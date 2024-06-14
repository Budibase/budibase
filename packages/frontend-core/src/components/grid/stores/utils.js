import { createLocalStorageStore } from "../../../stores/localStorage"
import { get, writable } from "svelte/store"
import { cachedMemo, memo } from "../../../utils"

export const createUtils = context => {
  const { props, gridID } = context
  const $props = get(props)

  const createCachedStore = (name, initialValue) => {
    if ($props.cache) {
      return createLocalStorageStore(`bb-grid-${gridID}-${name}`, initialValue)
    } else {
      return writable(initialValue)
    }
  }

  const createCachedMemo = (name, initialValue) => {
    if ($props.cache) {
      return cachedMemo(`bb-grid-${gridID}-${name}`, initialValue)
    } else {
      return memo(initialValue)
    }
  }

  return {
    createCachedStore,
    createCachedMemo,
  }
}
