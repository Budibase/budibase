import { Screen, Component } from "@budibase/types"

export function findInSettings(screen: Screen, toFind: string) {
  const foundIn: { setting: string; value: string }[] = []
  function recurse(props: Component, parentKey = "") {
    for (const [key, value] of Object.entries(props)) {
      if (!value) {
        continue
      }
      if (typeof value === "string" && value.includes(toFind)) {
        foundIn.push({
          setting: parentKey ? `${parentKey}.${key}` : key,
          value: value,
        })
      } else if (typeof value === "object") {
        recurse(value, key)
      }
    }
  }

  recurse(screen.props)
  return foundIn
}
