import { enrichDataBindings } from "./enrichDataBinding"
import { enrichButtonActions } from "./buttonActions"
import { decodeJSBinding } from "@budibase/string-templates"

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
export const enrichProps = (props, context, settingsDefinitionMap) => {
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
    if (settingsDefinitionMap?.[prop]?.type === "event") {
      actionProps[prop] = normalProps[prop]
      delete normalProps[prop]
    }
  })

  // Store the original conditions so that we can restore parts of them after
  // enrichment
  let rawConditions = normalProps._conditions

  // Enrich all props except button actions
  let enrichedProps = enrichDataBindings(normalProps, totalContext)

  // Enrich button actions.
  // Actions are enriched into a function at this stage, but actual data
  // binding enrichment is done dynamically at runtime.
  Object.keys(actionProps).forEach(prop => {
    enrichedProps[prop] = enrichButtonActions(actionProps[prop], totalContext)
  })

  // Conditions
  if (enrichedProps._conditions?.length) {
    enrichedProps._conditions.forEach((condition, idx) => {
      if (settingsDefinitionMap?.[condition.setting]?.type === "event") {
        // Use the original condition action value to enrich it to a button
        // action
        condition.settingValue = enrichButtonActions(
          rawConditions[idx].settingValue,
          totalContext
        )

        // Since we can't compare functions, we need to assume that conditions
        // change after every enrichment
        condition.rand = Math.random()
      }
    })
  }

  return enrichedProps
}

/**
 * Checks if a props object references a particular context binding.
 * e.g. if props are { foo: "My name is {{ person.name }}" }, and we search for" +
 * "person", then this function wil return true - the props do a context key
 * called "person".
 * @param props the props object to search
 * @param bindingKey the key to search for
 */
export const propsUseBinding = (props, bindingKey) => {
  if (!Object.keys(props || {}).length) {
    return false
  }
  const string = JSON.stringify(props)
  const usedInHBS = string.includes(`[${bindingKey}]`)
  if (usedInHBS) {
    return true
  }
  const jsBindingRegex = new RegExp("{{ js [^}]+ }}", "g")
  const jsBindings = [...string.matchAll(jsBindingRegex)]
  for (let jsBinding of jsBindings) {
    const encoded = jsBinding[0]
    const js = decodeJSBinding(encoded)
    if (js?.includes(`$("[${bindingKey}]`)) {
      return true
    }
  }
  return false
}

/**
 * Gets the definition of this component's settings from the manifest
 */
export const getSettingsDefinition = definition => {
  if (!definition) {
    return []
  }
  let settings = []
  definition.settings?.forEach(setting => {
    if (setting.section) {
      settings = settings.concat(setting.settings || [])
    } else {
      settings.push(setting)
    }
  })
  return settings
}
