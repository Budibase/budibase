import { getContextProviderComponents } from "builder/dataBinding"
import { componentStore } from "stores/builder"
import { capitalise } from "helpers"

// Generates bindings for all components that provider "datasource like"
// contexts. This includes "form" contexts and "schema" contexts. This is used
// by various button actions as candidates for whole "row" objects.
// Some examples are saving rows or duplicating rows.
export const getDatasourceLikeProviders = ({ asset, componentId, nested }) => {
  // Get all form context providers
  const formComponents = getContextProviderComponents(
    asset,
    componentId,
    "form",
    { includeSelf: nested }
  )

  // Get all schema context providers
  const schemaComponents = getContextProviderComponents(
    asset,
    componentId,
    "schema",
    { includeSelf: nested }
  )

  // Generate contexts for all form providers
  const formContexts = formComponents.map(component => ({
    component,
    context: extractComponentContext(component, "form"),
  }))

  // Generate contexts for all schema providers
  const schemaContexts = schemaComponents.map(component => ({
    component,
    context: extractComponentContext(component, "schema"),
  }))

  // Check for duplicate contexts by the same component. In this case, attempt
  // to label contexts with their suffixes
  schemaContexts.forEach(schemaContext => {
    // Check if we have a form context for this component
    const id = schemaContext.component._id
    const existing = formContexts.find(x => x.component._id === id)
    if (existing) {
      if (existing.context.suffix) {
        const suffix = capitalise(existing.context.suffix)
        existing.readableSuffix = ` - ${suffix}`
      }
      if (schemaContext.context.suffix) {
        const suffix = capitalise(schemaContext.context.suffix)
        schemaContext.readableSuffix = ` - ${suffix}`
      }
    }
  })

  // Generate bindings for all contexts
  const allContexts = formContexts.concat(schemaContexts)
  return allContexts.map(({ component, context, readableSuffix }) => {
    let readableBinding = component._instanceName
    let runtimeBinding = component._id
    if (context.suffix) {
      runtimeBinding += `-${context.suffix}`
    }
    if (readableSuffix) {
      readableBinding += readableSuffix
    }
    return {
      label: readableBinding,
      value: runtimeBinding,
    }
  })
}

// Gets a context definition of a certain type from a component definition
const extractComponentContext = (component, contextType) => {
  const def = componentStore.getDefinition(component?._component)
  if (!def) {
    return null
  }
  const contexts = Array.isArray(def.context) ? def.context : [def.context]
  return contexts.find(context => context?.type === contextType)
}
