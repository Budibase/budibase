import { DocumentType } from "../../db/utils"
import {
  App,
  FetchComponentDefinitionResponse,
  Plugin,
  UserCtx,
} from "@budibase/types"
import { db as dbCore, context, tenancy } from "@budibase/backend-core"
import { getComponentLibraryManifest } from "../../utilities/fileSystem"

export async function fetchAppComponentDefinitions(
  ctx: UserCtx<void, FetchComponentDefinitionResponse>
) {
  try {
    const db = context.getAppDB()
    const app = await db.get<App>(DocumentType.APP_METADATA)

    let componentManifests = await Promise.all(
      app.componentLibraries.map(async (library: any) => {
        let manifest = await getComponentLibraryManifest(library)
        return {
          manifest,
          library,
        }
      })
    )
    const definitions: { [key: string]: any } = {}
    for (let { manifest, library } of componentManifests) {
      for (let key of Object.keys(manifest)) {
        // These keys are not components, and should not be preprended with the `@budibase/` prefix
        if (key === "features" || key === "typeSupportPresets") {
          definitions[key] = manifest[key]
        } else {
          const fullComponentName = `${library}/${key}`.toLowerCase()
          definitions[fullComponentName] = {
            component: fullComponentName,
            ...manifest[key],
          }
        }
      }
    }

    // Add custom components
    const globalDB = tenancy.getGlobalDB()
    const response = await globalDB.allDocs(
      dbCore.getPluginParams(null, {
        include_docs: true,
      })
    )
    response.rows
      .map((row: any) => row.doc)
      .filter((plugin: Plugin) => plugin.schema.type === "component")
      .forEach((plugin: Plugin) => {
        const fullComponentName = `plugin/${plugin.name}`
        definitions[fullComponentName] = {
          component: fullComponentName,
          ...plugin.schema.schema,
        }
      })

    ctx.body = definitions
  } catch (err) {
    console.error(`component-definitions=failed`, err)
  }
}
