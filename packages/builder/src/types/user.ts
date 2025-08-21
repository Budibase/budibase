import { Constants } from "@budibase/frontend-core"
import type { User as UserDoc, UserGroup } from "@budibase/types"

export interface UserInfo {
  email: string
  password: string
  forceResetPassword?: boolean
  role: keyof typeof Constants.BudibaseRoles
}

export interface User extends UserDoc {
  tenantOwnerEmail?: string
}

export interface EnrichedUser extends Omit<User, "userGroups"> {
  name: string
  userGroups: UserGroup[]
  apps: string[]
  access: number
}

export interface ParsedInvite {
  _id: string
  email: string
  builder?: {
    global: boolean
  }
  admin?: {
    global: boolean
  }
  userGroups?: UserGroup[]
  apps?: string[]
}
