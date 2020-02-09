import { writable } from "svelte/store"
import { createCoreApi } from "./core"
import { getStateOrValue } from "./state/getState"
import { setState, setStateFromBinding } from "./state/setState"
import { trimSlash } from "./common/trimSlash"
import { isBound } from "./state/isState"
import { initialiseChildren } from "./render/initialiseChildren"
import { createTreeNode } from "./render/renderComponent"
import { screenRouter } from "./render/screenRouter"

export const createApp = (
  document,
  componentLibraries,
  appDefinition,
  user,
  uiFunctions,
  screens
) => {
  const coreApi = createCoreApi(appDefinition, user)
  appDefinition.hierarchy = coreApi.templateApi.constructHierarchy(
    appDefinition.hierarchy
  )
  const pageStore = writable({
    _bbuser: user,
  })

  const relativeUrl = url =>
    appDefinition.appRootPath
      ? appDefinition.appRootPath + "/" + trimSlash(url)
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
      const { getInitialiseParams, unsubscribe } = initialiseChildrenParams(
        store
      )
      const initialiseChildParams = getInitialiseParams(true, screenSlotNode)
      initialiseChildren(initialiseChildParams)(
        [screen.props],
        screenSlotNode.rootElement
      )
      if (currentScreenUbsubscribe) currentScreenUbsubscribe()
      currentScreenUbsubscribe = unsubscribe
      currentScreenStore = store
      currentUrl = url
    }

    routeTo = screenRouter(screens, onScreenSelected)
    routeTo(currentUrl || window.location.pathname)
  }

  const initialiseChildrenParams = store => {
    let currentState = null
    const unsubscribe = store.subscribe(s => {
      currentState = s
    })

    const getInitialiseParams = (hydrate, treeNode) => ({
      bb: getBbClientApi,
      coreApi,
      store,
      document,
      componentLibraries,
      appDefinition,
      hydrate,
      uiFunctions,
      treeNode,
      onScreenSlotRendered,
    })

    const getBbClientApi = (treeNode, componentProps) => {
      return {
        hydrateChildren: initialiseChildren(
          getInitialiseParams(true, treeNode)
        ),
        appendChildren: initialiseChildren(
          getInitialiseParams(false, treeNode)
        ),
        insertChildren: (props, htmlElement, anchor) =>
          initialiseChildren(getInitialiseParams(false, treeNode))(
            props,
            htmlElement,
            anchor
          ),
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

  const initialisePage = (page, target, urlPath) => {
    currentUrl = urlPath

    const rootTreeNode = createTreeNode()
    const { getInitialiseParams } = initialiseChildrenParams(pageStore)
    const initChildParams = getInitialiseParams(true, rootTreeNode)

    initialiseChildren(initChildParams)([page.props], target)

    return rootTreeNode
  }

  return {
    initialisePage,
    screenStore: () => currentScreenStore,
    pageStore: () => pageStore,
    routeTo: () => routeTo,
  }
}
