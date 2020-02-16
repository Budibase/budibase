export const prepareRenderComponent = ({
  componentConstructor,
  uiFunctions,
  htmlElement,
  anchor,
  props,
  bb,
  parentNode,
}) => {
  const func = props._id ? uiFunctions[props._id] : undefined

  const parentContext = (parentNode && parentNode.context) || {}

  let renderedNodes = []
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
    renderedNodes.push(thisNode)

    thisNode.render = initialProps => {
      initialProps._bb = bb(thisNode, props)
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
    func(createNodeAndRender, parentContext)
  } else {
    createNodeAndRender()
  }

  return renderedNodes
}

export const createTreeNode = () => ({
  context: {},
  props: {},
  rootElement: null,
  parentNode: null,
  children: [],
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
    }
  },
})
