import { getBuiltin } from "components/userInterface/assetParsing/createProps"
import { uuid } from "./uuid"
import getNewComponentName from "./getNewComponentName"

/**
 * Find the parent component of the passed in child.
 * @param {Object} rootProps - props to search for the parent in
 * @param {String|Object} child - id of the child or the child itself to find the parent of
 */
export const findParent = (rootProps, child) => {
  let parent
  walkProps(rootProps, (props, breakWalk) => {
    if (
      props._children &&
      (props._children.includes(child) ||
        props._children.some(c => c._id === child))
    ) {
      parent = props
      breakWalk()
    }
  })
  return parent
}

export const walkProps = (props, action, cancelToken = null) => {
  cancelToken = cancelToken || { cancelled: false }
  action(props, () => {
    cancelToken.cancelled = true
  })

  if (props._children) {
    for (let child of props._children) {
      if (cancelToken.cancelled) return
      walkProps(child, action, cancelToken)
    }
  }
}

export const generateNewIdsForComponent = (
  component,
  state,
  changeName = true
) =>
  walkProps(component, prop => {
    prop._id = uuid()
    if (changeName) prop._instanceName = getNewComponentName(prop, state)
  })

export const getComponentDefinition = (state, name) =>
  name.startsWith("##") ? getBuiltin(name) : state.components[name]

export const findChildComponentType = (node, typeToFind) => {
  // Stop recursion if invalid props
  if (!node || !typeToFind) {
    return null
  }

  // Stop recursion if this element matches
  if (node._component === typeToFind) {
    return node
  }

  // Otherwise check if any children match
  // Stop recursion if no valid children to process
  const children = node._children || (node.props && node.props._children)
  if (!children || !children.length) {
    return null
  }

  // Recurse and check each child component
  for (let child of children) {
    const childResult = findChildComponentType(child, typeToFind)
    if (childResult) {
      return childResult
    }
  }

  // If we reach here then no children were valid
  return null
}
