import setBindableComponentProp from "./setBindableComponentProp"
import { attachChildren } from "../render/attachChildren"
import store from "../state/store"

export const trimSlash = str => str.replace(/^\/+|\/+$/g, "")

export const bbFactory = ({
  componentLibraries,
  onScreenSlotRendered,
  runEventActions,
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
      call: async eventName =>
        eventName &&
        (await runEventActions(
          treeNode.props[eventName],
          store.getState(treeNode.contextStoreKey)
        )),
      setBinding: setBindableComponentProp(treeNode),
      api,
      parent,
      store: store.getStore(treeNode.contextStoreKey),
      // these parameters are populated by screenRouter
      routeParams: () => store.getState()["##routeParams"],
    }
  }
}
