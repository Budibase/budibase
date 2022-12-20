import { Document } from "../document"

export interface SSOProfile {
  id: string
  name?: {
    givenName?: string
    familyName?: string
  }
  _json: {
    email: string
    picture: string
  }
  provider?: string
}

export interface ThirdPartyUser extends Document {
  thirdPartyProfile?: SSOProfile["_json"]
  firstName?: string
  lastName?: string
  pictureUrl?: string
  profile?: SSOProfile
  oauth2?: any
  provider?: string
  providerType?: string
  email: string
  userId?: string
  forceResetPassword?: boolean
  userGroups?: string[]
}

export interface User extends ThirdPartyUser {
  tenantId: string
  email: string
  userId?: string
  forceResetPassword?: boolean
  roles: UserRoles
  builder?: {
    global: boolean
  }
  admin?: {
    global: boolean
  }
  password?: string
  status?: string
  createdAt?: number // override the default createdAt behaviour - users sdk historically set this to Date.now()
  dayPassRecordedAt?: string
  account?: {
    authType: string
  }
}

export interface UserRoles {
  [key: string]: string
}

// utility types

export interface BuilderUser extends User {
  builder: {
    global: boolean
  }
}

export interface AdminUser extends User {
  admin: {
    global: boolean
  }
  builder: {
    global: boolean
  }
}
