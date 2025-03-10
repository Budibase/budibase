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

export async function creatorsInList(
  users: (User | ContextUser)[],
  groups?: UserGroup[]
) {
  const groupIds = [
    ...new Set(
      users.filter(user => user.userGroups).flatMap(user => user.userGroups!)
    ),
  ]
  const db = context.getGlobalDB()
  groups = await db.getMultiple<UserGroup>(groupIds, { allowMissing: true })
  return users.map(user => isCreatorSync(user, groups))
}

// fetches groups if no provided, but is async and shouldn't be looped with
export async function isCreatorAsync(user: User | ContextUser) {
  let groups: UserGroup[] = []
  if (user.userGroups) {
    const db = context.getGlobalDB()
    groups = await db.getMultiple<UserGroup>(user.userGroups)
  }
  return isCreatorSync(user, groups)
}

export function isCreatorSync(user: User | ContextUser, groups?: UserGroup[]) {
  const isCreatorByUserDefinition = sdk.users.isCreator(user)
  if (!isCreatorByUserDefinition && user) {
    return isCreatorByGroupMembership(user, groups)
  }
  return isCreatorByUserDefinition
}

function isCreatorByGroupMembership(
  user: User | ContextUser,
  groups?: UserGroup[]
) {
  const userGroups = groups?.filter(
    group => user.userGroups?.indexOf(group._id!) !== -1
  )
  if (userGroups && userGroups.length > 0) {
    return userGroups.some(group =>
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
