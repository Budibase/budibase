import { writable } from "svelte/store"

export function createNavigationStore() {
  const store = writable({
    initialisated: false,
    goto: undefined,
  })
  const { set, subscribe } = store

  const init = gotoFunc => {
    if (typeof gotoFunc !== "function") {
      throw new Error(`gotoFunc must be a function, found a "${typeof gotoFunc}" instead`)
    }

    set({
      initialisated: true,
      goto: gotoFunc,
    })
  }

  return {
    subscribe,
    actions: {
      init,
    },
  }
}

export const navigation = createNavigationStore()
