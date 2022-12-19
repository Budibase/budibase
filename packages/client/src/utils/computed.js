import { writable } from "svelte/store"

/**
 * Extension of Svelte's built in "derived" stores, which the addition of deep
 * comparison of non-primitives. Falls back to using shallow comparison for
 * primitive types to avoid performance penalties.
 * Useful for instances where a deep comparison is cheaper than an additional
 * store invalidation.
 * @param store the store to observer
 * @param deriveValue the derivation function
 * @returns {Writable<*>} a derived svelte store containing just the derived value
 */
export const computed = (store, deriveValue) => {
  const initialValue = deriveValue(store)
  const computedStore = writable(initialValue)
  let lastKey = getKey(initialValue)

  store.subscribe(state => {
    const value = deriveValue(state)
    const key = getKey(value)
    if (key !== lastKey) {
      lastKey = key
      computedStore.set(value)
    }
  })

  return computedStore
}

// Helper function to serialise any value into a primitive which can be cheaply
// and shallowly compared
const getKey = value => {
  if (value == null || typeof value !== "object") {
    return value
  } else {
    return JSON.stringify(value)
  }
}
