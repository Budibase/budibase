import type { Agent } from "@budibase/types"

jest.mock("../../..", () => ({
  __esModule: true,
  default: {
    queries: { fetch: jest.fn() },
    datasources: { fetch: jest.fn() },
    tables: { getAllTables: jest.fn() },
    automations: { fetch: jest.fn() },
    ai: {
      configs: { find: jest.fn() },
    },
  },
}))

jest.mock("../../../../ai/tools/budibase", () => ({
  __esModule: true,
  getBudibaseTools: jest.fn(() => []),
  createKnowledgeFilesTool: jest.fn((agentId: string, operationId: string) => ({
    name: "list_knowledge_files",
    description: "List knowledge files",
    sourceType: "INTERNAL_TABLE",
    sourceLabel: "Budibase",
    tool: {
      execute: jest.fn().mockResolvedValue({ agentId, operationId }),
    },
  })),
  createKnowledgeSearchTool: jest.fn(
    (agentId: string, operationId: string) => ({
      name: "search_knowledge",
      description: "Search knowledge",
      sourceType: "INTERNAL_TABLE",
      sourceLabel: "Budibase",
      tool: {
        execute: jest.fn().mockResolvedValue({ agentId, operationId }),
      },
    })
  ),
}))

jest.mock("../../../../ai/tools/search", () => ({
  __esModule: true,
  createExaTool: jest.fn(),
  createParallelTool: jest.fn(),
}))

jest.mock("../../../../ai/tools", () => ({
  __esModule: true,
  createRestQueryTool: jest.fn(),
  createDatasourceQueryTool: jest.fn(),
  toToolSet: (tools: any[]) =>
    Object.fromEntries(tools.map(t => [t.name, t.tool])),
}))

jest.mock("@budibase/pro", () => ({
  __esModule: true,
  ai: {
    composeAutomationAgentSystemPrompt: jest.fn(() => "system prompt"),
  },
}))

import sdk from "../../.."
import {
  createKnowledgeFilesTool,
  createKnowledgeSearchTool,
} from "../../../../ai/tools/budibase"
import { buildPromptAndTools } from "./utils"
import { generator } from "@budibase/backend-core/tests"

describe("buildPromptAndTools", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const fetchQueries = jest.mocked(sdk.queries.fetch)
    const fetchDatasources = jest.mocked(sdk.datasources.fetch)
    const fetchTables = jest.mocked(sdk.tables.getAllTables)
    const fetchAutomations = jest.mocked(sdk.automations.fetch)

    fetchQueries.mockResolvedValue([])
    fetchDatasources.mockResolvedValue([])
    fetchTables.mockResolvedValue([])
    fetchAutomations.mockResolvedValue([])
  })

  it("adds knowledge files helper when agent has a knowledge base", async () => {
    const agent = {
      _id: "agent_1",
      name: "Support Agent",
      aiconfig: "",
      operations: [
        {
          id: "operation_1",
          name: "Main operation",
          live: true,
          enabledTools: [],
          knowledgeBases: ["kb_1"],
          allowKnowledgeSourceDownload: true,
        },
      ],
    } satisfies Agent

    const operation = agent.operations![0]
    const result = await buildPromptAndTools(agent, operation)

    expect(createKnowledgeFilesTool).toHaveBeenCalledWith(
      "agent_1",
      "operation_1"
    )
    expect(createKnowledgeSearchTool).toHaveBeenCalledWith(
      "agent_1",
      "operation_1"
    )
    expect(Reflect.get(result.tools, "list_knowledge_files")).toBeDefined()
    expect(Reflect.get(result.tools, "search_knowledge")).toBeDefined()
    expect(result.systemPrompt).toContain("call list_knowledge_files")
    expect(result.systemPrompt).toContain("call search_knowledge")
    expect(result.systemPrompt).toContain(
      "Do not say the answer is unavailable, unknown, or unsupported until after you have searched knowledge."
    )
    expect(result.systemPrompt).toContain("call report_used_sources")
  })

  it("does not add knowledge files helper when no knowledge base exists", async () => {
    const agent = {
      _id: "agent_2",
      name: "Support Agent",
      aiconfig: "",
      operations: [
        {
          id: "operation_1",
          name: "Main operation",
          live: true,
          enabledTools: [],
          knowledgeBases: [],
          allowKnowledgeSourceDownload: true,
        },
      ],
    } satisfies Agent

    const result = await buildPromptAndTools(agent, agent.operations![0])

    expect(createKnowledgeFilesTool).not.toHaveBeenCalled()
    expect(Reflect.get(result.tools, "list_knowledge_files")).toBeUndefined()
    expect(result.systemPrompt).toBe("system prompt")
  })

  it("throws when agent id is missing", async () => {
    const agent = {
      name: "Support Agent",
      aiconfig: "",
      operations: [
        {
          id: "operation_1",
          name: "Main operation",
          live: true,
          enabledTools: [],
          knowledgeBases: ["kb_1"],
          allowKnowledgeSourceDownload: true,
        },
      ],
    } satisfies Agent

    await expect(
      buildPromptAndTools(agent, agent.operations![0])
    ).rejects.toThrow("Agent _id is required")
  })

  it("ignores operation prompt, tools, and knowledge when no operation is provided", async () => {
    const agent = {
      _id: "agent_3",
      name: "Support Agent",
      aiconfig: "",
      operations: [
        {
          id: "operation_1",
          name: "Main operation",
          live: false,
          promptInstructions: "Draft instructions",
          enabledTools: ["draft_tool"],
          knowledgeBases: ["kb_1"],
          allowKnowledgeSourceDownload: generator.bool(),
        },
      ],
    } satisfies Agent

    const { ai } = jest.requireMock("@budibase/pro")
    const result = await buildPromptAndTools(agent)

    expect(ai.composeAutomationAgentSystemPrompt).toHaveBeenCalledWith(
      expect.objectContaining({
        promptInstructions: undefined,
      })
    )
    expect(createKnowledgeFilesTool).not.toHaveBeenCalled()
    expect(Reflect.get(result.tools, "search_knowledge")).toBeUndefined()
  })

  it("uses the provided operation instead of the first live operation", async () => {
    const agent = {
      _id: "agent_4",
      name: "Support Agent",
      aiconfig: "",
      operations: [
        {
          id: "operation_1",
          name: "IT support",
          live: true,
          promptInstructions: "Handle IT requests",
          enabledTools: [],
          knowledgeBases: [],
          allowKnowledgeSourceDownload: generator.bool(),
        },
        {
          id: "operation_2",
          name: "Knowledge support",
          live: true,
          promptInstructions: "Handle knowledge requests",
          enabledTools: [],
          knowledgeBases: [],
          allowKnowledgeSourceDownload: generator.bool(),
        },
      ],
    } satisfies Agent

    const { ai } = jest.requireMock("@budibase/pro")
    await buildPromptAndTools(agent, agent.operations?.[1])

    expect(ai.composeAutomationAgentSystemPrompt).toHaveBeenCalledWith(
      expect.objectContaining({
        promptInstructions: expect.stringContaining(
          "Current operation: Knowledge support"
        ),
      })
    )
  })
})
