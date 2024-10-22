import type { PlanType } from "../../sdk"
import type { Layout, App, Screen } from "../../documents"

export interface CreateAppRequest {
  name: string
  url?: string
  useTemplate?: string
  templateName?: string
  templateKey?: string
  fileToImport?: string
  encryptionPassword?: string
  file?: { path: string }
}

export interface DuplicateAppRequest {
  name: string
  url?: string
}

export interface DuplicateAppResponse {
  duplicateAppId: string
  sourceAppId: string
}

export interface FetchAppDefinitionResponse {
  layouts: Layout[]
  screens: Screen[]
  libraries: string[]
}

export interface FetchAppPackageResponse {
  application: App
  licenseType: PlanType
  screens: Screen[]
  layouts: Layout[]
  clientLibPath: string
  hasLock: boolean
}

export interface PublishResponse {
  _id: string
  status: string
  appUrl: string
}

export interface UpdateAppRequest extends Partial<App> {}
export interface UpdateAppResponse extends App {}
