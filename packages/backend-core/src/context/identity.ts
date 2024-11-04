import {
  IdentityContext,
  IdentityType,
  User,
  isCloudAccount,
  Account,
  AccountUserContext,
  UserContext,
  Ctx,
} from "@budibase/types"
import * as context from "."

export function getIdentity(): IdentityContext | undefined {
  return context.getIdentity()
}

export function doInIdentityContext(identity: IdentityContext, task: any) {
  return context.doInIdentityContext(identity, task)
}

// used in server/worker
export function doInUserContext(user: User, ctx: Ctx, task: any) {
  const userContext: UserContext = {
    ...user,
    _id: user._id as string,
    type: IdentityType.USER,
    hostInfo: {
      ipAddress: ctx.request.ip,
      // filled in by koa-useragent package
      userAgent: ctx.userAgent.source,
    },
  }
  return doInIdentityContext(userContext, task)
}

// used in account portal
export function doInAccountContext(account: Account, task: any) {
  const _id = getAccountUserId(account)
  const tenantId = account.tenantId
  const accountContext: AccountUserContext = {
    _id,
    type: IdentityType.USER,
    tenantId,
    account,
  }
  return doInIdentityContext(accountContext, task)
}

export function getAccountUserId(account: Account) {
  let userId: string
  if (isCloudAccount(account)) {
    userId = account.budibaseUserId
  } else {
    // use account id as user id for self-hosting
    userId = account.accountId
  }
  return userId
}
