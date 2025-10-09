import { constants, logging, queue } from "@budibase/backend-core"
import { sdk as proSdk } from "@budibase/pro"
import { DocUpdateEvent, WorkspaceUserSyncEvents } from "@budibase/types"
import { syncUsersAcrossWorkspaces } from "../../sdk/workspace/workspaces/sync"

export class UserSyncProcessor {
  private static _queue: queue.BudibaseQueue<{ userId: string }>

  public static get queue() {
    if (!UserSyncProcessor._queue) {
      UserSyncProcessor._queue = new queue.BudibaseQueue<{ userId: string }>(
        queue.JobQueue.BATCH_USER_SYNC_PROCESSOR,
        {
          jobOptions: {
            removeOnComplete: true,
            removeOnFail: 1000,
          },
        }
      )
    }

    return UserSyncProcessor._queue
  }

  init() {
    UserSyncProcessor.queue.process(1, async job => {
      const pendingJobs = await UserSyncProcessor.queue
        .getBullQueue()
        .getWaiting(0, 100)

      const userIds = Array.from(
        new Set([job, ...pendingJobs].map(m => m.data.userId))
      )
      await syncUsersAcrossWorkspaces(userIds)

      for (const job of pendingJobs) {
        await job.remove()
      }
    })
  }

  async add(userIds: string[]) {
    for (const userId of userIds) {
      await UserSyncProcessor.queue.add({ userId })
    }
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
      const userIds: string[] = []

      if (isGroup) {
        if ("userIds" in update.properties) {
          userIds.push(...update.properties.userIds)
        }

        const group = await proSdk.groups.get(docId)
        userIds.push(...(group.users?.map(user => user._id) || []))
      } else {
        userIds.push(docId)
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
