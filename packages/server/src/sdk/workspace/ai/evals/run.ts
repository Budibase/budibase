import { features, getErrorMessage, HTTPError } from "@budibase/backend-core"
import { ai, quotas } from "@budibase/pro"
import type {
  Agent,
  AgentEvalCase,
  AgentEvalCaseResult,
  AgentEvalRun,
  ContextUser,
  FeatureFlag,
} from "@budibase/types"
import {
  extractReasoningMiddleware,
  stepCountIs,
  streamText,
  wrapLanguageModel,
  type ModelMessage,
} from "ai"
import sdk from "../../.."
import {
  formatIncompleteToolCallError,
  updatePendingToolCalls,
} from "../agents"
import { createSessionLogIndexer } from "../agentLogs"
import { retrieveContextForAgent } from "../rag"
import { evaluateResponse, validateEvalCase } from "./assertions"
import { fetchSuite, saveLatestRun } from "./crud"
import { v4 } from "uuid"

const buildRetrievedContextMessage = (
  retrievedContext: string
): ModelMessage[] =>
  retrievedContext
    ? [
        {
          role: "system",
          content: `Relevant knowledge:\n${retrievedContext}\n\nUse this content when answering the user.`,
        },
      ]
    : []

async function getRetrievedAgentContext(agent: Agent, latestQuestion: string) {
  if (
    !latestQuestion ||
    !agent.knowledgeBases?.length ||
    !(await features.isEnabled(FeatureFlag.AI_RAG))
  ) {
    return ""
  }

  try {
    const contextResult = await retrieveContextForAgent(agent, latestQuestion)
    return contextResult.text
  } catch (error) {
    console.error("Failed to retrieve eval context", error)
    return ""
  }
}

async function runCase({
  agent,
  user,
  testCase,
  runId,
}: {
  agent: Agent
  user: ContextUser
  testCase: AgentEvalCase
  runId: string
}): Promise<AgentEvalCaseResult> {
  const validationFailures = validateEvalCase(testCase)
  const startedAt = new Date().toISOString()
  const startedAtMs = Date.now()
  const sessionId = `eval:${runId}:${testCase.id}`
  const requestIds = new Set<string>()
  const sessionLogIndexer = createSessionLogIndexer({
    agentId: agent._id!,
    sessionId,
    firstInput: testCase.prompt,
    errorLabel: "agent eval",
    startedAt,
  })

  if (validationFailures.length > 0) {
    const completedAt = new Date().toISOString()
    return {
      caseId: testCase.id,
      name: testCase.name,
      prompt: testCase.prompt,
      response: "",
      status: "failed",
      failures: validationFailures,
      sessionId,
      requestIds: [],
      startedAt,
      completedAt,
      durationMs: Date.now() - startedAtMs,
    }
  }

  try {
    const latestQuestion = testCase.prompt.trim()
    const [retrievedContext, promptAndTools, llm] = await Promise.all([
      getRetrievedAgentContext(agent, latestQuestion),
      sdk.ai.agents.buildPromptAndTools(agent, {
        baseSystemPrompt: ai.agentSystemPrompt(user),
        includeGoal: false,
      }),
      sdk.ai.llm.createLLM(agent.aiconfig, sessionId, undefined, agent._id),
    ])

    const pendingToolCalls = new Set<string>()
    const hasTools = Object.keys(promptAndTools.tools).length > 0
    const messages: ModelMessage[] = [
      ...buildRetrievedContextMessage(retrievedContext),
      {
        role: "user",
        content: latestQuestion,
      },
    ]

    const result = streamText({
      model: wrapLanguageModel({
        model: llm.chat,
        middleware: extractReasoningMiddleware({
          tagName: "think",
        }),
      }),
      messages,
      system: promptAndTools.systemPrompt,
      tools: hasTools ? promptAndTools.tools : undefined,
      toolChoice: hasTools ? "auto" : "none",
      stopWhen: stepCountIs(30),
      providerOptions: llm.providerOptions?.(hasTools),
      async onStepFinish({ content, toolCalls, toolResults, response }) {
        if (response?.id) {
          requestIds.add(response.id)
          sessionLogIndexer.addRequestId(response.id)
        }
        updatePendingToolCalls(pendingToolCalls, toolCalls, toolResults)
        for (const part of content) {
          if (part.type === "tool-error") {
            pendingToolCalls.delete(part.toolCallId)
          }
        }
        for (const _toolResult of toolResults) {
          await quotas.addAction(async () => {})
        }
      },
      onFinish({ response }) {
        if (response?.id) {
          requestIds.add(response.id)
          sessionLogIndexer.addRequestId(response.id)
        }
      },
      onError({ error }) {
        console.error("Agent eval streaming error", {
          agentId: agent._id,
          sessionId,
          error,
        })
      },
    })

    const [textResult, responseResult] = await Promise.allSettled([
      result.text,
      result.response,
    ])

    const responseId =
      responseResult.status === "fulfilled"
        ? (responseResult.value.id ?? undefined)
        : undefined
    if (responseId) {
      requestIds.add(responseId)
      sessionLogIndexer.addRequestId(responseId)
    }

    await sessionLogIndexer.index()

    if (pendingToolCalls.size > 0) {
      throw new Error(formatIncompleteToolCallError([]))
    }
    if (textResult.status === "rejected") {
      throw textResult.reason
    }
    if (responseResult.status === "rejected") {
      throw responseResult.reason
    }

    const response = textResult.value || ""
    const failures = evaluateResponse({
      assertions: testCase.assertions,
      response,
    })
    const completedAt = new Date().toISOString()

    return {
      caseId: testCase.id,
      name: testCase.name,
      prompt: testCase.prompt,
      response,
      status: failures.length > 0 ? "failed" : "passed",
      failures,
      sessionId,
      requestIds: [...requestIds],
      startedAt,
      completedAt,
      durationMs: Date.now() - startedAtMs,
    }
  } catch (error) {
    await sessionLogIndexer.index()

    const completedAt = new Date().toISOString()
    return {
      caseId: testCase.id,
      name: testCase.name,
      prompt: testCase.prompt,
      response: "",
      status: "error",
      failures: [],
      sessionId,
      requestIds: [...requestIds],
      startedAt,
      completedAt,
      durationMs: Date.now() - startedAtMs,
      error: getErrorMessage(error),
    }
  }
}

export async function runSuite({
  agentId,
  user,
}: {
  agentId: string
  user: ContextUser
}): Promise<AgentEvalRun> {
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const suite = await fetchSuite(agentId)

  if (suite.cases.length === 0) {
    throw new HTTPError(
      "Add at least one eval case before running the suite.",
      400
    )
  }

  const runId = v4()
  const startedAt = new Date().toISOString()
  const results: AgentEvalCaseResult[] = []

  for (const testCase of suite.cases) {
    results.push(
      await runCase({
        agent,
        user,
        testCase,
        runId,
      })
    )
  }

  const completedAt = new Date().toISOString()
  const passed = results.filter(result => result.status === "passed").length

  return await saveLatestRun({
    agentId,
    runId,
    total: results.length,
    passed,
    failed: results.length - passed,
    startedAt,
    completedAt,
    results,
  })
}
