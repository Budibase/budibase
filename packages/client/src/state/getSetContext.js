export const setContext = treeNode => (key, value) => (treeNode.context[key] = value)

export const getContext = treeNode => key => {
  if (treeNode.context && treeNode.context[key] !== undefined) return treeNode.context[key]

  if (!treeNode.context.$parent) return

  return getContext(treeNode.parentNode)(key)
}
