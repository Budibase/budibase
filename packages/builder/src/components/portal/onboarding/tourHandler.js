import { builderStore } from "stores/frontend"
import { get } from "svelte/store"

const registerNode = async (node, tourStepKey) => {
  if (!node) {
    console.log("Tour Handler - an anchor node is required")
  }

  if (!get(builderStore).tourKey) {
    console.log("Tour Handler - No active tour ", tourStepKey, node)
    return
  }

  builderStore.registerTourNode(tourStepKey, node)
}

export function tourHandler(node, tourStepKey) {
  if (node && tourStepKey) {
    registerNode(node, tourStepKey)
  }
  return {
    destroy: () => {
      builderStore.destroyTourNode(tourStepKey)
    },
  }
}
