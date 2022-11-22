import { Context, Request } from "koa"
import { User, Role, UserRoles } from "../documents"
import { License } from "../sdk"

export interface ContextUser extends Omit<User, "roles"> {
  globalId?: string
  license: License
  userId?: string
  roleId?: string | null
  role?: Role
  roles?: UserRoles
  csrfToken?: string
}

export interface BBRequest extends Request {
  body: any
  files?: any
}

export interface BBContext extends Context {
  request: BBRequest
  user?: ContextUser
}
