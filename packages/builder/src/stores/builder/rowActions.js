import { writable } from "svelte/store"
import { API } from "api"

export function createRowActionStore() {
  const store = writable([])
  console.error(store)

  function sort(array) {
    return array.sort((a, b) => a.name.localeCompare(b.name))
  }

  return {
    subscribe: store.subscribe,
    fetch: async tableId => {
      store.set([])
      const response = await API.get({
        url: `/api/tables/${tableId}/actions`,
      })

      store.set(sort(Object.values(response.actions)))
    },
    save: async (tableId, rowAction) => {
      const response = await API.post({
        url: `/api/tables/${tableId}/actions`,
        body: {
          ...rowAction,
        },
      })

      store.update(store => {
        return sort([...store, response])
      })
    },
    update: async (tableId, rowAction) => {
      const rowActionId = rowAction.id
      const response = await API.put({
        url: `/api/tables/${tableId}/actions/${rowActionId}`,
        body: {
          ...rowAction,
        },
      })

      store.update(store => {
        return sort([...store.filter(f => f.id !== rowActionId), response])
      })
    },
  }
}

export const rowActions = createRowActionStore()
