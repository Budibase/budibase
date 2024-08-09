import { helpers } from "@budibase/shared-core"

// Util to check if a setting can be rendered for a certain instance, based on
// the "dependsOn" metadata in the manifest
export const shouldDisplaySetting = (instance, setting) => {
  let dependsOn = setting.dependsOn
  if (dependsOn && !Array.isArray(dependsOn)) {
    dependsOn = [dependsOn]
  }
  if (!dependsOn?.length) {
    return true
  }

  // Ensure all conditions are met
  return dependsOn.every(condition => {
    let dependantSetting = condition
    let dependantValues = null
    let invert = !!condition.invert
    if (typeof condition === "object") {
      dependantSetting = condition.setting
      dependantValues = condition.value
    }
    if (!dependantSetting) {
      return false
    }

    // Ensure values is an array
    if (!Array.isArray(dependantValues)) {
      dependantValues = [dependantValues]
    }

    // If inverting, we want to ensure that we don't have any matches.
    // If not inverting, we want to ensure that we do have any matches.
    const currentVal = helpers.deepGet(instance, dependantSetting)
    const anyMatches = dependantValues.some(dependantVal => {
      if (dependantVal == null) {
        return currentVal != null && currentVal !== false && currentVal !== ""
      }
      return dependantVal === currentVal
    })
    return anyMatches !== invert
  })
}
