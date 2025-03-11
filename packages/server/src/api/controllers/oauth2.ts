import {
  CreateOAuth2ConfigRequest,
  CreateOAuth2ConfigResponse,
  Ctx,
  FetchOAuth2ConfigsResponse,
} from "@budibase/types"

export function fetch(ctx: Ctx<void, FetchOAuth2ConfigsResponse>) {
  ctx.body = { configs: [] }
}

export function create(
  ctx: Ctx<CreateOAuth2ConfigRequest, CreateOAuth2ConfigResponse>
) {
  ctx.status = 201
  ctx.body = { config: {} }
}
