import { csv } from "@budibase/backend-core"
import {
  BulkAddUsersToGroupRequest,
  BulkAddUsersToGroupResponse,
  Ctx,
  DatabaseQueryOpts,
  SearchGroupRequest,
  SearchGroupResponse,
  SearchUserGroupResponse,
  UpdateGroupAppRequest,
  UpdateGroupAppResponse,
  UserCtx,
  UserGroup,
} from "@budibase/types"
import { getGroupUsers } from "../../../db/groups"
import * as groups from "../../../sdk/groups"
import { db } from "../../../sdk/users"

export async function save(ctx: UserCtx) {
  const group: UserGroup = ctx.request.body
  group.name = group.name.trim()

  // don't allow updating the roles through this endpoint
  delete group.roles
  if (group._id) {
    const oldGroup = await groups.get(group._id)
    group.roles = oldGroup.roles
    group.scimInfo = oldGroup.scimInfo
  }
  const response = await groups.save(group)
  ctx.body = {
    _id: response.id,
    _rev: response.rev,
  }
}

export async function updateGroupUsers(ctx: UserCtx) {
  const groupId = ctx.params.groupId
  const toAdd = ctx.request.body.add,
    toRemove = ctx.request.body.remove
  if (
    (toAdd && !Array.isArray(toAdd)) ||
    (toRemove && !Array.isArray(toRemove))
  ) {
    ctx.throw(400, "Must supply a list of users to add or to remove")
  }
  let added, removed
  if (toAdd) {
    added = await groups.addUsers(groupId, toAdd)
  }
  if (toRemove) {
    removed = await groups.removeUsers(groupId, toRemove)
  }
  ctx.body = { added, removed }
}

export async function updateGroupApps(
  ctx: UserCtx<UpdateGroupAppRequest, UpdateGroupAppResponse>
) {
  const groupId = ctx.params.groupId
  const toAdd = ctx.request.body.add,
    toRemove = ctx.request.body.remove
  if (
    (toAdd && !Array.isArray(toAdd)) ||
    (toRemove && !Array.isArray(toRemove))
  ) {
    ctx.throw(
      400,
      "Must supply a list of objects, with appId and roleId to add or remove"
    )
  }
  ctx.body = await groups.updateGroupApps(groupId, {
    appsToAdd: toAdd,
    appsToRemove: toRemove,
  })
}

export async function fetch(ctx: Ctx<SearchGroupRequest, SearchGroupResponse>) {
  ctx.body = { data: await groups.fetch() }
}

export async function destroy(ctx: UserCtx) {
  const { groupId, rev } = ctx.params
  try {
    await groups.remove(groupId, rev)
    ctx.body = { message: "Group deleted successfully" }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

/**
 * Gets a group by ID from the global database.
 */
export async function find(ctx: UserCtx) {
  try {
    ctx.body = await groups.get(ctx.params.groupId)
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export async function searchUsers(ctx: Ctx<{}, SearchUserGroupResponse>) {
  const { pageSize = 10, bookmark, emailSearch } = ctx.request.query as any
  const groupId = ctx.params.groupId

  const params: DatabaseQueryOpts = { limit: pageSize + 1 }

  const users = await getGroupUsers(groupId, {
    ...params,
    emailSearch,
    bookmark,
  })

  const nextBookmark = emailSearch
    ? users[pageSize]?.email
    : users[pageSize]?._id
  const hasNextPage = !!nextBookmark

  ctx.body = {
    users: users.slice(0, pageSize),
    bookmark: nextBookmark,
    hasNextPage,
  }
}

export async function bulkAddUsersFromCsv(
  ctx: UserCtx<BulkAddUsersToGroupRequest, BulkAddUsersToGroupResponse>
) {
  const { groupId } = ctx.params
  const { csvContent } = ctx.request.body

  if (csvContent === undefined || csvContent.trim().length === 0) {
    ctx.throw(400, "CSV is empty")
  }

  const csvData = await csv.jsonFromCsvString(csvContent, {
    allowSingleColumn: true,
  })

  if (!csvData || csvData.length === 0) {
    ctx.throw(400, "CSV file is invalid")
  }

  // Find email column
  const headers = Object.keys(csvData[0])
  const emailColumn = headers.find(header =>
    /^(email|e-mail|email address|mail|e_mail)$/i.test(header.trim())
  )
  if (!emailColumn) {
    ctx.throw(400, "CSV file must contain an email column")
  }

  // Extract emails from CSV
  const emails = Array.from(
    new Set(
      csvData
        .map(row => row[emailColumn])
        .filter(
          email => email && typeof email === "string" && email.trim().length > 0
        )
        .map(email => email.trim())
    )
  )
  if (emails.length === 0) {
    ctx.throw(400, "No valid email addresses found in CSV")
  }

  // Check if group exists
  try {
    await groups.get(groupId)
  } catch (err: any) {
    if (err.status === 404) {
      ctx.throw(404, "Group not found")
    } else {
      throw err
    }
  }

  // Find existing users by email
  const added: { _id: string; email: string }[] = []
  const skipped: { email: string; reason: string }[] = []
  const userIds: string[] = []

  const users = await Promise.all(emails.map(email => db.getUserByEmail(email)))

  for (const email of emails) {
    const user = users.find(u => u?.email === email)
    if (user) {
      added.push({
        _id: user._id!,
        email: user.email,
      })
      userIds.push(user._id!)
    } else {
      skipped.push({
        email,
        reason: "User not found",
      })
    }
  }

  // Add users to group if any were found
  if (userIds.length > 0) {
    await groups.addUsers(groupId, userIds)
  }

  ctx.body = {
    added,
    skipped,
  }
}
