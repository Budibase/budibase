import { Context, Request } from "koa"
import { User } from "../documents"
import { License } from "../sdk"
import { Files } from "formidable"

export interface ContextUser extends User {
  globalId?: string
  license: License
}

/**
 * Add support for koa-body in context.
 */
export interface BBRequest<RequestBody> extends Request {
  body: RequestBody
  files?: Files
}

/**
 * Basic context with no user.
 */
export interface Ctx<RequestBody = any, ResponseBody = any> extends Context {
  request: BBRequest<RequestBody>
  body: ResponseBody
}

/**
 * Authenticated context.
 */
export interface UserCtx<RequestBody = any, ResponseBody = any>
  extends Ctx<RequestBody, ResponseBody> {
  user: ContextUser
}

/**
 * Deprecated: Use UserCtx / Ctx appropriately
 * Authenticated context.
 */
export interface BBContext extends Ctx {
  user?: ContextUser
}
