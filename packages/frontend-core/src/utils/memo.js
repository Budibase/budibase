import { writable, get, derived } from "svelte/store"

// A simple svelte store which deeply compares all changes and ensures that
// subscribed children will only fire when a new value is actually set
export const memo = initialValue => {
  const store = writable(initialValue)
  let currentJSON = JSON.stringify(initialValue)

  const tryUpdateValue = newValue => {
    const newJSON = JSON.stringify(newValue)
    if (newJSON !== currentJSON) {
      store.set(newValue)
      currentJSON = newJSON
    }
  }

  return {
    subscribe: store.subscribe,
    set: tryUpdateValue,
    update: updateFn => {
      let mutableCurrentValue = JSON.parse(currentJSON)
      const newValue = updateFn(mutableCurrentValue)
      tryUpdateValue(newValue)
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
