import { db as dbCore, tenancy } from "@budibase/backend-core"
import { Plugin, PluginSource } from "@budibase/types"
import mappingFile from "./mapping.json"
import sdk from "../../sdk"

const mapping = mappingFile as Record<string, string>

export async function backfillPluginOrigins() {
  const tenantId = tenancy.getTenantId()
  await tenancy.doInTenant(tenantId, async () => {
    console.log("Backfilling plugin origins for tenant", tenantId)
    const db = tenancy.getGlobalDB()
    const response = await db.allDocs(
      dbCore.getPluginParams(null, { include_docs: true })
    )
    const plugins = response.rows.map(r => r.doc) as Plugin[]
    let updated = 0
    console.log("Backfilling plugin origins for", plugins.length, "plugins")
    for (const plugin of plugins) {
      console.log(`checking ${plugin.name} (${plugin.source})`)
      try {
        if (!plugin || plugin.source !== PluginSource.GITHUB) continue
        // explicit mapping by plugin.name only
        console.log("test? ")
        const mappedUrl = mapping[plugin.name]
        if (mappedUrl) {
          const { repo, url } = sdk.plugins.parseGithubRepo(mappedUrl)
          if (!repo || !url) {
            console.warn(
              "Mapped GitHub URL invalid for",
              plugin.name,
              mappedUrl
            )
            continue
          }
          console.log("Updating plugin origin for", plugin.name, repo, url)
          const next: Plugin = {
            ...plugin,
            origin: { source: "github" as const, repo, url },
          }
          console.log("Updating plugin origin for", plugin.name, next.origin)
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
