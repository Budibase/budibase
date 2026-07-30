import type {
  CustomRestTemplateId,
  ImportEndpoint,
  ImportRestQueryInfoRequest,
  RestTemplateId,
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
  spec?: RestTemplateSpec | null,
  restTemplateId?: RestTemplateId
): ImportRestQueryInfoRequest | undefined => {
  if (restTemplateId && isCustomRestTemplateId(restTemplateId)) {
    return {
      restTemplateId,
    }
  }
  if (spec?.url) {
    return {
      url: spec.url,
    }
  }
  return undefined
}

const isCustomRestTemplateId = (
  restTemplateId: RestTemplateId
): restTemplateId is CustomRestTemplateId =>
  restTemplateId.startsWith("rest_template_")
