const app = require("./app")
const buildAppContext = require("./initialise/buildAppContext")
const process = require("process")

let configIsNext = false
let configPath = "./config"
for (let arg of process.argv) {
  if (arg === "-c") {
    configIsNext = true
  }
  if (configIsNext) {
    configPath = arg
  }
}

const config = require(configPath)

;(async () => {
  const bbContext = await buildAppContext(config(), true)
  const server = await app(bbContext)
  server.on("listening", () => {
    console.log(`Budibase Server listening on port ${bbContext.config.port}`)
  })
})()
