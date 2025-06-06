import {
  ResourceAnalysisRequest,
  ResourceAnalysisResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"

export async function analyse(
  ctx: UserCtx<ResourceAnalysisRequest, ResourceAnalysisResponse>
) {
  const { workspaceAppIds, automationIds } = ctx.request.body

  if (!workspaceAppIds?.length && !automationIds?.length) {
    ctx.throw(401, "No workspace apps or automations specified.")
  }

  ctx.body = {
    resources: await sdk.resources.analyse({ automationIds, workspaceAppIds }),
  }
}
