import { Context } from "koa"
import { User } from "../documents"
import { License } from "../sdk"

export interface ContextUser extends User {
  globalId?: string
  license: License
}

export interface BBContext {
  user?: ContextUser
  request: {
    body: any
  }
  params: any
  body?: any
  redirect?: any
  attachment: any
}
