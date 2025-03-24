import { environmentVariables } from "@budibase/pro"
import { context, db as dbCore } from "@budibase/backend-core"
import { AppEnvironment } from "@budibase/types"
import { processString } from "@budibase/string-templates"

export async function getEnvironmentVariables() {
  let envVars = context.getEnvironmentVariables()
  if (!envVars) {
    const appId = context.getAppId()
    const appEnv = dbCore.isDevAppID(appId)
      ? AppEnvironment.DEVELOPMENT
      : AppEnvironment.PRODUCTION

    envVars = await environmentVariables.fetchValues(appEnv)
  }
  return envVars
}

function isEnvironmentVariableKey(str: string) {
  return str.match(/{{\s*env\.[^\s]+\s*}}/)
}

export async function processEnvironmentVariable<
  T extends string | Record<string, string>
>(value: T): Promise<T> {
  let envVariables: Record<string, string>
  const getEnvVariables = async () => {
    if (!envVariables) {
      envVariables = await getEnvironmentVariables()
    }
    return envVariables
  }

  if (typeof value !== "string") {
    for (const key of Object.keys(value)) {
      value[key] = await _processEnvironmentVariable(
        value[key],
        getEnvVariables
      )
    }
    return value
  }

  const result = await _processEnvironmentVariable(value, getEnvVariables)
  return result as T
}

async function _processEnvironmentVariable(
  str: string,
  envVariables: () => Promise<Record<string, string>>
) {
  if (!isEnvironmentVariableKey(str)) {
    return str
  }

  const result = await processString(str, {
    env: await envVariables(),
  })
  return result
}
