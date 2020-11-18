import { writable } from "svelte/store"
import { fetchTableDefinition } from "../api"

export const createDataProviderStore = () => {
  const store = writable({
    row: {},
    table: null,
  })
  const setRow = async row => {
    let table
    if (row && row.tableId) {
      table = await fetchTableDefinition(row.tableId)
    }
    store.update(state => {
      state.row = row
      state.table = table
      return state
    })
  }
  return {
    subscribe: store.subscribe,
    actions: { setRow },
  }
}
