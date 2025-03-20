import {
  UpsertOAuth2ConfigRequest,
  UpsertOAuth2ConfigResponse,
  Ctx,
  FetchOAuth2ConfigsResponse,
  OAuth2Config,
  RequiredKeys,
  OAuth2ConfigResponse,
  PASSWORD_REPLACEMENT,
  ValidateConfigResponse,
  ValidateConfigRequest,
} from "@budibase/types"
import sdk from "../../sdk"

function toFetchOAuth2ConfigsResponse(
  config: OAuth2Config
): OAuth2ConfigResponse {
  return {
    id: config.id,
    name: config.name,
    url: config.url,
    clientId: config.clientId,
    clientSecret: PASSWORD_REPLACEMENT,
    method: config.method,
  }
}

export async function fetch(ctx: Ctx<void, FetchOAuth2ConfigsResponse>) {
  const configs = await sdk.oauth2.fetch()

  const response: FetchOAuth2ConfigsResponse = {
    configs: (configs || []).map(toFetchOAuth2ConfigsResponse),
  }
  ctx.body = response
}

export async function create(
  ctx: Ctx<UpsertOAuth2ConfigRequest, UpsertOAuth2ConfigResponse>
) {
  const { body } = ctx.request
  const newConfig: RequiredKeys<Omit<OAuth2Config, "id">> = {
    name: body.name,
    url: body.url,
    clientId: body.clientId,
    clientSecret: body.clientSecret,
    method: body.method,
  }

  const config = await sdk.oauth2.create(newConfig)
  ctx.status = 201
  ctx.body = {
    config: toFetchOAuth2ConfigsResponse(config),
  }
}

export async function edit(
  ctx: Ctx<UpsertOAuth2ConfigRequest, UpsertOAuth2ConfigResponse>
) {
  const { body } = ctx.request
  const toUpdate: RequiredKeys<OAuth2Config> = {
    id: ctx.params.id,
    name: body.name,
    url: body.url,
    clientId: body.clientId,
    clientSecret: body.clientSecret,
    method: body.method,
  }

  const config = await sdk.oauth2.update(toUpdate)
  ctx.body = {
    config: toFetchOAuth2ConfigsResponse(config),
  }
}

export async function remove(
  ctx: Ctx<UpsertOAuth2ConfigRequest, UpsertOAuth2ConfigResponse>
) {
  const configToRemove = ctx.params.id

  await sdk.oauth2.remove(configToRemove)
  ctx.status = 204
}

export async function validate(
  ctx: Ctx<ValidateConfigRequest, ValidateConfigResponse>
) {
  const { body } = ctx.request
  const config = {
    url: body.url,
    clientId: body.clientId,
    clientSecret: body.clientSecret,
    method: body.method,
  }

  if (config.clientSecret === PASSWORD_REPLACEMENT && body.id) {
    const existingConfig = await sdk.oauth2.get(body.id)
    if (!existingConfig) {
      ctx.throw(`OAuth2 config with id '${body.id}' not found.`, 404)
    }

    config.clientSecret = existingConfig.clientSecret
  }

  const validation = await sdk.oauth2.validateConfig(config)
  ctx.status = 201
  ctx.body = validation
}
