import { attachChildren } from "./render/attachChildren"
import { createTreeNode } from "./render/prepareRenderComponent"
import { screenRouter } from "./render/screenRouter"
import { createStateManager } from "./state/stateManager"
import { parseAppIdFromCookie } from "./render/getAppId"

export const createApp = ({
  componentLibraries,
  frontendDefinition,
  window,
}) => {
  let routeTo
  let currentUrl
  let screenStateManager

  const onScreenSlotRendered = screenSlotNode => {
    const onScreenSelected = (screen, url) => {
      const stateManager = createStateManager({
        componentLibraries,
        onScreenSlotRendered: () => {},
        routeTo,
      })
      const getAttachChildrenParams = attachChildrenParams(stateManager)
      screenSlotNode.props._children = [screen.props]
      const initialiseChildParams = getAttachChildrenParams(screenSlotNode)
      attachChildren(initialiseChildParams)(screenSlotNode.rootElement, {
        hydrate: true,
        force: true,
      })
      if (screenStateManager) screenStateManager.destroy()
      screenStateManager = stateManager
      currentUrl = url
    }

    routeTo = screenRouter({
      screens: frontendDefinition.screens,
      onScreenSelected,
      window,
    })
    const fallbackPath = window.location.pathname.replace(
      parseAppIdFromCookie(window.document.cookie),
      ""
    )
    routeTo(currentUrl || fallbackPath)
  }

  const attachChildrenParams = stateManager => {
    const getInitialiseParams = treeNode => ({
      componentLibraries,
      treeNode,
      onScreenSlotRendered,
      setupState: stateManager.setup,
    })

    return getInitialiseParams
  }

  let rootTreeNode
  const pageStateManager = createStateManager({
    componentLibraries,
    onScreenSlotRendered,
    // seems weird, but the routeTo variable may not be available at this point
    routeTo: url => routeTo(url),
  })

  const initialisePage = (page, target, urlPath) => {
    currentUrl = urlPath

    rootTreeNode = createTreeNode()
    rootTreeNode.props = {
      _children: [page.props],
    }
    const getInitialiseParams = attachChildrenParams(pageStateManager)
    const initChildParams = getInitialiseParams(rootTreeNode)

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
