import { writable } from "svelte/store"
import { store as frontendStore } from "builderStore"

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
          return
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
      store.update(state => {
        if (state.targetComponent !== state.dragged) {
          frontendStore.actions.components.copy(state.dragged, true)
          frontendStore.actions.components.paste(
            state.targetComponent,
            state.dropPosition
          )
        }

        store.actions.reset()

        return state
      })
    },
  }

  return store
}
