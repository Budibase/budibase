import { Screen } from "@budibase/types"

export function findInSettings(screen: Screen, toFind: string) {
  const foundIn: { setting: string; value: string }[] = []
  function recurse(props: Record<string, any>, parentKey = "") {
    for (let key of Object.keys(props)) {
      if (!props[key]) {
        continue
      }
      if (typeof props[key] === "string" && props[key].includes(toFind)) {
        foundIn.push({
          setting: parentKey ? `${parentKey}.${key}` : key,
          value: props[key],
        })
      } else if (typeof props[key] === "object") {
        recurse(props[key], key)
      }
    }
  }

  recurse(screen.props)
  return foundIn
}
