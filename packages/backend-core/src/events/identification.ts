import {
  isCloudAccount,
  isSSOAccount,
} from "./../../../types/src/documents/account/account"
import * as context from "../context"
import env from "../environment"
import {
  Hosting,
  User,
  SessionUser,
  Identity,
  IdentityType,
  Account,
  AccountIdentity,
  BudibaseIdentity,
} from "@budibase/types"
import { analyticsProcessor } from "./processors"

export const getCurrentIdentity = (): Identity => {
  const user: SessionUser | undefined = context.getUser()
  const tenantId = context.getTenantId()
  let id: string

  if (user) {
    id = user._id
  } else if (env.SELF_HOSTED) {
    id = "installationId" // TODO
  } else {
    id = context.getTenantId()
  }

  return {
    id,
    tenantId,
  }
}

export const identifyUser = async (user: User) => {
  const id = user._id as string
  const tenantId = user.tenantId
  const hosting = env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
  const type = IdentityType.USER
  let builder = user.builder?.global
  let admin = user.admin?.global
  let authType = user.providerType ? user.providerType : "password"

  const identity: BudibaseIdentity = {
    id,
    tenantId,
    hosting,
    type,
    builder,
    admin,
    authType,
  }

  await identify(identity)
}

export const identifyAccount = async (account: Account) => {
  let id = account.accountId
  const tenantId = account.tenantId
  const hosting = account.hosting
  let type = IdentityType.ACCOUNT
  let authType = isSSOAccount(account)
    ? (account.providerType as string)
    : "password"

  if (isCloudAccount(account)) {
    if (account.budibaseUserId) {
      // use the budibase user as the id if set
      id = account.budibaseUserId
      type = IdentityType.USER
    }
  }

  const identity: AccountIdentity = {
    id,
    tenantId,
    hosting,
    type,
    authType,
    verified: account.verified,
    profession: account.profession,
    companySize: account.size,
  }

  await identify(identity)
}

const identify = async (identity: Identity) => {
  await analyticsProcessor.identify(identity)
}
