import { Component, Screen, ScreenProps } from "@budibase/types"
import clientManifest from "@budibase/client/manifest.json"

export function findComponentsBySettingsType(screen: Screen, type: string) {
  const result: {
    component: Component
    setting: {
      type: string
      key: string
    }
  }[] = []
  function recurseFieldComponentsInChildren(
    component: ScreenProps,
    type: string
  ) {
    if (!component) {
      return
    }

    const definition = getManifestDefinition(component)
    const setting =
      "settings" in definition &&
      definition.settings.find((s: any) => s.type === type)
    if (setting && "type" in setting) {
      result.push({
        component,
        setting: { type: setting.type!, key: setting.key! },
      })
    }
    component._children?.forEach(child => {
      recurseFieldComponentsInChildren(child, type)
    })
  }

  recurseFieldComponentsInChildren(screen?.props, type)
  return result
}

function getManifestDefinition(component: Component) {
  const componentType = component._component.split("/").slice(-1)[0]
  const definition =
    clientManifest[componentType as keyof typeof clientManifest]
  return definition
}
