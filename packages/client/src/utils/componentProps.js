import { enrichDataBindings } from "./enrichDataBinding"
import { enrichButtonActions } from "./buttonActions"
import { decodeJSBinding } from "@budibase/string-templates"
import { componentStore } from "stores"
import { Helpers } from "@budibase/bbui"

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
  // We want to exclude any button actions from enrichment at this stage.
  // Extract top level button action settings.
  let normalProps = Helpers.cloneDeep(props)
  let actionProps = {}

  const componentToSettingsMap = component => {
    const stepDef = componentStore.actions.getComponentDefinition(component)
    const settingsDef = getSettingsDefinition(stepDef)
    let settingsDefMap = {}
    settingsDef?.forEach(setting => {
      settingsDefMap[setting.key] = setting
    })
    return settingsDefMap
  }

  const processEventActions = (props, settingsDefinitionMap, propPath) => {
    Object.keys(props).forEach(prop => {
      if (settingsDefinitionMap?.[prop]?.type === "event") {
        const settingPath = propPath ? `${propPath}.${prop}` : prop
        actionProps[settingPath] = props[prop]
        delete props[prop]
      } else if (
        settingsDefinitionMap?.[prop]?.type === "buttonConfiguration"
      ) {
        // Remove nested button actions so that they may be stored and processed later
        // at the button component level. If they are processed now, the bindings will be lost.
        const buttonSettingDefMap = componentToSettingsMap(
          "@budibase/standard-components/button"
        )
        props[prop].forEach((button, idx) => {
          processEventActions(button, buttonSettingDefMap, `${prop}.${idx}`)
        })
      } else if (settingsDefinitionMap?.[prop]?.type === "stepConfiguration") {
        // Parse each step and ensure the nested button actions are extracted and preserved.
        // The config will be returned after the stepConfiguration core props are processed
        const stepSettingDefMap = componentToSettingsMap(
          "@budibase/standard-components/multistepformblockstep"
        )
        const buttonSettingDefMap = componentToSettingsMap(
          "@budibase/standard-components/button"
        )
        props[prop].forEach((step, stepIdx) => {
          Object.keys(step).forEach(stepProp => {
            if (stepSettingDefMap?.[stepProp]?.type === "buttonConfiguration") {
              step[stepProp].forEach((button, buttonIdx) => {
                processEventActions(
                  button,
                  buttonSettingDefMap,
                  `${prop}.${stepIdx}.${stepProp}.${buttonIdx}`
                )
              })
            }
          })
        })
      }
    })
  }

  processEventActions(normalProps, settingsDefinitionMap)

  // Store the original conditions so that we can restore parts of them after
  // enrichment
  let rawConditions = normalProps._conditions

  // Enrich all props except button actions
  let enrichedProps = enrichDataBindings(normalProps, context)

  // Enrich button actions.
  // Actions are enriched into a function at this stage, but actual data
  // binding enrichment is done dynamically at runtime.
  Object.keys(actionProps).forEach(prop => {
    let track = enrichedProps
    let parts = prop.split(".")
    // IF nested actions were removed earlier, they will be restored
    // e.g. steps.0.buttons.0.onClick
    if (parts.length > 1) {
      parts.forEach((part, idx) => {
        if (idx !== parts.length - 1) {
          track = track[part]
        } else {
          track[part] = actionProps[prop]
        }
      })
    } else {
      // Only enriched at the root component prop level
      enrichedProps[prop] = enrichButtonActions(actionProps[prop], context)
    }
  })

  // Conditions
  if (enrichedProps._conditions?.length) {
    enrichedProps._conditions.forEach((condition, idx) => {
      if (settingsDefinitionMap?.[condition.setting]?.type === "event") {
        // Use the original condition action value to enrich it to a button
        // action
        condition.settingValue = enrichButtonActions(
          rawConditions[idx].settingValue,
          context
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
