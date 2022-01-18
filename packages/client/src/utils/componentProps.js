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

  // We want to exclude any button actions from enrichment at this stage.
  // Extract top level button action settings.
  let normalProps = { ...props }
  let actionProps = {}
  Object.keys(normalProps).forEach(prop => {
    if (prop?.toLowerCase().includes("onclick")) {
      actionProps[prop] = normalProps[prop]
      delete normalProps[prop]
    }
  })

  // Handle conditional UI separately after normal settings
  let conditions = normalProps._conditions
  delete normalProps._conditions

  // Enrich all props except button actions
  let enrichedProps = enrichDataBindings(normalProps, totalContext)

  // Enrich button actions.
  // Actions are enriched into a function at this stage, but actual data
  // binding enrichment is done dynamically at runtime.
  Object.keys(actionProps).forEach(prop => {
    enrichedProps[prop] = enrichButtonActions(actionProps[prop], totalContext)
  })

  // Conditions
  if (conditions?.length) {
    let enrichedConditions = []
    conditions.forEach(condition => {
      if (condition.setting?.toLowerCase().includes("onclick")) {
        // Copy and remove the setting value from the condition as it needs
        // enriched separately
        let toEnrich = { ...condition }
        delete toEnrich.settingValue

        // Join the condition back together
        enrichedConditions.push({
          ...enrichDataBindings(toEnrich, totalContext),
          settingValue: enrichButtonActions(
            condition.settingValue,
            totalContext
          ),
          rand: Math.random(),
        })
      } else {
        // Normal condition
        enrichedConditions.push(enrichDataBindings(condition, totalContext))
      }
    })
    enrichedProps._conditions = enrichedConditions
  }

  return enrichedProps
}
