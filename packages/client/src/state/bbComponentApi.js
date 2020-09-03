import setBindableComponentProp from "./setBindableComponentProp"
import { attachChildren } from "../render/attachChildren"

export const trimSlash = str => str.replace(/^\/+|\/+$/g, "")

export const bbFactory = ({
  componentLibraries,
  onScreenSlotRendered,
  getCurrentState,
}) => {
  const apiCall = method => (url, body) => {
    return fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
      credentials: "same-origin",
    })
  }

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
      props: treeNode.props,
      call: safeCallEvent,
      setBinding: setBindableComponentProp(treeNode),
      api,
      parent,
      // these parameters are populated by screenRouter
      routeParams: () => getCurrentState()["##routeParams"],
    }
  }
}
