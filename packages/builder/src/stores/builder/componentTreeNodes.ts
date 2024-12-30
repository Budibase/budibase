import { get } from "svelte/store"
import { createSessionStorageStore } from "@budibase/frontend-core"
import { selectedScreen as selectedScreenStore } from "./screens"
import { findComponentPath } from "helpers/components"
import { Screen, Component } from "@budibase/types"
import { BudiStore } from "stores/BudiStore"

interface OpenNodesState {
  [key: string]: boolean
}

export class ComponentTreeNodesStore extends BudiStore<OpenNodesState> {
  private baseStore = createSessionStorageStore(
    "openNodes",
    {} as OpenNodesState
  )

  constructor() {
    super({})
    this.subscribe = this.baseStore.subscribe
  }

  toggleNode(componentId: string) {
    this.baseStore.update((openNodes: OpenNodesState) => {
      openNodes[`nodeOpen-${componentId}`] =
        !openNodes[`nodeOpen-${componentId}`]
      return openNodes
    })
  }

  expandNodes(componentIds: string[]) {
    this.baseStore.update((openNodes: OpenNodesState) => {
      const newNodes = Object.fromEntries(
        componentIds.map(id => [`nodeOpen-${id}`, true])
      )
      return { ...openNodes, ...newNodes }
    })
  }

  collapseNodes(componentIds: string[]) {
    this.baseStore.update((openNodes: OpenNodesState) => {
      const newNodes = Object.fromEntries(
        componentIds.map(id => [`nodeOpen-${id}`, false])
      )
      return { ...openNodes, ...newNodes }
    })
  }

  // Will ensure all parents of a node are expanded so that it is visible in the tree
  makeNodeVisible(componentId: string) {
    const selectedScreen = get(selectedScreenStore) as Screen
    const path = findComponentPath(selectedScreen.props, componentId)
    const componentIds = path.map((component: Component) => component._id)

    this.baseStore.update((openNodes: OpenNodesState) => {
      const newNodes = Object.fromEntries(
        componentIds.map((id: string) => [`nodeOpen-${id}`, true])
      )
      return { ...openNodes, ...newNodes }
    })
  }

  isNodeExpanded(componentId: string): boolean {
    const openNodes = get(this.baseStore)
    return !!openNodes[`nodeOpen-${componentId}`]
  }
}

export default new ComponentTreeNodesStore()
