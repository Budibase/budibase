import { getSettingsDefinition } from "@budibase/frontend-core"
import { enrichProps } from "@/utils/componentProps"
import { getActiveConditions, reduceConditionActions } from "@/utils/conditions"
import { componentStore } from "@/stores/components"

let buttonSettingsDefinitionMap

const getButtonSettingsDefinitionMap = () => {
  if (buttonSettingsDefinitionMap) {
    return buttonSettingsDefinitionMap
  }

  // Mirror the button component's settings definition for enrichment/conditions.
  const definition = componentStore.actions.getComponentDefinition(
    "@budibase/standard-components/button"
  )
  if (!definition) {
    buttonSettingsDefinitionMap = {}
    return buttonSettingsDefinitionMap
  }

  const settingsDefinition = getSettingsDefinition(definition)
  let map = {}
  settingsDefinition?.forEach(setting => {
    map[setting.key] = setting
  })

  buttonSettingsDefinitionMap = map
  return buttonSettingsDefinitionMap
}

const evaluateButtonConditions = conditions => {
  if (!conditions?.length) {
    return { visible: true, settingUpdates: {} }
  }

  // Keep in line with Component.svelte's condition evaluation behavior.
  let visible = !conditions.find(condition => condition.action === "show")
  const activeConditions = getActiveConditions(conditions)
  const result = reduceConditionActions(activeConditions)
  if (result.visible != null) {
    visible = result.visible
  }

  return { visible, settingUpdates: result.settingUpdates }
}

const buildCollapsedButton = (
  button,
  context,
  enrichButtonActions,
  settingsDefinitionMap
) => {
  const rawConditions = button?._conditions || button?.conditions
  // Enrich bindings so dynamic text/actions/conditions resolve in collapsed mode.
  const enriched = enrichProps(
    {
      ...button,
      _conditions: rawConditions,
    },
    context,
    settingsDefinitionMap
  )
  const { visible, settingUpdates } = evaluateButtonConditions(
    enriched._conditions
  )

  if (!visible) {
    return null
  }

  const resolved = {
    ...enriched,
    ...settingUpdates,
  }

  return {
    ...resolved,
    onClick: async () => {
      // Use enriched handler when available, fall back to the raw action list.
      const handler =
        typeof resolved.onClick === "function"
          ? resolved.onClick
          : enrichButtonActions(button.onClick, context)
      await handler?.()
    },
  }
}

// Collapsed button groups bypass the normal Component pipeline, so we need to
// enrich bindings and evaluate conditions manually to match standard behavior.
export const resolveCollapsedButtons = (
  buttons,
  context,
  enrichButtonActions
) => {
  if (!buttons?.length) {
    return []
  }

  const settingsDefinitionMap = getButtonSettingsDefinitionMap()

  return buttons
    .map(button =>
      buildCollapsedButton(
        button,
        context,
        enrichButtonActions,
        settingsDefinitionMap
      )
    )
    .filter(Boolean)
}
