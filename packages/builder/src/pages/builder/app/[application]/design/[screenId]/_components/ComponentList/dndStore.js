import { writable, get } from "svelte/store"
import { store as frontendStore, selectedScreen } from "builderStore"
import {
  findComponentParent,
  findComponentPath,
} from "builderStore/componentUtils"

export const DropPosition = {
  ABOVE: "above",
  BELOW: "below",
  INSIDE: "inside",
}

const initialState = {
  source: null,
  target: null,
  targetParent: null,
  dropPosition: null,
  dragging: false,
  valid: false,
}

const createDNDStore = () => {
  const store = writable(initialState)
  const actions = {
    dragstart: component => {
      if (!component) {
        return
      }
      store.set({
        source: component,
        target: null,
        dropPosition: null,
        dragging: true,
        valid: false,
      })
    },
    dragover: ({ component, mousePosition }) => {
      const definition = frontendStore.actions.components.getDefinition(
        component._component
      )
      const canHaveChildren = definition?.hasChildren
      const hasChildren = component._children?.length > 0

      let dropPosition
      let target
      let targetParent

      // If it can have children then it can be any position
      if (canHaveChildren) {
        if (mousePosition <= 0.33) {
          dropPosition = DropPosition.ABOVE
        } else if (mousePosition >= 0.66) {
          dropPosition = DropPosition.BELOW
        } else {
          dropPosition = DropPosition.INSIDE
        }
      }

      // Otherwise drop either above or below
      else {
        dropPosition =
          mousePosition > 0.5 ? DropPosition.BELOW : DropPosition.ABOVE
      }

      // If hovering over a component with children and attempting to drop
      // below, we need to change this to be above the first child instead
      if (dropPosition === DropPosition.BELOW && hasChildren) {
        target = component._children[0]
        dropPosition = DropPosition.ABOVE
      } else {
        target = component
      }

      // If drop position and target are the same then we can skip this update
      const state = get(store)
      if (
        dropPosition === state.dropPosition &&
        target?._id === state.target?._id
      ) {
        return
      }

      // Find the parent of the target component
      if (target) {
        targetParent = findComponentParent(
          get(selectedScreen).props,
          target._id
        )
      }

      store.update(state => {
        return {
          ...state,
          dropPosition,
          target,
          targetParent,

          /// Mark as invalid if the target is a child of the source
          valid: findComponentPath(state.source, target._id)?.length === 0,
        }
      })
    },
    reset: () => {
      store.set(initialState)
    },
    drop: async () => {
      const state = get(store)
      if (!state.valid || !state.source || !state.target) {
        return
      }
      actions.reset()

      // Cut and paste the component
      frontendStore.actions.components.copy(state.source, true, false)
      await frontendStore.actions.components.paste(
        state.target,
        state.dropPosition
      )
    },
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const dndStore = createDNDStore()
