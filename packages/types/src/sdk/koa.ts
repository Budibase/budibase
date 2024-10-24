import { Context, Request } from "koa"
import {
  User,
  Role,
  UserRoles,
  Account,
  ConfigType,
  Row,
  Table,
  AutomationEventType,
} from "../documents"
import { FeatureFlag, License } from "../sdk"
import { Files } from "formidable"

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
  providerType?: ConfigType
  account?: Account
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
  roleId?: string
  eventEmitter?: ContextEmitter
}

/**
 * @deprecated: Use UserCtx / Ctx appropriately
 * Authenticated context.
 */
export interface BBContext extends Ctx {
  user?: ContextUser
}

export interface ContextEmitter {
  emitRow: (params: {
    eventName: AutomationEventType
    appId: string
    row: Row
    table?: Table
  }) => Promise<void>
}
