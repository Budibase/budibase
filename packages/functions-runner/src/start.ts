import { getEnvironment } from "./environment"
import { createServer } from "./server"

const environment = getEnvironment()
const server = createServer()

server.listen(environment.port, environment.host, () => {
  console.log(
    `Functions runner listening on ${environment.host}:${environment.port}`
  )
})

const shutdown = (signal: string) => {
  console.log(`Functions runner shutting down. Signal: ${signal}`)
  server.close(() => process.exit(0))
}

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))
