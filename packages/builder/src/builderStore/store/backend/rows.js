import { writable, get } from "svelte/store"
import { views } from "./"

function createRowsStore() {
  const { subscribe } = writable([])

  return {
    subscribe,
    save: () => views.select(get(views).selected),
    delete: () => views.select(get(views).selected),
  }
}

export const rows = createRowsStore()
