import { KoaFile, Plugin, PluginSource, PluginType } from "@budibase/types"
import {
  db as dbCore,
  objectStore,
  plugins as pluginCore,
  tenancy,
} from "@budibase/backend-core"
import { fileUpload } from "../../api/controllers/plugin/file"
import env from "../../environment"
import { clientAppSocket } from "../../websockets"
import { sdk as pro } from "@budibase/pro"

export async function fetch(type?: PluginType): Promise<Plugin[]> {
  const db = tenancy.getGlobalDB()
  const response = await db.allDocs(
    dbCore.getPluginParams(null, {
      include_docs: true,
    })
  )
  let plugins = response.rows.map((row: any) => row.doc) as Plugin[]
  plugins = objectStore.enrichPluginURLs(plugins)
  if (type) {
    return plugins.filter((plugin: Plugin) => plugin.schema?.type === type)
  } else {
    return plugins
  }
}

export async function processUploaded(plugin: KoaFile, source?: PluginSource) {
  const { metadata, directory } = await fileUpload(plugin)
  pluginCore.validate(metadata?.schema)

  // Only allow components in cloud
  if (!env.SELF_HOSTED && metadata?.schema?.type !== PluginType.COMPONENT) {
    throw new Error("Only component plugins are supported outside of self-host")
  }

  const doc = await pro.plugins.storePlugin(metadata, directory, source)
  clientAppSocket?.emit("plugin-update", { name: doc.name, hash: doc.hash })
  return doc
}
