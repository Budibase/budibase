import execa from "execa"
import env from "../environment"

const TRIGGER_DEPLOY_TIMEOUT_MS = 120_000

let inFlightDeploy: Promise<void> | undefined

function shouldDeployTriggerTasks() {
  if (env.isTest()) {
    return false
  }
  return !!process.env.TRIGGER_SECRET_KEY
}

function deployEnvironment() {
  return {
    ...process.env,
    // Trigger CLI expects an access token for non-interactive deploys.
    TRIGGER_ACCESS_TOKEN:
      process.env.TRIGGER_ACCESS_TOKEN || process.env.TRIGGER_SECRET_KEY,
  }
}

function getOutputPreview(output: string | undefined) {
  if (!output) {
    return ""
  }
  const maxLength = 1000
  if (output.length <= maxLength) {
    return output
  }
  return output.slice(output.length - maxLength)
}

async function runDeploy() {
  const result = await execa("yarn", ["trigger:deploy"], {
    cwd: env.TOP_LEVEL_PATH,
    env: deployEnvironment(),
    timeout: TRIGGER_DEPLOY_TIMEOUT_MS,
    all: true,
  })

  console.log("Trigger tasks deployed from workspace publish", {
    output: getOutputPreview(result.all),
  })
}

export async function deployTriggerTasksOnPublish() {
  if (!shouldDeployTriggerTasks()) {
    return
  }

  if (!inFlightDeploy) {
    inFlightDeploy = runDeploy().finally(() => {
      inFlightDeploy = undefined
    })
  }

  return inFlightDeploy
}
