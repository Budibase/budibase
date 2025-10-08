import { cache, constants, logging } from "@budibase/backend-core"
import { sdk as proSdk } from "@budibase/pro"
import { DocUpdateEvent, WorkspaceUserSyncEvents } from "@budibase/types"

const batchProcessingKey = "usersync:batch"

export default function process() {
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

      await cache.append(batchProcessingKey, userIds)
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
  return { events: WorkspaceUserSyncEvents, processor }
}
