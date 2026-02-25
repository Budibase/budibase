import { Document } from "@budibase/types"

export interface SaveLicenseInfo {
  licenseKey?: string
  offlineLicenseToken?: string
}

export interface LicenseInfo extends Document, SaveLicenseInfo {
  _id?: string
  _rev?: string
}
