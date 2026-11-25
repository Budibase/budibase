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
import mappingFile from "./mapping.json"
import sdk from "../../sdk"
import { deleteFolderFileSystem } from "../../utilities/fileSystem"
export { normaliseGithubUrl, parseGithubRepo } from "./githubUrl"

export async function fetch(type?: PluginType): Promise<Plugin[]> {
  const db = tenancy.getGlobalDB()
  const response = await db.allDocs(
    dbCore.getPluginParams(null, {
      include_docs: true,
    })
  )
  let plugins = response.rows.map((row: any) => row.doc) as Plugin[]
  plugins = await objectStore.enrichPluginURLs(plugins)
  if (type) {
    return plugins.filter((plugin: Plugin) => plugin.schema?.type === type)
  } else {
    return plugins
  }
}

const mapping = mappingFile as Record<string, string>

export async function backfillPluginOrigins() {
  const tenantId = tenancy.getTenantId()
  await tenancy.doInTenant(tenantId, async () => {
    const db = tenancy.getGlobalDB()
    const response = await db.allDocs(
      dbCore.getPluginParams(null, { include_docs: true })
    )

    const plugins = response.rows.map(r => r.doc) as Plugin[]
    let updated = 0

    for (const plugin of plugins) {
      try {
        if (!plugin || plugin.source !== PluginSource.GITHUB) continue
        if (plugin.origin?.url && plugin.origin?.repo) continue

        const mappedUrl = mapping[plugin.name]
        if (mappedUrl) {
          const { repo, url } = sdk.plugins.parseGithubRepo(mappedUrl)
          if (!repo || !url) {
            continue
          }
          const next: Plugin = {
            ...plugin,
            origin: { source: "github" as const, repo, url },
          }
          const putResp = await db.put(next)
          plugin._rev = putResp.rev
          updated++
        }
      } catch (err) {
        console.log(
          "Plugin origin backfill failed for",
          plugin?.name,
          err instanceof Error ? err.message : String(err)
        )
      }
    }
    if (updated > 0) {
      console.log(`Backfilled GitHub origin for ${updated} plugin(s).`)
    }
  })
}

export async function processUploaded(plugin: KoaFile, source: PluginSource) {
  const { metadata, directory, cleanupDirectory } = await fileUpload(plugin)
  try {
    pluginCore.validate(metadata.schema)

    // Only allow components in cloud
    if (!env.SELF_HOSTED && metadata.schema?.type !== PluginType.COMPONENT) {
      throw new Error(
        "Only component plugins are supported outside of self-host"
      )
    }

    // Only allow Svelte 5 plugins on this branch
    if (
      metadata.schema?.metadata?.svelteMajor !== 5 &&
      metadata.schema?.type === PluginType.COMPONENT
    ) {
      throw new Error("Only Svelte 5 plugins are supported on this branch")
    }

    const doc = await pro.plugins.storePlugin(metadata, directory, source)
    clientAppSocket?.emit("plugin-update", { name: doc.name, hash: doc.hash })
    return doc
  } finally {
    deleteFolderFileSystem(cleanupDirectory)
  }
}

export * from "./usedPlugins"
