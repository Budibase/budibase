import type { ImportEndpoint } from "@budibase/types"

const normalizeEndpointLabel = (value?: string) =>
  (value || "").toLowerCase().replace(/[^a-z0-9]/g, "")

const ENDPOINT_LABEL_CHAR_LIMIT = 70

export const formatEndpointLabel = (endpoint: ImportEndpoint) => {
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

  const combined = name !== path ? `${path} – ${name}` : path
  if (combined !== path && combined.length > ENDPOINT_LABEL_CHAR_LIMIT) {
    return path
  }
  return combined
}
