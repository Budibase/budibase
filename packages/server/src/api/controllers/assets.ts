import { join } from "../../utilities/centralPath"
import { TOP_LEVEL_PATH, DEV_ASSET_PATH } from "../../utilities/fileSystem"
import { Ctx } from "@budibase/types"
import env from "../../environment"
import send from "koa-send"
import { serveLocalFile } from "./static/serveLocalFile"

// this is a public endpoint with no middlewares
export const serveBuilderAssets = async function (ctx: Ctx<void, void>) {
  let topLevelPath = env.isDev() ? DEV_ASSET_PATH : TOP_LEVEL_PATH
  const builderPath = join(topLevelPath, "builder")
  const file = ctx.file || "index.html"
  await send(ctx, file, { root: builderPath })
}

export const serveAppMfeAssets = async function (ctx: Ctx<void, void>) {
  const file = ctx.file || "budibase-client.js"
  return serveLocalFile(ctx, file)
}
