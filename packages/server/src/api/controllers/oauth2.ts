import {
  CreateOAuth2ConfigRequest,
  CreateOAuth2ConfigResponse,
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
  ctx: Ctx<CreateOAuth2ConfigRequest, CreateOAuth2ConfigResponse>
) {
  const newConfig: RequiredKeys<Omit<OAuth2Config, "id">> = {
    name: ctx.request.body.name,
    url: ctx.request.body.url,
  }

  const config = await sdk.oauth2.create(newConfig)
  ctx.status = 201
  ctx.body = { config }
}
