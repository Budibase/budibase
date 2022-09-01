import { ObjectStoreBuckets } from "../../constants"
import {
  extractPluginTarball,
  createNpmPlugin,
  createUrlPlugin,
  createGithubPlugin,
} from "../../utilities/fileSystem"
import { getGlobalDB } from "@budibase/backend-core/tenancy"
import { generatePluginID, getPluginParams } from "../../db/utils"
import { uploadDirectory } from "@budibase/backend-core/objectStore"
import { PluginType, FileType } from "@budibase/types"

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
  const { source } = ctx.params
  const plugins: FileType[] =
    ctx.request.files.file.length > 1
      ? Array.from(ctx.request.files.file)
      : [ctx.request.files.file]
  try {
    let docs = []
    // can do single or multiple plugins
    for (let plugin of plugins) {
      const doc = await processPlugin(plugin, source)
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
  const { type, source, name, url, headers, githubToken } = ctx.request.body
  let metadata
  let directory

  switch (source) {
    case "npm":
      const { metadata: metadataNpm, directory: directoryNpm } =
        await createNpmPlugin(url, name)
      metadata = metadataNpm
      directory = directoryNpm
      break
    case "github":
      const { metadata: metadataGithub, directory: directoryGithub } =
        await createGithubPlugin(ctx, url, name, githubToken)
      metadata = metadataGithub
      directory = directoryGithub
      break
    case "url":
      const { metadata: metadataUrl, directory: directoryUrl } =
        await createUrlPlugin(url, name, headers)
      metadata = metadataUrl
      directory = directoryUrl
      break
  }

  try {
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
  await db.remove(ctx.params.pluginId, ctx.params.pluginRev)
  ctx.message = `Plugin ${ctx.params.pluginId} deleted.`
  ctx.status = 200
}

export async function storePlugin(
  metadata: any,
  directory: any,
  source?: string
) {
  const db = getGlobalDB()
  const version = metadata.package.version,
    name = metadata.package.name,
    description = metadata.package.description

  // first open the tarball into tmp directory
  const bucketPath = `${name}/${version}/`
  const files = await uploadDirectory(
    ObjectStoreBuckets.PLUGINS,
    directory,
    bucketPath
  )
  const jsFile = files.find((file: any) => file.name.endsWith(".js"))
  if (!jsFile) {
    throw new Error(`Plugin missing .js file.`)
  }
  const jsFileName = jsFile.name
  const pluginId = generatePluginID(name, version)

  // overwrite existing docs entirely if they exist
  let rev
  try {
    const existing = await db.get(pluginId)
    rev = existing._rev
  } catch (err) {
    rev = undefined
  }
  const doc = {
    _id: pluginId,
    _rev: rev,
    source,
    name,
    version,
    description,
    ...metadata,
    jsUrl: `${bucketPath}${jsFileName}`,
  }
  const response = await db.put(doc)
  return {
    ...doc,
    _rev: response.rev,
  }
}

export async function processPlugin(plugin: FileType, source?: string) {
  const { metadata, directory } = await extractPluginTarball(plugin)
  return await storePlugin(metadata, directory, source)
}
