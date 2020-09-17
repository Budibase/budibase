import { cloneDeep, difference } from "lodash/fp"

/**
 * parameter for fetchBindableProperties function
 * @typedef {Object} fetchBindablePropertiesParameter
 * @property {string}  componentInstanceId - an _id of a component that has been added to a screen, which you want to fetch bindable props for
 * @propperty {Object} screen - current screen - where componentInstanceId lives
 * @property {Object} components - dictionary of component definitions
 * @property {Array} models - array of all models
 */

/**
 *
 * @typedef {Object} BindableProperty
 * @property {string} type - either "instance" (binding to a component instance) or "context" (binding to data in context e.g. List Item)
 * @property {Object} instance - relevant component instance. If "context" type, this instance is the component that provides the context... e.g. the List
 * @property {string} runtimeBinding - a binding string that is a) saved against the string, and b) used at runtime to read/write the value
 * @property {string} readableBinding - a binding string that is displayed to the user, in the builder
 */

/**
 * Generates all allowed bindings from within any particular component instance
 * @param {fetchBindablePropertiesParameter} param
 * @returns {Array.<BindableProperty>}
 */
export default function({ componentInstanceId, screen, components, models }) {
  const walkResult = walk({
    // cloning so we are free to mutate props (e.g. by adding _contexts)
    instance: cloneDeep(screen.props),
    targetId: componentInstanceId,
    components,
    models,
  })

  return [
    ...walkResult.bindableInstances
      .filter(isInstanceInSharedContext(walkResult))
      .map(componentInstanceToBindable(walkResult)),

    ...walkResult.target._contexts
      .map(contextToBindables(models, walkResult))
      .flat(),
  ]
}

const isInstanceInSharedContext = walkResult => i =>
  // should cover
  // - neither are in any context
  // - both in same context
  // - instance is in ancestor context of target
  i.instance._contexts.length <= walkResult.target._contexts.length &&
  difference(i.instance._contexts, walkResult.target._contexts).length === 0

// turns a component instance prop into binding expressions
// used by the UI
const componentInstanceToBindable = walkResult => i => {
  const lastContext =
    i.instance._contexts.length &&
    i.instance._contexts[i.instance._contexts.length - 1]
  const contextParentPath = lastContext
    ? getParentPath(walkResult, lastContext)
    : ""

  return {
    type: "instance",
    instance: i.instance,
    // how the binding expression persists, and is used in the app at runtime
    runtimeBinding: `${contextParentPath}${i.instance._id}.${i.prop}`,
    // how the binding exressions looks to the user of the builder
    readableBinding: `${i.instance._instanceName}`,
  }
}

const contextToBindables = (models, walkResult) => context => {
  const contextParentPath = getParentPath(walkResult, context)

  const newBindable = key => ({
    type: "context",
    instance: context.instance,
    // how the binding expression persists, and is used in the app at runtime
    runtimeBinding: `${contextParentPath}data.${key}`,
    // how the binding exressions looks to the user of the builder
    readableBinding: `${context.instance._instanceName}.${context.model.label}.${key}`,
  })

  // see ModelViewSelect.svelte for the format of context.model
  // ... this allows us to bind to Model scheams, or View schemas
  const model = models.find(m => m._id === context.model.modelId)
  const schema = context.model.isModel
    ? model.schema
    : model.views[context.model.name].schema

  return (
    Object.keys(schema)
      .map(newBindable)
      // add _id and _rev fields - not part of schema, but always valid
      .concat([newBindable("_id"), newBindable("_rev")])
  )
}

const getParentPath = (walkResult, context) => {
  // describes the number of "parent" in the path
  // clone array first so original array is not mtated
  const contextParentNumber = [...walkResult.target._contexts]
    .reverse()
    .indexOf(context)

  return (
    new Array(contextParentNumber).fill("parent").join(".") +
    // trailing . if has parents
    (contextParentNumber ? "." : "")
  )
}

const walk = ({ instance, targetId, components, models, result }) => {
  if (!result) {
    result = {
      target: null,
      bindableInstances: [],
      allContexts: [],
      currentContexts: [],
    }
  }

  if (!instance._contexts) instance._contexts = []

  // "component" is the component definition (object in component.json)
  const component = components[instance._component]

  if (instance._id === targetId) {
    // found it
    result.target = instance
  } else {
    if (component && component.bindable) {
      // pushing all components in here initially
      // but this will not be correct, as some of
      // these components will be in another context
      // but we dont know this until the end of the walk
      // so we will filter in another method
      result.bindableInstances.push({
        instance,
        prop: component.bindable,
      })
    }
  }

  // a component that provides context to it's children
  const contextualInstance =
    component && component.context && instance[component.context]

  if (contextualInstance) {
    // add to currentContexts (ancestory of context)
    // before walking children
    const model = instance[component.context]
    result.currentContexts.push({ instance, model })
  }

  const currentContexts = [...result.currentContexts]
  for (let child of instance._children || []) {
    // attaching _contexts of components, for eas comparison later
    // these have been deep cloned above, so shouln't modify the
    // original component instances
    child._contexts = currentContexts
    walk({ instance: child, targetId, components, models, result })
  }

  if (contextualInstance) {
    // child walk done, remove from currentContexts
    result.currentContexts.pop()
  }

  return result
}
