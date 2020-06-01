import { setState } from "./setState"
import { attachChildren } from "../render/attachChildren"
import { getContext, setContext } from "./getSetContext"

export const trimSlash = str => str.replace(/^\/+|\/+$/g, "")

export const bbFactory = ({
  store,
  frontendDefinition,
  componentLibraries,
  onScreenSlotRendered,
}) => {
  const relativeUrl = url => {
    if (!frontendDefinition.appRootPath) return url
    if (
      url.startsWith("http:") ||
      url.startsWith("https:") ||
      url.startsWith("./")
    )
      return url

    return frontendDefinition.appRootPath + "/" + trimSlash(url)
  }

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
      treeNode,
      onScreenSlotRendered,
      setupState,
    }

    return {
      attachChildren: attachChildren(attachParams),
      context: treeNode.context,
      props: treeNode.props,
      call: safeCallEvent,
      setState,
      getContext: getContext(treeNode),
      setContext: setContext(treeNode),
      store: store,
      relativeUrl,
      api,
      parent,
    }
  }
}
