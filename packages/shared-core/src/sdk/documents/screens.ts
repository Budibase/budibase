import { Screen } from "@budibase/types"
import { flattenObject } from "../../utils"

export function findInSettings(screen: Screen, toFind: string) {
  const flattened = flattenObject(screen.props)
  const foundIn: { setting: string; value: string }[] = []
  for (let key of Object.keys(flattened)) {
    let found = false
    if (typeof flattened[key] === "string") {
      found = flattened[key].includes(toFind)
    } else if (Array.isArray(flattened[key])) {
      found = flattened[key].find(
        (el: any) => typeof el === "string" && el.includes(toFind)
      )
    }
    if (found) {
      foundIn.push({
        setting: key,
        value: flattened[key],
      })
    }
  }
  return foundIn
}
