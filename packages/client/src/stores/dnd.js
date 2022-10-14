import { writable, derived } from "svelte/store"

const createDndStore = () => {
  const initialState = {
    // Info about the dragged component
    source: null,

    // Info about the target component being hovered over
    target: null,

    // Info about where the component would be dropped
    drop: null,
  }
  const store = writable(initialState)

  // newComponentType is an optional field to signify we are creating a new
  // component rather than moving an existing one
  const startDragging = ({ id, parent, bounds, index, newComponentType }) => {
    store.set({
      ...initialState,
      source: { id, parent, bounds, index, newComponentType },
    })
  }

  const updateTarget = ({ id, parent, node, empty, acceptsChildren }) => {
    store.update(state => {
      state.target = { id, parent, node, empty, acceptsChildren }
      return state
    })
  }

  const updateDrop = ({ parent, index }) => {
    store.update(state => {
      state.drop = { parent, index }
      return state
    })
  }

  const reset = () => {
    store.set(initialState)
  }

  return {
    subscribe: store.subscribe,
    actions: {
      startDragging,
      updateTarget,
      updateDrop,
      reset,
    },
  }
}

export const dndStore = createDndStore()
export const dndParent = derived(dndStore, $dndStore => $dndStore.drop?.parent)
export const dndIndex = derived(dndStore, $dndStore => $dndStore.drop?.index)
export const dndBounds = derived(
  dndStore,
  $dndStore => $dndStore.source?.bounds
)
