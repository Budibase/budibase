import { Hosting } from "../core"

export enum IdentityType {
  USER = "user", // cloud and self hosted users
  ACCOUNT = "account", // self hosted accounts
  TENANT = "tenant", // cloud and self hosted tenants
}

export interface Identity {
  id: string
  tenantId: string
}

export interface UserIdentity extends Identity {
  hosting: Hosting
  type: IdentityType
  authType: string
}

export interface BudibaseIdentity extends UserIdentity {
  builder?: boolean
  admin?: boolean
}

export interface AccountIdentity extends UserIdentity {
  verified: boolean
  profession: string | undefined
  companySize: string | undefined
}
