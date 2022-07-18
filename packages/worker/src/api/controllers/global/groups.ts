import { UserGroup } from "@budibase/types"
const { difference } = require("lodash/fp")

const { events } = require("@budibase/backend-core")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { groups } = require("@budibase/pro")

exports.save = async function (ctx: any) {
  const db = getGlobalDB()
  let group: UserGroup = ctx.request.body
  const oldGroup: UserGroup = await db.get(group._id)

  let eventFns = []
  // Config does not exist yet
  if (!group._id) {
    group._id = groups.generateUserGroupID(ctx.request.body.name)
    eventFns.push(() => events.group.created(group))
  } else {
    // Get the diff between the old users and new users for
    // event processing purposes
    let uniqueOld = group.users.filter(g => {
      return !oldGroup.users.some(og => {
        return g._id == og._id
      })
    })

    let uniqueNew = oldGroup.users.filter(g => {
      return !group.users.some(og => {
        return g._id == og._id
      })
    })
    let newUsers = uniqueOld.concat(uniqueNew)

    eventFns.push(() => events.group.updated(group))

    if (group.users.length < oldGroup.users.length) {
      eventFns.push(() =>
        events.group.usersDeleted(
          newUsers.map(u => u.email),
          group
        )
      )
    } else if (group.users.length > oldGroup.users.length) {
      eventFns.push(() =>
        events.group.usersAdded(
          newUsers.map(u => u.email),
          group
        )
      )
    }

    if (JSON.stringify(oldGroup.roles) !== JSON.stringify(group.roles)) {
      eventFns.push(() => events.group.permissionsEdited(group.roles))
    }
  }

  try {
    for (const fn of eventFns) {
      await fn()
    }
    const response = await db.put(group)
    ctx.body = {
      _id: response.id,
      _rev: response.rev,
    }
  } catch (err) {
    ctx.throw(400, err)
  }
}

exports.fetch = async function (ctx: any) {
  const db = getGlobalDB()
  const response = await db.allDocs(
    groups.getUserGroupsParams(null, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map((row: any) => row.doc)
}

exports.destroy = async function (ctx: any) {
  const db = getGlobalDB()
  const { id, rev } = ctx.params
  const group = await db.get(id)
  try {
    await db.remove(id, rev)
    await events.group.deleted(group)
    ctx.body = { message: "Group deleted successfully" }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

/**
 * Gets a group by ID from the global database.
 */
exports.find = async function (ctx: any) {
  const db = getGlobalDB()
  try {
    ctx.body = await db.get(ctx.params.id)
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}
