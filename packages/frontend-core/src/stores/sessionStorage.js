import { get, writable } from "svelte/store"

export const createSessionStorageStore = (sessionStorageKey, initialValue) => {
  const store = writable(initialValue, () => {
    // Hydrate from session storage when we get a new subscriber
    hydrate()

    // Listen for session storage changes and keep store in sync
    const storageListener = ({ key }) => {
      return key === sessionStorageKey && hydrate()
    }

    window.addEventListener("storage", storageListener)
    return () => window.removeEventListener("storage", storageListener)
  })

  // New store setter which updates the store and sessionstorage
  const set = value => {
    store.set(value)
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(value))
  }

  // New store updater which updates the store and sessionstorage
  const update = updaterFn => set(updaterFn(get(store)))

  // Hydrates the store from sessionstorage
  const hydrate = () => {
    const sessionValue = sessionStorage.getItem(sessionStorageKey)
    if (sessionValue == null) {
      set(initialValue)
    } else {
      try {
        store.set(JSON.parse(sessionValue))
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
