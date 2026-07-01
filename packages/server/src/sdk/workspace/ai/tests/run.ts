import { getErrorMessage, HTTPError } from "@budibase/backend-core"
import { buildAgentTestCaseSnapshot, helpers } from "@budibase/shared-core"
import type {
  Agent,
  AgentTestModelSnapshot,
  AgentTestCase,
  AgentTestCaseResult,
  AgentTestCaseSnapshot,
  AgentTestSuite,
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
  wrapLanguageModel,
  type ModelMessage,
} from "ai"
import sdk from "../../.."
import {
  formatIncompleteToolCallError,
  getAvailableTools,
  getToolDisplayNames,
  prepareAgentChatRun,
} from "../agents"
import {
  buildErroredReviewerResults,
  evaluateReviewer,
  getCaseStatus,
} from "./reviewers"
import { fetchSuite, persistRunResults } from "./crud"
import { v4 } from "uuid"

type TestLLM = Awaited<ReturnType<typeof sdk.ai.llm.createLLM>>
type SessionLogIndexer = Awaited<
  ReturnType<typeof prepareAgentChatRun>
>["sessionLogIndexer"]

const MAX_COMPARE_CONFIGS = 3

interface JudgeOutput {
  passed: boolean
  reason: string
}

const isLLMJudgeReviewer = (
  reviewer: AgentTestReviewer
): reviewer is AgentTestReviewer & { type: "llm_judge" } =>
  reviewer.type === "llm_judge"

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

const buildTestMessages = ({
  testCase,
}: {
  testCase: AgentTestCase
}): ModelMessage[] => [
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

const buildResult = ({
  testCase,
  caseSnapshot,
  aiConfigId,
  aiConfig,
  requestIds,
  sessionId,
  startedAt,
  startedAtMs,
  response,
  status,
  reviewerResults,
  toolCalls,
  selectedOperationId,
  selectedOperationName,
  promptInstructions,
  enabledTools,
  knowledgeBases,
  error,
}: {
  testCase: AgentTestCase
  caseSnapshot: AgentTestCaseSnapshot
  aiConfigId: string
  aiConfig?: AgentTestModelSnapshot
  requestIds: string[]
  sessionId: string
  startedAt: string
  startedAtMs: number
  response: string
  status: AgentTestCaseResult["status"]
  reviewerResults: AgentTestReviewerResult[]
  toolCalls: string[]
  selectedOperationId?: string
  selectedOperationName?: string
  promptInstructions?: string
  enabledTools?: string[]
  knowledgeBases?: string[]
  error?: string
}): AgentTestCaseResult => ({
  caseId: testCase.id,
  aiConfigId,
  aiConfig,
  name: testCase.name,
  caseSnapshot,
  response,
  status,
  reviewerResults,
  toolCalls,
  selectedOperationId,
  selectedOperationName,
  promptInstructions,
  enabledTools,
  knowledgeBases,
  sessionId,
  requestIds,
  startedAt,
  completedAt: new Date().toISOString(),
  durationMs: Date.now() - startedAtMs,
  ...(error ? { error } : {}),
})

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
  reviewer: AgentTestReviewer & { type: "llm_judge" }
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
      rubric: reviewer.value,
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

async function runAgentForCase({
  agent,
  user,
  messages,
  input,
  sessionId,
  startedAt,
  aiConfigId,
}: {
  agent: Agent
  user: ContextUser
  messages: ModelMessage[]
  input: string
  sessionId: string
  startedAt: string
  aiConfigId: string
}): Promise<{
  response: string
  toolCalls: string[]
  toolDisplayNames: Record<string, string>
  selectedOperationId?: string
  selectedOperationName?: string
  promptInstructions?: string
  enabledTools?: string[]
  knowledgeBases?: string[]
  sessionLogIndexer: SessionLogIndexer
}> {
  const pendingToolCalls = new Set<string>()
  const toolCalls: string[] = []

  const run = await prepareAgentChatRun({
    agent,
    agentId: agent._id!,
    aiConfigId,
    errorLabel: "agent test",
    latestQuestion: input,
    modelMessages: messages,
    sessionId,
    startedAt,
    user,
  })

  const stream = await run.stream({
    pendingToolCalls,
    onToolCalls: names => toolCalls.push(...names),
  })

  const [text, streamResponse] = await Promise.all([
    stream.text,
    stream.response,
  ])
  run.sessionLogIndexer.addRequestId(streamResponse?.id)

  if (pendingToolCalls.size > 0) {
    throw new Error(formatIncompleteToolCallError([]))
  }

  return {
    response: text || "",
    toolCalls,
    toolDisplayNames: run.toolDisplayNames,
    selectedOperationId: run.selectedOperation?.id,
    selectedOperationName: run.selectedOperation?.name,
    promptInstructions: run.selectedOperation?.promptInstructions,
    enabledTools: run.selectedOperation?.enabledTools
      ? [...run.selectedOperation.enabledTools]
      : undefined,
    knowledgeBases: run.selectedOperation?.knowledgeBases
      ? [...run.selectedOperation.knowledgeBases]
      : undefined,
    sessionLogIndexer: run.sessionLogIndexer,
  }
}

async function runReviewers({
  reviewers,
  getLLM,
  testCase,
  response,
  toolCalls,
  toolDisplayNames,
  sessionLogIndexer,
  selectedOperationId,
  selectedOperationName,
  operationNamesById,
}: {
  reviewers: AgentTestReviewer[]
  getLLM: () => Promise<TestLLM>
  testCase: AgentTestCase
  response: string
  toolCalls: string[]
  toolDisplayNames?: Record<string, string>
  sessionLogIndexer: SessionLogIndexer
  selectedOperationId?: string
  selectedOperationName?: string
  operationNamesById?: Record<string, string>
}): Promise<AgentTestReviewerResult[]> {
  const results: AgentTestReviewerResult[] = []
  let llm: TestLLM | undefined

  for (const reviewer of reviewers) {
    if (!isLLMJudgeReviewer(reviewer)) {
      results.push(
        evaluateReviewer({
          reviewer,
          response,
          toolCalls,
          toolDisplayNames,
          selectedOperationId,
          selectedOperationName,
          operationNamesById,
        })
      )
      continue
    }

    try {
      llm = llm || (await getLLM())
      results.push(
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
      results.push({
        reviewerId: reviewer.id,
        type: reviewer.type,
        status: "error",
        message: `Judge failed: ${getErrorMessage(error)}`,
      })
    }
  }

  return results
}

async function runCase({
  agent,
  user,
  testCase,
  runId,
  aiConfigId,
  aiConfig,
}: {
  agent: Agent
  user: ContextUser
  testCase: AgentTestCase
  runId: string
  aiConfigId: string
  aiConfig?: AgentTestModelSnapshot
}): Promise<AgentTestCaseResult> {
  const agentForRun = {
    ...agent,
    aiconfig: aiConfigId,
  }
  const caseSnapshot = buildAgentTestCaseSnapshot(testCase)
  const startedAt = new Date().toISOString()
  const startedAtMs = Date.now()
  const sessionId = `test:${runId}:${testCase.id}:${aiConfigId}`
  let sessionLogIndexer: SessionLogIndexer | undefined
  const operationNamesById = Object.fromEntries(
    (agent.operations || []).map(operation => [operation.id, operation.name])
  )

  try {
    const messages = buildTestMessages({ testCase })
    const agentRun = await runAgentForCase({
      agent: agentForRun,
      user,
      messages,
      input: testCase.input,
      sessionId,
      startedAt,
      aiConfigId,
    })
    sessionLogIndexer = agentRun.sessionLogIndexer
    const toolDisplayNames = {
      ...getToolDisplayNames(await getAvailableTools(aiConfigId)),
      ...agentRun.toolDisplayNames,
    }
    const reviewerResults = await runReviewers({
      reviewers: caseSnapshot.reviewers,
      getLLM: () =>
        sdk.ai.llm.createLLM(aiConfigId, sessionId, undefined, agent._id),
      testCase,
      response: agentRun.response,
      toolCalls: agentRun.toolCalls,
      toolDisplayNames,
      sessionLogIndexer,
      selectedOperationId: agentRun.selectedOperationId,
      selectedOperationName: agentRun.selectedOperationName,
      operationNamesById,
    })

    await sessionLogIndexer.index()

    const status = getCaseStatus(reviewerResults)
    const error =
      status === "error"
        ? reviewerResults.find(r => r.status === "error")?.message
        : undefined

    return buildResult({
      testCase,
      caseSnapshot,
      aiConfigId,
      aiConfig,
      requestIds: sessionLogIndexer.getRequestIds(),
      sessionId,
      startedAt,
      startedAtMs,
      response: agentRun.response,
      status,
      reviewerResults,
      toolCalls: agentRun.toolCalls,
      selectedOperationId: agentRun.selectedOperationId,
      selectedOperationName: agentRun.selectedOperationName,
      promptInstructions: agentRun.promptInstructions,
      enabledTools: agentRun.enabledTools,
      knowledgeBases: agentRun.knowledgeBases,
      error,
    })
  } catch (error) {
    await sessionLogIndexer?.index()

    const message = getErrorMessage(error)
    return buildResult({
      testCase,
      caseSnapshot,
      aiConfigId,
      aiConfig,
      requestIds: sessionLogIndexer?.getRequestIds() ?? [],
      sessionId,
      startedAt,
      startedAtMs,
      response: "",
      status: "error",
      reviewerResults: buildErroredReviewerResults({
        reviewers: caseSnapshot.reviewers,
        message,
      }),
      toolCalls: [],
      selectedOperationId: undefined,
      selectedOperationName: undefined,
      error: message,
    })
  }
}

export const selectCasesToRun = ({
  suite,
  caseId,
  groupId,
}: {
  suite: AgentTestSuite
  caseId?: string
  groupId?: string
}): AgentTestCase[] => {
  if (suite.cases.length === 0) {
    throw new HTTPError("Add at least one test before running the suite.", 400)
  }

  if (caseId && groupId) {
    throw new HTTPError(
      "Select either a single test or a test group to run.",
      400
    )
  }

  if (caseId) {
    const match = suite.cases.find(testCase => testCase.id === caseId)
    if (!match) {
      throw new HTTPError("That test was not found in the saved suite.", 400)
    }
    return [match]
  }

  if (!groupId) return suite.cases

  const group = suite.groups.find(candidate => candidate.id === groupId)
  if (!group) {
    throw new HTTPError(
      "That test group was not found in the saved suite.",
      400
    )
  }

  const cases = suite.cases.filter(testCase => testCase.groupId === group.id)
  if (!cases.length) {
    throw new HTTPError(
      "Add at least one test to this group before running it.",
      400
    )
  }

  return cases
}

const uniqueConfigIds = (configIds: string[]): string[] => [
  ...new Set(configIds.filter(Boolean)),
]

const getCaseConfigIds = ({
  agent,
  testCase,
  aiConfigIds,
}: {
  agent: Agent
  testCase: AgentTestCase
  aiConfigIds?: string[]
}) => {
  const selectedConfigIds = aiConfigIds?.length
    ? aiConfigIds
    : testCase.aiConfigIds?.length
      ? testCase.aiConfigIds
      : [agent.aiconfig]

  const configIds = uniqueConfigIds(selectedConfigIds).slice(
    0,
    MAX_COMPARE_CONFIGS
  )

  if (!configIds.length) {
    throw new HTTPError("Select at least one AI config to run this test.", 400)
  }

  return configIds
}

const buildConfigSnapshot = async (
  aiConfigId: string
): Promise<AgentTestModelSnapshot | undefined> => {
  let aiConfig
  try {
    aiConfig = await sdk.ai.configs.find(aiConfigId)
  } catch (error) {
    console.error("Failed to snapshot AI config for agent test", {
      aiConfigId,
      error,
    })
    return undefined
  }
  if (!aiConfig?._id) return undefined

  return {
    aiConfigId: aiConfig._id,
    name: aiConfig.name,
    provider: aiConfig.provider,
    model: aiConfig.model,
    liteLLMModelId: aiConfig.liteLLMModelId,
    reasoningEffort: aiConfig.reasoningEffort,
  }
}

const buildConfigSnapshotMap = async (aiConfigIds: string[]) => {
  const configSnapshots = new Map<string, AgentTestModelSnapshot>()

  for (const aiConfigId of aiConfigIds) {
    const snapshot = await buildConfigSnapshot(aiConfigId)
    if (snapshot) {
      configSnapshots.set(aiConfigId, snapshot)
    }
  }

  return configSnapshots
}

const buildRunSnapshot = async ({
  agent,
  suite,
  aiConfigIds,
}: {
  agent: Agent
  suite: AgentTestSuite
  aiConfigIds: string[]
}): Promise<AgentTestSnapshot> => {
  const configSnapshots = await buildConfigSnapshotMap(aiConfigIds)
  const aiConfigs = [...configSnapshots.values()]
  const aiConfig = aiConfigs.find(
    config => config.aiConfigId === agent.aiconfig
  )

  return {
    agentId: agent._id!,
    agentName: agent.name,
    agentRev: agent._rev,
    agentUpdatedAt: agent.updatedAt,
    suiteRev: suite._rev,
    aiconfig: agent.aiconfig,
    aiConfig,
    aiConfigs,
    goal: agent.goal,
  }
}

export async function runSuite({
  agentId,
  user,
  caseId,
  groupId,
  aiConfigIds,
  runId = v4(),
  startedAt = new Date().toISOString(),
}: {
  agentId: string
  user: ContextUser
  caseId?: string
  groupId?: string
  aiConfigIds?: string[]
  runId?: string
  startedAt?: string
}): Promise<AgentTestRun> {
  const agent = await sdk.ai.agents.getOrThrow(agentId)

  const suite = await fetchSuite(agentId)
  const casesToRun = selectCasesToRun({ suite, caseId, groupId })
  const runConfigIds = uniqueConfigIds(
    casesToRun.flatMap(testCase =>
      getCaseConfigIds({ agent, testCase, aiConfigIds })
    )
  )
  const configSnapshots = await buildConfigSnapshotMap(runConfigIds)
  const snapshot = await buildRunSnapshot({
    agent,
    suite,
    aiConfigIds: runConfigIds,
  })

  const results: AgentTestCaseResult[] = []
  for (const testCase of casesToRun) {
    const testConfigIds = getCaseConfigIds({ agent, testCase, aiConfigIds })
    for (const aiConfigId of testConfigIds) {
      results.push(
        await runCase({
          agent,
          user,
          testCase,
          runId,
          aiConfigId,
          aiConfig: configSnapshots.get(aiConfigId),
        })
      )
    }
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
