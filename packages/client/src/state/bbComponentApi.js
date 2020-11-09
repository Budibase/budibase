import setBindableComponentProp from "./setBindableComponentProp"
import { attachChildren } from "../render/attachChildren"
import store from "../state/store"
import { baseApiCall } from "../api/index"

export const bbFactory = ({
  componentLibraries,
  onScreenSlotRendered,
  runEventActions,
}) => {
  const api = {
    post: (url, body) => baseApiCall("POST", url, body),
    get: (url, body) => baseApiCall("GET", url, body),
    patch: (url, body) => baseApiCall("PATCH", url, body),
    delete: (url, body) => baseApiCall("DELETE", url, body),
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
