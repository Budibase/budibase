import type {
  OpenAPIServer,
  RestTemplate,
  UIIntegration,
} from "@budibase/types"
import { API } from "@/api"
import { configFromIntegration } from "@/stores/selectors"
import { datasources } from "@/stores/builder/datasources"
import { getRestTemplateImportInfoRequest } from "@/helpers/restTemplates"

const resolveServerUrl = (server: OpenAPIServer) =>
  server.url.replace(
    /\{([^}]+)\}/g,
    (_, key) => server.variables?.[key]?.default ?? `{${key}}`
  )

export const createImportedRestConnection = async ({
  template,
  integration,
}: {
  template: RestTemplate
  integration: UIIntegration
}) => {
  const request = getRestTemplateImportInfoRequest(undefined, template.id)
  if (!request) {
    throw new Error("Invalid custom REST template")
  }

  const info = await API.getImportInfo(request)
  const config = {
    ...configFromIntegration(integration),
    url: info.servers?.[0] ? resolveServerUrl(info.servers[0]) : "",
    authConfigs: [],
    staticVariables: info.staticVariables || {},
    defaultHeaders: {},
    defaultQueryParameters: {},
    rejectUnauthorized: true,
    downloadImages: true,
  }

  return await datasources.create({
    integration,
    config,
    name: template.name,
    restTemplateId: template.id,
  })
}
