import { cache, constants, logging, queue } from "@budibase/backend-core"
import { sdk as proSdk } from "@budibase/pro"
import { DocUpdateEvent, WorkspaceUserSyncEvents } from "@budibase/types"
import { syncUsersAcrossWorkspaces } from "../../sdk/workspace/workspaces/sync"

export class UserSyncProcessor {
  private static batchProcessingKey = "usersync:batch"
  private static _queue: queue.BudibaseQueue<{}>

  public static get queue() {
    if (!UserSyncProcessor._queue) {
      UserSyncProcessor._queue = new queue.BudibaseQueue<{}>(
        queue.JobQueue.BATCH_USER_SYNC_PROCESSOR,
        {
          jobOptions: {
            attempts: 3,
            removeOnComplete: true,
            removeOnFail: true,
          },
        }
      )
    }

    return UserSyncProcessor._queue
  }

  init() {
    UserSyncProcessor.queue.process(async job => {
      const userIds = await cache.getArray(UserSyncProcessor.batchProcessingKey)
      await syncUsersAcrossWorkspaces(userIds)
      await cache.removeFromArray(UserSyncProcessor.batchProcessingKey, userIds)
      await job.moveToCompleted()
    })
  }

  async add(userIds: string[]) {
    if (userIds.length) {
      await cache.append(UserSyncProcessor.batchProcessingKey, userIds)
    }
    await this.queueRun()
  }

  private async queueRun() {
    const waitingCount = await UserSyncProcessor.queue
      .getBullQueue()
      .getWaitingCount()
    if (waitingCount) {
      // Another process already queued
      return
    }
    await UserSyncProcessor.queue.add({})
  }
}

let userSyncProcessor: UserSyncProcessor

export function getUserSyncProcessor(): UserSyncProcessor {
  if (!userSyncProcessor) {
    userSyncProcessor = new UserSyncProcessor()
    userSyncProcessor.init()
  }
  return userSyncProcessor
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

      const batchSyncProcessor = getUserSyncProcessor()
      await batchSyncProcessor.add(userIds)
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
