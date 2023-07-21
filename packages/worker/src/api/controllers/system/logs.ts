import { UserCtx } from "@budibase/types"
import { installation, logging } from "@budibase/backend-core"

export async function getLogs(ctx: UserCtx) {
  const logReadStream = logging.system.getLogReadStream()

  const { installId } = await installation.getInstall()

  const fileName = `${installId}-${Date.now()}.log`

  ctx.set("content-disposition", `attachment; filename=${fileName}`)
  ctx.body = logReadStream
}
