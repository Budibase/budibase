import {
  IdentityContext,
  IdentityType,
  User,
  UserContext,
  isCloudAccount,
  Account,
  AccountUserContext,
} from "@budibase/types"
import * as context from "."

export const getIdentity = (): IdentityContext | undefined => {
  return context.getIdentity()
}

export const doInIdentityContext = (identity: IdentityContext, task: any) => {
  return context.doInIdentityContext(identity, task)
}

export const doInUserContext = (user: User, task: any) => {
  const userContext: UserContext = {
    ...user,
    _id: user._id as string,
    type: IdentityType.USER,
  }
  return doInIdentityContext(userContext, task)
}

export const doInAccountContext = (account: Account, task: any) => {
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

export const getAccountUserId = (account: Account) => {
  let userId: string
  if (isCloudAccount(account)) {
    userId = account.budibaseUserId
  } else {
    // use account id as user id for self hosting
    userId = account.accountId
  }
  return userId
}
