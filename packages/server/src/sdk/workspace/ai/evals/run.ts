import { features, getErrorMessage, HTTPError } from "@budibase/backend-core"
import { ai, quotas } from "@budibase/pro"
import { helpers } from "@budibase/shared-core"
import type {
  Agent,
  AgentEvalCase,
  AgentEvalCaseSnapshot,
  AgentEvalCaseResult,
  AgentEvalJudgeResult,
  AgentEvalModelSnapshot,
  AgentEvalRun,
  AgentEvalSnapshot,
  AgentEvalSuite,
  ContextUser,
  CustomAIProviderConfig,
  FeatureFlag,
} from "@budibase/types"
import {
  Output,
  ToolLoopAgent,
  extractReasoningMiddleware,
  jsonSchema,
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
import {
  evaluateResponse,
  normalizeAssertions,
  normalizeJudgeAssertion,
  validateEvalCase,
} from "./assertions"
import { fetchSuite, saveRun } from "./crud"
import { v4 } from "uuid"

type EvalLLM = Awaited<ReturnType<typeof sdk.ai.llm.createLLM>>
type SessionLogIndexer = ReturnType<typeof createSessionLogIndexer>

interface JudgeOutput {
  passed: boolean
  reason: string
}

const judgeOutputSchema =
  helpers.structuredOutput.normalizeSchemaForStructuredOutput({
    type: "object",
    properties: {
      passed: {
        type: "boolean",
      },
      reason: {
        type: "string",
      },
    },
    required: ["passed", "reason"],
  })

const judgeInstructions = `You are grading an AI agent response against a user-defined rubric.
Use only the rubric, the original prompt, and the response.
Do not invent extra requirements.
Return passed=true only when the response clearly satisfies the rubric.
Keep the reason concise and specific.`

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

const buildJudgePrompt = ({
  prompt,
  response,
  rubric,
}: {
  prompt: string
  response: string
  rubric: string
}) => `Rubric:
${rubric}

User prompt:
${prompt}

Agent response:
${response}`

const normalizeJudgeReason = (reason?: string) =>
  reason?.trim() || "Judge did not return a reason."

const buildCaseSnapshot = (testCase: AgentEvalCase): AgentEvalCaseSnapshot => ({
  id: testCase.id,
  name: testCase.name,
  prompt: testCase.prompt,
  assertions: normalizeAssertions(testCase.assertions),
})

const buildAIConfigSnapshot = (
  aiConfig?: CustomAIProviderConfig
): AgentEvalModelSnapshot | undefined => {
  if (!aiConfig?._id) {
    return undefined
  }

  return {
    aiConfigId: aiConfig._id,
    name: aiConfig.name,
    provider: aiConfig.provider,
    model: aiConfig.model,
    liteLLMModelId: aiConfig.liteLLMModelId,
    reasoningEffort: aiConfig.reasoningEffort,
  }
}

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

const buildRunSnapshot = ({
  agent,
  suite,
  aiConfig,
}: {
  agent: Agent
  suite: AgentEvalSuite
  aiConfig?: CustomAIProviderConfig
}): AgentEvalSnapshot => ({
  agentId: agent._id!,
  agentName: agent.name,
  agentRev: agent._rev,
  agentUpdatedAt: agent.updatedAt,
  suiteRev: suite._rev,
  aiconfig: agent.aiconfig,
  aiConfig: buildAIConfigSnapshot(aiConfig),
  promptInstructions: agent.promptInstructions,
  goal: agent.goal,
  enabledTools: [...(agent.enabledTools || [])],
  knowledgeBases: [...(agent.knowledgeBases || [])],
})

async function runJudge({
  llm,
  prompt,
  response,
  rubric,
  requestIds,
  sessionLogIndexer,
}: {
  llm: EvalLLM
  prompt: string
  response: string
  rubric: string
  requestIds: Set<string>
  sessionLogIndexer: SessionLogIndexer
}): Promise<AgentEvalJudgeResult> {
  const judge = new ToolLoopAgent({
    model: wrapLanguageModel({
      model: llm.chat,
      middleware: extractReasoningMiddleware({
        tagName: "think",
      }),
    }),
    instructions: judgeInstructions,
    stopWhen: stepCountIs(1),
    providerOptions: llm.providerOptions?.(false),
    output: Output.object({ schema: jsonSchema(judgeOutputSchema) }),
    async onStepFinish({ response }) {
      if (response?.id) {
        requestIds.add(response.id)
        sessionLogIndexer.addRequestId(response.id)
      }
    },
  })

  const result = await judge.stream({
    prompt: buildJudgePrompt({
      prompt,
      response,
      rubric,
    }),
  })

  const [judgeOutputResult, judgeResponseResult] = await Promise.allSettled([
    result.output as Promise<JudgeOutput>,
    result.response,
  ])

  const responseId =
    judgeResponseResult.status === "fulfilled"
      ? (judgeResponseResult.value?.id ?? undefined)
      : undefined
  if (responseId) {
    requestIds.add(responseId)
    sessionLogIndexer.addRequestId(responseId)
  }

  if (judgeOutputResult.status === "rejected") {
    throw judgeOutputResult.reason
  }
  if (judgeResponseResult.status === "rejected") {
    throw judgeResponseResult.reason
  }

  const output = judgeOutputResult.value
  if (!output || typeof output.passed !== "boolean") {
    throw new Error("Judge did not return a valid verdict.")
  }

  return {
    status: output.passed ? "passed" : "failed",
    reason: normalizeJudgeReason(output.reason),
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
  const caseSnapshot = buildCaseSnapshot(testCase)
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
      caseSnapshot,
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
      assertions: caseSnapshot.assertions,
      response,
    })
    let judge: AgentEvalJudgeResult | undefined
    const judgeAssertion = normalizeJudgeAssertion(caseSnapshot.assertions.judge)

    if (judgeAssertion?.rubric) {
      try {
        judge = await runJudge({
          llm,
          prompt: testCase.prompt,
          response,
          rubric: judgeAssertion.rubric,
          requestIds,
          sessionLogIndexer,
        })
      } catch (error) {
        await sessionLogIndexer.index()

        const completedAt = new Date().toISOString()
        return {
          caseId: testCase.id,
          name: testCase.name,
          prompt: testCase.prompt,
          caseSnapshot,
          response,
          status: "error",
          failures,
          judge: {
            status: "error",
            error: getErrorMessage(error),
          },
          sessionId,
          requestIds: [...requestIds],
          startedAt,
          completedAt,
          durationMs: Date.now() - startedAtMs,
          error: `Judge failed: ${getErrorMessage(error)}`,
        }
      }
    }

    if (judge?.status === "failed") {
      failures.push({
        type: "judge",
        message: judge.reason || "Judge failed this response.",
      })
    }

    await sessionLogIndexer.index()

    const completedAt = new Date().toISOString()

    return {
      caseId: testCase.id,
      name: testCase.name,
      prompt: testCase.prompt,
      caseSnapshot,
      response,
      status: failures.length > 0 ? "failed" : "passed",
      failures,
      judge,
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
      caseSnapshot,
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
  const aiConfig = agent.aiconfig
    ? await sdk.ai.configs.find(agent.aiconfig)
    : undefined
  const snapshot = buildRunSnapshot({ agent, suite, aiConfig })

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

  return await saveRun({
    agentId,
    runId,
    total: results.length,
    passed,
    failed: results.length - passed,
    startedAt,
    completedAt,
    snapshot,
    results,
  })
}
