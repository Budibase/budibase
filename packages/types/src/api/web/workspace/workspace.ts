import { ReadStream } from "fs"
import type { Layout, Screen, Workspace } from "../../../documents"
import type { PlanType } from "../../../sdk"

export interface SyncWorkspaceResponse {
  message: string
}

export interface CreateWorkspaceRequest {
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

export interface CreateWorkspaceResponse extends Workspace {}

export interface DuplicateWorkspaceRequest {
  name: string
  url?: string
}

export interface DuplicateWorkspaceResponse {
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

export interface AddWorkspaceSampleDataResponse {
  message: string
}

export type FetchWorkspacesResponse = (Workspace & {
  defaultWorkspaceAppUrl: string
})[]

export interface PublishedWorkspaceData {
  name: string
  appId: string
  url: string
  prodId: string
  updatedAt?: string
}

export interface FetchPublishedAppsResponse {
  apps: PublishedWorkspaceData[]
}

export interface UpdateWorkspaceRequest extends Partial<Workspace> {}
export interface UpdateWorkspaceResponse extends Workspace {}
export interface UpdateAppClientResponse extends Workspace {}
export interface RevertAppClientResponse extends Workspace {}

export interface DeleteWorkspaceResponse {
  ok: boolean
}

export interface UnpublishWorkspaceResponse {
  message: string
}

export interface ImportToUpdateWorkspaceRequest {
  encryptionPassword?: string
}
export interface ImportToUpdateWorkspaceResponse {
  message: string
}

export interface ExportWorkspaceDumpRequest {
  excludeRows: boolean
  encryptPassword?: string
}

export type ExportWorkspaceDumpResponse = ReadStream
