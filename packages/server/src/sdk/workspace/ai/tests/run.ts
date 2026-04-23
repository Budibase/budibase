import { getErrorMessage, HTTPError } from "@budibase/backend-core"
import { ai, quotas } from "@budibase/pro"
import { helpers } from "@budibase/shared-core"
import type {
  Agent,
  AgentTestCase,
  AgentTestCaseResult,
  AgentTestReviewer,
  AgentTestReviewerResult,
  AgentTestRun,
  AgentTestSnapshot,
  ContextUser,
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
import {
  buildErroredReviewerResults,
  evaluateReviewer,
  getCaseStatus,
} from "./reviewers"
import { fetchSuite, persistRunResults } from "./crud"
import { v4 } from "uuid"

type TestLLM = Awaited<ReturnType<typeof sdk.ai.llm.createLLM>>
type SessionLogIndexer = ReturnType<typeof createSessionLogIndexer>

interface JudgeOutput {
  passed: boolean
  reason: string
}

const judgeOutputSchema =
  helpers.structuredOutput.normalizeSchemaForStructuredOutput({
    type: "object",
    properties: {
      passed: { type: "boolean" },
      reason: { type: "string" },
    },
    required: ["passed", "reason"],
  })

const judgeInstructions = `You are grading an AI agent response against a user-defined rubric.
Use only the rubric, the case input, optional case context, and the response.
Do not invent extra requirements.
Return passed=true only when the response clearly satisfies the rubric.
Keep the reason concise and specific.`

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

Test input:
${input}

${context ? `Test context:\n${context}\n\n` : ""}Agent response:
${response}`

async function runJudge({
  llm,
  input,
  context,
  response,
  reviewer,
  sessionLogIndexer,
}: {
  llm: TestLLM
  input: string
  context?: string
  response: string
  reviewer: Extract<AgentTestReviewer, { type: "llm_judge" }>
  sessionLogIndexer: SessionLogIndexer
}): Promise<AgentTestReviewerResult> {
  const judge = new ToolLoopAgent({
    model: wrapLanguageModel({
      model: llm.chat,
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    instructions: judgeInstructions,
    stopWhen: stepCountIs(1),
    providerOptions: llm.providerOptions?.(false),
    output: Output.object({ schema: jsonSchema(judgeOutputSchema) }),
    async onStepFinish({ response }) {
      if (response?.id) sessionLogIndexer.addRequestId(response.id)
    },
  })

  const stream = await judge.stream({
    prompt: buildJudgePrompt({
      input,
      context,
      response,
      rubric: reviewer.rubric,
    }),
  })

  const [output, judgeResponse] = await Promise.all([
    stream.output as Promise<JudgeOutput>,
    stream.response,
  ])

  if (judgeResponse?.id) sessionLogIndexer.addRequestId(judgeResponse.id)

  if (!output || typeof output.passed !== "boolean") {
    throw new Error("Judge did not return a valid verdict.")
  }

  return {
    reviewerId: reviewer.id,
    type: reviewer.type,
    status: output.passed ? "passed" : "failed",
    message:
      (output.reason ?? "").trim() || "Reviewer did not return a message.",
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
  testCase: AgentTestCase
  runId: string
}): Promise<AgentTestCaseResult> {
  const caseSnapshot: AgentTestCase = {
    id: testCase.id,
    groupId: testCase.groupId,
    name: testCase.name,
    input: testCase.input,
    context: testCase.context,
    reviewers: testCase.reviewers,
  }

  const startedAt = new Date().toISOString()
  const startedAtMs = Date.now()
  const sessionId = `test:${runId}:${testCase.id}`
  const toolCalls: string[] = []
  const sessionLogIndexer = createSessionLogIndexer({
    agentId: agent._id!,
    sessionId,
    firstInput: testCase.input,
    errorLabel: "agent test",
    startedAt,
  })

  const finish = ({
    response,
    status,
    reviewerResults,
    error,
  }: {
    response: string
    status: AgentTestCaseResult["status"]
    reviewerResults: AgentTestReviewerResult[]
    error?: string
  }): AgentTestCaseResult => ({
    caseId: testCase.id,
    name: testCase.name,
    caseSnapshot,
    response,
    status,
    reviewerResults,
    toolCalls,
    sessionId,
    requestIds: sessionLogIndexer.getRequestIds(),
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAtMs,
    ...(error ? { error } : {}),
  })

  try {
    const [promptAndTools, llm] = await Promise.all([
      sdk.ai.agents.buildPromptAndTools(agent, {
        baseSystemPrompt: ai.agentSystemPrompt(user),
        includeGoal: false,
      }),
      sdk.ai.llm.createLLM(agent.aiconfig, sessionId, undefined, agent._id),
    ])

    const pendingToolCalls = new Set<string>()
    const hasTools = Object.keys(promptAndTools.tools).length > 0
    const messages: ModelMessage[] = [
      ...(testCase.context
        ? [
            {
              role: "system" as const,
              content: `Additional test context:\n${testCase.context}\n\nUse this context when answering the user.`,
            },
          ]
        : []),
      { role: "user", content: testCase.input },
    ]

    const stream = streamText({
      model: wrapLanguageModel({
        model: llm.chat,
        middleware: extractReasoningMiddleware({ tagName: "think" }),
      }),
      messages,
      system: promptAndTools.systemPrompt,
      tools: hasTools ? promptAndTools.tools : undefined,
      toolChoice: hasTools ? "auto" : "none",
      stopWhen: stepCountIs(30),
      providerOptions: llm.providerOptions?.(hasTools),
      async onStepFinish({
        content,
        toolCalls: stepToolCalls,
        toolResults,
        response,
      }) {
        if (response?.id) sessionLogIndexer.addRequestId(response.id)
        for (const toolCall of stepToolCalls) {
          if (toolCall.toolName) toolCalls.push(toolCall.toolName)
        }
        updatePendingToolCalls(pendingToolCalls, stepToolCalls, toolResults)
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
        if (response?.id) sessionLogIndexer.addRequestId(response.id)
      },
      onError({ error }) {
        console.error("Agent test streaming error", {
          agentId: agent._id,
          sessionId,
          error,
        })
      },
    })

    const [text, streamResponse] = await Promise.all([
      stream.text,
      stream.response,
    ])
    if (streamResponse?.id) sessionLogIndexer.addRequestId(streamResponse.id)

    if (pendingToolCalls.size > 0) {
      throw new Error(formatIncompleteToolCallError([]))
    }

    const response = text || ""
    const reviewerResults: AgentTestReviewerResult[] = []

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
      } else {
        reviewerResults.push(
          evaluateReviewer({ reviewer, response, toolCalls })
        )
      }
    }

    await sessionLogIndexer.index()

    const status = getCaseStatus(reviewerResults)
    const error =
      status === "error"
        ? reviewerResults.find(r => r.status === "error")?.message
        : undefined

    return finish({ response, status, reviewerResults, error })
  } catch (error) {
    await sessionLogIndexer.index()

    const message = getErrorMessage(error)
    return finish({
      response: "",
      status: "error",
      reviewerResults: buildErroredReviewerResults({
        reviewers: caseSnapshot.reviewers,
        message,
      }),
      error: message,
    })
  }
}

export async function runSuite({
  agentId,
  user,
  caseId,
  groupId,
}: {
  agentId: string
  user: ContextUser
  caseId?: string
  groupId?: string
}): Promise<AgentTestRun> {
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const suite = await fetchSuite(agentId)

  if (suite.cases.length === 0) {
    throw new HTTPError("Add at least one test before running the suite.", 400)
  }

  if (caseId && groupId) {
    throw new HTTPError(
      "Select either a single test or a test group to run.",
      400
    )
  }

  let casesToRun: AgentTestCase[] = suite.cases
  if (caseId) {
    const match = suite.cases.find(c => c.id === caseId)
    if (!match) {
      throw new HTTPError("That test was not found in the saved suite.", 400)
    }
    casesToRun = [match]
  } else if (groupId) {
    const group = suite.groups.find(candidate => candidate.id === groupId)
    if (!group) {
      throw new HTTPError(
        "That test group was not found in the saved suite.",
        400
      )
    }

    casesToRun = suite.cases.filter(testCase => testCase.groupId === group.id)
    if (!casesToRun.length) {
      throw new HTTPError(
        "Add at least one test to this group before running it.",
        400
      )
    }
  }

  const runId = v4()
  const startedAt = new Date().toISOString()
  const aiConfig = agent.aiconfig
    ? await sdk.ai.configs.find(agent.aiconfig)
    : undefined

  const snapshot: AgentTestSnapshot = {
    agentId: agent._id!,
    agentName: agent.name,
    agentRev: agent._rev,
    agentUpdatedAt: agent.updatedAt,
    suiteRev: suite._rev,
    aiconfig: agent.aiconfig,
    aiConfig: aiConfig?._id
      ? {
          aiConfigId: aiConfig._id,
          name: aiConfig.name,
          provider: aiConfig.provider,
          model: aiConfig.model,
          liteLLMModelId: aiConfig.liteLLMModelId,
          reasoningEffort: aiConfig.reasoningEffort,
        }
      : undefined,
    promptInstructions: agent.promptInstructions,
    goal: agent.goal,
    enabledTools: [...(agent.enabledTools || [])],
    knowledgeBases: [...(agent.knowledgeBases || [])],
  }

  const results: AgentTestCaseResult[] = []
  for (const testCase of casesToRun) {
    results.push(await runCase({ agent, user, testCase, runId }))
  }

  try {
    await persistRunResults({ agentId, results })
  } catch (error) {
    console.error("Failed to persist agent test results", { agentId, error })
  }

  const passed = results.filter(r => r.status === "passed").length
  return {
    agentId,
    runId,
    total: results.length,
    passed,
    failed: results.length - passed,
    startedAt,
    completedAt: new Date().toISOString(),
    snapshot,
    results,
  }
}
