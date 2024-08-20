import { CloudAccount, ContextUser, User, UserGroup } from "@budibase/types"
import * as accountSdk from "../accounts"
import env from "../environment"
import { getFirstPlatformUser } from "./lookup"
import { EmailUnavailableError } from "../errors"
import { getTenantId } from "../context"
import { sdk } from "@budibase/shared-core"
import { getAccountByTenantId } from "../accounts"
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
 * For the given user id's, return the account holder if it is in the ids.
 */
export async function getAccountHolderFromUserIds(
  userIds: string[]
): Promise<CloudAccount | undefined> {
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const tenantId = getTenantId()
    const account = await getAccountByTenantId(tenantId)
    if (!account) {
      throw new Error(`Account not found for tenantId=${tenantId}`)
    }

    const budibaseUserId = account.budibaseUserId
    if (userIds.includes(budibaseUserId)) {
      return account
    }
  }
}
