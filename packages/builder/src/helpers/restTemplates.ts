import type { QueryImportEndpoint } from "@budibase/types"

const normalizeEndpointLabel = (value?: string) =>
  (value || "").toLowerCase().replace(/[^a-z0-9]/g, "")

export const formatEndpointLabel = (endpoint: QueryImportEndpoint) => {
  const path = endpoint.path || ""
  const name = endpoint.name || ""

  if (!path && !name) {
    return ""
  }
  if (!path) {
    return name
  }
  if (!name) {
    return path
  }

  const normalizedPath = normalizeEndpointLabel(path)
  const normalizedName = normalizeEndpointLabel(name)
  if (normalizedPath && normalizedPath === normalizedName) {
    return path
  }
  if (name !== path) {
    return `${path} – ${name}`
  }
  return path
}
