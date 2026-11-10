import { context } from "@budibase/backend-core"
import { backups } from "@budibase/pro"
import { publishWorkspaceInternal } from "../api/controllers/deploy"
import type { PublishWorkspaceJob, WorkerCallback } from "./definitions"
import threadUtils from "./utils"

threadUtils.threadSetup()

export function execute(job: PublishWorkspaceJob, callback: WorkerCallback) {
  backups.initQueue()
  const run = () =>
    context.doInWorkspaceContext(job.appId, () => publishWorkspaceInternal(job))
  const { identity } = job
  const result = identity
    ? context.identity.doInIdentityContext(identity, run)
    : run()
  result.then(result => callback(null, result)).catch(error => callback(error))
}
