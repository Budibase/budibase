const { DocumentType } = require("../../db/utils")
const { getComponentLibraryManifest } = require("../../utilities/fileSystem")
const { getAppDB } = require("@budibase/backend-core/context")

exports.fetchAppComponentDefinitions = async function (ctx) {
  const db = getAppDB()
  const app = await db.get(DocumentType.APP_METADATA)

  let componentManifests = await Promise.all(
    app.componentLibraries.map(async library => {
      let manifest = await getComponentLibraryManifest(library)

      return {
        manifest,
        library,
      }
    })
  )
  const definitions = {}
  for (let { manifest, library } of componentManifests) {
    for (let key of Object.keys(manifest)) {
      if (key === "features") {
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
  ctx.body = definitions
}
