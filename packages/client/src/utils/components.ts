import { Component } from "@budibase/types"

/**
 * Finds a component instance by ID
 */
export const findComponentById = (
  component: Component | undefined,
  componentId: string | undefined
): Component | null => {
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
export const findComponentPathById = (
  component: Component | undefined,
  componentId: string | undefined,
  path: Component[] = []
): Component[] | null => {
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
export const findChildrenByType = (
  component: Component | undefined,
  type: string,
  children: Component[] = []
): Component[] | undefined => {
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
export const findComponentParent = (
  rootComponent: Component | undefined,
  id: string | undefined,
  parentComponent?: Component
): Component | null => {
  if (!rootComponent || !id) {
    return null
  }
  if (rootComponent._id === id) {
    return parentComponent || null
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
