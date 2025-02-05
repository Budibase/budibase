import { writable, get } from "svelte/store"
import { derivedMemo } from "@budibase/frontend-core"
import { screenStore } from "@/stores"
import { ScreenslotID } from "@/constants"

const createDndStore = () => {
  const initialState = {
    // Info about the dragged component
    source: null,

    // Info about the target component being hovered over
    target: null,

    // Info about where the component would be dropped
    drop: null,

    // Metadata about the event
    meta: {
      initialised: false,
      newComponentProps: null,
    },
  }
  const store = writable(initialState)

  const startDraggingExistingComponent = ({ id, parent, bounds, index }) => {
    store.set({
      ...initialState,
      source: { id, parent, bounds, index },
    })
  }

  const startDraggingNewComponent = ({ component, definition }) => {
    console.log("start", component, definition)
    if (!component) {
      return
    }

    let target, drop
    const screen = get(screenStore)?.activeScreen
    const isGridScreen = screen?.props?.layout === "grid"
    if (isGridScreen) {
      const id = screen?.props?._id
      drop = {
        parent: id,
        index: screen?.props?._children?.length,
      }
      target = {
        id,
        parent: ScreenslotID,
        node: null,
        empty: false,
        acceptsChildren: true,
      }
    }

    // Get size of new component so we can show a properly sized placeholder
    const width = definition?.size?.width || 128
    const height = definition?.size?.height || 64

    store.set({
      ...initialState,
      isGridScreen,
      source: {
        id: null,
        parent: null,
        bounds: { height, width },
        index: null,
        newComponentType: component,
      },
      target,
      drop,
    })
  }

  const updateTarget = ({ id, parent, node, empty, acceptsChildren }) => {
    store.update(state => {
      state.target = { id, parent, node, empty, acceptsChildren }
      console.log("TARGET", state.target)
      return state
    })
  }

  const updateDrop = ({ parent, index }) => {
    store.update(state => {
      state.drop = { parent, index }
      console.log("DROP", state.drop)
      return state
    })
  }

  const reset = () => {
    store.set(initialState)
  }

  const markInitialised = () => {
    store.update(state => ({
      ...state,
      meta: {
        ...state.meta,
        initialised: true,
      },
    }))
  }

  const updateNewComponentProps = newComponentProps => {
    store.update(state => ({
      ...state,
      meta: {
        ...state.meta,
        newComponentProps,
      },
    }))
  }

  return {
    subscribe: store.subscribe,
    actions: {
      startDraggingExistingComponent,
      startDraggingNewComponent,
      updateTarget,
      updateDrop,
      reset,
      markInitialised,
      updateNewComponentProps,
    },
  }
}

export const dndStore = createDndStore()

// The DND store is updated extremely frequently, so we can greatly improve
// performance by deriving any state that needs to be externally observed.
// By doing this and using primitives, we can avoid invalidating other stores
// or components which depend on DND state unless values actually change.
export const dndParent = derivedMemo(dndStore, x => x.drop?.parent)
export const dndIndex = derivedMemo(dndStore, x => x.drop?.index)
export const dndBounds = derivedMemo(dndStore, x => x.source?.bounds)
export const dndIsDragging = derivedMemo(dndStore, x => !!x.source)
export const dndInitialised = derivedMemo(dndStore, x => x.meta.initialised)
export const dndIsNewComponent = derivedMemo(
  dndStore,
  x => x.source?.newComponentType != null
)
