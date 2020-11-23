import appStore from "./store"

export default treeNode => (propName, value) => {
  if (!propName || propName.length === 0) return
  if (!treeNode) return
  const componentId = treeNode.props._id

  appStore.update(state => {
    state[componentId] = state[componentId] || {}
    state[componentId][propName] = value
    return state
  }, treeNode.contextStoreKey)
}
