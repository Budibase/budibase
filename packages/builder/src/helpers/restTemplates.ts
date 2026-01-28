import type {
  ImportEndpoint,
  ImportRestQueryInfoRequest,
  RestTemplateSpec,
} from "@budibase/types"

const normalizeEndpointLabel = (value?: string) =>
  (value || "").toLowerCase().replace(/[^a-z0-9]/g, "")

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
  return name
}

export const getRestTemplateImportInfoRequest = (
  spec?: RestTemplateSpec | null
): ImportRestQueryInfoRequest | undefined => {
  if (!spec) {
    return undefined
  }
  const payload: ImportRestQueryInfoRequest = {}
  if (spec.url) {
    payload.url = spec.url
  }
  if (!payload.url) {
    return undefined
  }
  return payload
}
