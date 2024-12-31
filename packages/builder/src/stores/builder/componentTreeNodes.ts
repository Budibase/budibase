import { get } from "svelte/store"
import { selectedScreen as selectedScreenStore } from "./screens"
import { findComponentPath } from "@/helpers/components"
import { Screen, Component } from "@budibase/types"
import { BudiStore, PersistenceType } from "@/stores/BudiStore"

interface OpenNodesState {
  [key: string]: boolean
}

export class ComponentTreeNodesStore extends BudiStore<OpenNodesState> {
  constructor() {
    super({} as OpenNodesState, {
      persistence: {
        type: PersistenceType.SESSION,
        key: "openNodes",
      },
    })
  }

  toggleNode(componentId: string) {
    this.update((openNodes: OpenNodesState) => {
      openNodes[`nodeOpen-${componentId}`] =
        !openNodes[`nodeOpen-${componentId}`]

      return openNodes
    })
  }

  expandNodes(componentIds: string[]) {
    this.update((openNodes: OpenNodesState) => {
      const newNodes = Object.fromEntries(
        componentIds.map(id => [`nodeOpen-${id}`, true])
      )

      return { ...openNodes, ...newNodes }
    })
  }

  collapseNodes(componentIds: string[]) {
    this.update((openNodes: OpenNodesState) => {
      const newNodes = Object.fromEntries(
        componentIds.map(id => [`nodeOpen-${id}`, false])
      )

      return { ...openNodes, ...newNodes }
    })
  }

  // Will ensure all parents of a node are expanded so that it is visible in the tree
  makeNodeVisible(componentId: string) {
    const selectedScreen: Screen = get(selectedScreenStore)

    const path = findComponentPath(selectedScreen.props, componentId)

    const componentIds = path.map((component: Component) => component._id)

    this.update((openNodes: OpenNodesState) => {
      const newNodes = Object.fromEntries(
        componentIds.map((id: string) => [`nodeOpen-${id}`, true])
      )

      return { ...openNodes, ...newNodes }
    })
  }

  isNodeExpanded(componentId: string): boolean {
    const openNodes = get(this)
    return !!openNodes[`nodeOpen-${componentId}`]
  }
}

export default new ComponentTreeNodesStore()
