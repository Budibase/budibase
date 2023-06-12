import { constants, logging } from "@budibase/backend-core"
import { sdk as proSdk } from "@budibase/pro"
import { DocUpdateEvent, UserGroupSyncEvents } from "@budibase/types"
import { syncUsersToAllApps } from "../../sdk/app/applications/sync"
import { UpdateCallback } from "./processors"

export default function process(updateCb?: UpdateCallback) {
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
      }
      // The user has already been sync in another process
      else if (err?.status === 409) {
        return
      } else {
        logging.logAlert("Failed to perform user/group app sync", err)
      }
    }
  }
  return { events: UserGroupSyncEvents, processor }
}
