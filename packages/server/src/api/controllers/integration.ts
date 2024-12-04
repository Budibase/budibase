import { getDefinition, getDefinitions } from "../../integrations"
import {
  SourceName,
  UserCtx,
  FetchIntegrationsResponse,
  FindIntegrationResponse,
} from "@budibase/types"

const DISABLED_EXTERNAL_INTEGRATIONS = [
  SourceName.AIRTABLE,
  SourceName.BUDIBASE,
]

export async function fetch(ctx: UserCtx<void, FetchIntegrationsResponse>) {
  const definitions = await getDefinitions()
  for (let disabledIntegration of DISABLED_EXTERNAL_INTEGRATIONS) {
    delete definitions[disabledIntegration]
  }
  ctx.body = definitions
}

export async function find(ctx: UserCtx<void, FindIntegrationResponse>) {
  const sourceType = ctx.params?.type
  if (DISABLED_EXTERNAL_INTEGRATIONS.indexOf(sourceType) !== -1) {
    ctx.throw(400, `Invalid source type - ${sourceType} is not supported.`)
  }
  const integration = await getDefinition(ctx.params.type)
  if (!integration) {
    ctx.throw(404, "Integration not found")
  }
  ctx.body = integration
}
