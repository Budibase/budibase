const normaliseBinding = (binding: string) =>
  binding
    .replace(/^\s*\{\{\s*/, "")
    .replace(/\s*\}\}\s*$/, "")
    .trim()

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
