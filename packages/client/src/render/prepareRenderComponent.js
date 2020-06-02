import { appStore } from "../state/store"
import mustache from "mustache"

export const prepareRenderComponent = ({
  ComponentConstructor,
  htmlElement,
  anchor,
  props,
  parentNode,
}) => {
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
      thisNode.component = new ComponentConstructor({
        target: htmlElement,
        props: initialProps,
        hydrate: false,
        anchor,
      })
      thisNode.rootElement =
        htmlElement.children[htmlElement.children.length - 1]

      let [componentName] = props._component.match(/[a-z]*$/)
      if (props._id && thisNode.rootElement) {
        thisNode.rootElement.classList.add(`${componentName}-${props._id}`)
      }

      // make this node listen to the store
      if (thisNode.stateBound) {
        const unsubscribe = appStore.subscribe(state => {
          const storeBoundProps = { ...initialProps._bb.props }
          for (let prop in storeBoundProps) {
            const propValue = storeBoundProps[prop]
            if (typeof propValue === "string") {
              storeBoundProps[prop] = mustache.render(propValue, {
                state,
              })
            }
          }
          thisNode.component.$set(storeBoundProps)
        })
        thisNode.unsubscribe = unsubscribe
      }
    }
  }

  createNodeAndRender()

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
