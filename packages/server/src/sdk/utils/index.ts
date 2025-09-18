import { context, db as dbCore } from "@budibase/backend-core"
import { environmentVariables } from "@budibase/pro"
import { processString } from "@budibase/string-templates"
import { Environment } from "@budibase/types"

export async function getEnvironmentVariables() {
  let envVars = context.getEnvironmentVariables()
  if (!envVars) {
    const appId = context.getWorkspaceId()
    const workspaceEnv = dbCore.isDevWorkspaceID(appId)
      ? Environment.DEVELOPMENT
      : Environment.PRODUCTION

    envVars = await environmentVariables.fetchValues(workspaceEnv)
  }
  return envVars
}

function isEnvironmentVariableKey(str: string) {
  return str.match(/{{\s*env\.[^\s]+\s*}}/)
}

export async function processEnvironmentVariable<
  T extends string | Record<string, string> | undefined,
>(value: T): Promise<T> {
  let envVariables: Record<string, string>
  const getEnvVariables = async () => {
    if (!envVariables) {
      envVariables = await getEnvironmentVariables()
    }
    return envVariables
  }

  if (!value) {
    return value
  }
  if (typeof value !== "string") {
    for (const key of Object.keys(value).filter(k => value[k])) {
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
