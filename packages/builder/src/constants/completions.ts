import { getManifest, helpersToRemoveForJs } from "@budibase/string-templates"
import { Helper } from "@budibase/types"

export function handlebarsCompletions(): Helper[] {
  const manifest = getManifest()
  return Object.values(manifest).flatMap(helpersObj =>
    Object.entries(helpersObj).map<Helper>(([helperName, helperConfig]) => ({
      text: helperName,
      path: helperName,
      example: helperConfig.example,
      label: helperName,
      displayText: helperName,
      description: helperConfig.description,
      allowsJs:
        !helperConfig.requiresBlock &&
        !helpersToRemoveForJs.includes(helperName),
      args: helperConfig.args,
    }))
  )
}
