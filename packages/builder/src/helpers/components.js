import { componentStore } from "@/stores/builder"
import { get } from "svelte/store"
import { Helpers } from "@budibase/bbui"
import {
  decodeJSBinding,
  encodeJSBinding,
  findHBSBlocks,
} from "@budibase/string-templates"
import { capitalise } from "@/helpers"
import { Constants } from "@budibase/frontend-core"

const { ContextScopes } = Constants

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
 * Recurses through the component tree and finds all components.
 */
export const findAllComponents = rootComponent => {
  return findAllMatchingComponents(rootComponent, () => true)
}

/**
 * Finds the closest parent component which matches certain criteria
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

export const getComponentText = component => {
  if (component == null) {
    return ""
  }

  if (component?._instanceName) {
    return component._instanceName
  }
  const type =
    component._component?.replace("@budibase/standard-components/", "") ||
    "component"
  return capitalise(type)
}

export const getComponentName = component => {
  if (component == null) {
    return ""
  }

  const components = get(componentStore)?.components || {}
  const componentDefinition = components[component._component] || {}
  return componentDefinition.friendlyName || componentDefinition.name || ""
}

// Gets all contexts exposed by a certain component type, including actions
export const getComponentContexts = component => {
  const def = componentStore.getDefinition(component)
  let contexts = []
  if (def?.context) {
    contexts = Array.isArray(def.context) ? [...def.context] : [def.context]
  }
  if (def?.actions) {
    contexts.push({
      type: "action",
      scope: ContextScopes.Global,

      // Ensure all actions are their verbose object versions
      actions: def.actions.map(x => (typeof x === "string" ? { type: x } : x)),
    })
  }
  return contexts
}

/**
 * Recurses through the component tree and builds a tree of contexts provided
 * by components.
 */
export const buildContextTree = (
  rootComponent,
  tree = { root: [] },
  currentBranch = "root"
) => {
  // Sanity check
  if (!rootComponent) {
    return tree
  }

  // Process this component's contexts
  const contexts = getComponentContexts(rootComponent._component)
  if (contexts.length) {
    tree[currentBranch].push(rootComponent._id)

    // If we provide local context, start a new branch for our children
    if (contexts.some(context => context.scope === ContextScopes.Local)) {
      currentBranch = rootComponent._id
      tree[rootComponent._id] = []
    }
  }

  // Process children
  if (rootComponent._children) {
    rootComponent._children.forEach(child => {
      buildContextTree(child, tree, currentBranch)
    })
  }

  return tree
}

/**
 * Generates a lookup map of which context branch all components in a component
 * tree are inside.
 */
export const buildContextTreeLookupMap = rootComponent => {
  const tree = buildContextTree(rootComponent)
  let map = {}
  Object.entries(tree).forEach(([branch, ids]) => {
    ids.forEach(id => {
      map[id] = branch
    })
  })
  return map
}

// Get a flat list of ids for all descendants of a component
export const getChildIdsForComponent = component => {
  return [
    component._id,
    ...(component?._children ?? []).map(getChildIdsForComponent).flat(1),
  ]
}
