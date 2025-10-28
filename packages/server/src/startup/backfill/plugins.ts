import { db as dbCore, tenancy } from "@budibase/backend-core"
import { Plugin, PluginSource } from "@budibase/types"
import mappingFile from "./mapping.json"
import sdk from "../../sdk"

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
