import { ContextUser } from "@budibase/types"
import { UIMessage } from "ai"
import { v4 } from "uuid"
import { run as runAgentStep } from "../../src/automations/steps/ai/agent"
import { discordChat } from "../../src/api/controllers/ai/chatConversations"
import { AgentEvalCase, NormalizedAgentTrace } from "./types"
import {
  extractResponseTextFromMessage,
  extractToolCallsFromMessages,
  extractUsageTotalTokens,
} from "./utils"

function toTraceFromMessage({
  surface,
  success,
  latencyMs,
  message,
  responseText,
  error,
  usage,
}: {
  surface: "automation" | "chat"
  success: boolean
  latencyMs: number
  message?: UIMessage
  responseText?: string
  error?: string
  usage?: unknown
}): NormalizedAgentTrace {
  const assistantMessages = message ? [message] : []
  const extractedText = message ? extractResponseTextFromMessage(message) : ""

  return {
    surface,
    success,
    responseText: responseText ?? extractedText,
    ...(error ? { error } : {}),
    latencyMs,
    usageTotalTokens: extractUsageTotalTokens(usage),
    toolCalls: extractToolCallsFromMessages(assistantMessages),
  }
}

export async function runAutomationCase({
  appId,
  agentId,
  testCase,
}: {
  appId: string
  agentId: string
  testCase: AgentEvalCase
}): Promise<NormalizedAgentTrace> {
  const startedAt = Date.now()

  try {
    const result = await runAgentStep({
      inputs: {
        agentId,
        prompt: testCase.prompt,
      },
      appId,
    })

    const latencyMs = Date.now() - startedAt

    return toTraceFromMessage({
      surface: "automation",
      success: result.success,
      latencyMs,
      message: result.message,
      responseText: result.response || "",
      usage: result.usage,
      ...(result.success
        ? {}
        : { error: result.response || "Agent step failed" }),
    })
  } catch (err: any) {
    return {
      surface: "automation",
      success: false,
      responseText: "",
      error: err?.message || String(err),
      latencyMs: Date.now() - startedAt,
      toolCalls: [],
    }
  }
}

function evalUser(): ContextUser {
  const id = `usr_eval_${v4().replaceAll("-", "")}`

  return {
    _id: id,
    userId: id,
    globalId: id,
    email: "eval@budibase.local",
    firstName: "Eval",
    lastName: "Runner",
    roleId: "ADMIN",
    role: {
      _id: "ADMIN",
      name: "Admin",
      permissionId: "ADMIN",
    } as any,
    roles: {},
  }
}

export async function runChatCase({
  chatAppId,
  agentId,
  testCase,
}: {
  chatAppId: string
  agentId: string
  testCase: AgentEvalCase
}): Promise<NormalizedAgentTrace> {
  const startedAt = Date.now()

  try {
    const result = await discordChat({
      chat: {
        chatAppId,
        agentId,
        messages: [
          {
            id: v4(),
            role: "user",
            parts: [{ type: "text", text: testCase.prompt }],
          },
        ],
      },
      user: evalUser(),
    })

    const assistantMessage = [...result.messages]
      .reverse()
      .find(message => message.role === "assistant")

    return toTraceFromMessage({
      surface: "chat",
      success: true,
      latencyMs: Date.now() - startedAt,
      message: assistantMessage,
      responseText:
        result.assistantText ||
        (assistantMessage
          ? extractResponseTextFromMessage(assistantMessage)
          : ""),
    })
  } catch (err: any) {
    return {
      surface: "chat",
      success: false,
      responseText: "",
      error: err?.message || String(err),
      latencyMs: Date.now() - startedAt,
      toolCalls: [],
    }
  }
}
