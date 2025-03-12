import {
  CreateOAuth2ConfigRequest,
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
      name: c.name,
      url: c.url,
    })),
  }
  ctx.body = response
}

export async function create(ctx: Ctx<CreateOAuth2ConfigRequest, void>) {
  const newConfig: RequiredKeys<OAuth2Config> = {
    name: ctx.request.body.name,
    url: ctx.request.body.url,
  }

  await sdk.oauth2.create(newConfig)
  ctx.status = 201
}
