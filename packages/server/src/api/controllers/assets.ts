import { join } from "../../utilities/centralPath"
import { TOP_LEVEL_PATH } from "../../utilities/fileSystem"
import { Ctx } from "@budibase/types"
import send from "koa-send"

// this is a public endpoint with no middlewares
export const serveBuilderAssets = async function (ctx: Ctx<void, void>) {
  const builderPath = join(TOP_LEVEL_PATH, "builder")
  await send(ctx, ctx.file, { root: builderPath })
}
