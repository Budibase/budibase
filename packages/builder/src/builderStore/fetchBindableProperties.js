export default function({ componentInstanceId, screen, components, models }) {
  const { target, targetAncestors, bindableInstances, bindableContexts } = walk(
    {
      instance: screen.props,
      targetId: componentInstanceId,
      components,
      models,
    }
  )

  return [
    ...bindableInstances
      .filter(isComponentInstanceAvailable)
      .map(componentInstanceToBindable),
    ...bindableContexts.map(contextToBindables),
  ]
}

const isComponentInstanceAvailable = i => true

// turns a component instance prop into binding expressions
// used by the UI
const componentInstanceToBindable = i => ({
  type: "instance",
  instance: i.instance,
  // how the binding expression persists, and is used in the app at runtime
  runtimeBinding: `state.${i.instance._id}.${i.prop}`,
  // how the binding exressions looks to the user of the builder
  readableBinding: `${i.instance._instanceName}`,
})

const contextToBindables = c => {
  const contextParentNumber = 0
  const contextParentPath = Array[contextParentNumber]
    .map(() => "_parent")
    .join(".")
  return Object.keys(c.schema).map(k => ({
    type: "context",
    instance: c.instance,
    // how the binding expression persists, and is used in the app at runtime
    runtimeBinding: `context.${contextParentPath}.${k}`,
    // how the binding exressions looks to the user of the builder
    readableBinding: `${c.instance._instanceName}.${c.schema.name}.${k}`,
  }))
}

const walk = ({ instance, targetId, components, models, result }) => {
  if (!result) {
    result = {
      currentAncestors: [],
      currentContexts: [],
      target: null,
      targetAncestors: [],
      bindableInstances: [],
      bindableContexts: [],
      parentMap: {},
    }
  }

  // "component" is the component definition (object in component.json)
  const component = components[instance._component]
  const parentInstance =
    result.currentAncestors.length > 0 &&
    result.currentAncestors[result.currentAncestors.length - 1]

  if (instance._id === targetId) {
    // set currentParents to be result parents
    result.targetAncestors = result.currentAncestors
    result.bindableContexts = result.currentContexts
    // found it
    result.target = instance
  } else {
    if (instance.bindable) {
      // pushing all components in here initially
      // but this will not be correct, as some of
      // these components will be in another context
      // but we dont know this until the end of the walk
      // so we will filter in another metod
      result.bindableInstances.push({
        instance,
        prop: instance.bindable,
      })
    }
  }
  console.log(instance._component)
  console.debug(components)
  // a component that provides context to it's children
  const contextualInstance = component.context && instance[component.context]

  if (contextualInstance) {
    // add to currentContexts (ancestory of context)
    // before walking children
    const schema = models.find(m => m._id === instance[component.context])
      .schema
    result.currentContexts.push({ instance, schema })
  }

  for (let child of instance._children || []) {
    result.parentMap[child._id] = parentInstance._id
    result.currentAncestors.push(instance)
    walk({ instance, targetId, components, models, result })
    result.currentAncestors.pop()
  }

  if (contextualInstance) {
    // child walk done, remove from currentContexts
    result.currentContexts.pop()
  }

  return result
}
