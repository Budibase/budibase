#!/usr/bin/env node

const { execFile } = require("node:child_process")
const { promisify } = require("node:util")

const execFileAsync = promisify(execFile)
const image =
  process.argv[2] ||
  process.env.FUNCTIONS_RUNNER_IMAGE ||
  "budibase/functions-runner:local"
const containerName = `budibase-functions-runner-verify-${process.pid}`
const forbiddenEnvironmentPrefixes = [
  "API_ENCRYPTION_KEY",
  "COUCH_DB",
  "ENCRYPTION_KEY",
  "INTERNAL_API_KEY",
  "JWT_SECRET",
  "MINIO",
  "REDIS",
]

const docker = async (...args) => {
  const { stdout } = await execFileAsync("docker", args, {
    maxBuffer: 10 * 1024 * 1024,
  })
  return stdout.trim()
}

const delay = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds))

const getRunnerUrl = async () => {
  const port = await docker("port", containerName, "4007/tcp")
  const hostPort = port.split(":").at(-1)
  if (!hostPort) {
    throw new Error("Unable to resolve the Functions runner port")
  }
  return `http://127.0.0.1:${hostPort}`
}

const waitForHealth = async runnerUrl => {
  let lastError
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(`${runnerUrl}/health`)
      if (response.ok && (await response.json()).healthy === true) {
        return
      }
      lastError = new Error(`Health endpoint returned ${response.status}`)
    } catch (error) {
      lastError = error
    }
    await delay(500)
  }
  const containerLogs = await docker("logs", containerName).catch(
    () => "No container logs available"
  )
  throw new Error(
    `Functions runner health check did not become ready at ${runnerUrl}: ${lastError?.message}\n${containerLogs}`
  )
}

const verifyImageConfiguration = async () => {
  const [inspection] = JSON.parse(await docker("inspect", containerName))
  if (inspection.Config.User !== "node") {
    throw new Error("Functions runner image must run as the node user")
  }
  if (
    JSON.stringify(inspection.Config.Entrypoint) !==
    JSON.stringify(["node", "dist/start.js"])
  ) {
    throw new Error("Functions runner image has an unexpected entrypoint")
  }

  const environmentNames = inspection.Config.Env.map(
    value => value.split("=")[0]
  )
  const credential = environmentNames.find(name =>
    forbiddenEnvironmentPrefixes.some(prefix => name.startsWith(prefix))
  )
  if (credential) {
    throw new Error(
      `Functions runner image contains application credential ${credential}`
    )
  }

  const files = (
    await docker(
      "exec",
      containerName,
      "find",
      "/app",
      "-mindepth",
      "1",
      "-maxdepth",
      "1",
      "-printf",
      "%f\\n"
    )
  )
    .split("\n")
    .sort()
  if (JSON.stringify(files) !== JSON.stringify(["dist", "node_modules"])) {
    throw new Error(`Functions runner image has unexpected files: ${files}`)
  }
}

const verifyProtocolFixture = async runnerUrl => {
  const response = await fetch(`${runnerUrl}/runs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      runId: `container-fixture-${Date.now()}`,
      artifact: {
        compiledJavaScript: `
          export default async function run() {
            return { output: { message: globalThis.__budibaseInputs.message } }
          }
        `,
        sourceHash: "container-fixture-source",
        declarationsHash: "container-fixture-declarations",
        compiledAt: "2026-01-01T00:00:00.000Z",
      },
      inputs: { message: "hello from the container" },
      grantToken: "container-fixture-grant",
      limits: {
        maxInputBytes: 262144,
        maxInputDepth: 20,
        isolateMemoryLimitMb: 64,
        timeoutMs: 30000,
        maxQueryCalls: 10,
        maxConcurrentQueryCalls: 2,
        maxQueryResponseBytes: 1048576,
        maxQueryResponseDepth: 30,
        maxOutputBytes: 1048576,
        maxOutputDepth: 30,
        maxLogEntries: 100,
        maxLogBytes: 65536,
        maxLogEntryBytes: 4096,
      },
    }),
  })
  const result = await response.json()
  if (
    !response.ok ||
    result.status !== "success" ||
    result.output?.message !== "hello from the container"
  ) {
    throw new Error(
      `Functions runner protocol fixture failed: ${JSON.stringify(result)}`
    )
  }
}

const cleanup = () =>
  docker("rm", "--force", containerName).catch(() => undefined)

const main = async () => {
  const handleSignal = exitCode => {
    cleanup().finally(() => process.exit(exitCode))
  }
  process.once("SIGINT", () => handleSignal(130))
  process.once("SIGTERM", () => handleSignal(143))

  try {
    await docker(
      "run",
      "--detach",
      "--rm",
      "--init",
      "--read-only",
      "--tmpfs",
      "/tmp:rw,noexec,nosuid,size=16777216",
      "--cap-drop",
      "ALL",
      "--security-opt",
      "no-new-privileges:true",
      "--name",
      containerName,
      "--publish",
      "127.0.0.1::4007",
      image
    )
    let runnerUrl = await getRunnerUrl()
    await waitForHealth(runnerUrl)
    await verifyImageConfiguration()
    await verifyProtocolFixture(runnerUrl)

    await docker("restart", "--time", "5", containerName)
    runnerUrl = await getRunnerUrl()
    await waitForHealth(runnerUrl)

    console.log(`Verified Functions runner image ${image}`)
  } finally {
    await cleanup()
  }
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
