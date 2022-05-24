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
  isCloudAccount,
  isSSOAccount,
  TenantIdentity,
  SettingsConfig,
} from "@budibase/types"
import { analyticsProcessor } from "./processors"
import * as dbUtils from "../db/utils"
import { Configs } from "../constants"
import * as hashing from "../hashing"

export const getCurrentIdentity = async (): Promise<Identity> => {
  const user: SessionUser | undefined = context.getUser()
  let tenantId = context.getTenantId()
  let id: string

  if (user) {
    id = user._id
  } else {
    const global = await getGlobalIdentifiers(tenantId)
    id = global.id
    tenantId = global.tenantId
  }

  return {
    id,
    tenantId,
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

export const identifyTenant = async (tenantId: string) => {
  const global = await getGlobalIdentifiers(tenantId)

  const identity: TenantIdentity = {
    id: global.id,
    tenantId: global.tenantId,
    hosting: getHostingFromEnv(),
    type: IdentityType.TENANT,
  }
  await identify(identity)
}

export const identifyUser = async (user: User) => {
  const id = user._id as string
  const tenantId = user.tenantId
  const hosting = env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
  const type = IdentityType.USER
  let builder = user.builder?.global
  let admin = user.admin?.global
  let providerType = user.providerType

  const identity: BudibaseIdentity = {
    id,
    tenantId,
    hosting,
    type,
    builder,
    admin,
    providerType,
  }

  await identify(identity)
}

export const identifyAccount = async (account: Account) => {
  let id = account.accountId
  const tenantId = account.tenantId
  const hosting = account.hosting
  let type = IdentityType.ACCOUNT
  let providerType = isSSOAccount(account) ? account.providerType : undefined

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
    providerType,
    verified: account.verified,
    profession: account.profession,
    companySize: account.size,
  }

  await identify(identity)
}

const identify = async (identity: Identity) => {
  await analyticsProcessor.identify(identity)
}
