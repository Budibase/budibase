import {
  ToolValidationResultStatus,
  type ChatConversationRequest,
} from "@budibase/types"
import { getToolName, isToolUIPart } from "ai"
import isEqual from "lodash/isEqual"
import type { RequesterValidationRuntime } from "../../../../ai/tools"

export interface ConfirmedToolCall {
  toolName: string
  sourceId?: string
  args: unknown
}

export interface RequesterValidationContext {
  consume: (call: ConfirmedToolCall) => boolean
}

const AFFIRMATIVE_REPLIES = new Set([
  "yes",
  "yes please",
  "yep",
  "sure",
  "ok",
  "okay",
  "confirm",
  "go ahead",
  "proceed",
  "do it",
  "please do",
])

export const getRequesterConfirmedToolCalls = ({
  chat,
  latestQuestion,
}: {
  chat?: ChatConversationRequest
  latestQuestion: string
}): ConfirmedToolCall[] => {
  if (!chat?.messages.length) {
    return []
  }
  const reply = latestQuestion
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .trim()
  if (!AFFIRMATIVE_REPLIES.has(reply)) {
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
        toolName: getToolName(part),
        sourceId: output.sourceId,
        args: part.input,
      },
    ]
  })
}

export const createRequesterValidationContext = (
  confirmedCalls: ConfirmedToolCall[]
): RequesterValidationContext => {
  const consumed = new Set<number>()
  return {
    consume: call => {
      const index = confirmedCalls.findIndex(
        (confirmed, index) =>
          !consumed.has(index) &&
          confirmed.toolName === call.toolName &&
          confirmed.sourceId === call.sourceId &&
          isEqual(confirmed.args, call.args)
      )
      if (index === -1) {
        return false
      }
      consumed.add(index)
      return true
    },
  }
}

export const createRequesterValidationRuntime = ({
  toolName,
  readableName,
  sourceId,
  validationContext,
}: {
  toolName: string
  readableName?: string
  sourceId?: string
  validationContext: RequesterValidationContext
}): RequesterValidationRuntime => ({
  intercept: async input => {
    if (validationContext.consume({ toolName, sourceId, args: input })) {
      return undefined
    }

    return {
      status: ToolValidationResultStatus.PENDING,
      title: `Review ${readableName ?? toolName}`,
      toolName,
      sourceId,
      arguments: input,
      note:
        "The action has not run. Show the user every proposed argument and " +
        "ask naturally whether they want you to go ahead. Do not use an " +
        "approval code or imply that the action already ran.",
    }
  },
})
