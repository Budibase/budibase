const Koa = require("koa")
const logger = require("koa-logger")
const api = require("./api")
const koaBody = require("koa-body")
const env = require("./environment")
const http = require("http")

const app = new Koa()

// set up top level koa middleware
app.use(koaBody({ multipart: true }))

if (env.LOGGER !== "off") app.use(logger())

// api routes
app.use(api.routes())

module.exports = async port => {
  const server = http.createServer(app.callback())
  return new Promise((resolve, reject) => {
    server.on("error", e => {
      if (e.code === "EADDRINUSE") {
        reject(e)
      }
    })
    server.listen({ port }, () => {
      resolve(server)
    })
  })
}