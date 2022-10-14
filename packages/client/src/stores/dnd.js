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

  const startDraggingExistingComponent = ({ id, parent, bounds, index }) => {
    store.set({
      ...initialState,
      source: { id, parent, bounds, index },
    })
  }

  const startDraggingNewComponent = ({ component, definition }) => {
    if (!component || !definition) {
      return
    }

    // Get size of new component so we can show a properly sized placeholder
    const width = definition.size?.width || 128
    const height = definition.size?.height || 64

    store.set({
      ...initialState,
      source: {
        id: null,
        parent: null,
        bounds: { height, width },
        index: null,
        newComponentType: component,
      },
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
      startDraggingExistingComponent,
      startDraggingNewComponent,
      updateTarget,
      updateDrop,
      reset,
    },
  }
}

export const dndStore = createDndStore()

// The DND store is updated extremely frequently, so we can greatly improve
// performance by deriving any state that needs to be externally observed.
// By doing this and using primitives, we can avoid invalidating other stores
// or components which depend on DND state unless values actually change.
export const dndIsDragging = derived(dndStore, $dndStore => !!$dndStore.source)
export const dndParent = derived(dndStore, $dndStore => $dndStore.drop?.parent)
export const dndIndex = derived(dndStore, $dndStore => $dndStore.drop?.index)
export const dndBounds = derived(
  dndStore,
  $dndStore => $dndStore.source?.bounds
)
export const dndIsNewComponent = derived(
  dndStore,
  $dndStore => $dndStore.source?.newComponentType != null
)
