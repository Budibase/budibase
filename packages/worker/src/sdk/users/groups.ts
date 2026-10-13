import Joi from "joi"
import { events, HTTPError } from "@budibase/backend-core"
import { features, groups } from "@budibase/pro"
import {
  DocumentType,
  Feature,
  prefixed,
  type UserGroup,
} from "@budibase/types"

interface GroupChanges {
  added: UserGroup[]
  removed: UserGroup[]
}

export const getInitialUserGroups = async ({
  userGroups,
}: {
  userGroups?: string[]
}) => {
  if (
    userGroups === undefined ||
    (Array.isArray(userGroups) && userGroups.length === 0)
  ) {
    const defaultGroup = await groups.getDefaultGroup()
    return defaultGroup?._id ? [defaultGroup._id] : userGroups
  }
  return userGroups
}

export const validateGroupChanges = async ({
  userGroups,
  previousGroups = [],
}: {
  userGroups?: string[]
  previousGroups?: string[]
}): Promise<GroupChanges> => {
  if (userGroups === undefined) {
    return { added: [], removed: [] }
  }

  const { error } = Joi.array()
    .items(Joi.string().pattern(new RegExp(`^${prefixed(DocumentType.GROUP)}`)))
    .unique()
    .validate(userGroups)
  if (error) {
    throw new HTTPError(`Invalid userGroups: ${error.message}`, 400)
  }

  const addedIds = userGroups.filter(id => !previousGroups.includes(id))
  const removedIds = previousGroups.filter(id => !userGroups.includes(id))
  const changedIds = [...new Set([...addedIds, ...removedIds])]
  if (!changedIds.length) {
    return { added: [], removed: [] }
  }

  await features.checkFeature(Feature.USER_GROUPS)
  const changedGroups = await groups.getBulk(changedIds, { enriched: false })
  if (
    changedGroups.length !== changedIds.length ||
    changedGroups.some(group => group.scimInfo?.isSync)
  ) {
    throw new HTTPError("Group not found or managed by SCIM", 404)
  }

  return {
    added: changedGroups.filter(group => addedIds.includes(group._id!)),
    removed: changedGroups.filter(group => removedIds.includes(group._id!)),
  }
}

export const recordGroupChanges = async ({
  changes,
  userIds,
}: {
  changes: GroupChanges
  userIds: string[]
}) => {
  if (!userIds.length) {
    return
  }
  for (const group of changes.added) {
    await events.group.usersAdded(userIds.length, group, userIds)
  }
  for (const group of changes.removed) {
    await events.group.usersDeleted(userIds.length, group, userIds)
  }
}
