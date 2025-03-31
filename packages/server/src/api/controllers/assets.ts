import { join } from "../../utilities/centralPath"
import { TOP_LEVEL_PATH, DEV_ASSET_PATH } from "../../utilities/fileSystem"
import { Ctx } from "@budibase/types"
import env from "../../environment"
import send from "koa-send"

// this is a public endpoint with no middlewares
export const serveBuilderAssets = async function (ctx: Ctx<void, void>) {
  let topLevelPath = env.isDev() ? DEV_ASSET_PATH : TOP_LEVEL_PATH
  const builderPath = join(topLevelPath, "builder")
  await send(ctx, ctx.file, { root: builderPath })
}
