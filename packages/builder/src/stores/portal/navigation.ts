import { writable } from "svelte/store"

type GotoFuncType = (path: string) => void

interface PortalNavigationStore {
  initialisated: boolean
  goto: GotoFuncType
}

export function createNavigationStore() {
  const store = writable<PortalNavigationStore>({
    initialisated: false,
    goto: undefined as any,
  })
  const { set, subscribe } = store

  const init = (gotoFunc: GotoFuncType) => {
    if (typeof gotoFunc !== "function") {
      throw new Error(
        `gotoFunc must be a function, found a "${typeof gotoFunc}" instead`
      )
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
