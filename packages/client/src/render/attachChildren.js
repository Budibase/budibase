import { prepareRenderComponent } from "./prepareRenderComponent"
import { isScreenSlot } from "./builtinComponents"
import deepEqual from "deep-equal"
import appStore from "../state/store"

export const attachChildren = initialiseOpts => (htmlElement, options) => {
  const { componentLibraries, treeNode, onScreenSlotRendered, setupState } = initialiseOpts

  const anchor = options && options.anchor ? options.anchor : null
  const force = options ? options.force : false
  const hydrate = options ? options.hydrate : true
  const context = options && options.context

  if (!force && treeNode.children.length > 0) return treeNode.children

  for (let childNode of treeNode.children) {
    childNode.destroy()
  }

  if (!htmlElement) return

  if (hydrate) {
    while (htmlElement.firstChild) {
      htmlElement.removeChild(htmlElement.firstChild)
    }
  }

  const contextStoreKeys = []

  // create new context if supplied
  if (context) {
    let childIndex = 0
    // if context is an array,  map to new structure
    const contextArray = Array.isArray(context) ? context : [context]
    for (let ctx of contextArray) {
      const key = appStore.create(ctx, treeNode.props._id, childIndex, treeNode.contextStoreKey)
      contextStoreKeys.push(key)
      childIndex++
    }
  }

  const childNodes = []

  const createChildNodes = contextStoreKey => {
    for (let childProps of treeNode.props._children) {
      const { componentName, libName } = splitName(childProps._component)

      if (!componentName || !libName) return

      const ComponentConstructor = componentLibraries[libName][componentName]

      const childNode = prepareRenderComponent({
        props: childProps,
        parentNode: treeNode,
        ComponentConstructor,
        htmlElement,
        anchor,
        // in same context as parent, unless a new one was supplied
        contextStoreKey,
      })

      childNodes.push(childNode)
    }
  }

  if (context) {
    // if new context(s) is supplied, then create nodes
    // with keys to new context stores
    for (let contextStoreKey of contextStoreKeys) {
      createChildNodes(contextStoreKey)
    }
  } else {
    // otherwise, use same context store as parent
    // which maybe undefined (therfor using the root state)
    createChildNodes(treeNode.contextStoreKey)
  }

  // if everything is equal, then don't re-render
  if (areTreeNodesEqual(treeNode.children, childNodes)) return treeNode.children

  for (let node of childNodes) {
    const initialProps = setupState(node)
    node.render(initialProps)
  }

  const screenSlot = childNodes.find(n => isScreenSlot(n.props._component))

  if (onScreenSlotRendered && screenSlot) {
    // assuming there is only ever one screen slot
    onScreenSlotRendered(screenSlot)
  }

  treeNode.children = childNodes

  return childNodes
}

const splitName = fullname => {
  const nameParts = fullname.split("/")

  const componentName = nameParts[nameParts.length - 1]

  const libName = fullname.substring(0, fullname.length - componentName.length - 1)

  return { libName, componentName }
}

const areTreeNodesEqual = (children1, children2) => {
  if (children1.length !== children2.length) return false
  if (children1 === children2) return true

  let isEqual = false
  for (let i = 0; i < children1.length; i++) {
    // same context and same children, then nothing has changed
    isEqual =
      deepEqual(children1[i].context, children2[i].context) &&
      areTreeNodesEqual(children1[i].children, children2[i].children)
    if (!isEqual) return false
    if (isScreenSlot(children1[i].parentNode.props._component)) {
      isEqual = deepEqual(children1[i].props, children2[i].props)
    }
    if (!isEqual) return false
  }
  return true
}
