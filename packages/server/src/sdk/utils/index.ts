import { environmentVariables } from "@budibase/pro"
import { context, db as dbCore } from "@budibase/backend-core"
import { AppEnvironment } from "@budibase/types"

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
