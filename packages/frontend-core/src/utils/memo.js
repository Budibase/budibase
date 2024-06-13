import { writable, get, derived } from "svelte/store"
import { createLocalStorageStore } from "../stores/localStorage"

// Returns a memoized version of another store
const memoize = store => {
  const tryUpdateValue = (newValue, currentValue) => {
    // Sanity check for primitive equality
    if (currentValue === newValue) {
      return
    }

    // Otherwise deep compare via JSON stringify
    const currentString = JSON.stringify(currentValue)
    const newString = JSON.stringify(newValue)
    if (currentString !== newString) {
      store.set(newValue)
    }
  }

  return {
    subscribe: store.subscribe,
    set: newValue => {
      const currentValue = get(store)
      tryUpdateValue(newValue, currentValue)
    },
    update: updateFn => {
      const currentValue = get(store)
      let mutableCurrentValue = JSON.parse(JSON.stringify(currentValue))
      const newValue = updateFn(mutableCurrentValue)
      tryUpdateValue(newValue, currentValue)
    },
  }
}

// A simple svelte store which deeply compares all changes and ensures that
// subscribed children will only fire when a new value is actually set
export const memo = initialValue => {
  return memoize(writable(initialValue))
}

// A memoized version of a store cached in local storage
export const cachedMemo = (key, initialValue) => {
  return memoize(createLocalStorageStore(key, initialValue))
}

// Enriched version of svelte's derived store which returns a memo
export const derivedMemo = (store, derivation) => {
  const derivedStore = derived(store, derivation)
  const memoStore = memo(get(derivedStore))
  derivedStore.subscribe(memoStore.set)
  return memoStore
}
