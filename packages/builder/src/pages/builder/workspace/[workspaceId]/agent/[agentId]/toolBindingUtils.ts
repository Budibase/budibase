import { ToolType } from "@budibase/types"

const normaliseBinding = (binding: string) =>
  binding
    .replace(/^\s*\{\{\s*/, "")
    .replace(/\s*\}\}\s*$/, "")
    .trim()

export const getToolBindingCategory = (
  sourceType: ToolType | undefined,
  sourceLabel?: string
) => {
  if (sourceType === ToolType.INTERNAL_TABLE) {
    return "Budibase"
  }
  if (sourceType === ToolType.AUTOMATION) {
    return "Automations"
  }
  if (sourceType === ToolType.EXTERNAL_TABLE) {
    return sourceLabel || "External"
  }
  if (sourceType === ToolType.SEARCH) {
    return "Knowledge sources"
  }
  if (sourceType === ToolType.REST_QUERY) {
    return sourceLabel || "API tools"
  }
  if (sourceType === ToolType.DATASOURCE_QUERY) {
    return sourceLabel || "Datasource tools"
  }
  if (sourceType === ToolType.ESCALATION) {
    return "Escalation"
  }
  return "Tools"
}

export const getIncludedToolRuntimeBindings = (
  prompt: string | undefined | null,
  bindingsMap: Record<string, string>
) => {
  const matches = (prompt || "").match(/\{\{\s*[^{}]+\s*\}\}/g) || []
  return Array.from(
    new Set(
      matches
        .map(normaliseBinding)
        .map(binding => bindingsMap[binding])
        .filter(Boolean)
    )
  )
}
