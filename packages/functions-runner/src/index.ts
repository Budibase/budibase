import { loadConfig } from "./config"
import { createServer } from "./supervisor"

const config = loadConfig()
const server = createServer(config)

server.listen(config.port, config.host, () => {
  console.log(
    `functions-runner listening on http://${config.host}:${config.port} ` +
      `(default timeout ${config.defaultTimeoutMs}ms, memory ${config.defaultMemoryMb}MB)`
  )
})

const shutdown = (signal: string) => {
  console.log(`functions-runner received ${signal}, shutting down`)
  server.close(err => {
    if (err) {
      console.error("error during shutdown", err)
      process.exit(1)
    }
    process.exit(0)
  })
  // Failsafe: force exit if connections do not drain in time.
  setTimeout(() => process.exit(0), 10000).unref()
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", () => shutdown("SIGINT"))
