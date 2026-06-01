import { writable, get } from "svelte/store"
import { admin, licensing } from "@/stores/portal"
import { API } from "@/api"
import { Feature, type License } from "@budibase/types"

export type LicenseStatus = "checking" | "has_key" | "missing_key"

export const aiLicenseStatus = writable<LicenseStatus>("checking")

export const hasManagedBBAIDevLicense = (
  isCloud: boolean,
  isDev: boolean,
  license?: License
) => {
  return (
    !isCloud &&
    isDev &&
    Boolean(license?.features?.includes(Feature.BUDIBASE_AI))
  )
}

const resolveStatus = async (): Promise<LicenseStatus> => {
  const adminStore = get(admin)
  if (adminStore.cloud) {
    return "has_key"
  }

  const license = get(licensing).license
  if (hasManagedBBAIDevLicense(adminStore.cloud, adminStore.isDev, license)) {
    return "has_key"
  }

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
