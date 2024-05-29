import { get, writable } from "svelte/store"
import { eventStore } from "./events.js"

const createHoverStore = () => {
  const store = writable({
    hoveredComponentId: null,
  })
  let hoverTimeout

  const hoverComponent = (id, notifyBuilder = true) => {
    clearTimeout(hoverTimeout)
    if (id) {
      processHover(id, notifyBuilder)
    } else {
      hoverTimeout = setTimeout(() => {
        processHover(id, notifyBuilder)
      }, 10)
    }
  }

  const processHover = (id, notifyBuilder = true) => {
    if (id === get(store).hoveredComponentId) {
      return
    }
    store.set({ hoveredComponentId: id })
    if (notifyBuilder) {
      eventStore.actions.dispatchEvent("hover-component", { id })
    }
  }

  return {
    ...store,
    actions: {
      hoverComponent,
    },
  }
}

export const hoverStore = createHoverStore()
