import { HTTPError } from "@budibase/backend-core"

// Commercial Teams service URL — region-specific installs can override via TEAMS_API_URL
export const DEFAULT_MSTEAMS_SERVICE_URL =
  process.env.TEAMS_API_URL ?? "https://smba.trafficmanager.net/apis/"

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
    parsed.password
  ) {
    throw new HTTPError("Invalid Microsoft Teams service URL", 400)
  }

  return parsed.toString()
}
