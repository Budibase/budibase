import { cloneDeep, difference, fill } from "lodash"

const stubBindings = [
  {
    // type: instance represents a bindable property of a component
    type: "instance",
    instance: {} /** a component instance **/,
    // how the binding expression persists, and is used in the app at runtime
    runtimeBinding: "state.<component instance Id>.<component property name>",
    // how the binding exressions looks to the user of the builder
    readableBinding: "<component instance name>",
  },
  {
    type: "context",
    instance: {
      /** a component instance **/
    },
    // how the binding expression persists, and is used in the app at runtime
    runtimeBinding: "context._parent.<key of model/record>",
    // how the binding exressions looks to the user of the builder
    readableBinding: "<component instance name>.<model/view name>.<key>",
  },
]

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

    ...walkResult.target._contexts.map(contextToBindables(walkResult)).flat(),
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

  // if component is inside context, then the component lives
  // in context at runtime (otherwise, in state)
  const stateOrContext = lastContext ? "context" : "state"
  return {
    type: "instance",
    instance: i.instance,
    // how the binding expression persists, and is used in the app at runtime
    runtimeBinding: `${stateOrContext}.${contextParentPath}${i.instance._id}.${i.prop}`,
    // how the binding exressions looks to the user of the builder
    readableBinding: `${i.instance._instanceName}`,
  }
}

const contextToBindables = walkResult => c => {
  const contextParentPath = getParentPath(walkResult, c)

  return Object.keys(c.model.schema).map(k => ({
    type: "context",
    instance: c.instance,
    // how the binding expression persists, and is used in the app at runtime
    runtimeBinding: `context.${contextParentPath}data.${k}`,
    // how the binding exressions looks to the user of the builder
    readableBinding: `${c.instance._instanceName}.${c.model.name}.${k}`,
  }))
}

const getParentPath = (walkResult, context) => {
  // describes the number of "_parent" in the path
  // clone array first so original array is not mtated
  const contextParentNumber = [...walkResult.target._contexts]
    .reverse()
    .indexOf(context)

  return (
    new Array(contextParentNumber).fill("_parent").join(".") +
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
    if (component.bindable) {
      // pushing all components in here initially
      // but this will not be correct, as some of
      // these components will be in another context
      // but we dont know this until the end of the walk
      // so we will filter in another metod
      result.bindableInstances.push({
        instance,
        prop: component.bindable,
      })
    }
  }

  // a component that provides context to it's children
  const contextualInstance = component.context && instance[component.context]

  if (contextualInstance) {
    // add to currentContexts (ancestory of context)
    // before walking children
    const model = models.find(m => m._id === instance[component.context])
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
