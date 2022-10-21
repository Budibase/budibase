import { Context } from "koa"
import { User } from "../documents"
import { License } from "../sdk"

export interface ContextUser extends User {
  globalId?: string
  license: License
}

export interface BBContext {
  user?: ContextUser
  status?: number
  request: {
    body: any
  }
  params: any
  body?: any
  redirect?: any
  attachment: any
  throw: any
}
