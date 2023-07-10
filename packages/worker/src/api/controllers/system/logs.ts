import { UserCtx } from "@budibase/types"
import { logging } from "@budibase/backend-core"

export async function getLogs(ctx: UserCtx) {
  const logReadStream = logging.system.getLogReadStream()

  ctx.body = logReadStream
}
