import { Ctx } from "@budibase/types"
import send from "koa-send"
import path from "path"
import { existsSync } from "fs"
import { join } from "../../../utilities/centralPath"
import { NODE_MODULES_PATH } from "../../../utilities/fileSystem"

export function serveLocalFile(
  ctx: Ctx,
  fileName: string,
  subdirectory = "dist"
) {
  // Resolve via the package.json to avoid ESM/CJS export resolution issues
  // with require.resolve on packages that mark "type":"module".
  const pkgJsonPath = require.resolve("@budibase/client/package.json")
  const pkgDir = path.dirname(pkgJsonPath)
  const fromPkg = join(pkgDir, subdirectory)
  const nodeModulesPath = join(
    NODE_MODULES_PATH,
    "@budibase",
    "client",
    subdirectory
  )
  const root = existsSync(nodeModulesPath) ? nodeModulesPath : fromPkg
  return send(ctx, fileName, { root })
}
