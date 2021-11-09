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
export const enrichProps = (props, context) => {
  // Create context of all bindings and data contexts
  // Duplicate the closest context as "data" which the builder requires
  const totalContext = {
    ...context,

    // This is only required for legacy bindings that used "data" rather than a
    // component ID.
    data: context[context.closestComponentId],
  }

  // Enrich all data bindings in top level props
  let enrichedProps = enrichDataBindings(props, totalContext)

  // Enrich click actions if they exist
  Object.keys(enrichedProps).forEach(prop => {
    if (prop?.toLowerCase().includes("onclick")) {
      enrichedProps[prop] = enrichButtonActions(
        enrichedProps[prop],
        totalContext
      )
    }
  })

  // Enrich any click actions in conditions
  if (enrichedProps._conditions) {
    enrichedProps._conditions.forEach(condition => {
      if (condition.setting?.toLowerCase().includes("onclick")) {
        condition.settingValue = enrichButtonActions(
          condition.settingValue,
          totalContext
        )

        // If there is an onclick function in here then it won't be serialised
        // properly, and therefore will not be updated properly.
        // The solution to this is add a rand which will ensure diffs happen
        // every time.
        condition.rand = Math.random()
      }
    })
  }

  return enrichedProps
}
