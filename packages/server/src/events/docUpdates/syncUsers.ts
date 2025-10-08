import { cache, constants, logging, queue } from "@budibase/backend-core"
import { sdk as proSdk } from "@budibase/pro"
import { DocUpdateEvent, WorkspaceUserSyncEvents } from "@budibase/types"
import { syncUsersAcrossWorkspaces } from "../../sdk/workspace/workspaces/sync"

const batchProcessingKey = "usersync:batch"

let userSyncProcessor: queue.BudibaseQueue<{}> | undefined

function getUserSyncProcessor() {
  if (!userSyncProcessor) {
    userSyncProcessor = new queue.BudibaseQueue<{}>(
      queue.JobQueue.BATCH_USER_SYNC_PROCESSOR,
      {
        maxStalledCount: 3,
        jobOptions: {
          attempts: 3,
          removeOnFail: false,
          removeOnComplete: true,
        },
      }
    )

    userSyncProcessor.process(async () => {
      const userIds = await cache.getArray(batchProcessingKey)
      await syncUsersAcrossWorkspaces(userIds)
    })
  }
  return {
    queueRun: async () => {
      if (!userSyncProcessor) {
        throw new Error("userSyncProcessor is not initialised")
      }

      const waitingCount = await userSyncProcessor
        .getBullQueue()
        .getWaitingCount()
      if (waitingCount) {
        // Another process already queued
        return
      }
      await userSyncProcessor.add({})
    },
  }
}

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

      const batchSyncProcessor = getUserSyncProcessor()
      await batchSyncProcessor.queueRun()
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
