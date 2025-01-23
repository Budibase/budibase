import { getManifest, helpersToRemoveForJs } from "@budibase/string-templates"

export interface Completion {
  text: string
  path: string
  example?: string
  label: string
  displayText: string
  description: string
  allowsJs: boolean
}

export function handlebarsCompletions(): Completion[] {
  const manifest = getManifest()

  return Object.keys(manifest).flatMap(key =>
    Object.entries(manifest[key]).map(([helperName, helperConfig]) => ({
      text: helperName,
      path: helperName,
      example: helperConfig.example,
      label: helperName,
      displayText: helperName,
      description: helperConfig.description,
      allowsJs:
        !helperConfig.requiresBlock &&
        !helpersToRemoveForJs.includes(helperName),
    }))
  )
}
