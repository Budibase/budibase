import setBindableComponentProp from "./setBindableComponentProp"
import { attachChildren } from "../render/attachChildren"
import store from "../state/store"

export const bbFactory = ({
  componentLibraries,
  onScreenSlotRendered,
  runEventActions,
}) => {
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
      parent,
      store: store.getStore(treeNode.contextStoreKey),
      // these parameters are populated by screenRouter
      routeParams: () => store.getState()["##routeParams"],
    }
  }
}
