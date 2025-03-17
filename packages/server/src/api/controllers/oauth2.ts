import {
  UpsertOAuth2ConfigRequest,
  UpsertOAuth2ConfigResponse,
  Ctx,
  FetchOAuth2ConfigsResponse,
  OAuth2Config,
  RequiredKeys,
} from "@budibase/types"
import sdk from "../../sdk"

export async function fetch(ctx: Ctx<void, FetchOAuth2ConfigsResponse>) {
  const configs = await sdk.oauth2.fetch()

  const response: FetchOAuth2ConfigsResponse = {
    configs: (configs || []).map(c => ({
      id: c.id,
      name: c.name,
      url: c.url,
    })),
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
    clientId: ctx.clientId,
    clientSecret: ctx.clientSecret,
  }

  const config = await sdk.oauth2.create(newConfig)
  ctx.status = 201
  ctx.body = { config }
}

export async function edit(
  ctx: Ctx<UpsertOAuth2ConfigRequest, UpsertOAuth2ConfigResponse>
) {
  const { body } = ctx.request
  const toUpdate: RequiredKeys<OAuth2Config> = {
    id: ctx.params.id,
    name: body.name,
    url: body.url,
    clientId: ctx.clientId,
    clientSecret: ctx.clientSecret,
  }

  const config = await sdk.oauth2.update(toUpdate)
  ctx.status = 201
  ctx.body = { config }
}
