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
