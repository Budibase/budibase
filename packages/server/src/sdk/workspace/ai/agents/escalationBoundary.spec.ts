import type {
  LanguageModelV3FinishReason,
  LanguageModelV3GenerateResult,
  LanguageModelV3Usage,
} from "@ai-sdk/provider"
import { stepCountIs, tool, ToolLoopAgent, type ToolSet } from "ai"
import { MockLanguageModelV3 } from "ai/test"
import { z } from "zod"
import {
  EscalateToolResultStatus,
  ToolExecutionPrincipal,
  ToolType,
  type AgentExecutionContext,
} from "@budibase/types"
import {
  toToolSet,
  type AiToolDefinition,
  type EscalationGateRuntime,
  type ToolAuthorizationRuntime,
} from "../../../../ai/tools"

const FINISH_TOOL_CALLS: LanguageModelV3FinishReason = {
  unified: "tool-calls",
  raw: undefined,
}

const USAGE: LanguageModelV3Usage = {
  inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 1, text: 1, reasoning: 0 },
}

// The parallelism hole: a model can emit escalate and a mutating tool in one
// parallel batch, and streaming dispatches the action before the escalate
// chunk even arrives. This never showed up in the other agent specs because
// they mock ToolLoopAgent itself - dispatch is never exercised. Using
// MockLanguageModelV3 under a REAL ToolLoopAgent reproduces true dispatch
// ordering, which is how the reactive wrapper passed every test yet failed
// live. The gate runs inside the wrapped execute, so batch composition and
// chunk timing cannot matter.
describe("escalation approval boundary", () => {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const CHUNK_GAP_MS = 50

  const executionContext: AgentExecutionContext = {
    tenantId: "default",
    workspaceId: "app_test",
    agentId: "agent_test",
    operationId: "operation_test",
    conversationId: "session_test",
    requester: { executorRole: "BASIC" },
  }

  const buildToolDefs = () => {
    const createdRows: unknown[] = []
    const defs: AiToolDefinition[] = [
      {
        name: "escalate",
        description: "Escalate to a human for approval.",
        sourceType: ToolType.ESCALATION,
        executionPolicy: { mode: "admin" },
        tool: tool({
          description: "Escalate to a human for approval.",
          inputSchema: z.object({ reason: z.string() }),
          execute: async () => ({ status: "pending_approval" }),
        }),
      },
      {
        name: "create_row",
        description: "Create a row.",
        sourceType: ToolType.INTERNAL_TABLE,
        executionPolicy: { mode: "admin" },
        tool: tool({
          description: "Create a row.",
          inputSchema: z.object({ name: z.string() }),
          execute: async ({ name }) => {
            createdRows.push(name)
            return { created: true }
          },
        }),
      },
    ]
    return { defs, createdRows }
  }

  // Both calls in one response, action listed first - the ordering live
  // Gemini produces.
  const batchingModel = () =>
    new MockLanguageModelV3({
      doGenerate: async (): Promise<LanguageModelV3GenerateResult> => ({
        content: [
          {
            type: "tool-call" as const,
            toolCallId: "call_create",
            toolName: "create_row",
            input: JSON.stringify({ name: "Jeff Man" }),
          },
          {
            type: "tool-call" as const,
            toolCallId: "call_escalate",
            toolName: "escalate",
            input: JSON.stringify({ reason: "needs sign-off" }),
          },
        ],
        finishReason: FINISH_TOOL_CALLS,
        usage: USAGE,
        warnings: [],
      }),
    })

  // Same batch, but delivered as separate chunks with a network-like gap -
  // this is what production actually does.
  const streamingModel = () =>
    new MockLanguageModelV3({
      doStream: async () => ({
        stream: new ReadableStream({
          async start(controller) {
            controller.enqueue({ type: "stream-start", warnings: [] })
            controller.enqueue({
              type: "tool-call",
              toolCallId: "call_create",
              toolName: "create_row",
              input: JSON.stringify({ name: "Jeff Man" }),
            })
            await sleep(CHUNK_GAP_MS)
            controller.enqueue({
              type: "tool-call",
              toolCallId: "call_escalate",
              toolName: "escalate",
              input: JSON.stringify({ reason: "needs sign-off" }),
            })
            controller.enqueue({
              type: "finish",
              finishReason: FINISH_TOOL_CALLS,
              usage: USAGE,
            })
            controller.close()
          },
        }) as any,
      }),
    })

  const agentFor = (model: ReturnType<typeof batchingModel>, tools: ToolSet) =>
    new ToolLoopAgent({
      model,
      tools,
      toolChoice: "auto" as const,
      stopWhen: stepCountIs(1),
    })

  it("ungated: the action executes in the same step as escalate", async () => {
    const { defs, createdRows } = buildToolDefs()

    const result = await agentFor(batchingModel(), toToolSet(defs)).generate({
      prompt: "Create officer Jeff Man.",
    })

    expect(result.steps[0].toolCalls.map(call => call.toolName)).toEqual([
      "create_row",
      "escalate",
    ])
    expect(createdRows).toEqual(["Jeff Man"])
  })

  it("ungated streaming: the action executes before escalate even arrives", async () => {
    const { defs, createdRows } = buildToolDefs()

    const result = await agentFor(
      streamingModel() as any,
      toToolSet(defs)
    ).stream({
      prompt: "Create officer Jeff Man.",
    })
    await result.consumeStream()

    expect(createdRows).toEqual(["Jeff Man"])
  })

  it("gated: the gate refuses at dispatch in the streaming path, after authorization", async () => {
    const { defs, createdRows } = buildToolDefs()
    const events: string[] = []

    const runtimes = new Map<string, ToolAuthorizationRuntime>()
    runtimes.set("create_row", {
      executionContext,
      principal: ToolExecutionPrincipal.ADMIN,
      authorize: async () => {
        events.push("authorize")
      },
    })
    defs[1].authorization = {
      permissionType: "READ" as never,
      permissionLevel: "READ" as never,
    }

    const intercepted: Array<{ input: unknown; toolCallId: string }> = []
    const gates = new Map<string, EscalationGateRuntime>()
    gates.set("create_row", {
      intercept: async (input, { toolCallId }) => {
        events.push("gate")
        intercepted.push({ input, toolCallId })
        return {
          status: EscalateToolResultStatus.PENDING_APPROVAL,
          escalationId: "esc_test",
          title: "Approval required: create_row",
          summary: "Jeff Man",
          note: "paused for approval",
        }
      },
    })

    const result = await agentFor(
      streamingModel() as any,
      toToolSet(defs, runtimes, gates)
    ).stream({
      prompt: "Create officer Jeff Man.",
    })
    await result.consumeStream()
    const steps = await result.steps

    expect(createdRows).toEqual([])
    expect(events).toEqual(["authorize", "gate"])
    expect(intercepted).toEqual([
      { input: { name: "Jeff Man" }, toolCallId: "call_create" },
    ])
    // Every call has a result - the refusal IS the gated call's result, so
    // there is no dangling tool call for a resume to trip over, and the
    // sibling escalate is untouched.
    const resultsByTool = Object.fromEntries(
      steps[0].toolResults.map(r => [r.toolName, r.output])
    )
    expect(resultsByTool.create_row).toEqual(
      expect.objectContaining({
        status: EscalateToolResultStatus.PENDING_APPROVAL,
        escalationId: "esc_test",
      })
    )
    expect(resultsByTool.escalate).toBeDefined()
    expect(await result.finishReason).toEqual("tool-calls")
  })

  it("gated: a failing gate fails closed - the tool never executes", async () => {
    const { defs, createdRows } = buildToolDefs()

    const gates = new Map<string, EscalationGateRuntime>()
    gates.set("create_row", {
      intercept: async () => {
        throw new Error("escalation raise failed")
      },
    })

    const result = await agentFor(
      streamingModel() as any,
      toToolSet(defs, new Map(), gates)
    ).stream({
      prompt: "Create officer Jeff Man.",
    })
    await result.consumeStream()
    const steps = await result.steps

    expect(createdRows).toEqual([])
    expect(steps[0].toolResults.map(r => r.toolName)).toEqual(["escalate"])
  })
})
