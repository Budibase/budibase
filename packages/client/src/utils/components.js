/**
 * Finds a component instance by ID
 */
export const findComponentById = (component, componentId) => {
  if (!component || !componentId) {
    return null
  }
  if (component._id === componentId) {
    return component
  }
  if (!component._children?.length) {
    return null
  }
  for (let child of component._children) {
    const result = findComponentById(child, componentId)
    if (result) {
      return result
    }
  }
  return null
}

/**
 * Finds the component path to a component
 */
export const findComponentPathById = (component, componentId, path = []) => {
  if (!component || !componentId) {
    return null
  }
  path = [...path, component]
  if (component._id === componentId) {
    return path
  }
  if (!component._children?.length) {
    return null
  }
  for (let child of component._children) {
    const result = findComponentPathById(child, componentId, path)
    if (result) {
      return result
    }
  }
  return null
}

/**
 * Finds all children instances of a certain component type of a given component
 */
export const findChildrenByType = (component, type, children = []) => {
  if (!component) {
    return
  }
  if (component._component.endsWith(`/${type}`)) {
    children.push(component)
  }
  if (!component._children?.length) {
    return
  }
  component._children.forEach(child => {
    findChildrenByType(child, type, children)
  })
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
