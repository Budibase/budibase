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
  InstallationIdentity,
  Installation,
  isInstallation,
} from "@budibase/types"
import { processors } from "./processors"
import * as dbUtils from "../db/utils"
import { Configs } from "../constants"
import * as hashing from "../hashing"

const pkg = require("../../package.json")

export const getCurrentIdentity = async (): Promise<Identity> => {
  const user: SessionUser | undefined = context.getUser()

  const tenantId = await getGlobalTenantId(context.getTenantId())
  let id: string
  let type: IdentityType

  if (user) {
    id = user._id
    type = IdentityType.USER
  } else {
    id = tenantId
    type = IdentityType.TENANT
  }

  if (user && isInstallation(user)) {
    type = IdentityType.INSTALLATION
  }

  return {
    id,
    tenantId,
    type,
  }
}

const getGlobalId = async (tenantId: string): Promise<string> => {
  const db = context.getGlobalDB()
  const config: SettingsConfig = await dbUtils.getScopedFullConfig(db, {
    type: Configs.SETTINGS,
  })

  let globalId: string
  if (config.config.globalId) {
    return config.config.globalId
  } else {
    globalId = `${hashing.newid()}_${tenantId}`
    config.config.globalId = globalId
    await db.put(config)
    return globalId
  }
}

const getGlobalTenantId = async (tenantId: string): Promise<string> => {
  if (env.SELF_HOSTED) {
    return getGlobalId(tenantId)
  } else {
    // tenant id's in the cloud are already unique
    return tenantId
  }
}

const getHostingFromEnv = () => {
  return env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
}

export const identifyInstallation = async (
  install: Installation,
  timestamp: string | number
) => {
  const id = install.installId
  // the default tenant id, so we can match installations to other events
  const tenantId = await getGlobalTenantId(context.getTenantId())
  const version: string = pkg.version as string
  const type = IdentityType.INSTALLATION
  const hosting = getHostingFromEnv()

  const identity: InstallationIdentity = {
    id,
    tenantId,
    type,
    version,
    hosting,
  }
  await identify(identity, timestamp)
}

export const identifyTenant = async (
  tenantId: string,
  account: CloudAccount | undefined,
  timestamp?: string | number
) => {
  const globalTenantId = await getGlobalTenantId(tenantId)
  const id = globalTenantId
  const hosting = getHostingFromEnv()
  const type = IdentityType.TENANT
  const profession = account?.profession
  const companySize = account?.size

  const identity: TenantIdentity = {
    id,
    tenantId: globalTenantId,
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
  const verified =
    account && account?.budibaseUserId === user._id ? account.verified : false
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

export const identify = async (
  identity: Identity,
  timestamp?: string | number
) => {
  await processors.identify(identity, timestamp)
}
