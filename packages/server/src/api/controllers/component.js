const CouchDB = require("../../db")
const { homedir } = require("os")
const { resolve, join } = require("path")

const isDev = process.env.NODE_ENV !== "production"

exports.fetchAppComponentDefinitions = async function(ctx) {
  const db = new CouchDB(`client-${ctx.params.clientId}`)
  const app = await db.get(ctx.params.appId)

  const componentDefinitions = app.componentLibraries.reduce(
    (acc, componentLibrary) => {
      let appDirectory = resolve(
        homedir(),
        ".budibase",
        ctx.params.appId,
        "node_modules"
      )

      if (isDev) {
        appDirectory = "/tmp/.budibase"
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
