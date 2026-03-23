import lodashMerge from "lodash/fp/merge"
import { UserGroup } from "@budibase/types"

import * as groupDb from "../../db/groups"
import { groups } from ".."
import { HTTPError } from "@budibase/backend-core"

export async function create(data: UserGroup) {
  const existingGroup = await groupDb.getByName(data.name)

  let groupId
  if (!existingGroup) {
    const createdGroup = await groups.save(data)
    groupId = createdGroup.id!
  } else {
    if (existingGroup.scimInfo?.isSync) {
      throw new HTTPError(`Group is already synched`, 409)
    }

    groupId = existingGroup._id!
    if (existingGroup.users.length) {
      await groups.removeUsers(
        groupId,
        existingGroup.users.map(u => u._id)
      )
    }
    existingGroup.scimInfo = lodashMerge(existingGroup.scimInfo, data.scimInfo)
    await groups.save(existingGroup)
  }
  const group = await groups.get(groupId)
  return group
}
