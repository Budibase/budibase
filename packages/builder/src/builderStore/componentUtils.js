import { store } from "./index"
import { Helpers } from "@budibase/bbui"
import {
  decodeJSBinding,
  encodeJSBinding,
  findHBSBlocks,
} from "@budibase/string-templates"

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
    return []
  }
  if (rootComponent._id === id) {
    return [...path, rootComponent]
  }
  if (!rootComponent._children) {
    return []
  }
  for (const child of rootComponent._children) {
    const newPath = [...path, rootComponent]
    const childResult = findComponentPath(child, id, newPath)
    if (childResult?.length) {
      return childResult
    }
  }
  return []
}

/**
 * Recurses through the component tree and finds all components which match
 * a certain selector
 */
export const findAllMatchingComponents = (rootComponent, selector) => {
  if (!rootComponent || !selector) {
    return []
  }
  let components = []
  if (rootComponent._children) {
    rootComponent._children.forEach(child => {
      components = [
        ...components,
        ...findAllMatchingComponents(child, selector),
      ]
    })
  }
  if (selector(rootComponent)) {
    components.push(rootComponent)
  }
  return components.reverse()
}

/**
 * Finds the closes parent component which matches certain criteria
 */
export const findClosestMatchingComponent = (
  rootComponent,
  componentId,
  selector
) => {
  if (!selector) {
    return null
  }
  const componentPath = findComponentPath(rootComponent, componentId).reverse()
  for (let component of componentPath) {
    if (selector(component)) {
      return component
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

/**
 * Searches a component's definition for a setting matching a certain predicate.
 * These settings are cached because they cannot change at run time.
 */
let componentSettingCache = {}
export const getComponentSettings = componentType => {
  if (!componentType) {
    return []
  }

  // Ensure whole component name is used
  if (
    !componentType.startsWith("plugin/") &&
    !componentType.startsWith("@budibase")
  ) {
    componentType = `@budibase/standard-components/${componentType}`
  }

  // Check if we have cached this type already
  if (componentSettingCache[componentType]) {
    return componentSettingCache[componentType]
  }

  // Otherwise get the settings and cache them
  const def = store.actions.components.getDefinition(componentType)
  let settings = []
  if (def) {
    settings = def.settings?.filter(setting => !setting.section) ?? []
    def.settings
      ?.filter(setting => setting.section)
      .forEach(section => {
        settings = settings.concat(
          (section.settings || []).map(setting => ({
            ...setting,
            section: section.name,
          }))
        )
      })
  }
  componentSettingCache[componentType] = settings

  return settings
}

/**
 * Randomises a components ID's, including all child component IDs, and also
 * updates all data bindings to still be valid.
 * This mutates the object in place.
 * @param component the component to randomise
 */
export const makeComponentUnique = component => {
  if (!component) {
    return
  }

  // Generate a full set of component ID replacements in this tree
  const idReplacements = []
  const generateIdReplacements = (component, replacements) => {
    const oldId = component._id
    const newId = Helpers.uuid()
    replacements.push([oldId, newId])
    component._children?.forEach(x => generateIdReplacements(x, replacements))
  }
  generateIdReplacements(component, idReplacements)

  // Replace all instances of this ID in HBS bindings
  let definition = JSON.stringify(component)
  idReplacements.forEach(([oldId, newId]) => {
    definition = definition.replace(new RegExp(oldId, "g"), newId)
  })

  // Replace all instances of this ID in JS bindings
  const bindings = findHBSBlocks(definition)
  bindings.forEach(binding => {
    // JSON.stringify will have escaped double quotes, so we need
    // to account for that
    let sanitizedBinding = binding.replace(/\\"/g, '"')

    // Check if this is a valid JS binding
    let js = decodeJSBinding(sanitizedBinding)
    if (js != null) {
      // Replace ID inside JS binding
      idReplacements.forEach(([oldId, newId]) => {
        js = js.replace(new RegExp(oldId, "g"), newId)
      })

      // Create new valid JS binding
      let newBinding = encodeJSBinding(js)

      // Replace escaped double quotes
      newBinding = newBinding.replace(/"/g, '\\"')

      // Insert new JS back into binding.
      // A single string replace here is better than a regex as
      // the binding contains special characters, and we only need
      // to replace a single instance.
      definition = definition.replace(binding, newBinding)
    }
  })

  // Recurse on all children
  return JSON.parse(definition)
}
