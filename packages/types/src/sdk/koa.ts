import { Context } from "koa"
import { User } from "../documents"
import { License } from "../sdk"

export interface ContextUser extends User {
  globalId?: string
  license: License
}

export interface BBContext extends Context {
  user?: ContextUser
  body: any
}
