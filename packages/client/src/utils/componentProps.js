import { enrichDataBindings } from "./enrichDataBinding"
import { enrichButtonActions } from "./buttonActions"

/**
 * Enriches component props.
 * Data bindings are enriched, and button actions are enriched.
 */
export const enrichProps = async (props, dataContexts, dataBindings) => {
  // Exclude all private props that start with an underscore
  let validProps = {}
  Object.entries(props)
    .filter(([name]) => !name.startsWith("_"))
    .forEach(([key, value]) => {
      validProps[key] = value
    })

  // Create context of all bindings and data contexts
  // Duplicate the closest context as "data" which the builder requires
  const context = {
    ...dataContexts,
    ...dataBindings,
    data: dataContexts[dataContexts.closestComponentId],
    data_draft: dataContexts[`${dataContexts.closestComponentId}_draft`],
  }

  // Enrich all data bindings in top level props
  let enrichedProps = await enrichDataBindings(validProps, context)

  // Enrich button actions if they exist
  if (props._component.endsWith("/button") && enrichedProps.onClick) {
    enrichedProps.onClick = enrichButtonActions(enrichedProps.onClick, context)
  }

  return enrichedProps
}
