import type { RestTemplate, UIIntegration } from "@budibase/types"
import { API } from "@/api"
import { configFromIntegration } from "@/stores/selectors"
import { datasources } from "@/stores/builder/datasources"
import { getRestTemplateImportInfoRequest } from "@/helpers/restTemplates"

export const createImportedRestConnection = async ({
  template,
  integration,
  projectIds,
}: {
  template: RestTemplate
  integration: UIIntegration
  projectIds?: string[]
}) => {
  const request = getRestTemplateImportInfoRequest(undefined, template.id)
  if (!request) {
    throw new Error("Invalid custom REST template")
  }

  const info = await API.getImportInfo(request)
  const config = {
    ...configFromIntegration(integration),
    url: info.servers?.[0]?.url ?? info.url ?? "",
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
    projectIds,
    restTemplateId: template.id,
  })
}
