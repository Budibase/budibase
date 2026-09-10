import { context, HTTPError } from "@budibase/backend-core"
import type { PlatformActionEnvironment } from "@budibase/types"

export function getWorkspaceDbForEnvironment(
  environment: PlatformActionEnvironment
) {
  if (environment === "dev") {
    return context.getDevWorkspaceDB()
  }
  if (environment === "prod") {
    return context.getProdWorkspaceDB()
  }

  throw new HTTPError("Invalid environment query", 400)
}
