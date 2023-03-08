import { store } from "builderStore/index"
import { get } from "svelte/store"

const registerNode = async (node, tourStepKey) => {
  if (!node) {
    console.log("Tour Handler - an anchor node is required")
  }

  if (!get(store).tourKey) {
    console.log("Tour Handler - No active tour ", tourStepKey, node)
    return
  }

  store.update(state => {
    const update = {
      ...state,
      tourNodes: {
        ...state.tourNodes,
        [tourStepKey]: node,
      },
    }
    return update
  })
}

export function tourHandler(node, tourStepKey) {
  if (node && tourStepKey) {
    registerNode(node, tourStepKey)
  }
  return {
    destroy: () => {
      const updatedTourNodes = get(store).tourNodes
      if (updatedTourNodes && updatedTourNodes[tourStepKey]) {
        delete updatedTourNodes[tourStepKey]
        store.update(state => {
          const update = {
            ...state,
            tourNodes: {
              ...updatedTourNodes,
            },
          }
          return update
        })
      }
    },
  }
}
