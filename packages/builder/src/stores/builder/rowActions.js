import { writable } from "svelte/store"
import { API } from "api"

export function createRowActionStore() {
  const store = writable([])

  return {
    subscribe: store.subscribe,
    fetch: async tableId => {
      const response = await API.get({
        url: `/api/tables/${tableId}/actions`,
      })

      store.update(_store => {
        return Object.values(response.actions)
      })
    },
    save: async (tableId, rowAction) => {
      return await API.post({
        url: `/api/tables/${tableId}/actions`,
        body: {
          ...rowAction,
        },
      })
    },
  }
}

export const rowActions = createRowActionStore()
