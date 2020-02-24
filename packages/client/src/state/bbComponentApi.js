import { getStateOrValue } from "./getState"
import { setState, setStateFromBinding } from "./setState"
import { trimSlash } from "../common/trimSlash"
import { isBound } from "./parseBinding"
import { attachChildren } from "../render/attachChildren"
import { getContext, setContext } from "./getSetContext"

export const bbFactory = ({
  store,
  getCurrentState,
  frontendDefinition,
  componentLibraries,
  uiFunctions,
  onScreenSlotRendered,
}) => {
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

  return (treeNode, setupState) => {
    const attachParams = {
      componentLibraries,
      uiFunctions,
      treeNode,
      onScreenSlotRendered,
      setupState,
      getCurrentState,
    }

    return {
      attachChildren: attachChildren(attachParams),
      context: treeNode.context,
      props: treeNode.props,
      call: safeCallEvent,
      setStateFromBinding: (binding, value) =>
        setStateFromBinding(store, binding, value),
      setState: (path, value) => setState(store, path, value),
      getStateOrValue: (prop, currentContext) =>
        getStateOrValue(getCurrentState(), prop, currentContext),
      getContext: getContext(treeNode),
      setContext: setContext(treeNode),
      store: store,
      relativeUrl,
      api,
      isBound,
      parent,
    }
  }
}
