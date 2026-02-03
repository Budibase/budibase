import { queue } from "@budibase/backend-core"
import { WorkspaceBackupQueueData } from "@budibase/types"

let backupQueue: queue.BudibaseQueue<WorkspaceBackupQueueData>

export function init() {
  backupQueue = new queue.BudibaseQueue<WorkspaceBackupQueueData>(
    queue.JobQueue.APP_BACKUP,
    {
      maxStalledCount: 3,
      jobOptions: {
        attempts: 3,
        removeOnFail: true,
        removeOnComplete: true,
      },
    }
  )
}

export function getBackupQueue() {
  return backupQueue
}
