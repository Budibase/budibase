const { resolve, join } = require("path")
const { homedir } = require("os")

async function runServer() {
  const budibaseDir = join(homedir(), ".budibase"); 
  process.env.BUDIBASE_DIR = budibaseDir 

  require("dotenv").config({ path: resolve(budibaseDir, ".env") })

  const server = await require("./app")()

  server.on("close", () => console.log("Server Closed"))
  console.log(`Budibase running on ${JSON.stringify(server.address())}`)
}

runServer()


process.on("SIGINT", function() {
  console.log("Shutting down server.." );
  process.exit(1);
});