import { constants, docUpdates, logging } from "@budibase/backend-core"
import { sdk as proSdk } from "@budibase/pro"
import { DocUpdateEvent } from "@budibase/types"
import { syncUsersToAllApps } from "../sdk/app/applications/sync"

type UpdateCallback = (docId: string) => void

function userGroupUpdates(updateCb?: UpdateCallback) {
  const types = [constants.DocumentType.USER, constants.DocumentType.GROUP]
  const processor = async (update: DocUpdateEvent) => {
    try {
      const docId = update.id
      const isGroup = docId.startsWith(constants.DocumentType.GROUP)
      let userIds: string[]
      if (isGroup) {
        const group = await proSdk.groups.get(docId)
        userIds = group.users?.map(user => user._id) || []
      } else {
        userIds = [docId]
      }
      if (userIds.length > 0) {
        await syncUsersToAllApps(userIds)
      }
      if (updateCb) {
        updateCb(docId)
      }
    } catch (err: any) {
      // if something not found - no changes to perform
      if (err?.status === 404) {
        return
      } else {
        logging.logAlert("Failed to perform user/group app sync", err)
      }
    }
  }
  return { types, processor }
}

export function init(updateCb?: UpdateCallback) {
  const processors = [userGroupUpdates(updateCb)]
  docUpdates.init(processors)
}
