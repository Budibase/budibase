import { Context, Request } from "koa"
import { User } from "../documents"
import { License } from "../sdk"

export interface ContextUser extends User {
  globalId?: string
  license: License
}

export interface BBRequest extends Request {
  body: any
}

export interface BBContext extends Context {
  request: BBRequest
  user?: ContextUser
}
