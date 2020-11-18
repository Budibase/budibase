import { getContext } from "svelte"
import { writable } from "svelte/store"

export const createDataProviderStore = () => {
  const { API } = getContext("app")

  const store = writable({
    row: {},
    table: null,
  })
  const setRow = async row => {
    let table
    if (row && row.tableId) {
      table = await API.fetchTableDefinition(row.tableId)
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
