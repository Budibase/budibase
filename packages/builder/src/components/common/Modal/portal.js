export function portal(node, targetNodeOrSelector) {
  const targetNode =
    typeof targetNodeOrSelector == "string"
      ? document.querySelector(targetNodeOrSelector)
      : targetNodeOrSelector
  const portalChildren = [...node.children]
  targetNode.append(...portalChildren)

  return {
    destroy() {
      for (const portalChild of portalChildren) portalChild.remove()
    },
  }
}
