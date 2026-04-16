import { Screen, Component } from "@budibase/types"

export function findInSettings(screen: Screen, toFind: string) {
  const foundIn: { setting: string; value: string }[] = []
  function recurse(props: Component | Record<string, unknown> | unknown[], parentKey = "") {
    if (!props || typeof props !== "object") {
      return
    }

    for (const [key, value] of Object.entries(props)) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key

      if (!value) {
        continue
      }
      if (typeof value === "string" && value.includes(toFind)) {
        foundIn.push({
          setting: currentKey,
          value: value,
        })
      } else if (typeof value === "object") {
        recurse(value, currentKey)
      }
    }
  }

  recurse(screen.props)
  recurse(screen.onLoad || [], "onLoad")
  return foundIn
}
