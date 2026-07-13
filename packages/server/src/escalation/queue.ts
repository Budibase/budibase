import zlib from "zlib"
import type { Job } from "bull"
import { readUIMessageStream, type ModelMessage, type UIMessage } from "ai"
import { context, queue, utils } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  AutomationActionStepId,
  ContextUser,
  DocumentType,
  EscalationContextDoc,
  EscalationNotificationDoc,
  EscalationRecipient,
  EscalationSource,
  SEPARATOR,
  SuspendedOperationContext,
} from "@budibase/types"
import { automationQueue } from "../automations/bullboard"
import sdk from "../sdk"
import { prepareAgentChatRun } from "../sdk/workspace/ai/agents"
import { getFullUser } from "../utilities/users"
import * as slack from "./notifications/slack"
import * as discord from "./notifications/discord"
import * as telegram from "./notifications/telegram"
import * as teams from "./notifications/ms-teams"
import { v4 } from "uuid"

export interface EscalationJob {
  phase: "notify" | "waiting"
  escalationId: string
  appId: string
  tenantId: string
  message?: string
  expiresAt?: string
  isTest?: boolean
}

const DEFAULT_CONCURRENCY = 1
const DEFAULT_TIMEOUT_MS = 30000

const getDocId = (escalationId: string): string =>
  `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`

let escalationQueue: queue.BudibaseQueue<EscalationJob> | undefined
let escalationQueueInitialised = false

export function getQueue() {
  if (!escalationQueue) {
    escalationQueue = new queue.BudibaseQueue<EscalationJob>(
      queue.JobQueue.ESCALATION,
      {
        jobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: 1000,
          timeout: DEFAULT_TIMEOUT_MS,
        },
        jobTags: (data: EscalationJob) => ({
          phase: data.phase,
          escalationId: data.escalationId,
          appId: data.appId,
          tenantId: data.tenantId,
          message: data.message,
          isTest: data.isTest,
        }),
      }
    )
  }
  return escalationQueue
}

async function processNotify(job: Job<EscalationJob>) {
  const { escalationId, appId, message } = job.data

  console.log("Escalation notify: picked up", {
    jobId: job.id,
    escalationId,
    appId,
    message,
  })

  await context.doInContext(appId, async () => {
    const db = context.getWorkspaceDB()
    const doc = await db.tryGet<EscalationContextDoc>(getDocId(escalationId))

    if (!doc) {
      console.error("Escalation notify: context doc not found, discarding", {
        escalationId,
        jobId: job.id,
      })
      return
    }

    const resumeJobId = `esc_${escalationId}_resume`

    // TODO: consider one Bull job per recipient rather than batching all in one job -
    // gives independent retry/backoff per channel so a Slack failure doesn't block Teams etc.
    // IF - we do this, then the bulkDocs call would be done first.
    if (doc.recipients?.length) {
      const sentAt = new Date().toISOString()
      const notifDocs: EscalationNotificationDoc[] = doc.recipients.map(
        (recipient: EscalationRecipient) => ({
          _id: `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}${utils.newid()}`,
          escalationId,
          appId,
          tenantId: job.data.tenantId,
          recipient,
          sentAt,
        })
      )
      await db.bulkDocs(notifDocs)

      const notifResults = await Promise.allSettled(
        notifDocs.flatMap(notifDoc => [
          slack.sendSlackNotification({ notifDoc, contextDoc: doc }),
          discord.sendDiscordNotification({ notifDoc, contextDoc: doc }),
          telegram.sendTelegramNotification({ notifDoc, contextDoc: doc }),
          teams.sendMSTeamsNotification({ notifDoc, contextDoc: doc }),
        ])
      )
      notifResults.forEach((result, i) => {
        if (result.status === "rejected") {
          console.error("Escalation notify: notification send failed", {
            index: i,
            escalationId,
            error:
              result.reason instanceof Error
                ? result.reason.message
                : String(result.reason),
          })
        }
      })
    }

    await db.put({ ...doc, updatedAt: new Date().toISOString() })

    const resumeJob: EscalationJob = {
      phase: "waiting",
      escalationId,
      appId,
      tenantId: job.data.tenantId,
      message,
      expiresAt: new Date(Date.now() + doc.delay).toISOString(),
      isTest: job.data.isTest,
    }

    await addEscalationJob(resumeJob, doc.delay, resumeJobId)

    console.log("Escalation notify: resume job enqueued", {
      jobId: job.id,
      escalationId,
      message,
      resumeJobId,
      delayMs: doc.delay,
      expiresAt: new Date(Date.now() + doc.delay).toISOString(),
    })
  })
}

// Delivers the resume outcome to the requester's origin conversation (DM or
// channel) via the agent's provider integration.
async function deliverOperationResult(
  ctx: SuspendedOperationContext,
  text: string
) {
  const channel = ctx.channel
  if (!channel?.provider) {
    console.log("Escalation resume (operation): no channel to deliver to", {
      agentId: ctx.agentId,
    })
    return
  }

  const appId = context.getWorkspaceId()
  if (!appId) {
    console.warn("Escalation resume (operation): missing workspace context")
    return
  }

  const reply = { appId, agentId: ctx.agentId, channel, text }

  try {
    switch (channel.provider) {
      case AgentChannelProvider.MSTEAMS:
        await teams.replyToConversation(reply)
        break
      case AgentChannelProvider.SLACK:
        await slack.replyToConversation(reply)
        break
      case AgentChannelProvider.DISCORD:
        await discord.replyToConversation(reply)
        break
      case AgentChannelProvider.TELEGRAM:
        await telegram.replyToConversation(reply)
        break
      default:
        console.log(
          "Escalation resume (operation): delivery not wired for provider",
          { provider: channel.provider, text }
        )
    }
  } catch (error) {
    console.error("Escalation resume (operation): delivery failed", {
      provider: channel.provider,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

const textMessage = (text: string): UIMessage => ({
  id: v4(),
  role: "assistant",
  parts: [{ type: "text", text }],
})

const messageText = (message: UIMessage): string =>
  message.parts.map(part => (part.type === "text" ? part.text : "")).join("")

// Persists the resumed assistant turn onto the context doc - the durable record
// the originating chat (no live connection at resume time) polls to render.
async function persistResumeResult(escalationId: string, message: UIMessage) {
  const db = context.getWorkspaceDB()
  const doc = await db.tryGet<EscalationContextDoc>(getDocId(escalationId))
  if (!doc) {
    return
  }
  await db.put({
    ...doc,
    resumeResultCompressed: zlib
      .deflateSync(JSON.stringify(message))
      .toString("base64"),
    updatedAt: new Date().toISOString(),
  })
}

async function resumeOperation({
  doc,
  escalationId,
  resolution,
  ctx,
}: {
  doc: EscalationContextDoc
  escalationId: string
  resolution: EscalationContextDoc["resolution"]
  ctx: SuspendedOperationContext
}) {
  const approved = resolution === "resolved" && doc.response?.accepted === true
  const outcome =
    resolution === "expired" ? "expired" : approved ? "approved" : "rejected"

  console.log("Escalation resume (operation):", {
    escalationId,
    outcome,
    agentId: ctx.agentId,
    operationId: ctx.operationId,
  })

  const markEscalationRequestResolved = async (params: {
    status: "completed" | "failed"
    error?: string
  }) => {
    if (!doc.requestId) {
      return
    }
    await sdk.ai.agentRequests
      .updateRequestStatus({
        requestId: doc.requestId,
        isHumanResponse: true,
        ...params,
      })
      .catch(error => {
        console.error(
          "Failed to update agent request status on escalation resume",
          { escalationId, agentId: ctx.agentId, error }
        )
      })
  }

  if (outcome !== "approved") {
    const text =
      outcome === "expired"
        ? "This request timed out without a response."
        : "This request was rejected."
    await persistResumeResult(escalationId, textMessage(text))
    await deliverOperationResult(ctx, text)
    // A rejection is a human decision, not a failure. The escalation did its
    // job. Expiring without any response, though, means the request never
    // actually got resolved.
    await markEscalationRequestResolved(
      outcome === "expired"
        ? { status: "failed", error: "Escalation expired without a response" }
        : { status: "completed" }
    )
    return
  }

  const agent = await sdk.ai.agents.getOrThrow(ctx.agentId)

  // System prompt, not a user message, so the model doesn't distrust the
  // approval as user input.
  const approvalInstructions =
    "ESCALATION APPROVAL: The user's request in this conversation has been " +
    "reviewed and APPROVED by an authorised human reviewer. Approval is already " +
    "granted - do NOT escalate or ask for approval again. Begin your reply by " +
    "briefly confirming the request was approved, then CARRY OUT the user's " +
    "original request: take the action they asked for using " +
    "your available tools. Actually attempt it. If you cannot complete it because " +
    "a required tool or capability is missing, say specifically what is missing " +
    "and that the request could not be completed - never imply it was done when " +
    "it was not."

  const resumeUserId = ctx.userId ?? "escalation-resume"

  // Linked user check. Retrieve or generate transient.
  let user: ContextUser
  try {
    user = await getFullUser(resumeUserId)
  } catch {
    user = {
      _id: resumeUserId,
      globalId: resumeUserId,
      userId: resumeUserId,
      tenantId: context.getTenantId(),
      // Synthetic address for an unlinked transient resume user (no real
      // identity); revisit when user rehydration lands (see TODO below).
      email: `${encodeURIComponent(resumeUserId)}@escalation.budibase.local`,
    }
  }

  // Add in messages to confirm that the request is approved.
  const escalateCallId = `esc_call_${escalationId}`
  const messages: ModelMessage[] = [
    ...ctx.messages,
    {
      role: "assistant",
      content: [
        {
          type: "tool-call",
          toolCallId: escalateCallId,
          toolName: "escalate",
          input: {
            title: doc.title ?? "Escalation",
            summary: doc.summary ?? "",
            reason: "Human approval required",
          },
        },
      ],
    },
    {
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: escalateCallId,
          toolName: "escalate",
          output: {
            type: "json",
            value: {
              status: "approved",
              decision: "approved",
              note:
                "An authorised human reviewer approved this request. Proceed " +
                "to fulfil it and confirm to the user. Do not escalate again.",
            },
          },
        },
      ],
    },
  ]

  const run = await prepareAgentChatRun({
    agent,
    agentId: ctx.agentId,
    modelMessages: messages,
    errorLabel: "escalation resume",
    sessionId: ctx.sessionId,
    user,
    operationId: ctx.operationId,
    escalationResolved: true,
    additionalInstructions: approvalInstructions,
  })

  const pendingToolCalls = new Set<string>()
  const unrecoveredToolFailures = new Set<string>()

  try {
    const result = await run.stream({
      pendingToolCalls,
      unrecoveredToolFailures,
      onToolCallCompleted: ({ toolName, status, input, output }) => {
        if (!doc.requestId) {
          return
        }
        // Fire-and-forget: recordToolCall awaits an LLM summary internally,
        // returning the promise would stall the stream on it between steps.
        sdk.ai.agentRequests
          .recordToolCall({
            requestId: doc.requestId,
            agentId: ctx.agentId,
            sessionId: ctx.sessionId,
            toolName,
            status,
            readableName: run.toolDisplayNames[toolName],
            input,
            output,
          })
          .catch(error => {
            console.error(
              "Failed to record agent request tool call on escalation resume",
              { escalationId, agentId: ctx.agentId, toolName, error }
            )
          })
      },
    })

    // Drain the stream (this runs the approved action) and capture the full
    // assistant turn. Attach toolDisplayNames, as the live chat path does, so tool
    // parts render friendly names not raw ids.
    const sharedMetadata =
      Object.keys(run.toolDisplayNames).length > 0
        ? { toolDisplayNames: run.toolDisplayNames }
        : {}
    let assistantMessage: UIMessage | undefined
    for await (const uiMessage of readUIMessageStream({
      stream: result.toUIMessageStream({
        sendReasoning: true,
        messageMetadata: ({ part }) =>
          part.type === "start" ? sharedMetadata : undefined,
      }),
    })) {
      assistantMessage = uiMessage
    }

    // The resumed stream yields a message with an empty id; give it a real one so
    // it doesn't collide with other resumed messages in the chat's keyed list.
    if (assistantMessage && !assistantMessage.id) {
      assistantMessage.id = v4()
    }

    // Flush the resumed turn into the session-log index (requestIds collected
    // during the drain) so agent-logs reflect the post-approval turn.
    await run.sessionLogIndexer.index()

    const text = assistantMessage ? messageText(assistantMessage) : ""
    await persistResumeResult(
      escalationId,
      assistantMessage ?? textMessage(text)
    )
    await deliverOperationResult(ctx, text)

    const finishReason = await Promise.resolve(result.finishReason).catch(
      error => {
        console.warn(
          "Escalation resume (operation): finishReason unavailable",
          {
            escalationId,
            agentId: ctx.agentId,
            error: error instanceof Error ? error.message : String(error),
          }
        )
        return undefined
      }
    )
    const toolCallsIncomplete =
      pendingToolCalls.size > 0 || finishReason === "tool-calls"
    await markEscalationRequestResolved(
      sdk.ai.agentRequests.resolveFinalRequestStatus({
        toolCallsIncomplete,
        unrecoveredToolFailures,
      })
    )
  } catch (error) {
    await markEscalationRequestResolved({
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

async function processResume(job: Job<EscalationJob>) {
  const { escalationId, appId } = job.data

  await context.doInContext(appId, async () => {
    const db = context.getWorkspaceDB()
    const doc = await db.tryGet<EscalationContextDoc>(getDocId(escalationId))

    if (!doc) {
      console.error("Escalation resume: context doc not found, discarding", {
        escalationId,
        jobId: job.id,
      })
      return
    }

    const resolvedAt = doc.resolvedAt ?? new Date().toISOString()
    const resolution = doc.resolution === "pending" ? "expired" : doc.resolution
    await db.put({ ...doc, resolvedAt, resolution, updatedAt: resolvedAt })

    // Without the snapshot there's nothing to resume - mark it resolved (above)
    // and discard rather than crash the job on an empty inflate/parse.
    if (!doc.contextCompressed) {
      console.error("Escalation resume: context snapshot missing, discarding", {
        escalationId,
        jobId: job.id,
      })
      return
    }

    // Compression used in automations, seems a good fit for ops too
    const suspendedContext = JSON.parse(
      zlib
        .inflateSync(
          Uint8Array.from(Buffer.from(doc.contextCompressed, "base64"))
        )
        .toString()
    )

    if (doc.source === EscalationSource.OPERATION) {
      await resumeOperation({
        doc,
        escalationId,
        resolution,
        ctx: suspendedContext as SuspendedOperationContext,
      })
      return
    }

    console.log("Escalation resume: resuming automation", {
      jobId: job.id,
      escalationId,
      resolution: doc.resolution,
      resolvedAt,
    })

    const { automation, stepResults, state } = suspendedContext

    if (!automation?.definition) {
      console.error(
        "Escalation resume: automation snapshot missing from context, discarding",
        {
          escalationId,
          jobId: job.id,
        }
      )
      return
    }

    // The escalation step halts before its result reaches stepResults; append
    // it here so downstream steps can bind {{ steps.Escalation.* }}.
    const escalationStep = automation.definition.steps.find(
      (s: { id: string }) => s.id === doc.stepId
    )
    const escalationStepResult = {
      id: doc.stepId,
      stepId: AutomationActionStepId.ESCALATION,
      name: escalationStep?.name ?? "Escalation",
      inputs: escalationStep?.inputs ?? {},
      outputs: {
        success: true,
        escalationId,
        resolvedAt: new Date().toISOString(),
        resolution,
        ...(doc.response && { response: doc.response }),
      },
    }

    const resolvedStepResults = [...stepResults, escalationStepResult]

    const escalationStepIndex = automation.definition.steps.findIndex(
      (s: { id: string }) => s.id === doc.stepId
    )
    if (escalationStepIndex === -1) {
      console.error(
        "Escalation resume: stepId not found in automation definition",
        {
          stepId: doc.stepId,
          automationId: doc.automationId,
        }
      )
      return
    }

    const remainingSteps = automation.definition.steps.slice(
      escalationStepIndex + 1
    )

    if (remainingSteps.length === 0) {
      console.log(
        "Escalation resume: no remaining steps, automation complete",
        {
          jobId: job.id,
        }
      )
      return
    }

    // TODO: rehydrate ctx.user from doc.context.userId via
    // sdk.users.getUser(doc.context.userId) and pass it through resumeContext
    // to ensure fresh user data (roles, email etc.) is available to downstream
    // steps that bind to {{ user.* }}.
    const resumeAutomation = {
      ...automation,
      definition: {
        ...automation.definition,
        steps: remainingSteps,
      },
    }

    await automationQueue.add(
      {
        automation: resumeAutomation,
        isResume: true,
        event: {
          appId,
          resumeContext: { stepResults: resolvedStepResults, state },
        },
      },
      {}
    )

    // TODO: emit ESCALATION_EXPIRED (auto) or ESCALATION_RESOLVED (manual) analytics event here
    console.log("Escalation resume: automation re-enqueued", {
      jobId: job.id,
      resolution: doc.resolution,
      remainingSteps: remainingSteps.length,
    })
  })
}

async function processEscalationJob(job: Job<EscalationJob>) {
  if (!job.data?.appId) {
    console.error("Escalation job missing appId, discarding", {
      jobId: job.id,
      phase: job.data?.phase,
    })
    return
  }

  if (job.data.phase === "notify") {
    await processNotify(job)
  } else if (job.data.phase === "waiting") {
    await processResume(job)
  } else {
    console.error("Escalation job unknown phase, discarding", {
      jobId: job.id,
      phase: job.data?.phase,
    })
  }
}

export function init(concurrency = DEFAULT_CONCURRENCY) {
  if (escalationQueueInitialised) {
    return Promise.resolve()
  }
  try {
    escalationQueueInitialised = true
    return getQueue().process(concurrency, processEscalationJob)
  } catch (error) {
    console.error("Error initialising escalation queue", error)
    escalationQueueInitialised = false
    return Promise.resolve()
  }
}

export async function addEscalationJob(
  job: EscalationJob,
  delayMs: number,
  jobId?: string
): Promise<string> {
  init()
  const added = await getQueue().add(job, {
    delay: delayMs,
    ...(jobId && { jobId }),
  })
  return String(added.id)
}
