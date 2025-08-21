import { Ctx, UpdateNavigationRequest } from "@budibase/types"
import sdk from "../../sdk"
import { builderSocket } from "../../websockets"

export async function update(
  ctx: Ctx<UpdateNavigationRequest, void, { workspaceAppId: string }>
) {
  const { workspaceAppId } = ctx.params
  const { navigation } = ctx.request.body
  await sdk.navigation.update(workspaceAppId, navigation)

  const workspaceApp = await sdk.workspaceApps.get(workspaceAppId)
  if (workspaceApp) {
    builderSocket?.emitWorkspaceAppUpdate(ctx, workspaceApp)
  }

  ctx.status = 204
}
