import { Context } from "koa"
import { User } from "../documents"

export interface ContextUser extends User {
  globalId?: string
}

export interface BBContext extends Context {
  user?: ContextUser
  body: any
}
