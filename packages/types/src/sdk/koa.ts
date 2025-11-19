import { Context, Request } from "koa"
import {
  Role,
  UserRoles,
  Account,
  Row,
  Table,
  UserBindings,
  User,
  UserSSO,
} from "../documents"
import { FeatureFlag, License } from "../sdk"
import { Files } from "formidable"
import { EventType } from "../core"

export interface UserAgentDetails {
  source: string
  browser: string
  [key: string]: unknown
}

export enum LoginMethod {
  API_KEY = "api_key",
  COOKIE = "cookie",
}

export interface ContextUser extends Omit<User & Partial<UserSSO>, "roles"> {
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
export interface Ctx<
  RequestBody = any,
  ResponseBody = any,
  Params extends Record<string, any> = any,
> extends Context {
  params: Params
  request: BBRequest<RequestBody>
  body: ResponseBody
  userAgent: UserAgentDetails
  state: { nonce?: string }
}

/**
 * Authenticated context.
 */
export interface UserCtx<
  RequestBody = any,
  ResponseBody = any,
  Params extends Record<string, any> = any,
> extends Ctx<RequestBody, ResponseBody, Params> {
  user: ContextUser
  state: { nonce?: string }
  roleId?: string
  eventEmitter?: ContextEmitter
  loginMethod?: LoginMethod
}

/**
 * @deprecated: Use UserCtx / Ctx appropriately
 * Authenticated context.
 */
export interface BBContext extends Ctx {
  user?: ContextUser
}

export interface ContextEmitter {
  emitRow(values: {
    eventName: EventType.ROW_SAVE
    appId: string
    row: Row
    table: Table
    user: UserBindings
  }): void
  emitRow(values: {
    eventName: EventType.ROW_UPDATE
    appId: string
    row: Row
    table: Table
    oldRow: Row
    user: UserBindings
  }): void
  emitRow(values: {
    eventName: EventType.ROW_DELETE
    appId: string
    row: Row
    user: UserBindings
  }): void
  emitTable(
    eventName: EventType.TABLE_SAVE | EventType.TABLE_DELETE,
    appId: string,
    table?: Table
  ): void
}
