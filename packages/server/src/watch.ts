import path from "path"
import env from "./environment"
import chokidar from "chokidar"
import fs from "fs"
import { constants, tenancy } from "@budibase/backend-core"
import pluginsSdk from "./sdk/plugins"

export function watch() {
  const watchPath = path.join(env.PLUGINS_DIR, "./**/*.tar.gz")
  chokidar
    .watch(watchPath, {
      ignored: "**/node_modules",
      awaitWriteFinish: {
        pollInterval: 100,
        stabilityThreshold: 250,
      },
      usePolling: true,
      interval: 250,
    })
    .on("all", async (event: string, path: string) => {
      // Sanity checks
      if (!path?.endsWith(".tar.gz") || !fs.existsSync(path)) {
        return
      }
      await tenancy.doInTenant(constants.DEFAULT_TENANT_ID, async () => {
        try {
          const split = path.split("/")
          const name = split[split.length - 1]
          console.log("Importing plugin:", path)
          await pluginsSdk.processUploaded({ name, path })
        } catch (err: any) {
          const message = err?.message ? err?.message : err
          console.error("Failed to import plugin:", message)
        }
      })
    })
}
