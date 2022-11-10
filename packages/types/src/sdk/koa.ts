import { Context, Request } from "koa"
import { User, Role, UserRoles } from "../documents"
import { License } from "../sdk"

export interface ContextUser extends Omit<User, "roles"> {
  globalId?: string
  license: License
  userId?: string
  roleId?: string
  role?: Role
  roles?: UserRoles
}

export interface BBRequest extends Request {
  body: any
}

export interface BBContext extends Context {
  request: BBRequest
  user?: ContextUser
}
