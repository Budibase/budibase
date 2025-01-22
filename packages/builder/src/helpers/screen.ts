import { Component, Screen, ScreenProps } from "@budibase/types"
import clientManifest from "@budibase/client/manifest.json"

export function findComponentsBySettingsType(
  screen: Screen,
  type: string | string[]
) {
  const typesArray = Array.isArray(type) ? type : [type]

  const result: {
    component: Component
    setting: {
      type: string
      key: string
    }
  }[] = []
  function recurseFieldComponentsInChildren(component: ScreenProps) {
    if (!component) {
      return
    }

    const definition = getManifestDefinition(component)
    const setting =
      "settings" in definition &&
      definition.settings.find((s: any) => typesArray.includes(s.type))
    if (setting && "type" in setting) {
      result.push({
        component,
        setting: { type: setting.type!, key: setting.key! },
      })
    }
    component._children?.forEach(child => {
      recurseFieldComponentsInChildren(child)
    })
  }

  recurseFieldComponentsInChildren(screen?.props)
  return result
}

function getManifestDefinition(component: Component) {
  const componentType = component._component.split("/").slice(-1)[0]
  const definition =
    clientManifest[componentType as keyof typeof clientManifest]
  return definition
}
