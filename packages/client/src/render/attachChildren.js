import { split, last, compose } from "lodash/fp"
import { prepareRenderComponent } from "./prepareRenderComponent"
import { isScreenSlot } from "./builtinComponents"
import deepEqual from "deep-equal"

export const attachChildren = initialiseOpts => (htmlElement, options) => {
  const {
    componentLibraries,
    treeNode,
    onScreenSlotRendered,
    setupState,
    getCurrentState,
  } = initialiseOpts

  const anchor = options && options.anchor ? options.anchor : null
  const force = options ? options.force : false
  const hydrate = options ? options.hydrate : true

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

  const childNodes = []
  for (let childProps of treeNode.props._children) {
    const { componentName, libName } = splitName(childProps._component)

    if (!componentName || !libName) return

    const ComponentConstructor = componentLibraries[libName][componentName]

    const childNodesThisIteration = prepareRenderComponent({
      props: childProps,
      parentNode: treeNode,
      ComponentConstructor,
      htmlElement,
      anchor,
      getCurrentState,
    })

    for (let childNode of childNodesThisIteration) {
      childNodes.push(childNode)
    }
  }

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
  const getComponentName = compose(last, split("/"))

  const componentName = getComponentName(fullname)

  const libName = fullname.substring(
    0,
    fullname.length - componentName.length - 1
  )

  return { libName, componentName }
}

const areTreeNodesEqual = (children1, children2) => {
  if (children1.length !== children2.length) return false
  if (children1 === children2) return true

  let isEqual = false
  for (let i = 0; i < children1.length; i++) {
    isEqual = deepEqual(children1[i].context, children2[i].context)
    if (!isEqual) return false
    if (isScreenSlot(children1[i].parentNode.props._component)) {
      isEqual = deepEqual(children1[i].props, children2[i].props)
    }
    if (!isEqual) return false
  }
  return true
}
