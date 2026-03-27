import { logging, queue, utils } from "@budibase/backend-core"
import {
  AutomationData,
  AutomationJob,
  Ctx,
  ErrorOpsRequest,
  LogOpsRequest,
} from "@budibase/types"
import { processEvent } from "../../automations/utils"

export async function log(ctx: Ctx<LogOpsRequest, void>) {
  const body = ctx.request.body
  console.trace(body.message, body.data)
  console.debug(body.message, body.data)
  console.info(body.message, body.data)
  console.warn(body.message, body.data)
  console.error(body.message, body.data)
  ctx.status = 204
}

export async function alert(ctx: Ctx<ErrorOpsRequest, void>) {
  const body = ctx.request.body
  logging.logAlert(body.message, new Error(body.message))
  ctx.status = 204
}

export async function error(ctx: Ctx<ErrorOpsRequest, void>) {
  const body = ctx.request.body
  throw new Error(body.message)
}

interface TriggerAutomationExecutionRequest {
  queueName: string
  job: {
    data: AutomationData
    opts: queue.JobOptions
    timestamp?: number
  }
}

interface TriggerAutomationExecutionResponse {
  ok: boolean
}

function toAutomationJob(request: TriggerAutomationExecutionRequest) {
  const generatedId = request.job.opts?.jobId ?? utils.newid()
  const automationJob: AutomationJob = {
    id: generatedId,
    timestamp: request.job.timestamp ?? Date.now(),
    queue: {} as queue.Queue<AutomationData>,
    data: request.job.data,
    opts: request.job.opts || {},
    attemptsMade: 0,
    discard: async () => {},
    remove: async () => {},
    finished: async () => undefined,
  }

  return automationJob
}

function hasErrorResult(
  result: unknown
): result is {
  err: Error
} {
  return (
    !!result &&
    typeof result === "object" &&
    "err" in result &&
    (result as { err?: unknown }).err instanceof Error
  )
}

export async function executeAutomationRun(
  ctx: Ctx<TriggerAutomationExecutionRequest, TriggerAutomationExecutionResponse>
) {
  const request = ctx.request.body
  if (request.queueName !== queue.JobQueue.AUTOMATION) {
    ctx.throw(
      400,
      `Unsupported queue "${request.queueName}", expected "${queue.JobQueue.AUTOMATION}"`
    )
  }
  const job = toAutomationJob(request)
  const result = await processEvent(job)
  if (hasErrorResult(result)) {
    throw result.err
  }
  ctx.body = { ok: true }
}
