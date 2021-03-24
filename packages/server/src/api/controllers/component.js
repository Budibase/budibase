const CouchDB = require("../../db")
const { join } = require("../../utilities/centralPath")
const { budibaseTempDir } = require("../../utilities/budibaseDir")
const fileSystem = require("../../utilities/fileSystem")
const env = require("../../environment")

exports.fetchAppComponentDefinitions = async function(ctx) {
  const appId = ctx.params.appId || ctx.appId
  const db = new CouchDB(appId)
  const app = await db.get(appId)

  let componentManifests = await Promise.all(
    app.componentLibraries.map(async library => {
      let manifest
      if (env.isDev()) {
        manifest = require(join(budibaseTempDir(), library, "manifest.json"))
      } else {
        manifest = await fileSystem.getComponentLibraryManifest(appId, library)
      }
      return {
        manifest,
        library,
      }
    })
  )
  const definitions = {}
  for (let { manifest, library } of componentManifests) {
    for (let key of Object.keys(manifest)) {
      const fullComponentName = `${library}/${key}`.toLowerCase()
      definitions[fullComponentName] = {
        component: fullComponentName,
        ...manifest[key],
      }
    }
  }
  ctx.body = definitions
}
