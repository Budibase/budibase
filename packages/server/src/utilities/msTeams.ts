import { HTTPError } from "@budibase/backend-core"

// Commercial Teams service URL — region-specific installs can override via TEAMS_API_URL
const COMMERCIAL_MSTEAMS_SERVICE_URL = "https://smba.trafficmanager.net/apis/"

export const resolveDefaultMSTeamsServiceUrl = (
  configuredServiceUrl = process.env.TEAMS_API_URL
): string => {
  if (!configuredServiceUrl) {
    return COMMERCIAL_MSTEAMS_SERVICE_URL
  }

  try {
    const parsed = new URL(configuredServiceUrl)
    if (
      parsed.protocol !== "https:" ||
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash
    ) {
      return COMMERCIAL_MSTEAMS_SERVICE_URL
    }
    return parsed.toString()
  } catch {
    return COMMERCIAL_MSTEAMS_SERVICE_URL
  }
}

export const DEFAULT_MSTEAMS_SERVICE_URL = resolveDefaultMSTeamsServiceUrl()

const configuredServiceOrigin = new URL(DEFAULT_MSTEAMS_SERVICE_URL).origin

export const validateMSTeamsServiceUrl = (serviceUrl: string): string => {
  let parsed: URL
  try {
    parsed = new URL(serviceUrl)
  } catch {
    throw new HTTPError("Invalid Microsoft Teams service URL", 400)
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.origin !== configuredServiceOrigin ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new HTTPError("Invalid Microsoft Teams service URL", 400)
  }

  return parsed.toString()
}
