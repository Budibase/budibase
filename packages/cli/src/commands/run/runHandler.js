const { getAppContext } = require("../../common")
const app = require("@budibase/server/app")

module.exports = ({ config }) => {
  getAppContext({ configName: config, masterIsCreated: true }).then(context => {
    app(context)
    console.log(`Budibase Builder running on port ${context.config.port}..`)
  })
}
