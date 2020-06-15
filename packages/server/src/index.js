const { resolve } = require("path")

async function runServer() {
  const budibaseDir = "~/.budibase"

  process.env.BUDIBASE_DIR = resolve(budibaseDir)

  const server = await require("./app")()
  server.on("close", () => console.log("Server Closed"))
  console.log(`Budibase running on ${JSON.stringify(server.address())}`)
}

runServer()
