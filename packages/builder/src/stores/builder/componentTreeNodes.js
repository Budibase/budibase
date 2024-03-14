import { get } from "svelte/store"
import { createSessionStorageStore } from "@budibase/frontend-core"
import { selectedScreen as selectedScreenStore } from "./screens"
import { findComponentPath } from "helpers/components"

const baseStore = createSessionStorageStore("openNodes", {})

const toggleNode = componentId => {
  baseStore.update(openNodes => {
    openNodes[`nodeOpen-${componentId}`] = !openNodes[`nodeOpen-${componentId}`]

    return openNodes
  })
}

const expandNodes = componentIds => {
  baseStore.update(openNodes => {
    const newNodes = Object.fromEntries(
      componentIds.map(id => [`nodeOpen-${id}`, true])
    )

    return { ...openNodes, ...newNodes }
  })
}

const collapseNodes = componentIds => {
  baseStore.update(openNodes => {
    const newNodes = Object.fromEntries(
      componentIds.map(id => [`nodeOpen-${id}`, false])
    )

    return { ...openNodes, ...newNodes }
  })
}

// Will ensure all parents of a node are expanded so that it is visible in the tree
const makeNodeVisible = componentId => {
  const selectedScreen = get(selectedScreenStore)

  const path = findComponentPath(selectedScreen.props, componentId)

  const componentIds = path.map(component => component._id)

  baseStore.update(openNodes => {
    const newNodes = Object.fromEntries(
      componentIds.map(id => [`nodeOpen-${id}`, true])
    )

    return { ...openNodes, ...newNodes }
  })
}

const isNodeExpanded = componentId => {
  const openNodes = get(baseStore)
  return !!openNodes[`nodeOpen-${componentId}`]
}

const store = {
  subscribe: baseStore.subscribe,
  toggleNode,
  expandNodes,
  makeNodeVisible,
  collapseNodes,
  isNodeExpanded,
}

export default store
