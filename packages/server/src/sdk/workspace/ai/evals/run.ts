import { features, getErrorMessage, HTTPError } from "@budibase/backend-core"
import { ai, quotas } from "@budibase/pro"
import { helpers } from "@budibase/shared-core"
import { FeatureFlag } from "@budibase/types"
import type {
  Agent,
  AgentEvalCase,
  AgentEvalCaseSnapshot,
  AgentEvalCaseResult,
  AgentEvalModelSnapshot,
  AgentEvalReviewer,
  AgentEvalReviewerResult,
  AgentEvalRun,
  AgentEvalSnapshot,
  AgentEvalSuite,
  ContextUser,
  CustomAIProviderConfig,
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
  buildErroredReviewerResults,
  evaluateReviewer,
  getCaseStatus,
  normalizeCaseContext,
  normalizeReviewers,
  validateEvalCase,
} from "./reviewers"
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
Use only the rubric, the case input, optional case context, and the response.
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

const buildCaseContextMessage = (context?: string): ModelMessage[] =>
  context
    ? [
        {
          role: "system",
          content: `Additional evaluation context:\n${context}\n\nUse this context when answering the user.`,
        },
      ]
    : []

const buildJudgePrompt = ({
  input,
  context,
  response,
  rubric,
}: {
  input: string
  context?: string
  response: string
  rubric: string
}) => `Rubric:
${rubric}

Case input:
${input}

${context ? `Case context:\n${context}\n\n` : ""}Agent response:
${response}`

const normalizeReviewerMessage = (message?: string) =>
  message?.trim() || "Reviewer did not return a message."

const addRequestId = ({
  requestIds,
  sessionLogIndexer,
  responseId,
}: {
  requestIds: Set<string>
  sessionLogIndexer: SessionLogIndexer
  responseId?: string
}) => {
  if (!responseId) {
    return
  }

  requestIds.add(responseId)
  sessionLogIndexer.addRequestId(responseId)
}

const buildCaseSnapshot = (testCase: AgentEvalCase): AgentEvalCaseSnapshot => ({
  id: testCase.id,
  name: testCase.name,
  input: testCase.input,
  context: normalizeCaseContext(testCase.context),
  reviewers: normalizeReviewers(testCase.reviewers),
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

const buildCaseResult = ({
  testCase,
  caseSnapshot,
  response,
  status,
  reviewerResults,
  toolCalls,
  sessionId,
  requestIds,
  startedAt,
  startedAtMs,
  error,
}: {
  testCase: AgentEvalCase
  caseSnapshot: AgentEvalCaseSnapshot
  response: string
  status: AgentEvalCaseResult["status"]
  reviewerResults: AgentEvalReviewerResult[]
  toolCalls: string[]
  sessionId: string
  requestIds: string[]
  startedAt: string
  startedAtMs: number
  error?: string
}): AgentEvalCaseResult => {
  const completedAt = new Date().toISOString()

  return {
    caseId: testCase.id,
    name: testCase.name,
    input: caseSnapshot.input,
    context: caseSnapshot.context,
    caseSnapshot,
    response,
    status,
    reviewerResults,
    toolCalls,
    sessionId,
    requestIds,
    startedAt,
    completedAt,
    durationMs: Date.now() - startedAtMs,
    ...(error ? { error } : {}),
  }
}

async function runJudge({
  llm,
  input,
  context,
  response,
  reviewer,
  requestIds,
  sessionLogIndexer,
}: {
  llm: EvalLLM
  input: string
  context?: string
  response: string
  reviewer: Extract<AgentEvalReviewer, { type: "llm_judge" }>
  requestIds: Set<string>
  sessionLogIndexer: SessionLogIndexer
}): Promise<AgentEvalReviewerResult> {
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
      addRequestId({
        requestIds,
        sessionLogIndexer,
        responseId: response?.id,
      })
    },
  })

  const result = await judge.stream({
    prompt: buildJudgePrompt({
      input,
      context,
      response,
      rubric: reviewer.rubric,
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
  addRequestId({
    requestIds,
    sessionLogIndexer,
    responseId,
  })

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
    reviewerId: reviewer.id,
    type: reviewer.type,
    status: output.passed ? "passed" : "failed",
    message: normalizeReviewerMessage(output.reason),
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
  const executedToolCalls: string[] = []
  const sessionLogIndexer = createSessionLogIndexer({
    agentId: agent._id!,
    sessionId,
    firstInput: testCase.input,
    errorLabel: "agent eval",
    startedAt,
  })

  if (validationFailures.length > 0) {
    const error = validationFailures.map(failure => failure.message).join(" ")
    return buildCaseResult({
      testCase,
      caseSnapshot,
      response: "",
      status: "error",
      reviewerResults: buildErroredReviewerResults({
        reviewers: caseSnapshot.reviewers,
        message: error,
      }),
      toolCalls: executedToolCalls,
      sessionId,
      requestIds: [],
      startedAt,
      error,
      startedAtMs,
    })
  }

  try {
    const latestQuestion = testCase.input
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
      ...buildCaseContextMessage(testCase.context),
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
        addRequestId({
          requestIds,
          sessionLogIndexer,
          responseId: response?.id,
        })
        for (const toolCall of toolCalls) {
          if (toolCall.toolName) {
            executedToolCalls.push(toolCall.toolName)
          }
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
        addRequestId({
          requestIds,
          sessionLogIndexer,
          responseId: response?.id,
        })
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
    addRequestId({
      requestIds,
      sessionLogIndexer,
      responseId,
    })

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
    const reviewerResults: AgentEvalReviewerResult[] = []

    for (const reviewer of caseSnapshot.reviewers) {
      if (reviewer.type === "llm_judge") {
        try {
          reviewerResults.push(
            await runJudge({
              llm,
              input: testCase.input,
              context: testCase.context,
              response,
              reviewer,
              requestIds,
              sessionLogIndexer,
            })
          )
        } catch (error) {
          reviewerResults.push({
            reviewerId: reviewer.id,
            type: reviewer.type,
            status: "error",
            message: `Judge failed: ${getErrorMessage(error)}`,
          })
        }
        continue
      }

      reviewerResults.push(
        evaluateReviewer({
          reviewer,
          response,
          toolCalls: executedToolCalls,
        })
      )
    }

    await sessionLogIndexer.index()

    const caseStatus = getCaseStatus(reviewerResults)
    const error =
      caseStatus === "error"
        ? reviewerResults.find(result => result.status === "error")?.message
        : undefined

    return buildCaseResult({
      testCase,
      caseSnapshot,
      response,
      status: caseStatus,
      reviewerResults,
      toolCalls: executedToolCalls,
      sessionId,
      requestIds: [...requestIds],
      startedAt,
      startedAtMs,
      error,
    })
  } catch (error) {
    await sessionLogIndexer.index()

    const errorMessage = getErrorMessage(error)
    return buildCaseResult({
      testCase,
      caseSnapshot,
      response: "",
      status: "error",
      reviewerResults: buildErroredReviewerResults({
        reviewers: caseSnapshot.reviewers,
        message: errorMessage,
      }),
      toolCalls: executedToolCalls,
      sessionId,
      requestIds: [...requestIds],
      startedAt,
      error: errorMessage,
      startedAtMs,
    })
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
