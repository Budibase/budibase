import { ComponentDefinition, ComponentSetting } from "@budibase/types"

/**
 * Gets the definition of this component's settings from the manifest
 */
export const getSettingsDefinition = (
  definition: ComponentDefinition
): ComponentSetting[] => {
  if (!definition) {
    return []
  }
  let settings: ComponentSetting[] = []
  definition.settings?.forEach(setting => {
    if (setting.section) {
      settings = settings.concat(
        (setting.settings || [])?.map(childSetting => ({
          ...childSetting,
          sectionDependsOn: setting.dependsOn,
        }))
      )
    } else {
      settings.push(setting)
    }
  })
  return settings
}
