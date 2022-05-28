import * as context from "../context"
import * as identityCtx from "../context/identity"
import env from "../environment"
import {
  Hosting,
  User,
  Identity,
  IdentityType,
  Account,
  isCloudAccount,
  isSSOAccount,
  TenantGroup,
  SettingsConfig,
  CloudAccount,
  UserIdentity,
  InstallationGroup,
  isSelfHostAccount,
  UserContext,
  Group,
} from "@budibase/types"
import { processors } from "./processors"
import * as dbUtils from "../db/utils"
import { Configs } from "../constants"
import * as hashing from "../hashing"
import * as installation from "../installation"

const pkg = require("../../package.json")

/**
 * An identity can be:
 * - account user (Self host)
 * - budibase user
 * - tenant
 * - installation
 */
export const getCurrentIdentity = async (): Promise<Identity> => {
  let identityContext = identityCtx.getIdentity()

  let identityType

  if (!identityContext) {
    identityType = IdentityType.TENANT
  } else {
    identityType = identityContext.type
  }

  if (identityType === IdentityType.INSTALLATION) {
    const installationId = await getInstallationId()
    return {
      id: formatDistinctId(installationId, identityType),
      type: identityType,
      installationId,
    }
  } else if (identityType === IdentityType.TENANT) {
    const installationId = await getInstallationId()
    const tenantId = await getCurrentTenantId()

    return {
      id: formatDistinctId(tenantId, identityType),
      type: identityType,
      installationId,
      tenantId,
    }
  } else if (identityType === IdentityType.USER) {
    const userContext = identityContext as UserContext
    const tenantId = await getCurrentTenantId()
    let installationId: string | undefined

    // self host account users won't have installation
    if (!userContext.account || !isSelfHostAccount(userContext.account)) {
      installationId = await getInstallationId()
    }

    return {
      id: userContext._id,
      type: identityType,
      installationId,
      tenantId,
    }
  } else {
    throw new Error("Unknown identity type")
  }
}

export const identifyInstallationGroup = async (
  installId: string,
  timestamp?: string | number
): Promise<void> => {
  const id = installId
  const type = IdentityType.INSTALLATION
  const hosting = getHostingFromEnv()
  const version = pkg.version

  const group: InstallationGroup = {
    id,
    type,
    hosting,
    version,
  }

  await identifyGroup(group, timestamp)
  // need to create a normal identity for the group to be able to query it globally
  // match the posthog syntax to link this identity to the empty auto generated one
  await identify({ ...group, id: `$${type}_${id}` }, timestamp)
}

export const identifyTenantGroup = async (
  tenantId: string,
  account: Account | undefined,
  timestamp?: string | number
): Promise<void> => {
  const id = await getGlobalTenantId(tenantId)
  const type = IdentityType.TENANT

  let hosting: Hosting
  let profession: string | undefined
  let companySize: string | undefined

  if (account) {
    profession = account.profession
    companySize = account.size
    hosting = account.hosting
  } else {
    hosting = getHostingFromEnv()
  }

  const group: TenantGroup = {
    id,
    type,
    hosting,
    profession,
    companySize,
  }

  await identifyGroup(group, timestamp)
  // need to create a normal identity for the group to be able to query it globally
  // match the posthog syntax to link this identity to the auto generated one
  await identify({ ...group, id: `$${type}_${id}` }, timestamp)
}

export const identifyUser = async (
  user: User,
  account: CloudAccount | undefined,
  timestamp?: string | number
) => {
  const id = user._id as string
  const tenantId = await getGlobalTenantId(user.tenantId)
  const type = IdentityType.USER
  let builder = user.builder?.global || false
  let admin = user.admin?.global || false
  let providerType = user.providerType
  const accountHolder = account?.budibaseUserId === user._id || false
  const verified =
    account && account?.budibaseUserId === user._id ? account.verified : false
  const installationId = await getInstallationId()

  const identity: UserIdentity = {
    id,
    type,
    installationId,
    tenantId,
    verified,
    accountHolder,
    providerType,
    builder,
    admin,
  }

  await identify(identity, timestamp)
}

export const identifyAccount = async (account: Account) => {
  let id = account.accountId
  const tenantId = account.tenantId
  let type = IdentityType.USER
  let providerType = isSSOAccount(account) ? account.providerType : undefined
  const verified = account.verified
  const accountHolder = true

  if (isCloudAccount(account)) {
    if (account.budibaseUserId) {
      // use the budibase user as the id if set
      id = account.budibaseUserId
    }
  }

  const identity: UserIdentity = {
    id,
    type,
    tenantId,
    providerType,
    verified,
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

export const identifyGroup = async (
  group: Group,
  timestamp?: string | number
) => {
  await processors.identifyGroup(group, timestamp)
}

const getHostingFromEnv = () => {
  return env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
}

export const getCurrentTenantId = () => getGlobalTenantId(context.getTenantId())

export const getInstallationId = async () => {
  if (isAccountPortal()) {
    return "account-portal"
  }
  const install = await installation.getInstall()
  return install.installId
}

const getGlobalTenantId = async (tenantId: string): Promise<string> => {
  if (env.SELF_HOSTED) {
    return getGlobalId(tenantId)
  } else {
    // tenant id's in the cloud are already unique
    return tenantId
  }
}

// TODO: cache in redis
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

const isAccountPortal = () => {
  return env.SERVICE === "account-portal"
}

const formatDistinctId = (id: string, type: IdentityType) => {
  if (type === IdentityType.INSTALLATION || type === IdentityType.TENANT) {
    return `$${type}_${id}`
  } else {
    return id
  }
}
