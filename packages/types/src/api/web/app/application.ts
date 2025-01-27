import type { PlanType } from "../../../sdk"
import type { Layout, App, Screen } from "../../../documents"
import { ReadStream } from "fs"

export interface SyncAppResponse {
  message: string
}

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

export interface CreateAppResponse extends App {}

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

export interface AddAppSampleDataResponse {
  message: string
}

export type FetchAppsResponse = App[]

export interface PublishResponse {
  _id: string
  status: string
  appUrl: string
}

export interface UpdateAppRequest extends Partial<App> {}
export interface UpdateAppResponse extends App {}
export interface UpdateAppClientResponse extends App {}
export interface RevertAppClientResponse extends App {}

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

export interface SetRevertableAppVersionRequest {
  revertableVersion: string
}
export interface SetRevertableAppVersionResponse {
  message: string
}

export interface ExportAppDumpRequest {
  excludeRows: boolean
  encryptPassword?: string
}

export type ExportAppDumpResponse = ReadStream
