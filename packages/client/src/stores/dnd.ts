import { ScreenslotID } from "@/constants"
import { componentStore, isGridScreen, screenStore } from "@/stores"
import { derivedMemo } from "@budibase/frontend-core"
import { get, writable } from "svelte/store"

interface DNDSource {
  id?: string
  parent?: string
  index?: number
  bounds: {
    height: number
    width: number
  }
  name?: string
  icon?: string
  type: string
  isNew: boolean
}

interface DNDTarget {
  id: string
  parent: string
  empty: boolean
  acceptsChildren: boolean
  element?: HTMLElement
}

interface DNDDrop {
  parent: string
  index: number
}

interface DNDMeta {
  props?: Record<string, any>
}

interface DNDState {
  source?: DNDSource
  target?: DNDTarget
  drop?: DNDDrop
  meta?: DNDMeta
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
      const id = screen!.props._id
      target = {
        id: id!,
        parent: ScreenslotID,
        empty: false,
        acceptsChildren: true,
      }
      drop = {
        parent: id!,
        index: screen?.props?._children?.length || 0,
      }
    }

    // Get size of new component so we can show a properly sized placeholder
    const definition = componentStore.actions.getComponentDefinition(type)
    const width =
      (definition && "size" in definition && definition.size?.width) || 128
    const height =
      (definition && "size" in definition && definition.size?.height) || 64

    store.set({
      source: {
        bounds: { height, width },
        type,
        isNew: true,
        name: `New ${(definition && "name" in definition && definition.name) || "component"}`,
        icon:
          (definition && "icon" in definition && definition.icon) ||
          "selection",
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

  const updateNewComponentProps = (props: Record<string, any>) => {
    store.update(state => {
      return {
        ...state,
        meta: {
          ...state.meta,
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
export const dndSource = derivedMemo(dndStore, x => x.source)
export const dndIsDragging = derivedMemo(dndStore, x => !!x.source)
