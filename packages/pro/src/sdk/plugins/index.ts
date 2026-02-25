import {
  Plugin,
  PluginMetadata,
  PluginSource,
  PluginType,
  PluginOrigin,
} from "@budibase/types"
import {
  events,
  objectStore,
  db as dbCore,
  tenancy,
  logging,
} from "@budibase/backend-core"
import { loadJSFile } from "../../utilities/fileSystem"
import * as quotas from "../quotas"

export async function storePlugin(
  metadata: PluginMetadata,
  directory: any,
  source: PluginSource,
  origin?: PluginOrigin
): Promise<Plugin> {
  const db = tenancy.getGlobalDB()
  const version = metadata.package.version,
    name = metadata.package.name,
    description = metadata.package.description,
    hash = metadata.schema.hash

  // first open the tarball into tmp directory
  const bucketPath = objectStore.getPluginS3Dir(name)
  const files = await objectStore.uploadDirectory(
    objectStore.ObjectStoreBuckets.PLUGINS,
    directory,
    bucketPath
  )
  const jsFile = files.find((file: any) => file.name.endsWith(".js"))
  const iconFile = files.find((file: any) => file.name.endsWith(".svg"))
  if (!jsFile) {
    throw new Error(`Plugin missing .js file.`)
  }
  // validate the JS for a datasource
  if (metadata.schema.type === PluginType.DATASOURCE) {
    const js = loadJSFile(directory, jsFile.name)
    try {
      // down the line we might need a better way to confirm JS file
      // BUDI-7116 -> indirect eval call appears to cause issues importing plugins
      eval(js)
    } catch (err: any) {
      const message = err?.message ? err.message : JSON.stringify(err)
      throw new Error(`JS invalid: ${message}`)
    }
  }
  const iconFileName = iconFile ? iconFile.name : null
  const pluginId = dbCore.generatePluginID(name)

  // overwrite existing docs entirely if they exist
  let rev
  try {
    const existing = await db.get<Plugin>(pluginId)
    rev = existing._rev
  } catch (err) {
    rev = undefined
  }
  let doc: Plugin = {
    _id: pluginId,
    _rev: rev,
    ...metadata,
    name,
    version,
    hash,
    description,
    source,
  }
  if (iconFileName) {
    doc.iconFileName = iconFileName
  }

  if (source) {
    doc = {
      ...doc,
      source,
    }
  }

  if (origin && origin.source === "github") {
    doc.origin = origin
  }

  const write = async (): Promise<Plugin> => {
    const response = await db.put(doc)
    await events.plugin.imported(doc)
    return {
      ...doc,
      _rev: response.rev,
    }
  }
  // it doesn't exist, update the quota
  if (!rev) {
    return await quotas.addPlugin(write)
  } else {
    return await write()
  }
}

export async function deletePlugin(pluginId: string) {
  const db = tenancy.getGlobalDB()
  try {
    const plugin: Plugin = await db.get(pluginId)
    const bucketPath = objectStore.getPluginS3Dir(plugin.name)
    await objectStore.deleteFolder(
      objectStore.ObjectStoreBuckets.PLUGINS,
      bucketPath
    )

    await db.remove(pluginId, plugin._rev!)
    await events.plugin.deleted(plugin)
    await quotas.removePlugin()
  } catch (err: any) {
    const errMsg = err?.message ? err?.message : err
    throw new Error(`Failed to delete plugin: ${errMsg}`)
  }
}

export async function checkPluginQuotas() {
  const db = tenancy.getGlobalDB()
  try {
    const allPlugins = await db.allDocs(dbCore.getPluginParams())
    const pluginCount = allPlugins.rows.length
    console.log(`Syncing plugin count: ${pluginCount}`)
    await quotas.updatePluginCount(pluginCount)
  } catch (err) {
    logging.logAlert("Unable to retrieve plugins for quota check", err)
  }
}
