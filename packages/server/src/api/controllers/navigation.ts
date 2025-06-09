import { Ctx, UpdateNavigationRequest } from "@budibase/types"
import sdk from "../../sdk"

export async function update(ctx: Ctx<UpdateNavigationRequest, void>) {
  const { navigation } = ctx.request.body
  await sdk.navigation.update(navigation)
  ctx.status = 204
}
