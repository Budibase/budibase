import { Component, Screen, ScreenProps } from "@budibase/types"
import clientManifest from "@budibase/client/manifest.json"

export function findComponentsBySettingsType(screen: Screen, type: string) {
  const result: Component[] = []
  function recurseFieldComponentsInChildren(
    component: ScreenProps,
    type: string
  ) {
    if (!component) {
      return
    }

    const componentType = component._component.split("/").slice(-1)[0]
    const definition =
      clientManifest[componentType as keyof typeof clientManifest]
    if (
      "settings" in definition &&
      definition.settings.some((s: any) => s.type === type)
    ) {
      result.push(component)
    }
    component._children?.forEach(child => {
      recurseFieldComponentsInChildren(child, type)
    })
  }

  recurseFieldComponentsInChildren(screen?.props, type)
  return result
}
