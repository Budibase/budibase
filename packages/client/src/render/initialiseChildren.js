import { setupBinding } from "../state/stateBinding"
import { split, last } from "lodash/fp"
import { $ } from "../core/common"
import { renderComponent } from "./renderComponent"
import { isScreenSlot } from "./builtinComponents"

export const initialiseChildren = initialiseOpts => (htmlElement, options) => {
  const {
    uiFunctions,
    bb,
    coreApi,
    store,
    componentLibraries,
    treeNode,
    frontendDefinition,
    onScreenSlotRendered,
  } = initialiseOpts

  const anchor = options && options.anchor ? options.anchor : null
  const force = options ? options.force : false
  const hydrate = options ? options.hydrate : true

  if (!force && treeNode.children.length > 0) return treeNode.children

  for (let childNode of treeNode.children) {
    childNode.destroy()
  }

  if (hydrate) {
    while (htmlElement.firstChild) {
      htmlElement.removeChild(htmlElement.firstChild)
    }
  }

  htmlElement.classList.add(`lay-${treeNode.props._id}`)

  const renderedComponents = []
  for (let childProps of treeNode.props._children) {
    const { componentName, libName } = splitName(childProps._component)

    if (!componentName || !libName) return

    const { initialProps, bind } = setupBinding(
      store,
      childProps,
      coreApi,
      frontendDefinition.appRootPath
    )

    const componentConstructor = componentLibraries[libName][componentName]

    const renderedComponentsThisIteration = renderComponent({
      props: childProps,
      parentNode: treeNode,
      componentConstructor,
      uiFunctions,
      htmlElement,
      anchor,
      initialProps,
      bb,
    })

    if (
      onScreenSlotRendered &&
      isScreenSlot(childProps._component) &&
      renderedComponentsThisIteration.length > 0
    ) {
      // assuming there is only ever one screen slot
      onScreenSlotRendered(renderedComponentsThisIteration[0])
    }

    for (let comp of renderedComponentsThisIteration) {
      comp.unsubscribe = bind(comp.component)
      renderedComponents.push(comp)
    }
  }

  treeNode.children = renderedComponents

  return renderedComponents
}

const splitName = fullname => {
  const componentName = $(fullname, [split("/"), last])

  const libName = fullname.substring(
    0,
    fullname.length - componentName.length - 1
  )

  return { libName, componentName }
}
