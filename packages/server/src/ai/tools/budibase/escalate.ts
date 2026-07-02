import { context } from "@budibase/backend-core"
import {
  type ChatConversationChannel,
  type EscalationRecipient,
  ESCALATE_TOOL_NAME,
  EscalateToolResultStatus,
  EscalationSource,
  ResolutionStrategy,
  ToolType,
} from "@budibase/types"
import { tool } from "ai"
import type { ModelMessage } from "ai"
import { z } from "zod"
import { escalationProcessor } from "../../../escalation/processor"
import { resolutionStrategyBinding } from "../../../escalation/resolutionStrategies"
import type { AiToolDefinition } from ".."

interface CreateEscalateToolParams {
  agentId: string
  operationId: string
  sessionId: string
  recipients: EscalationRecipient[]
  // How long to wait for a human response before the escalation expires, in ms.
  delayMs: number
  channel?: ChatConversationChannel
  userId?: string
  // Resolves the conversation history to snapshot at the point escalate is called.
  getMessages: () => ModelMessage[]
}

// A fire-and-forget escalation tool. When the operation cannot proceed safely
// (approval required, missing information, low confidence) the model calls this
// to pause the request and hand it to a human. It returns immediately - the run
// completes its turn, and the escalation is resolved asynchronously.
export const createEscalateTool = ({
  agentId,
  operationId,
  sessionId,
  recipients,
  delayMs,
  channel,
  userId,
  getMessages,
}: CreateEscalateToolParams) =>
  tool({
    description:
      "Escalate to a human when you cannot proceed safely - approval is " +
      "required, information is missing, or you have low confidence. The " +
      "request pauses until a human approves or rejects. Call this instead of " +
      "guessing.",
    inputSchema: z.object({
      title: z
        .string()
        .describe("A short label for the request, e.g. 'Procurement request'"),
      summary: z
        .string()
        .describe(
          "A one-line summary of what the user wants, written for the human " +
            "reviewer, e.g. 'Jeff wants to request 1500 pens'"
        ),
      reason: z.string().describe("Why this needs human review"),
    }),
    execute: async ({ title, summary, reason }) => {
      const appId = context.getWorkspaceId()
      const tenantId = context.getTenantId()
      if (!appId) {
        throw new Error("escalate: missing workspace context")
      }

      const { escalationId } = await escalationProcessor.create({
        source: EscalationSource.OPERATION,
        appId,
        tenantId,
        message: summary,
        title,
        summary,
        delay: delayMs,
        recipients,
        resolutionStrategy: resolutionStrategyBinding(
          ResolutionStrategy.FIRST_RESPONSE
        ),
        agentId,
        operationId,
        context: {
          agentId,
          operationId,
          sessionId,
          channel,
          userId,
          messages: getMessages(),
        },
      })

      return {
        status: EscalateToolResultStatus.PENDING_APPROVAL,
        escalationId,
        note: `Escalated for approval: ${reason}. The request is paused until a human responds.`,
      }
    },
  })

// Catalog entry so escalate appears in the builder tools dropdown and can be
// referenced as a binding in operation instructions. The real, run-configured
// tool is swapped in at runtime (see prepareAgentChatRun); this placeholder is
// only reached if the binding is used but no reviewers are configured.
export const createEscalatePlaceholderTool = (): AiToolDefinition => ({
  name: ESCALATE_TOOL_NAME,
  readableName: "Escalate to human",
  description:
    "Pause the request and hand it to a human for approval when the operation " +
    "cannot proceed safely. Reference this where sign-off is required.",
  sourceType: ToolType.ESCALATION,
  sourceLabel: "Escalation",
  tool: tool({
    description:
      "Escalate to a human for approval. Use where the operation must not " +
      "proceed without sign-off.",
    inputSchema: z.object({
      title: z.string(),
      summary: z.string(),
      reason: z.string(),
    }),
    execute: async () => ({
      status: EscalateToolResultStatus.UNAVAILABLE,
      note:
        "Escalation is referenced but no reviewers are configured for this " +
        "operation. Tell the user approval cannot be requested right now.",
    }),
  }),
})

// Used on resume, where the escalation has already been approved. If the model
// follows its instructions and calls escalate again, it gets the approval
// in-band instead of a missing tool or a fresh escalation.
export const createResolvedEscalateTool = () =>
  tool({
    description: "Escalate to a human for approval.",
    inputSchema: z.object({
      title: z.string(),
      summary: z.string(),
      reason: z.string(),
    }),
    execute: async () => ({
      status: EscalateToolResultStatus.ALREADY_APPROVED,
      note:
        "This request has already been reviewed and APPROVED by a human " +
        "reviewer. Do not escalate again - proceed to fulfil it.",
    }),
  })
