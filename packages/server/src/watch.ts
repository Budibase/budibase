import env from "./environment"
import chokidar from "chokidar"
import fs from "fs"
import { constants, tenancy } from "@budibase/backend-core"
import { processUploaded } from "./sdk/plugins"
import { PluginSource } from "@budibase/types"

export function watch() {
  // chokidar v4+ removed glob support, so we watch the plugins directory
  // recursively and filter for plugin archives in the handler below.
  chokidar
    .watch(env.PLUGINS_DIR, {
      ignored: (filePath: string) => filePath.includes("node_modules"),
      awaitWriteFinish: {
        pollInterval: 100,
        stabilityThreshold: 250,
      },
      usePolling: true,
      interval: 250,
    })
    .on("all", async (event: string, filePath: string) => {
      // Sanity checks
      if (!filePath?.endsWith(".tar.gz") || !fs.existsSync(filePath)) {
        return
      }
      await tenancy.doInTenant(constants.DEFAULT_TENANT_ID, async () => {
        try {
          const split = filePath.split("/")
          const name = split[split.length - 1]
          console.log("Importing plugin:", filePath)
          await processUploaded(
            {
              originalFilename: name,
              filepath: filePath,
              mimetype: "application/gzip",
            },
            PluginSource.FILE
          )
        } catch (err: any) {
          const message = err?.message ? err?.message : err
          console.error("Failed to import plugin:", message)
        }
      })
    })
}
