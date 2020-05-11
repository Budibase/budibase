const { join } = require("path")
const { homedir } = require("os")

const path = join(homedir(), ".budibase", ".env")
require("dotenv").config({ path })
const server = require("./app")

server.on("listening", () => {
  console.log(`Budibase Server listening on port ${process.env.PORT}`)
})
