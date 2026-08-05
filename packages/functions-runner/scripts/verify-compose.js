#!/usr/bin/env node

const { execFileSync } = require("node:child_process")
const path = require("node:path")

const repoRoot = path.resolve(__dirname, "..", "..", "..")
const hostingPath = path.join(repoRoot, "hosting")
const environmentPath = path.join(hostingPath, ".env")
const runnerServiceName = "functions-runner-service"
const runnerNetworkName = "functions-network"
const runnerUrl = `http://${runnerServiceName}:4007`
const forbiddenEnvironmentPrefixes = [
  "API_ENCRYPTION_KEY",
  "AWS_",
  "AZURE_",
  "COUCH",
  "DOCKER_",
  "GOOGLE_",
  "INTERNAL_API_KEY",
  "JWT_SECRET",
  "MINIO_",
  "REDIS_",
]

const getComposeConfig = (files, functionsEnabled) => {
  const args = ["compose", "--env-file", environmentPath]
  for (const file of files) {
    args.push("--file", path.join(hostingPath, file))
  }
  args.push("config", "--format", "json")

  return JSON.parse(
    execFileSync("docker", args, {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        BUDIBASE_FUNCTIONS_ENABLED: functionsEnabled,
      },
    })
  )
}

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const verifyRunner = config => {
  const runner = config.services[runnerServiceName]
  assert(runner, "Functions runner service is missing")
  assert(runner.restart === "unless-stopped", "Restart policy is missing")
  assert(runner.user === "node", "Runner must use the node user")
  assert(runner.read_only === true, "Runner filesystem must be read-only")
  assert(runner.cap_drop?.includes("ALL"), "Runner must drop all capabilities")
  assert(
    runner.security_opt?.includes("no-new-privileges:true"),
    "Runner must prevent privilege escalation"
  )
  assert(runner.pids_limit > 0, "Runner must have a PID limit")
  assert(runner.mem_limit > 0, "Runner must have a memory limit")
  assert(runner.cpus > 0, "Runner must have a CPU limit")
  assert(runner.healthcheck, "Runner must have a health check")
  assert(runner.stop_grace_period, "Runner must have a graceful stop period")
  assert(
    runner.tmpfs?.some(mount => mount.startsWith("/tmp:")),
    "Runner must use a tmpfs for /tmp"
  )
  assert(!runner.ports, "Runner must not publish ports")
  assert(!runner.volumes, "Runner must not mount volumes")
  assert(
    runner.environment.FUNCTIONS_BROKER_URL === "http://app-service:4002",
    "Runner does not use the internal Function broker URL"
  )
  assert(
    Object.keys(runner.networks || {}).length === 1 &&
      runnerNetworkName in runner.networks,
    "Runner must only use the internal Functions network"
  )

  const credential = Object.keys(runner.environment || {}).find(name =>
    forbiddenEnvironmentPrefixes.some(prefix => name.startsWith(prefix))
  )
  assert(!credential, `Runner must not receive credential ${credential}`)

  const network = config.networks[runnerNetworkName]
  assert(network?.internal === true, "Functions network must be internal")
}

const verifyBudibaseService = (config, serviceName, functionsEnabled) => {
  const service = config.services[serviceName]
  assert(service, `${serviceName} is missing`)
  assert(
    service.environment.BUDIBASE_FUNCTIONS_ENABLED === functionsEnabled,
    `${serviceName} does not use the Functions feature gate`
  )
  assert(
    service.environment.FUNCTIONS_RUNNER_URL === runnerUrl,
    `${serviceName} does not use the internal runner URL`
  )
  assert(
    runnerNetworkName in service.networks,
    `${serviceName} cannot reach the Functions runner`
  )
}

const verifyConfig = (files, functionsEnabled) => {
  const config = getComposeConfig(files, functionsEnabled)
  verifyRunner(config)
  verifyBudibaseService(config, "app-service", functionsEnabled)
  verifyBudibaseService(config, "worker-service", functionsEnabled)
}

verifyConfig(["docker-compose.yaml"], "")
verifyConfig(["docker-compose.yaml"], "true")
verifyConfig(["docker-compose.build.yaml", "docker-compose.dev.yaml"], "")
verifyConfig(["docker-compose.build.yaml", "docker-compose.dev.yaml"], "true")

console.log("Verified hardened Functions runner Compose services")
