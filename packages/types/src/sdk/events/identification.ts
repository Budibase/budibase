import { Hosting } from ".."

// GROUPS

export enum GroupType {
  TENANT = "tenant",
  INSTALLATION = "installation",
}

export interface Group {
  id: string
  type: IdentityType
  environment: string
  hosting: Hosting
}

export interface TenantGroup extends Group {
  // account level information is associated with the tenant group
  // as we don't have this at the user level
  profession?: string // only available in cloud
  companySize?: string // only available in cloud
  installationId: string
}

export interface InstallationGroup extends Group {
  version: string
}

// IDENTITIES

export enum IdentityType {
  USER = "user",
  TENANT = "tenant",
  INSTALLATION = "installation",
}

export interface Identity {
  id: string
  type: IdentityType
  hosting: Hosting
  environment: string
  installationId?: string
  tenantId?: string
}

export interface UserIdentity extends Identity {
  verified: boolean
  accountHolder: boolean
  providerType?: string
  builder?: boolean
  admin?: boolean
}
