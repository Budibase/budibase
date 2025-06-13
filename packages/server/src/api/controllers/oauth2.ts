import {
  Ctx,
  FetchOAuth2ConfigsResponse,
  OAuth2Config,
  OAuth2ConfigResponse,
  PASSWORD_REPLACEMENT,
  ValidateConfigResponse,
  ValidateConfigRequest,
  InsertOAuth2ConfigRequest,
  InsertOAuth2ConfigResponse,
  UpdateOAuth2ConfigRequest,
  UpdateOAuth2ConfigResponse,
} from "@budibase/types"
import sdk from "../../sdk"

function toFetchOAuth2ConfigsResponse(
  config: OAuth2Config
): OAuth2ConfigResponse {
  return {
    _id: config._id!,
    _rev: config._rev!,
    name: config.name,
    url: config.url,
    clientId: config.clientId,
    clientSecret: PASSWORD_REPLACEMENT,
    method: config.method,
    grantType: config.grantType,
    scope: config.scope,
  }
}

export async function fetch(ctx: Ctx<void, FetchOAuth2ConfigsResponse>) {
  const configs = await sdk.oauth2.fetch()

  const timestamps = await sdk.oauth2.getLastUsages(configs.map(c => c._id))

  const response: FetchOAuth2ConfigsResponse = {
    configs: (configs || []).map(c => ({
      ...toFetchOAuth2ConfigsResponse(c),
      lastUsage: timestamps[c._id]
        ? new Date(timestamps[c._id]).toISOString()
        : undefined,
    })),
  }

  ctx.body = response
}

export async function create(
  ctx: Ctx<InsertOAuth2ConfigRequest, InsertOAuth2ConfigResponse>
) {
  const { body } = ctx.request
  const newConfig = {
    name: body.name,
    url: body.url,
    clientId: body.clientId,
    clientSecret: body.clientSecret,
    method: body.method,
    grantType: body.grantType,
    scope: body.scope,
  }

  const config = await sdk.oauth2.create(newConfig)
  ctx.status = 201
  ctx.body = {
    config: toFetchOAuth2ConfigsResponse(config),
  }
}

export async function edit(
  ctx: Ctx<UpdateOAuth2ConfigRequest, UpdateOAuth2ConfigResponse>
) {
  const { body } = ctx.request

  if (ctx.params.id !== body._id) {
    ctx.throw("Path and body ids do not match", 400)
  }

  const toUpdate = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    url: body.url,
    clientId: body.clientId,
    clientSecret: body.clientSecret,
    method: body.method,
    grantType: body.grantType,
    scope: body.scope,
  }

  const config = await sdk.oauth2.update(toUpdate)
  ctx.body = {
    config: toFetchOAuth2ConfigsResponse(config),
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const { id, rev } = ctx.params

  await sdk.oauth2.remove(id, rev)
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
    grantType: body.grantType,
    scope: body.scope,
  }

  if (config.clientSecret === PASSWORD_REPLACEMENT && body._id) {
    const existingConfig = await sdk.oauth2.get(body._id)
    if (!existingConfig) {
      ctx.throw(`OAuth2 config with id '${body._id}' not found.`, 404)
    }

    config.clientSecret = existingConfig.clientSecret
  }

  const validation = await sdk.oauth2.validateConfig(config)
  ctx.status = 200
  ctx.body = validation
}
