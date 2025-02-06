import { writable, get } from "svelte/store"
import { derivedMemo } from "@budibase/frontend-core"
import { screenStore, isGridScreen, componentStore } from "stores/index"
import { ScreenslotID } from "@/constants"
import { ComponentDefinition } from "@budibase/types"

interface DNDSource {
  id?: string
  parent?: string
  index?: number
  bounds: {
    height: number
    width: number
  }
  name: string
  icon: string
  type: string
  isNew: boolean
  props?: Record<string, any>
}

interface DNDTarget {
  id: string
  parent: string
  empty: boolean
  acceptsChildren: boolean
  node?: Node
}

interface DNDDrop {
  parent: string
  index: number
}

interface DNDState {
  source?: DNDSource
  target?: DNDTarget
  drop?: DNDDrop
}

const createDndStore = () => {
  const store = writable<DNDState>({})

  const startDraggingExistingComponent = (source: Omit<DNDSource, "isNew">) => {
    store.set({
      source: {
        ...source,
        isNew: false,
      },
    })
  }

  const startDraggingNewComponent = (type: string) => {
    // On grid screens, we already know exactly where to insert the component
    let target: DNDTarget | undefined = undefined
    let drop: DNDDrop | undefined = undefined
    if (get(isGridScreen)) {
      const screen = get(screenStore)?.activeScreen
      const id = screen.props._id
      target = {
        id,
        parent: ScreenslotID,
        empty: false,
        acceptsChildren: true,
      }
      drop = {
        parent: id,
        index: screen?.props?._children?.length,
      }
    }

    // Get size of new component so we can show a properly sized placeholder
    const definition: ComponentDefinition =
      componentStore.actions.getComponentDefinition(type)
    const width = definition?.size?.width || 128
    const height = definition?.size?.height || 64

    store.set({
      source: {
        bounds: { height, width },
        type,
        isNew: true,
        name: `New ${definition?.name || "component"}`,
        icon: definition?.icon || "Selection",
      },
      target,
      drop,
    })
  }

  const updateTarget = (target: DNDTarget) => {
    store.update(state => {
      state.target = target
      return state
    })
  }

  const updateDrop = (drop: DNDDrop) => {
    store.update(state => {
      state.drop = drop
      return state
    })
  }

  const reset = () => {
    store.set({})
  }

  const updateSourceProps = (props: Record<string, any>) => {
    store.update(state => {
      if (!state.source) {
        return state
      }
      return {
        ...state,
        source: {
          ...state.source,
          props,
        },
      }
    })
  }

  return {
    subscribe: store.subscribe,
    actions: {
      startDraggingExistingComponent,
      startDraggingNewComponent,
      updateTarget,
      updateDrop,
      reset,
      updateSourceProps,
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
export const dndSource = derivedMemo(dndStore, x => x.source)
export const dndIsDragging = derivedMemo(dndStore, x => !!x.source)
