export const prepareRenderComponent = ({
  componentConstructor,
  uiFunctions,
  htmlElement,
  anchor,
  props,
  parentNode,
  getCurrentState,
}) => {
  const func = props._id ? uiFunctions[props._id] : undefined

  const parentContext = (parentNode && parentNode.context) || {}

  let nodesToRender = []
  const createNodeAndRender = context => {
    let componentContext = parentContext
    if (context) {
      componentContext = { ...context }
      componentContext.$parent = parentContext
    }

    const thisNode = createTreeNode()
    thisNode.context = componentContext
    thisNode.parentNode = parentNode
    thisNode.props = props
    nodesToRender.push(thisNode)

    thisNode.render = initialProps => {
      thisNode.component = new componentConstructor({
        target: htmlElement,
        props: initialProps,
        hydrate: false,
        anchor,
      })
      thisNode.rootElement =
        htmlElement.children[htmlElement.children.length - 1]

      if (props._id && thisNode.rootElement) {
        thisNode.rootElement.classList.add(`pos-${props._id}`)
      }
    }
  }

  if (func) {
    const state = getCurrentState()
    const routeParams = state["##routeParams"]
    func(createNodeAndRender, parentContext, getCurrentState(), routeParams)
  } else {
    createNodeAndRender()
  }

  return nodesToRender
}

export const createTreeNode = () => ({
  context: {},
  props: {},
  rootElement: null,
  parentNode: null,
  children: [],
  bindings: [],
  component: null,
  unsubscribe: () => {},
  render: () => {},
  get destroy() {
    const node = this
    return () => {
      if (node.unsubscribe) node.unsubscribe()
      if (node.component && node.component.$destroy) node.component.$destroy()
      if (node.children) {
        for (let child of node.children) {
          child.destroy()
        }
      }
      for (let onDestroyItem of node.onDestroy) {
        onDestroyItem()
      }
    }
  },
  onDestroy: [],
})
