import { Hosting } from "."

// GROUPS

export enum GroupType {
  TENANT = "tenant",
  INSTALLATION = "installation",
}

export interface Group {
  id: string
  type: IdentityType
}

export interface TenantGroup extends Group {
  // account level information is associated with the tenant group
  // as we don't have this at the user level
  profession?: string // only available in cloud
  companySize?: string // only available in cloud
  hosting: Hosting // need hosting at the tenant level for cloud self host accounts
}

export interface InstallationGroup extends Group {
  version: string
  hosting: Hosting
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
