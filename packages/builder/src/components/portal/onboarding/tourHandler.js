import { _ } from "../../../../lang/i18n"
import { store } from "builderStore/index"
import { get } from "svelte/store"

const registerNode = async (node, tourStepKey) => {
  if (!node) {
    console.log($_("components.portal.onboarding.tourHandler.First"))
  }

  if (!get(store).tourKey) {
    console.log(
      $_("components.portal.onboarding.tourHandler.Second"),
      tourStepKey,
      node
    )
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
