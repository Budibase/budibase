import { Ctx, FetchOAuth2ConfigsResponse } from "@budibase/types"

export function fetch(ctx: Ctx<void, FetchOAuth2ConfigsResponse>) {
  ctx.body = { configs: [] }
}
