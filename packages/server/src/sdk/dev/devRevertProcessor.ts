import {
  cache,
  context,
  db as dbCore,
  events,
  queue,
} from "@budibase/backend-core"
import { App, DevRevertQueueData, DocumentType } from "@budibase/types"
import env from "../../environment"

let _devRevertProcessor: DevRevertProcessor | undefined

class DevRevertProcessor extends queue.QueuedProcessor<DevRevertQueueData> {
  constructor() {
    super(queue.JobQueue.DEV_REVERT_PROCESSOR, {
      maxAttempts: 3,
      removeOnFail: false,
      removeOnComplete: false,
      maxStalledCount: 3,
      waitForCompletionMs: 10000,
    })
  }

  processFn = async (
    data: DevRevertQueueData
  ): Promise<{ message: string }> => {
    return await context.doInAppContext(data.appId, () => this.revertApp(data))
  }

  async revertApp(data: DevRevertQueueData): Promise<{ message: string }> {
    const { appId } = data
    const productionAppId = dbCore.getProdAppID(appId)

    // App must have been deployed first
    try {
      const db = context.getProdAppDB({ skip_setup: true })
      const exists = await db.exists()
      if (!exists) {
        throw new Error("App must be deployed to be reverted.")
      }
      const deploymentDoc = await db.get<any>(DocumentType.DEPLOYMENTS)
      if (
        !deploymentDoc.history ||
        Object.keys(deploymentDoc.history).length === 0
      ) {
        throw new Error("No deployments for app")
      }
    } catch (err) {
      throw new Error("App has not yet been deployed")
    }

    const replication = new dbCore.Replication({
      source: productionAppId,
      target: appId,
    })

    try {
      if (env.COUCH_DB_URL) {
        // in-memory db stalls on rollback
        await replication.rollback()
      }

      // update appID in reverted app to be dev version again
      const db = context.getAppDB()
      const appDoc = await db.get<App>(DocumentType.APP_METADATA)
      appDoc.appId = appId
      appDoc.instance._id = appId
      await db.put(appDoc)
      await cache.app.invalidateAppMetadata(appId)
      await events.app.reverted(appDoc)

      return { message: "Reverted changes successfully." }
    } catch (err) {
      throw new Error(`Unable to revert. ${err}`)
    } finally {
      await replication.close()
    }
  }
}

export function devRevertProcessor(): DevRevertProcessor {
  if (!_devRevertProcessor) {
    _devRevertProcessor = new DevRevertProcessor()
  }
  return _devRevertProcessor
}

export async function revertDevChanges(data: DevRevertQueueData) {
  const processor = devRevertProcessor()
  const result = await processor.execute(data)
  return result
}
