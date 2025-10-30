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

export function normaliseGithubUrl(url: string): string | undefined {
  try {
    let gh = url.trim()
    if (!gh) return

    // Ensure it starts with https://
    if (!gh.startsWith("http")) {
      gh = `https://${gh}`
    }
    if (gh.endsWith("/")) {
      gh = gh.slice(0, -1)
    }
    return gh
  } catch (err) {
    console.log(
      "Failed to normalise GitHub URL:",
      url,
      err instanceof Error ? err.message : String(err)
    )
    return
  }
}

export function parseGithubRepo(url?: string): { repo?: string; url?: string } {
  if (!url) return {}
  try {
    const gh = normaliseGithubUrl(url)
    if (!gh || !gh.includes("https://github.com/")) {
      return {}
    }
    const parts = gh.replace("https://github.com/", "").split("/")
    if (parts.length >= 2) {
      const owner = parts[0]
      const repo = parts[1]
      return {
        repo: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
      }
    }
  } catch (err) {
    console.log(
      "Failed to parse GitHub repo:",
      url,
      err instanceof Error ? err.message : String(err)
    )
  }
  return {}
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
  const { metadata, directory } = await fileUpload(plugin)
  pluginCore.validate(metadata.schema)

  // Only allow components in cloud
  if (!env.SELF_HOSTED && metadata.schema?.type !== PluginType.COMPONENT) {
    throw new Error("Only component plugins are supported outside of self-host")
  }

  // Block Svelte 5 plugins until we release Svelte 5
  if (metadata.schema?.metadata?.svelteMajor === 5) {
    throw new Error("Svelte 5 plugins are not yet supported in Budibase")
  }

  const doc = await pro.plugins.storePlugin(metadata, directory, source)
  clientAppSocket?.emit("plugin-update", { name: doc.name, hash: doc.hash })
  return doc
}
