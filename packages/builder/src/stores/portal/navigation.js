import { writable } from "svelte/store"

export function createNavigationStore() {
  const store = writable({
    initialisated: false,
    goto: undefined,
  })
  const { set, subscribe, get } = store

  const init = gotoFunc => {
    if (typeof gotoFunc !== "function") {
      throw new Error('A valid "gotoFunc" must be provided')
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
