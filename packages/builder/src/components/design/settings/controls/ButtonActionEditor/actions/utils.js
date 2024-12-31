import { getAllComponentContexts } from "@/dataBinding"
import { capitalise } from "@/helpers"

// Generates bindings for all components that provider "datasource like"
// contexts. This includes "form" contexts and "schema" contexts. This is used
// by various button actions as candidates for whole "row" objects.
// Some examples are saving rows or duplicating rows.
export const getDatasourceLikeProviders = ({ asset, componentId, nested }) => {
  // Get all form context providers
  const formComponentContexts = getAllComponentContexts(
    asset,
    componentId,
    "form",
    {
      includeSelf: nested,
    }
  )
  // Get all schema context providers
  const schemaComponentContexts = getAllComponentContexts(
    asset,
    componentId,
    "schema",
    {
      includeSelf: nested,
    }
  )

  // Check for duplicate contexts by the same component. In this case, attempt
  // to label contexts with their suffixes
  schemaComponentContexts.forEach(schemaContext => {
    // Check if we have a form context for this component
    const id = schemaContext.component._id
    const existing = formComponentContexts.find(x => x.component._id === id)
    if (existing) {
      if (existing.contexts[0].suffix) {
        const suffix = capitalise(existing.contexts[0].suffix)
        existing.readableSuffix = ` - ${suffix}`
      }
      if (schemaContext.contexts[0].suffix) {
        const suffix = capitalise(schemaContext.contexts[0].suffix)
        schemaContext.readableSuffix = ` - ${suffix}`
      }
    }
  })

  // Generate bindings for all contexts
  const allContexts = formComponentContexts.concat(schemaComponentContexts)
  return allContexts.map(({ component, contexts, readableSuffix }) => {
    let readableBinding = component._instanceName
    let runtimeBinding = component._id
    if (contexts[0].suffix) {
      runtimeBinding += `-${contexts[0].suffix}`
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
