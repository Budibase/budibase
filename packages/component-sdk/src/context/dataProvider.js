import { writable } from "svelte/store"

export const createDataProviderContext = () => {
  const store = writable({
    rows: [],
    table: null,
  })
  const setRows = rows => {
    store.update(state => {
      state.rows = rows
      return state
    })
  }
  const setTable = table => {
    store.update(state => {
      state.table = table
      return state
    })
  }
  return {
    subscribe: store.subscribe,
    actions: { setRows, setTable },
  }
}
