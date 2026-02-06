import {
  db as dbCore,
  DocumentType,
  SEPARATOR,
  tenancy,
  UNICODE_MAX,
  users as usersCore,
  utils,
} from "@budibase/backend-core"
import {
  DatabaseQueryOpts,
  EnrichedUserGroup,
  UserGroup,
} from "@budibase/types"
import { createGroupUserLookupView, GroupViewMode } from "./views"

const GROUP_PREFIX = `${DocumentType.GROUP}${SEPARATOR}`

const getAppIDs = async () => {
  const workspaceIds = await dbCore.getAllWorkspaces({
    dev: true,
    efficient: true,
    idsOnly: true,
  })
  // get all the production IDs, groups only think in production workspaces
  return workspaceIds.map(id => dbCore.getProdWorkspaceID(id))
}

type UserGroupsViewParams = DatabaseQueryOpts & {
  emailSearch?: string
  bookmark?: string
}
/**
 * Gets parameters for retrieving groups.
 */
export function getUserGroupsParams(
  groupId: string | null | undefined,
  otherProps = {}
) {
  if (!groupId) {
    groupId = ""
  }
  const start = groupId?.startsWith(DocumentType.GROUP) ? "" : GROUP_PREFIX
  return {
    ...otherProps,
    startkey: `${start}${groupId}`,
    endkey: `${start}${groupId}${UNICODE_MAX}`,
  }
}

/**
 * Gets parameters for retrieving groups.
 */
export function getGroupUsersParams(
  groupId: string,
  otherProps: UserGroupsViewParams = {}
): DatabaseQueryOpts {
  if (!groupId) {
    groupId = ""
  }
  const { emailSearch, bookmark, ...props } = otherProps

  if (!emailSearch) {
    return {
      ...otherProps,
      startkey: `${GroupViewMode.SEARCH_BY_ID}${groupId}`,
      endkey: `${GroupViewMode.SEARCH_BY_ID}${groupId}${UNICODE_MAX}`,
      startkey_docid: bookmark,
    }
  }

  const params = {
    ...props,
    startkey: `${GroupViewMode.SEARCH_BY_EMAIL}${groupId}${
      bookmark || emailSearch
    }`,
    endkey: `${GroupViewMode.SEARCH_BY_EMAIL}${groupId}${emailSearch}${UNICODE_MAX}`,
  }
  return params
}

/**
 * Generates a new user group ID
 * @returns {string} The new user group ID which info can be stored under.
 */
export function generateUserGroupID() {
  return `${GROUP_PREFIX}${utils.newid()}`
}

export async function getGroupUsers(
  groupId: string,
  params?: UserGroupsViewParams
) {
  const db = tenancy.getGlobalDB()

  const userDocs = (await dbCore.queryView(
    dbCore.ViewName.USER_BY_GROUP,
    getGroupUsersParams(groupId, params),
    db,
    createGroupUserLookupView,
    { arrayResponse: true }
  )) as { userId: string; email: string }[]

  return (
    userDocs.map((doc: any) => ({
      _id: doc.userId,
      email: doc.email,
    })) || []
  )
}

async function enrichGroup(
  group: UserGroup,
  appIds: string[]
): Promise<EnrichedUserGroup> {
  const users = await getGroupUsers(group._id!)
  if (group.roles) {
    group.roles = Object.fromEntries(
      Object.entries(group.roles).filter(([appId]) => appIds.includes(appId))
    )
  }
  return { ...group, users }
}

async function cleanupUsers(group: UserGroup) {
  // get the users that need cleaned up
  const enriched = await enrichGroup(group, await getAppIDs())
  const userIds = enriched.users?.map(user => user._id) as string[]
  const users = await usersCore.bulkGetGlobalUsersById(userIds)
  const toUpdate = []
  for (let user of users) {
    if (!user.userGroups) {
      continue
    }
    const lengthBefore = user.userGroups.length
    user.userGroups = user.userGroups.filter(groupId => groupId !== group._id)
    if (user.userGroups.length !== lengthBefore) {
      toUpdate.push(user)
    }
  }
  if (toUpdate.length) {
    await usersCore.bulkUpdateGlobalUsers(toUpdate)
  }
}

async function getAllGroupDocuments() {
  const db = tenancy.getGlobalDB()

  return (
    await db.allDocs<UserGroup>(
      getUserGroupsParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc!)
}

export async function fetch(): Promise<EnrichedUserGroup[]> {
  const [groups, appIds] = await Promise.all([
    getAllGroupDocuments(),
    getAppIDs(),
  ])
  const enrichedGroups: Promise<EnrichedUserGroup>[] = []
  for (let group of groups) {
    enrichedGroups.push(enrichGroup(group, appIds))
  }
  return await Promise.all(enrichedGroups)
}

export async function get(groupId: string): Promise<EnrichedUserGroup> {
  const db = tenancy.getGlobalDB()
  const [group, appIds] = await Promise.all([
    db.get<UserGroup>(groupId),
    getAppIDs(),
  ])
  return await enrichGroup(group, appIds)
}

export async function getBulk(
  groupIds: string[],
  opts: { enriched: true }
): Promise<EnrichedUserGroup[]>
export async function getBulk(
  groupIds: string[],
  opts: { enriched: false }
): Promise<UserGroup[]>
export async function getBulk(
  groupIds: string[],
  opts?: { enriched?: boolean }
): Promise<UserGroup[]>
export async function getBulk(
  groupIds: string[],
  opts: { enriched?: boolean } = { enriched: true }
): Promise<UserGroup[] | EnrichedUserGroup[]> {
  const db = tenancy.getGlobalDB()
  const [groups, appIds] = await Promise.all([
    db.getMultiple<UserGroup>(groupIds, {
      allowMissing: true,
    }),
    getAppIDs(),
  ])
  if (opts?.enriched) {
    const enrichedGroups: Promise<EnrichedUserGroup>[] = []
    for (let group of groups) {
      enrichedGroups.push(enrichGroup(group, appIds))
    }
    return await Promise.all(enrichedGroups)
  } else {
    return groups
  }
}

export async function save(
  group: UserGroup
): Promise<{ id: string; rev: string }> {
  const db = tenancy.getGlobalDB()

  return await db.put(group)
}

export async function bulkSave(
  groups: UserGroup[]
): Promise<{ id: string; rev?: string }[]> {
  const db = tenancy.getGlobalDB()
  return await db.bulkDocs(groups)
}

export async function destroy(
  groupId: string,
  revision: string
): Promise<{ id: string }> {
  const db = tenancy.getGlobalDB()
  const group = await db.get<UserGroup>(groupId)
  let resp = await db.remove(groupId, revision)
  await cleanupUsers(group)
  return resp
}

export async function getByName(
  name: string
): Promise<EnrichedUserGroup | undefined> {
  const lcName = name.toLowerCase()
  const [groups, appIds] = await Promise.all([
    getAllGroupDocuments(),
    getAppIDs(),
  ])
  const group = groups.find(group => group.name.toLowerCase() === lcName)
  if (!group) {
    return
  }
  return await enrichGroup(group, appIds)
}
