import mustache from "mustache"
import appStore from "../state/store"
import hasBinding from "../state/hasBinding"

export const prepareRenderComponent = ({
  ComponentConstructor,
  htmlElement,
  anchor,
  props,
  parentNode,
  contextStoreKey,
}) => {
  const thisNode = createTreeNode()
  thisNode.parentNode = parentNode
  thisNode.props = props
  thisNode.contextStoreKey = contextStoreKey

  // the treeNode is first created (above), and then this
  // render method is add. The treeNode is returned, and
  // render is called later (in attachChildren)
  thisNode.render = initialProps => {
    thisNode.component = new ComponentConstructor({
      target: htmlElement,
      props: initialProps,
      hydrate: false,
      anchor,
    })

    // finds the root element of the component, which was created by the contructor above
    // we use this later to attach a className to. This is how styles
    // are applied by the builder
    thisNode.rootElement = htmlElement.children[htmlElement.children.length - 1]

    let [componentName] = props._component.match(/[a-z]*$/)
    if (props._id && thisNode.rootElement) {
      thisNode.rootElement.classList.add(`${componentName}-${props._id}`)
    }

    // make this node listen to the store
    if (thisNode.stateBound) {
      const unsubscribe = appStore.subscribe(state => {
        const storeBoundProps = Object.keys(initialProps._bb.props).filter(p =>
          hasBinding(initialProps._bb.props[p])
        )
        if (storeBoundProps.length > 0) {
          const toSet = {}
          for (let prop of storeBoundProps) {
            const propValue = initialProps._bb.props[prop]
            toSet[prop] = mustache.render(propValue, state)
          }
          thisNode.component.$set(toSet)
        }
      }, thisNode.contextStoreKey)
      thisNode.unsubscribe = unsubscribe
    }
  }

  return thisNode
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
      if (node.children) {
        // destroy children first - from leaf nodes up
        for (let child of node.children) {
          child.destroy()
        }
      }
      if (node.unsubscribe) node.unsubscribe()
      if (node.component && node.component.$destroy) node.component.$destroy()
      for (let onDestroyItem of node.onDestroy) {
        onDestroyItem()
      }
    }
  },
  onDestroy: [],
})
