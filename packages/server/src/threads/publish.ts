import { context } from "@budibase/backend-core"
import { publishWorkspaceInternal } from "../api/controllers/deploy"
import type { PublishWorkspaceJob, WorkerCallback } from "./definitions"
import threadUtils from "./utils"

threadUtils.threadSetup()

export function execute(job: PublishWorkspaceJob, callback: WorkerCallback) {
  context
    .doInWorkspaceContext(job.appId, () => publishWorkspaceInternal(job))
    .then(result => callback(null, result))
    .catch(error => callback(error))
}
