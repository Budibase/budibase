import { writable } from "svelte/store"
import { createCoreApi } from "./core"
import { getStateOrValue } from "./state/getState"
import { setState, setStateFromBinding } from "./state/setState"
import { trimSlash } from "./common/trimSlash"
import { isBound } from "./state/isState"
import { attachChildren } from "./render/attachChildren"
import { createTreeNode } from "./render/renderComponent"
import { screenRouter } from "./render/screenRouter"

export const createApp = (
  document,
  componentLibraries,
  frontendDefinition,
  backendDefinition,
  user,
  uiFunctions
) => {
  const coreApi = createCoreApi(backendDefinition, user)
  backendDefinition.hierarchy = coreApi.templateApi.constructHierarchy(
    backendDefinition.hierarchy
  )
  const pageStore = writable({
    _bbuser: user,
  })

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
  let currentScreenStore
  let currentScreenUbsubscribe
  let currentUrl

  const onScreenSlotRendered = screenSlotNode => {
    const onScreenSelected = (screen, store, url) => {
      const { getInitialiseParams, unsubscribe } = attachChildrenParams(store)
      screenSlotNode.props._children = [screen.props]
      const initialiseChildParams = getInitialiseParams(screenSlotNode)
      attachChildren(initialiseChildParams)(screenSlotNode.rootElement, {
        hydrate: true,
        force: true,
      })
      if (currentScreenUbsubscribe) currentScreenUbsubscribe()
      currentScreenUbsubscribe = unsubscribe
      currentScreenStore = store
      currentUrl = url
    }

    routeTo = screenRouter(frontendDefinition.screens, onScreenSelected)
    routeTo(currentUrl || window.location.pathname)
  }

  const attachChildrenParams = store => {
    let currentState = null
    const unsubscribe = store.subscribe(s => {
      currentState = s
    })

    const getInitialiseParams = treeNode => ({
      bb: getBbClientApi,
      coreApi,
      store,
      document,
      componentLibraries,
      frontendDefinition,
      uiFunctions,
      treeNode,
      onScreenSlotRendered,
    })

    const getBbClientApi = (treeNode, componentProps) => {
      return {
        attachChildren: attachChildren(getInitialiseParams(treeNode)),
        context: treeNode.context,
        props: componentProps,
        call: safeCallEvent,
        setStateFromBinding: (binding, value) =>
          setStateFromBinding(store, binding, value),
        setState: (path, value) => setState(store, path, value),
        getStateOrValue: (prop, currentContext) =>
          getStateOrValue(currentState, prop, currentContext),
        store,
        relativeUrl,
        api,
        isBound,
        parent,
      }
    }
    return { getInitialiseParams, unsubscribe }
  }

  let rootTreeNode

  const initialisePage = (page, target, urlPath) => {
    currentUrl = urlPath

    rootTreeNode = createTreeNode()
    rootTreeNode.props = {
      _children: [page.props],
    }
    rootTreeNode.rootElement = target
    const { getInitialiseParams } = attachChildrenParams(pageStore)
    const initChildParams = getInitialiseParams(rootTreeNode)

    attachChildren(initChildParams)(target, {
      hydrate: true,
      force: true,
    })

    return rootTreeNode
  }
  return {
    initialisePage,
    screenStore: () => currentScreenStore,
    pageStore: () => pageStore,
    routeTo: () => routeTo,
    rootNode: () => rootTreeNode,
  }
}
