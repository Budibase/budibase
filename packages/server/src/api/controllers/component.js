const CouchDB = require("../../db")
const { resolve, join } = require("path")
const {
  budibaseTempDir,
  budibaseAppsDir,
} = require("../../utilities/budibaseDir")

exports.fetchAppComponentDefinitions = async function(ctx) {
  const db = new CouchDB(`client-${ctx.params.clientId}`)
  const app = await db.get(ctx.params.appId)

  const componentDefinitions = app.componentLibraries.reduce(
    (acc, componentLibrary) => {
      let appDirectory = resolve(
        budibaseAppsDir(),
        ctx.params.appId,
        "node_modules"
      )

      if (ctx.isDev) {
        appDirectory = budibaseTempDir()
      }

      const componentJson = require(join(
        appDirectory,
        componentLibrary,
        "components.json"
      ))

      const result = {}

      // map over the components.json and add the library identifier as a key
      // button -> @budibase/standard-components/button
      for (key in componentJson) {
        const fullComponentName = `${componentLibrary}/${key}`
        result[fullComponentName] = {
          _component: fullComponentName,
          ...componentJson[key],
        }
      }

      return {
        ...acc,
        ...result,
      }
    },
    {}
  )

  ctx.body = componentDefinitions
}
