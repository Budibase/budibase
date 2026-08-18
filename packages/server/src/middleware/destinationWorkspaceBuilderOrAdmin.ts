import { users } from "@budibase/backend-core"
import { DuplicateResourceToWorkspaceRequest, UserCtx } from "@budibase/types"
import { Next } from "koa"

export async function destinationWorkspaceBuilderOrAdmin(
  ctx: UserCtx<DuplicateResourceToWorkspaceRequest>,
  next: Next
) {
  const { toWorkspace } = ctx.request.body
  if (!users.isAdminOrBuilder(ctx.user, toWorkspace)) {
    ctx.throw(403, "Only app builders or admins can duplicate resources.")
  }
  return next()
}
