import { writable, get, derived } from "svelte/store"

// A simple svelte store which deeply compares all changes and ensures that
// subscribed children will only fire when a new value is actually set
export const memo = initialValue => {
  const store = writable(initialValue)

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

// Enriched version of svelte's derived store which returns a memo
export const derivedMemo = (store, derivation) => {
  const derivedStore = derived(store, derivation)
  const memoStore = memo(get(derivedStore))
  derivedStore.subscribe(memoStore.set)
  return memoStore
}
