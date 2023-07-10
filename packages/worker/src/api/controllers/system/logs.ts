import { UserCtx } from "@budibase/types"
import { context, logging } from "@budibase/backend-core"

export async function getLogs(ctx: UserCtx) {
  const logReadStream = logging.system.getLogReadStream()

  const fileName = `${context.getTenantId()}-${Date.now()}.logs`

  ctx.set("content-disposition", `attachment; filename=${fileName}`)
  ctx.body = logReadStream
}
