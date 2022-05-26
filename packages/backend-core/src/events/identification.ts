import * as context from "../context"
import env from "../environment"
import {
  Hosting,
  User,
  SessionUser,
  Identity,
  IdentityType,
  Account,
  BudibaseIdentity,
  isCloudAccount,
  isSSOAccount,
  TenantIdentity,
  SettingsConfig,
  CloudAccount,
  UserIdentity,
} from "@budibase/types"
import { analyticsProcessor } from "./processors"
import * as dbUtils from "../db/utils"
import { Configs } from "../constants"
import * as hashing from "../hashing"

export const getCurrentIdentity = async (): Promise<Identity> => {
  const user: SessionUser | undefined = context.getUser()
  let tenantId = context.getTenantId()
  let id: string
  let type: IdentityType

  if (user) {
    id = user._id
    type = IdentityType.USER
  } else {
    const global = await getGlobalIdentifiers(tenantId)
    id = global.id
    tenantId = global.tenantId
    type = IdentityType.TENANT
  }

  return {
    id,
    tenantId,
    type,
  }
}

const getGlobalId = async (): Promise<string> => {
  const db = context.getGlobalDB()
  const config: SettingsConfig = await dbUtils.getScopedFullConfig(db, {
    type: Configs.SETTINGS,
  })
  if (config.config.globalId) {
    return config.config.globalId
  } else {
    const globalId = `global_${hashing.newid()}`
    config.config.globalId = globalId
    await db.put(config)
    return globalId
  }
}

const getGlobalIdentifiers = async (
  tenantId: string
): Promise<{ id: string; tenantId: string }> => {
  if (env.SELF_HOSTED) {
    const globalId = await getGlobalId()
    return {
      id: globalId,
      tenantId: `${globalId}-${tenantId}`,
    }
  } else {
    // tenant id's in the cloud are already unique
    return {
      id: tenantId,
      tenantId: tenantId,
    }
  }
}

const getHostingFromEnv = () => {
  return env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
}

export const identifyTenant = async (
  tenantId: string,
  account: CloudAccount | undefined,
  timestamp?: string | number
) => {
  const global = await getGlobalIdentifiers(tenantId)
  const id = global.id
  const hosting = getHostingFromEnv()
  const type = IdentityType.TENANT
  const profession = account?.profession
  const companySize = account?.size

  const identity: TenantIdentity = {
    id,
    tenantId: global.tenantId,
    hosting,
    type,
    profession,
    companySize,
  }
  await identify(identity, timestamp)
}

export const identifyUser = async (
  user: User,
  account: CloudAccount | undefined,
  timestamp?: string | number
) => {
  const id = user._id as string
  const tenantId = user.tenantId
  const hosting = env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
  const type = IdentityType.USER
  let builder = user.builder?.global
  let admin = user.admin?.global
  let providerType = user.providerType
  const accountHolder = account?.budibaseUserId === user._id
  const verified = account ? account.verified : false
  const profession = account?.profession
  const companySize = account?.size

  const identity: BudibaseIdentity = {
    id,
    tenantId,
    hosting,
    type,
    builder,
    admin,
    providerType,
    accountHolder,
    verified,
    profession,
    companySize,
  }

  await identify(identity, timestamp)
}

export const identifyAccount = async (account: Account) => {
  let id = account.accountId
  const tenantId = account.tenantId
  const hosting = account.hosting
  let type = IdentityType.USER
  let providerType = isSSOAccount(account) ? account.providerType : undefined
  const verified = account.verified
  const profession = account.profession
  const companySize = account.size
  const accountHolder = true

  if (isCloudAccount(account)) {
    if (account.budibaseUserId) {
      // use the budibase user as the id if set
      id = account.budibaseUserId
    }
  }

  const identity: UserIdentity = {
    id,
    tenantId,
    hosting,
    type,
    providerType,
    verified,
    profession,
    companySize,
    accountHolder,
  }

  await identify(identity)
}

const identify = async (identity: Identity, timestamp?: string | number) => {
  await analyticsProcessor.identify(identity, timestamp)
}
