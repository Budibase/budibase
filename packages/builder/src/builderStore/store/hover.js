import { get, writable } from "svelte/store"
import { store as builder } from "builderStore"

export const getHoverStore = () => {
  const initialValue = {
    componentId: null,
  }

  const store = writable(initialValue)

  const update = (componentId, notifyClient = true) => {
    if (componentId === get(store).componentId) {
      return
    }
    store.update(state => {
      state.componentId = componentId
      return state
    })
    if (notifyClient) {
      builder.actions.preview.sendEvent("hover-component", componentId)
    }
  }
  return {
    subscribe: store.subscribe,
    actions: { update },
  }
}
