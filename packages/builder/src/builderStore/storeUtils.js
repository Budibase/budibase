/**
 * Recursively searches for a specific component ID
 */
export const findComponent = (rootComponent, id) => {
  return searchComponentTree(rootComponent, comp => comp._id === id)
}

/**
 * Recursively searches for a specific component type
 */
export const findComponentType = (rootComponent, type) => {
  return searchComponentTree(rootComponent, comp => comp._component === type)
}

/**
 * Recursively searches for the parent component of a specific component ID
 */
export const findComponentParent = (rootComponent, id, parentComponent) => {
  if (!rootComponent || !id) {
    return null
  }
  if (rootComponent._id === id) {
    return parentComponent
  }
  if (!rootComponent._children) {
    return null
  }
  for (const child of rootComponent._children) {
    const childResult = findComponentParent(child, id, rootComponent)
    if (childResult) {
      return childResult
    }
  }
  return null
}

/**
 * Recursively searches for a specific component ID and records the component
 * path to this component
 */
export const findComponentPath = (rootComponent, id, path = []) => {
  if (!rootComponent || !id) {
    return null
  }
  if (rootComponent._id === id) {
    return [...path, id]
  }
  if (!rootComponent._children) {
    return null
  }
  for (const child of rootComponent._children) {
    const newPath = [...path, rootComponent._id]
    const childResult = findComponentPath(child, id, newPath)
    if (childResult != null) {
      return childResult
    }
  }
  return null
}

/**
 * Recurses through a component tree evaluating a matching function against
 * components until a match is found
 */
const searchComponentTree = (rootComponent, matchComponent) => {
  if (!rootComponent || !matchComponent) {
    return null
  }
  if (matchComponent(rootComponent)) {
    return rootComponent
  }
  if (!rootComponent._children) {
    return null
  }
  for (const child of rootComponent._children) {
    const childResult = searchComponentTree(child, matchComponent)
    if (childResult) {
      return childResult
    }
  }
  return null
}
