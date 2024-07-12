import { writable, derived } from "svelte/store"
import { API } from "api"

export function createRowActionsStore() {
  const store = writable({
    list: [],
    actions: {},
  })
  const derivedStore = derived(store, $store => ({
    ...$store,
  }))

  const fetch = async tableId => {
    const rowActions = await API.fetchRowActions(tableId)

    store.update(state => ({
      ...state,
      list: Object.values(rowActions.actions),
      actions: rowActions.actions,
    }))
  }

  return {
    subscribe: derivedStore.subscribe,
    fetch,
  }
}

export const rowActions = createRowActionsStore()
