require("dotenv").config()
const server = require("./app")

server.on("listening", () => {
  console.log(`Budibase Server listening on port ${process.env.PORT}`)
});