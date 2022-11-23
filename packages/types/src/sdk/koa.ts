import { Context, Request } from "koa"
import { User, Role, UserRoles, Account } from "../documents"
import { FeatureFlag, License } from "../sdk"

export interface ContextUser extends Omit<User, "roles"> {
  globalId?: string
  license?: License
  userId?: string
  roleId?: string | null
  role?: Role
  roles?: UserRoles
  csrfToken?: string
  featureFlags?: FeatureFlag[]
  accountPortalAccess?: boolean
  account?: Account
}

export interface BBRequest extends Request {
  body: any
  files?: any
}

export interface BBContext extends Context {
  request: BBRequest
  user?: ContextUser
}
