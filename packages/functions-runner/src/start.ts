import { getEnvironment } from "./environment"
import { createServer } from "./server"
import { FunctionSupervisor } from "./supervisor"

const environment = getEnvironment()
const supervisor = new FunctionSupervisor({
  terminationGraceMs: environment.terminationGraceMs,
})
const server = createServer(supervisor)
let shuttingDown = false

server.listen(environment.port, environment.host, () => {
  console.log(
    `Functions runner listening on ${environment.host}:${environment.port}`
  )
})

const shutdown = (signal: string) => {
  if (shuttingDown) {
    return
  }
  shuttingDown = true
  console.log(`Functions runner shutting down. Signal: ${signal}`)
  const serverClosed = new Promise<void>(resolve =>
    server.close(() => resolve())
  )
  Promise.all([serverClosed, supervisor.shutdown()]).then(() => process.exit(0))
}

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))
