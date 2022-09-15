import { ObjectStoreBuckets } from "../../../constants"
import { loadJSFile } from "../../../utilities/fileSystem"
import { npmUpload, urlUpload, githubUpload, fileUpload } from "./uploaders"
import { getGlobalDB } from "@budibase/backend-core/tenancy"
import { validate } from "@budibase/backend-core/plugins"
import { generatePluginID, getPluginParams } from "../../../db/utils"
import {
  uploadDirectory,
  deleteFolder,
} from "@budibase/backend-core/objectStore"
import { PluginType, FileType, PluginSource, Plugin } from "@budibase/types"
import env from "../../../environment"
import { ClientAppSocket } from "../../../websocket"
import { events } from "@budibase/backend-core"

export async function getPlugins(type?: PluginType) {
  const db = getGlobalDB()
  const response = await db.allDocs(
    getPluginParams(null, {
      include_docs: true,
    })
  )
  const plugins = response.rows.map((row: any) => row.doc)
  if (type) {
    return plugins.filter((plugin: any) => plugin.schema?.type === type)
  } else {
    return plugins
  }
}

export async function upload(ctx: any) {
  const plugins: FileType[] =
    ctx.request.files.file.length > 1
      ? Array.from(ctx.request.files.file)
      : [ctx.request.files.file]
  try {
    let docs = []
    // can do single or multiple plugins
    for (let plugin of plugins) {
      const doc = await processPlugin(plugin, PluginSource.FILE)
      docs.push(doc)
    }
    ctx.body = {
      message: "Plugin(s) uploaded successfully",
      plugins: docs,
    }
  } catch (err: any) {
    const errMsg = err?.message ? err?.message : err

    ctx.throw(400, `Failed to import plugin: ${errMsg}`)
  }
}

export async function create(ctx: any) {
  const { source, url, headers, githubToken } = ctx.request.body

  try {
    let metadata
    let directory
    // Generating random name as a backup and needed for url
    let name = "PLUGIN_" + Math.floor(100000 + Math.random() * 900000)

    switch (source) {
      case PluginSource.NPM:
        const { metadata: metadataNpm, directory: directoryNpm } =
          await npmUpload(url, name)
        metadata = metadataNpm
        directory = directoryNpm
        break
      case PluginSource.GITHUB:
        const { metadata: metadataGithub, directory: directoryGithub } =
          await githubUpload(url, name, githubToken)
        metadata = metadataGithub
        directory = directoryGithub
        break
      case PluginSource.URL:
        const headersObj = headers || {}
        const { metadata: metadataUrl, directory: directoryUrl } =
          await urlUpload(url, name, headersObj)
        metadata = metadataUrl
        directory = directoryUrl
        break
    }

    validate(metadata?.schema)

    // Only allow components in cloud
    if (!env.SELF_HOSTED && metadata?.schema?.type !== PluginType.COMPONENT) {
      throw new Error(
        "Only component plugins are supported outside of self-host"
      )
    }

    const doc = await storePlugin(metadata, directory, source)

    ctx.body = {
      message: "Plugin uploaded successfully",
      plugins: [doc],
    }
  } catch (err: any) {
    const errMsg = err?.message ? err?.message : err

    ctx.throw(400, `Failed to import plugin: ${errMsg}`)
  }
  ctx.status = 200
}

export async function fetch(ctx: any) {
  ctx.body = await getPlugins()
}

export async function destroy(ctx: any) {
  const db = getGlobalDB()
  const { pluginId } = ctx.params

  try {
    const plugin: Plugin = await db.get(pluginId)
    const bucketPath = `${plugin.name}/`
    await deleteFolder(ObjectStoreBuckets.PLUGINS, bucketPath)

    await db.remove(pluginId, plugin._rev)
    await events.plugin.deleted(plugin)
  } catch (err: any) {
    const errMsg = err?.message ? err?.message : err

    ctx.throw(400, `Failed to delete plugin: ${errMsg}`)
  }

  ctx.message = `Plugin ${ctx.params.pluginId} deleted.`
  ctx.status = 200
}

export async function storePlugin(
  metadata: any,
  directory: any,
  source?: PluginSource
) {
  const db = getGlobalDB()
  const version = metadata.package.version,
    name = metadata.package.name,
    description = metadata.package.description,
    hash = metadata.schema.hash

  // first open the tarball into tmp directory
  const bucketPath = `${name}/`
  const files = await uploadDirectory(
    ObjectStoreBuckets.PLUGINS,
    directory,
    bucketPath
  )
  const jsFile = files.find((file: any) => file.name.endsWith(".js"))
  if (!jsFile) {
    throw new Error(`Plugin missing .js file.`)
  }
  // validate the JS for a datasource
  if (metadata.schema.type === PluginType.DATASOURCE) {
    const js = loadJSFile(directory, jsFile.name)
    // TODO: this isn't safe - but we need full node environment
    // in future we should do this in a thread for safety
    try {
      eval(js)
    } catch (err: any) {
      const message = err?.message ? err.message : JSON.stringify(err)
      throw new Error(`JS invalid: ${message}`)
    }
  }
  const jsFileName = jsFile.name
  const pluginId = generatePluginID(name)

  // overwrite existing docs entirely if they exist
  let rev
  try {
    const existing = await db.get(pluginId)
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
    jsUrl: `${bucketPath}${jsFileName}`,
  }

  if (source) {
    doc = {
      ...doc,
      source,
    }
  }

  const response = await db.put(doc)
  await events.plugin.imported(doc)
  ClientAppSocket.emit("plugin-update", { name, hash })
  return {
    ...doc,
    _rev: response.rev,
  }
}

export async function processPlugin(plugin: FileType, source?: PluginSource) {
  const { metadata, directory } = await fileUpload(plugin)
  validate(metadata?.schema)

  // Only allow components in cloud
  if (!env.SELF_HOSTED && metadata?.schema?.type !== PluginType.COMPONENT) {
    throw new Error("Only component plugins are supported outside of self-host")
  }

  return await storePlugin(metadata, directory, source)
}
