import { writable, get } from "svelte/store"
import { tables } from "./"

export function createRowsStore() {
  const { subscribe } = writable([])

  return {
    subscribe,
    save: () => tables.select(get(tables).selected),
    delete: () => tables.select(get(tables).selected),
  }
}

export const rows = createRowsStore()
