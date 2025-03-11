import {
  CreateOAuth2ConfigRequest,
  CreateOAuth2ConfigResponse,
  Ctx,
  FetchOAuth2ConfigsResponse,
} from "@budibase/types"
import sdk from "../../sdk"

export async function fetch(ctx: Ctx<void, FetchOAuth2ConfigsResponse>) {
  const configs = await sdk.oauth2.fetch()

  ctx.body = { configs: (configs || []).map(c => ({})) }
}

export function create(
  ctx: Ctx<CreateOAuth2ConfigRequest, CreateOAuth2ConfigResponse>
) {
  ctx.status = 201
  ctx.body = { config: {} }
}
