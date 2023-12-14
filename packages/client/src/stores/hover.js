import { get, writable } from "svelte/store"
import { eventStore } from "./events.js"

const createHoverStore = () => {
  const store = writable({
    hoveredComponentId: null,
  })

  const hoverComponent = id => {
    if (id === get(store).hoveredComponentId) {
      return
    }
    store.set({ hoveredComponentId: id })
    eventStore.actions.dispatchEvent("hover-component", { id })
  }

  return {
    ...store,
    actions: {
      hoverComponent,
    },
  }
}

export const hoverStore = createHoverStore()
