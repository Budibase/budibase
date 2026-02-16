import { context, docIds } from "@budibase/backend-core"
import {
  AIConfigType,
  Agent,
  BUDIBASE_AI_PROVIDER_ID,
  ChatApp,
  CustomAIProviderConfig,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  Table,
  TableSourceType,
} from "@budibase/types"
import { AgentEvalCase } from "./types"

export interface SeededEvalResources {
  aiConfigId: string
  agentId: string
  chatAppId: string
}

function buildTableDoc(name: string): Table {
  return {
    _id: docIds.generateTableID(),
    type: "table",
    name,
    sourceType: TableSourceType.INTERNAL,
    sourceId: INTERNAL_TABLE_SOURCE_ID,
    schema: {
      title: {
        type: FieldType.STRING,
        name: "title",
        constraints: { type: "string" },
      },
      status: {
        type: FieldType.STRING,
        name: "status",
        constraints: { type: "string" },
      },
    },
  }
}

function toolProfileToEnabledTools(testCase: AgentEvalCase): string[] {
  if (testCase.tooling === "tables") {
    return ["list_tables", "get_table"]
  }
  return []
}

function buildAgentPromptInstructions(testCase: AgentEvalCase): string {
  if (testCase.tooling === "tables") {
    return [
      "Use tools when table information is requested.",
      "If the user asks about tables, call list_tables before answering.",
      "Return concise plain text answers.",
    ].join("\n")
  }

  return "Return concise plain text answers. Do not use tools unless strictly necessary."
}

export async function seedEvalResources({
  testCase,
  modelId,
}: {
  testCase: AgentEvalCase
  modelId: string
}): Promise<SeededEvalResources> {
  const db = context.getWorkspaceDB()

  const aiConfig: CustomAIProviderConfig = {
    _id: docIds.generateAIConfigID("bbai"),
    name: `eval-${modelId}`,
    provider: BUDIBASE_AI_PROVIDER_ID,
    credentialsFields: {},
    model: modelId,
    liteLLMModelId: BUDIBASE_AI_PROVIDER_ID,
    configType: AIConfigType.COMPLETIONS,
  }

  await db.put(aiConfig)

  if (testCase.tooling === "tables") {
    await db.bulkDocs([
      buildTableDoc("EvalTasks"),
      buildTableDoc("EvalCustomers"),
    ])
  }

  const agent: Agent = {
    _id: docIds.generateAgentID(),
    name: `Eval Agent ${testCase.id}`,
    aiconfig: aiConfig._id!,
    promptInstructions: buildAgentPromptInstructions(testCase),
    goal: "Complete the user request exactly.",
    live: true,
    enabledTools: toolProfileToEnabledTools(testCase),
  }
  await db.put(agent)

  const chatApp: ChatApp = {
    _id: docIds.generateChatAppID(),
    title: `Eval Chat App ${testCase.id}`,
    agents: [{ agentId: agent._id!, isEnabled: true, isDefault: true }],
    createdAt: new Date().toISOString(),
  }
  await db.put(chatApp)

  return {
    aiConfigId: aiConfig._id!,
    agentId: agent._id!,
    chatAppId: chatApp._id!,
  }
}
