import { ContextUser, User, UserGroup, UserIdentifier } from "@budibase/types"
import * as accountSdk from "../accounts"
import env from "../environment"
import { getExistingAccounts, getFirstPlatformUser } from "./lookup"
import { EmailUnavailableError } from "../errors"
import { sdk } from "@budibase/shared-core"
import { BUILTIN_ROLE_IDS } from "../security/roles"
import * as context from "../context"

// extract from shared-core to make easily accessible from backend-core
export const isBuilder = sdk.users.isBuilder
export const isAdmin = sdk.users.isAdmin
export const isGlobalBuilder = sdk.users.isGlobalBuilder
export const isAdminOrBuilder = sdk.users.isAdminOrBuilder
export const hasAdminPermissions = sdk.users.hasAdminPermissions
export const hasBuilderPermissions = sdk.users.hasBuilderPermissions
export const hasAppBuilderPermissions = sdk.users.hasAppBuilderPermissions

export async function isCreator(user?: User | ContextUser) {
  const isCreatorByUserDefinition = sdk.users.isCreator(user)
  if (!isCreatorByUserDefinition && user) {
    return await isCreatorByGroupMembership(user)
  }
  return isCreatorByUserDefinition
}

async function isCreatorByGroupMembership(user?: User | ContextUser) {
  const userGroups = user?.userGroups || []
  if (userGroups.length > 0) {
    const db = context.getGlobalDB()
    const groups: UserGroup[] = []
    for (let groupId of userGroups) {
      try {
        const group = await db.get<UserGroup>(groupId)
        groups.push(group)
      } catch (e: any) {
        if (e.error !== "not_found") {
          throw e
        }
      }
    }
    return groups.some(group =>
      Object.values(group.roles || {}).includes(BUILTIN_ROLE_IDS.ADMIN)
    )
  }
  return false
}

export async function validateUniqueUser(email: string, tenantId: string) {
  // check budibase users in other tenants
  if (env.MULTI_TENANCY) {
    const tenantUser = await getFirstPlatformUser(email)
    if (tenantUser != null && tenantUser.tenantId !== tenantId) {
      throw new EmailUnavailableError(email)
    }
  }

  // check root account users in account portal
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const account = await accountSdk.getAccount(email)
    if (account && account.verified && account.tenantId !== tenantId) {
      throw new EmailUnavailableError(email)
    }
  }
}

/**
 * For a list of users, return the account holder if there is an email match.
 */
export async function getAccountHolderFromUsers(
  users: Array<UserIdentifier>
): Promise<UserIdentifier | undefined> {
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const accountMetadata = await getExistingAccounts(
      users.map(user => user.email)
    )
    return users.find(user =>
      accountMetadata.map(metadata => metadata.email).includes(user.email)
    )
  }
}
