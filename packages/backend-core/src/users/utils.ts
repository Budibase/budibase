import {
  Account,
  CloudAccount,
  isSSOAccount,
  isSSOUser,
  User,
} from "@budibase/types"
import * as pro from "@budibase/pro"
import * as accountSdk from "../accounts"
import env from "../environment"
import { getPlatformUser } from "./lookup"
import { EmailUnavailableError } from "../errors"
import { getTenantId } from "../context"
import { sdk } from "@budibase/shared-core"
import { getAccountByTenantId } from "../accounts"

// extract from shared-core to make easily accessible from backend-core
export const isBuilder = sdk.users.isBuilder
export const isAdmin = sdk.users.isAdmin
export const isAdminOrBuilder = sdk.users.isAdminOrBuilder
export const hasAdminPermissions = sdk.users.hasAdminPermissions
export const hasBuilderPermissions = sdk.users.hasBuilderPermissions
export const hasAppBuilderPermissions = sdk.users.hasAppBuilderPermissions

export async function validateUniqueUser(email: string, tenantId: string) {
  // check budibase users in other tenants
  if (env.MULTI_TENANCY) {
    const tenantUser = await getPlatformUser(email)
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

export async function isPreventPasswordActions(user: User, account?: Account) {
  // when in maintenance mode we allow sso users with the admin role
  // to perform any password action - this prevents lockout
  if (env.ENABLE_SSO_MAINTENANCE_MODE && isAdmin(user)) {
    return false
  }

  // SSO is enforced for all users
  if (await pro.features.isSSOEnforced()) {
    return true
  }

  // Check local sso
  if (isSSOUser(user)) {
    return true
  }

  // Check account sso
  if (!account) {
    account = await accountSdk.getAccountByTenantId(getTenantId())
  }
  return !!(account && account.email === user.email && isSSOAccount(account))
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
