import { writable, get } from "svelte/store"
import { store as frontendStore } from "builderStore"
import { findComponentPath } from "builderStore/storeUtils"

export const DropEffect = {
  MOVE: "move",
  COPY: "copy",
}

export const DropPosition = {
  ABOVE: "above",
  BELOW: "below",
  INSIDE: "inside",
}

export default function() {
  const store = writable({})

  store.actions = {
    dragstart: component => {
      store.update(state => {
        state.dragged = component
        return state
      })
    },
    dragover: ({
      component,
      index,
      canHaveChildrenButIsEmpty,
      mousePosition,
    }) => {
      store.update(state => {
        state.targetComponent = component
        // only allow dropping inside when container is empty
        // if container has children, drag over them

        if (canHaveChildrenButIsEmpty && index === 0) {
          // hovered above center of target
          if (mousePosition < 0.4) {
            state.dropPosition = DropPosition.ABOVE
          }

          // hovered around bottom of target
          if (mousePosition > 0.8) {
            state.dropPosition = DropPosition.BELOW
          }

          // hovered in center of target
          if (mousePosition > 0.4 && mousePosition < 0.8) {
            state.dropPosition = DropPosition.INSIDE
          }
          return state
        }

        // bottom half
        if (mousePosition > 0.5) {
          state.dropPosition = DropPosition.BELOW
        } else {
          state.dropPosition = canHaveChildrenButIsEmpty
            ? DropPosition.INSIDE
            : DropPosition.ABOVE
        }

        return state
      })
    },
    reset: () => {
      store.update(state => {
        state.dropPosition = ""
        state.targetComponent = null
        state.dragged = null
        return state
      })
    },
    drop: () => {
      const state = get(store)

      // Stop if the target and source are the same
      if (state.targetComponent === state.dragged) {
        console.log("same component")
        return
      }
      // Stop if the target or source are null
      if (!state.targetComponent || !state.dragged) {
        console.log("null component")
        return
      }
      // Stop if the target is a child of source
      const path = findComponentPath(state.dragged, state.targetComponent._id)
      if (path?.includes(state.targetComponent._id)) {
        console.log("target is child of course")
        return
      }

      // Cut and paste the component
      frontendStore.actions.components.copy(state.dragged, true)
      frontendStore.actions.components.paste(
        state.targetComponent,
        state.dropPosition
      )
      store.actions.reset()
    },
  }

  return store
}
