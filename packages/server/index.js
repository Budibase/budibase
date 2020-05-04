require("dotenv").config()
const app = require("./app")

async function startServer() {
  const server = await app()
  server.on("listening", () => {
    console.log(`Budibase Server listening on port ${process.env.PORT}`)
  })
}

startServer();