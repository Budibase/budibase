import { writable } from "svelte/store"
import { createCoreApi } from "./core"
import { getStateOrValue } from "./state/getState"
import { setState, setStateFromBinding } from "./state/setState"
import { trimSlash } from "./common/trimSlash"
import { isBound } from "./state/isState"
import { attachChildren } from "./render/attachChildren"
import { createTreeNode } from "./render/prepareRenderComponent"
import { screenRouter } from "./render/screenRouter"
import { createStateManager } from "./state/stateManager"

export const createApp = (
  componentLibraries,
  frontendDefinition,
  backendDefinition,
  user,
  uiFunctions,
  window
) => {
  const coreApi = createCoreApi(backendDefinition, user)
  backendDefinition.hierarchy = coreApi.templateApi.constructHierarchy(
    backendDefinition.hierarchy
  )

  const relativeUrl = url =>
    frontendDefinition.appRootPath
      ? frontendDefinition.appRootPath + "/" + trimSlash(url)
      : url

  const apiCall = method => (url, body) =>
    fetch(relativeUrl(url), {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
    })

  const api = {
    post: apiCall("POST"),
    get: apiCall("GET"),
    patch: apiCall("PATCH"),
    delete: apiCall("DELETE"),
  }

  const safeCallEvent = (event, context) => {
    const isFunction = obj =>
      !!(obj && obj.constructor && obj.call && obj.apply)

    if (isFunction(event)) event(context)
  }

  let routeTo
  let currentUrl
  let screenStateManager

  const onScreenSlotRendered = screenSlotNode => {
    const onScreenSelected = (screen, store, url) => {
      const stateManager = createStateManager(
        store,
        coreApi,
        frontendDefinition.appRootPath
      )
      const getAttchChildrenParams = attachChildrenParams(stateManager)
      screenSlotNode.props._children = [screen.props]
      const initialiseChildParams = getAttchChildrenParams(screenSlotNode)
      attachChildren(initialiseChildParams)(screenSlotNode.rootElement, {
        hydrate: true,
        force: true,
      })
      if (screenStateManager) screenStateManager.destroy()
      screenStateManager = stateManager
      currentUrl = url
    }

    routeTo = screenRouter(frontendDefinition.screens, onScreenSelected)
    routeTo(currentUrl || window.location.pathname)
  }

  const attachChildrenParams = stateManager => {
    const getInitialiseParams = treeNode => ({
      bb: getBbClientApi,
      componentLibraries,
      uiFunctions,
      treeNode,
      onScreenSlotRendered,
      stateManager,
    })

    const getBbClientApi = (treeNode, componentProps) => {
      return {
        attachChildren: attachChildren(getInitialiseParams(treeNode)),
        context: treeNode.context,
        props: componentProps,
        call: safeCallEvent,
        setStateFromBinding: (binding, value) =>
          setStateFromBinding(stateManager.store, binding, value),
        setState: (path, value) => setState(stateManager.store, path, value),
        getStateOrValue: (prop, currentContext) =>
          getStateOrValue(stateManager.getCurrentState(), prop, currentContext),
        store: stateManager.store,
        relativeUrl,
        api,
        isBound,
        parent,
      }
    }
    return getInitialiseParams
  }

  let rootTreeNode
  const pageStateManager = createStateManager(
    writable({ _bbuser: user }),
    coreApi,
    frontendDefinition.appRootPath
  )

  const initialisePage = (page, target, urlPath) => {
    currentUrl = urlPath

    rootTreeNode = createTreeNode()
    rootTreeNode.props = {
      _children: [page.props],
    }
    rootTreeNode.rootElement = target
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
