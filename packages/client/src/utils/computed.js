import { writable } from "svelte/store"

const getKey = value => {
  if (value == null || typeof value !== "object") {
    return value
  } else {
    return JSON.stringify(value)
  }
}

export const computed = (store, getValue) => {
  const initialValue = getValue(store)
  const computedStore = writable(initialValue)
  let lastKey = getKey(initialValue)

  store.subscribe(state => {
    const value = getValue(state)
    const key = getKey(value)
    if (key !== lastKey) {
      lastKey = key
      computedStore.set(value)
    }
  })

  return computedStore
}
