import { npmUpload, urlUpload, githubUpload, fileUpload } from "./uploaders"
import { getGlobalDB } from "@budibase/backend-core/tenancy"
import { validate } from "@budibase/backend-core/plugins"
import { PluginType, FileType, PluginSource } from "@budibase/types"
import env from "../../../environment"
import { ClientAppSocket } from "../../../websocket"
import { db as dbCore } from "@budibase/backend-core"
import { plugins } from "@budibase/pro"

export async function getPlugins(type?: PluginType) {
  const db = getGlobalDB()
  const response = await db.allDocs(
    dbCore.getPluginParams(null, {
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
      const doc = await processUploadedPlugin(plugin, PluginSource.FILE)
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

    const doc = await plugins.storePlugin(metadata, directory, source)

    ClientAppSocket.emit("plugins-update", { name, hash: doc.hash })
    ctx.body = {
      message: "Plugin uploaded successfully",
      plugins: [doc],
    }
    ctx.body = { plugin: doc }
  } catch (err: any) {
    const errMsg = err?.message ? err?.message : err

    ctx.throw(400, `Failed to import plugin: ${errMsg}`)
  }
}

export async function fetch(ctx: any) {
  ctx.body = await getPlugins()
}

export async function destroy(ctx: any) {
  const { pluginId } = ctx.params

  try {
    await plugins.deletePlugin(pluginId)

    ctx.body = { message: `Plugin ${ctx.params.pluginId} deleted.` }
  } catch (err: any) {
    ctx.throw(400, err.message)
  }
}

export async function processUploadedPlugin(
  plugin: FileType,
  source?: PluginSource
) {
  const { metadata, directory } = await fileUpload(plugin)
  validate(metadata?.schema)

  // Only allow components in cloud
  if (!env.SELF_HOSTED && metadata?.schema?.type !== PluginType.COMPONENT) {
    throw new Error("Only component plugins are supported outside of self-host")
  }

  const doc = await plugins.storePlugin(metadata, directory, source)
  ClientAppSocket.emit("plugin-update", { name: doc.name, hash: doc.hash })
  return doc
}
