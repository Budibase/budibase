import { User, Account } from "../documents"
import { IdentityType } from "./identification"

export interface BaseContext {
  _id: string
  type: IdentityType
}

export interface AccountUserContext extends BaseContext {
  tenantId: string
  account: Account
}

export interface UserContext extends BaseContext, User {
  _id: string
  account?: Account
}

export type IdentityContext = BaseContext | AccountUserContext | UserContext
