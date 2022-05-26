import { Hosting } from "../core"

export enum IdentityType {
  USER = "user", // cloud and self hosted users
  TENANT = "tenant", // cloud and self hosted tenants
}

export interface Identity {
  id: string
  tenantId: string
  type: IdentityType
}

export interface TenantIdentity extends Identity {
  hosting: Hosting
  profession?: string
  companySize?: string
}

export interface UserIdentity extends TenantIdentity {
  hosting: Hosting
  type: IdentityType
  verified: boolean
  accountHolder: boolean
  providerType?: string
}

export interface BudibaseIdentity extends UserIdentity {
  builder?: boolean
  admin?: boolean
}
