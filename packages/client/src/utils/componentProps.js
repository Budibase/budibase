import { enrichDataBindings } from "./enrichDataBinding"
import { enrichButtonActions } from "./buttonActions"

/**
 * Deeply compares 2 props using JSON.stringify.
 * Does not consider functions, as currently only button actions have a function
 * prop and it's cheaper to just always re-render buttons than it is to deeply
 * compare them.
 */
export const propsAreSame = (a, b) => {
  if (a === b) {
    return true
  }
  if (typeof a === "function" || typeof b === "function") {
    return false
  }
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Enriches component props.
 * Data bindings are enriched, and button actions are enriched.
 */
export const enrichProps = async (props, context) => {
  // Exclude all private props that start with an underscore
  let validProps = {}
  Object.entries(props)
    .filter(([name]) => !name.startsWith("_"))
    .forEach(([key, value]) => {
      validProps[key] = value
    })

  // Create context of all bindings and data contexts
  // Duplicate the closest context as "data" which the builder requires
  const totalContext = {
    ...context,

    // This is only required for legacy bindings that used "data" rather than a
    // component ID.
    data: context[context.closestComponentId],
  }

  // Enrich all data bindings in top level props
  let enrichedProps = await enrichDataBindings(validProps, totalContext)

  // Enrich click actions if they exist
  if (enrichedProps.onClick) {
    enrichedProps.onClick = enrichButtonActions(
      enrichedProps.onClick,
      totalContext
    )
  }

  return enrichedProps
}
