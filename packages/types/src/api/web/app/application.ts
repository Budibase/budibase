import { ReadStream } from "fs"
import type { Layout, Screen, Workspace } from "../../../documents"
import type { PlanType } from "../../../sdk"

export interface SyncAppResponse {
  message: string
}

export interface CreateAppRequest {
  name: string
  url?: string
  useTemplate?: string | boolean
  templateName?: string
  templateKey?: string
  fileToImport?: string
  encryptionPassword?: string
  file?: { path: string }
  isOnboarding?: string
}

export interface CreateAppResponse extends Workspace {}

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
  application: Workspace
  licenseType: PlanType
  screens: Screen[]
  layouts: Layout[]
  clientLibPath: string
  hasLock: boolean
  recaptchaKey?: string
}

export interface AddAppSampleDataResponse {
  message: string
}

export type FetchAppsResponse = (Workspace & {
  defaultWorkspaceAppUrl: string
})[]

export interface PublishedAppData {
  name: string
  appId: string
  url: string
  prodId: string
  updatedAt?: string
}

export interface FetchPublishedAppsResponse {
  apps: PublishedAppData[]
}

export interface UpdateAppRequest extends Partial<Workspace> {}
export interface UpdateAppResponse extends Workspace {}
export interface UpdateAppClientResponse extends Workspace {}
export interface RevertAppClientResponse extends Workspace {}

export interface DeleteAppResponse {
  ok: boolean
}

export interface UnpublishAppResponse {
  message: string
}

export interface ImportToUpdateAppRequest {
  encryptionPassword?: string
}
export interface ImportToUpdateAppResponse {
  message: string
}

export interface ExportAppDumpRequest {
  excludeRows: boolean
  encryptPassword?: string
}

export type ExportAppDumpResponse = ReadStream
