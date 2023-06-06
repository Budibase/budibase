import { npmUpload, urlUpload, githubUpload } from "./uploaders"
import { plugins as pluginCore } from "@budibase/backend-core"
import { PluginType, FileType, PluginSource } from "@budibase/types"
import env from "../../../environment"
import { clientAppSocket } from "../../../websockets"
import sdk from "../../../sdk"
import { sdk as pro } from "@budibase/pro"

export async function upload(ctx: any) {
  const plugins: FileType[] =
    ctx.request.files.file.length > 1
      ? Array.from(ctx.request.files.file)
      : [ctx.request.files.file]
  try {
    let docs = []
    // can do single or multiple plugins
    for (let plugin of plugins) {
      const doc = await sdk.plugins.processUploaded(plugin, PluginSource.FILE)
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

    pluginCore.validate(metadata?.schema)

    // Only allow components in cloud
    if (!env.SELF_HOSTED && metadata?.schema?.type !== PluginType.COMPONENT) {
      throw new Error(
        "Only component plugins are supported outside of self-host"
      )
    }

    const doc = await pro.plugins.storePlugin(metadata, directory, source)

    clientAppSocket?.emit("plugins-update", { name, hash: doc.hash })
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
  ctx.body = await sdk.plugins.fetch()
}

export async function destroy(ctx: any) {
  const { pluginId } = ctx.params

  try {
    await pro.plugins.deletePlugin(pluginId)

    ctx.body = { message: `Plugin ${ctx.params.pluginId} deleted.` }
  } catch (err: any) {
    ctx.throw(400, err.message)
  }
}
