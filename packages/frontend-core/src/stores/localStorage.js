import { get, writable } from "svelte/store"

export const createLocalStorageStore = (localStorageKey, initialValue) => {
  const store = writable(initialValue, () => {
    // Hydrate from local storage when we get a new subscriber
    hydrate()

    // Listen for local storage changes and keep store in sync
    const storageListener = ({ key }) => key === localStorageKey && hydrate()
    window.addEventListener("storage", storageListener)
    return () => window.removeEventListener("storage", storageListener)
  })

  // New store setter which updates the store and localstorage
  const set = value => {
    store.set(value)
    localStorage.setItem(localStorageKey, JSON.stringify(value))
  }

  // New store updater which updates the store and localstorage
  const update = updaterFn => set(updaterFn(get(store)))

  // Hydrates the store from localstorage
  const hydrate = () => {
    const localValue = localStorage.getItem(localStorageKey)
    if (localValue == null) {
      set(initialValue)
    } else {
      try {
        store.set(JSON.parse(localValue))
      } catch {
        set(initialValue)
      }
    }
  }

  // Patch the default svelte store functions with our overrides
  return {
    ...store,
    set,
    update,
  }
}
