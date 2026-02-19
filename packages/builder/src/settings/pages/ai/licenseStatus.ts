import { writable, get } from "svelte/store"
import { licensing } from "@/stores/portal"
import { API } from "@/api"

export type LicenseStatus = "checking" | "has_key" | "missing_key"

export const aiLicenseStatus = writable<LicenseStatus>("checking")

let loaded = false
let inFlight: Promise<void> | null = null

const resolveStatus = async (): Promise<LicenseStatus> => {
  const license = get(licensing).license
  const isOfflineLicense = !!(license && "identifier" in license)
  if (isOfflineLicense) {
    return "has_key"
  }

  const licenseKeyResponse = await API.getLicenseKey()
  return licenseKeyResponse?.licenseKey ? "has_key" : "missing_key"
}

export const ensureAILicenseStatus = async () => {
  if (loaded) {
    return
  }

  if (inFlight) {
    await inFlight
    return
  }

  inFlight = (async () => {
    try {
      aiLicenseStatus.set(await resolveStatus())
    } catch {
      aiLicenseStatus.set("missing_key")
    } finally {
      loaded = true
      inFlight = null
    }
  })()

  await inFlight
}
