const { resolve, join } = require("path")
const { homedir } = require("os");
const { app } = require("electron");

async function runServer() {
  const homeDir = app ? app.getPath("home") : homedir(); 

  const budibaseDir = join(homeDir, ".budibase")
  process.env.BUDIBASE_DIR = budibaseDir 

  require("dotenv").config({ path: resolve(budibaseDir, ".env") })

  const server = await require("./app")()

  server.on("close", () => console.log("Server Closed"))
  console.log(`Budibase running on ${JSON.stringify(server.address())}`)
}

runServer()
