import { Ctx, UpdateNavigationRequest } from "@budibase/types"
import sdk from "../../sdk"

export async function update(
  ctx: Ctx<UpdateNavigationRequest, void, { workspaceAppId: string }>
) {
  const { workspaceAppId } = ctx.params
  const { navigation } = ctx.request.body
  await sdk.navigation.update(workspaceAppId, navigation)
  ctx.status = 204
}
