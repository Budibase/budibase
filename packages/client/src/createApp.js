import { writable } from "svelte/store"
import { attachChildren } from "./render/attachChildren"
import { createTreeNode } from "./render/prepareRenderComponent"
import { screenRouter } from "./render/screenRouter"
import { createStateManager } from "./state/stateManager"

export const createApp = ({
  componentLibraries,
  frontendDefinition,
  user,
  window
}) => {
  let routeTo
  let currentUrl
  let screenStateManager

  const onScreenSlotRendered = screenSlotNode => {
    const onScreenSelected = (screen, store, url) => {
      const stateManager = createStateManager({
        store,
        frontendDefinition,
        componentLibraries,
        onScreenSlotRendered: () => {},
        routeTo,
        appRootPath: frontendDefinition.appRootPath,
      })
      screenSlotNode.props._children = [screen.props]
      const initialiseChildParams = attachChildrenParams(stateManager, screenSlotNode)
      attachChildren(initialiseChildParams)(screenSlotNode.rootElement, {
        hydrate: true,
        force: true,
      })
      if (screenStateManager) screenStateManager.destroy()
      screenStateManager = stateManager
      currentUrl = url
    }

    routeTo = screenRouter(
      frontendDefinition.screens,
      onScreenSelected,
      frontendDefinition.appRootPath
    )
    const fallbackPath = window.location.pathname.replace(
      frontendDefinition.appRootPath,
      ""
    )
    routeTo(currentUrl || fallbackPath)
  }

  const attachChildrenParams = (stateManager, treeNode) => ({
    componentLibraries,
    treeNode,
    onScreenSlotRendered,
    setupState: stateManager.setup,
    getCurrentState: stateManager.getCurrentState,
  });

  let rootTreeNode
  const pageStateManager = createStateManager({
    store: writable({ _bbuser: user }),
    frontendDefinition,
    componentLibraries,
    onScreenSlotRendered,
    appRootPath: frontendDefinition.appRootPath,
    // seems weird, but the routeTo variable may not be available at this point
    routeTo: url => routeTo(url),
  })

  const initialisePage = (page, target, urlPath) => {
    currentUrl = urlPath

    rootTreeNode = createTreeNode()
    rootTreeNode.props = {
      _children: [page.props],
    }
    rootTreeNode.rootElement = target
    const initChildParams = attachChildrenParams(pageStateManager, rootTreeNode)

    attachChildren(initChildParams)(target, {
      hydrate: true,
      force: true,
    })

    return rootTreeNode
  }

  return {
    initialisePage,
    screenStore: () => screenStateManager.store,
    pageStore: () => pageStateManager.store,
    routeTo: () => routeTo,
    rootNode: () => rootTreeNode,
  }
}
