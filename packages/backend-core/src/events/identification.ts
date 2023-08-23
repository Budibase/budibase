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
  CloudAccount,
  UserIdentity,
  InstallationGroup,
  UserContext,
  Group,
  isSSOUser,
} from "@budibase/types"
import { processors } from "./processors"
import { newid } from "../utils"
import * as installation from "../installation"
import * as configs from "../configs"
import * as users from "../users"
import { withCache, TTL, CacheKey } from "../cache/generic"

/**
 * An identity can be:
 * - account user (Self host)
 * - budibase user
 * - tenant
 * - installation
 */
const getCurrentIdentity = async (): Promise<Identity> => {
  let identityContext = identityCtx.getIdentity()
  const environment = getDeploymentEnvironment()

  let identityType

  if (!identityContext) {
    identityType = IdentityType.TENANT
  } else {
    identityType = identityContext.type
  }

  if (identityType === IdentityType.INSTALLATION) {
    const installationId = await getInstallationId()
    const hosting = getHostingFromEnv()
    return {
      id: formatDistinctId(installationId, identityType),
      hosting,
      type: identityType,
      installationId,
      environment,
    }
  } else if (identityType === IdentityType.TENANT) {
    const installationId = await getInstallationId()
    const tenantId = await getEventTenantId(context.getTenantId())
    const hosting = getHostingFromEnv()

    return {
      id: formatDistinctId(tenantId, identityType),
      type: identityType,
      hosting,
      installationId,
      tenantId,
      realTenantId: context.getTenantId(),
      environment,
    }
  } else if (identityType === IdentityType.USER) {
    const userContext = identityContext as UserContext
    const tenantId = await getEventTenantId(context.getTenantId())
    const installationId = await getInstallationId()

    const account = userContext.account
    let hosting
    if (account) {
      hosting = account.hosting
    } else {
      hosting = getHostingFromEnv()
    }

    return {
      id: userContext._id,
      type: identityType,
      hosting,
      installationId,
      tenantId,
      environment,
      realTenantId: context.getTenantId(),
      hostInfo: userContext.hostInfo,
    }
  } else {
    throw new Error("Unknown identity type")
  }
}

const identifyInstallationGroup = async (
  installId: string,
  timestamp?: string | number
): Promise<void> => {
  const id = installId
  const type = IdentityType.INSTALLATION
  const hosting = getHostingFromEnv()
  const version = env.VERSION
  const environment = getDeploymentEnvironment()

  const group: InstallationGroup = {
    id,
    type,
    hosting,
    version,
    environment,
  }

  await identifyGroup(group, timestamp)
  // need to create a normal identity for the group to be able to query it globally
  // match the posthog syntax to link this identity to the empty auto generated one
  await identify({ ...group, id: `$${type}_${id}` }, timestamp)
}

const identifyTenantGroup = async (
  tenantId: string,
  account: Account | undefined,
  timestamp?: string | number
): Promise<void> => {
  const id = await getEventTenantId(tenantId)
  const type = IdentityType.TENANT
  const installationId = await getInstallationId()
  const environment = getDeploymentEnvironment()

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
    environment,
    installationId,
    profession,
    companySize,
  }

  await identifyGroup(group, timestamp)
  // need to create a normal identity for the group to be able to query it globally
  // match the posthog syntax to link this identity to the auto generated one
  await identify({ ...group, id: `$${type}_${id}` }, timestamp)
}

const identifyUser = async (
  user: User,
  account: CloudAccount | undefined,
  timestamp?: string | number
) => {
  const id = user._id as string
  const tenantId = await getEventTenantId(user.tenantId)
  const type = IdentityType.USER
  let builder = users.hasBuilderPermissions(user)
  let admin = users.hasAdminPermissions(user)
  let providerType
  if (isSSOUser(user)) {
    providerType = user.providerType
  }
  const accountHolder = account?.budibaseUserId === user._id || false
  const verified =
    account && account?.budibaseUserId === user._id ? account.verified : false
  const installationId = await getInstallationId()
  const hosting = account ? account.hosting : getHostingFromEnv()
  const environment = getDeploymentEnvironment()

  const identity: UserIdentity = {
    id,
    type,
    hosting,
    installationId,
    tenantId,
    verified,
    accountHolder,
    providerType,
    builder,
    admin,
    environment,
  }

  await identify(identity, timestamp)
}

const identifyAccount = async (account: Account) => {
  let id = account.accountId
  const tenantId = account.tenantId
  let type = IdentityType.USER
  let providerType = isSSOAccount(account) ? account.providerType : undefined
  const verified = account.verified
  const accountHolder = true
  const hosting = account.hosting
  const installationId = await getInstallationId()
  const environment = getDeploymentEnvironment()

  if (isCloudAccount(account)) {
    if (account.budibaseUserId) {
      // use the budibase user as the id if set
      id = account.budibaseUserId
    }
  }

  const identity: UserIdentity = {
    id,
    type,
    hosting,
    installationId,
    tenantId,
    providerType,
    verified,
    accountHolder,
    environment,
  }

  await identify(identity)
}

const identify = async (identity: Identity, timestamp?: string | number) => {
  await processors.identify(identity, timestamp)
}

const identifyGroup = async (group: Group, timestamp?: string | number) => {
  await processors.identifyGroup(group, timestamp)
}

const getDeploymentEnvironment = () => {
  if (env.isDev()) {
    return "development"
  } else {
    return env.DEPLOYMENT_ENVIRONMENT
  }
}

const getHostingFromEnv = () => {
  return env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
}

const getInstallationId = async () => {
  if (isAccountPortal()) {
    return "account-portal"
  }
  const install = await installation.getInstall()
  return install.installId
}

const getEventTenantId = async (tenantId: string): Promise<string> => {
  if (env.SELF_HOSTED) {
    return getUniqueTenantId(tenantId)
  } else {
    // tenant id's in the cloud are already unique
    return tenantId
  }
}

export const getUniqueTenantId = async (tenantId: string): Promise<string> => {
  // make sure this tenantId always matches the tenantId in context
  return context.doInTenant(tenantId, () => {
    return withCache(CacheKey.UNIQUE_TENANT_ID, TTL.ONE_DAY, async () => {
      const db = context.getGlobalDB()
      const config = await configs.getSettingsConfigDoc()

      let uniqueTenantId: string
      if (config.config.uniqueTenantId) {
        return config.config.uniqueTenantId
      } else {
        uniqueTenantId = `${newid()}_${tenantId}`
        config.config.uniqueTenantId = uniqueTenantId
        await db.put(config)
        return uniqueTenantId
      }
    })
  })
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

export default {
  getCurrentIdentity,
  identifyInstallationGroup,
  identifyTenantGroup,
  identifyUser,
  identifyAccount,
  identify,
  identifyGroup,
  getInstallationId,
  getUniqueTenantId,
}
