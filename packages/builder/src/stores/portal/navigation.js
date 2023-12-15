import { writable } from "svelte/store"

export function createNavigationStore() {
  const { subscribe } = writable([])

  let initialisated = false
  let _goTo

  const init = goToFunc => {
    initialisated = true
    if (typeof goToFunc !== "function") {
      throw new Error('A valid "goToFunc" must be provided')
    }

    _goTo = goToFunc
  }

  const goTo = (...params) => {
    if (!initialisated) {
      throw new Error("You need to call navigation.init first")
    }

    _goTo(...params)
  }

  return {
    subscribe,
    actions: {
      init,
      goTo,
    },
  }
}

export const navigation = createNavigationStore()
