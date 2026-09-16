import {
  ToolValidationResultStatus,
  type ChatConversationRequest,
} from "@budibase/types"
import { getToolName, isToolUIPart, tool, type ToolSet } from "ai"
import { z } from "zod"
import type { RequesterValidationRuntime } from "../../../../ai/tools"

export const REQUESTER_VALIDATION_TOOL_NAME = "confirm_requester_action"

export interface PendingRequesterToolCall {
  toolCallId: string
  toolName: string
  sourceId?: string
  args: unknown
}

export interface RequesterValidationContext {
  pendingCalls: PendingRequesterToolCall[]
}

export const getPendingRequesterToolCalls = (
  chat?: ChatConversationRequest
): PendingRequesterToolCall[] => {
  if (!chat?.messages.length) {
    return []
  }
  const latestUserIndex = chat.messages.findLastIndex(
    message => message.role === "user"
  )
  if (latestUserIndex < 1) {
    return []
  }
  const proposal = chat.messages[latestUserIndex - 1]
  if (proposal?.role !== "assistant") {
    return []
  }

  return proposal.parts.flatMap(part => {
    if (!isToolUIPart(part) || part.state !== "output-available") {
      return []
    }
    const output = part.output as
      | { status?: string; sourceId?: string }
      | undefined
    if (output?.status !== ToolValidationResultStatus.PENDING) {
      return []
    }
    return [
      {
        toolCallId: part.toolCallId,
        toolName: getToolName(part),
        sourceId: output.sourceId,
        args: part.input,
      },
    ]
  })
}

export const createRequesterValidationRuntime = ({
  toolName,
  readableName,
  sourceId,
}: {
  toolName: string
  readableName?: string
  sourceId?: string
}): RequesterValidationRuntime => ({
  intercept: async (input, { toolCallId }) => ({
    status: ToolValidationResultStatus.PENDING,
    title: `Review ${readableName ?? toolName}`,
    toolName,
    sourceId,
    arguments: input,
    validationToolCallId: toolCallId,
    note:
      "The action has not run. Show the user every proposed argument and " +
      "ask naturally whether they want you to go ahead. Do not use an " +
      "approval code or imply that the action already ran.",
  }),
})

export const createRequesterValidationResolutionTool = ({
  pendingCalls,
  executableTools,
}: {
  pendingCalls: PendingRequesterToolCall[]
  executableTools: ToolSet
}) => {
  const pendingById = new Map(
    pendingCalls.map(pending => [pending.toolCallId, pending])
  )
  return tool({
    description:
      "Execute one previously proposed action only when the user's latest " +
      "message clearly and unambiguously confirms that exact action. Do " +
      "not call this for a rejection, a parameter change, an unrelated " +
      "message, or an ambiguous response. Available internal action IDs: " +
      pendingCalls.map(pending => pending.toolCallId).join(", "),
    inputSchema: z.object({
      actionId: z.string().describe("The internal action ID to execute"),
    }),
    execute: async ({ actionId }, executionOptions) => {
      const pending = pendingById.get(actionId)
      if (!pending) {
        return { error: "That proposed action is no longer available" }
      }
      pendingById.delete(actionId)
      const target = executableTools[pending.toolName]
      if (!target?.execute) {
        return { error: "The proposed action is no longer available" }
      }
      return await target.execute(pending.args, {
        ...executionOptions,
        toolCallId: pending.toolCallId,
      })
    },
  })
}
