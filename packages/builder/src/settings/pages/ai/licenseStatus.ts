import { writable, get } from "svelte/store"
import { admin, licensing } from "@/stores/portal"
import { API } from "@/api"

export type LicenseStatus = "checking" | "has_key" | "missing_key"

export const aiLicenseStatus = writable<LicenseStatus>("checking")

const resolveStatus = async (): Promise<LicenseStatus> => {
  if (get(admin).cloud) {
    return "has_key"
  }

  const license = get(licensing).license
  const isOfflineLicense = !!(license && "identifier" in license)
  if (isOfflineLicense) {
    return "has_key"
  }

  const licenseKeyResponse = await API.getLicenseKey()
  return licenseKeyResponse?.licenseKey ? "has_key" : "missing_key"
}

export const ensureAILicenseStatus = async () => {
  try {
    aiLicenseStatus.set(await resolveStatus())
  } catch {
    aiLicenseStatus.set("missing_key")
  }
}
