import type { PlanType } from "../../sdk"
import type { Layout, App, Screen } from "../../documents"

export interface CreateAppRequest {
  name: string
  url?: string
  useTemplate?: string
  templateName?: string
  templateKey?: string
  templateFile?: string
  includeSampleData?: boolean
  encryptionPassword?: string
  templateString?: string
  file?: { path: string }
}

export interface DuplicateAppRequest {
  name: string
  url?: string
}

export interface DuplicateAppResponse {
  duplicateAppId: string
  sourceAppId: string
  message: string
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
