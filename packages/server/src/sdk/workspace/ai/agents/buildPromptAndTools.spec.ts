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
  createKnowledgeFilesTool: jest.fn((agentId: string) => ({
    name: "list_knowledge_files",
    description: "List knowledge files",
    sourceType: "INTERNAL_TABLE",
    sourceLabel: "Budibase",
    tool: {
      execute: jest.fn().mockResolvedValue({ agentId }),
    },
  })),
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
import { createKnowledgeFilesTool } from "../../../../ai/tools/budibase"
import { buildPromptAndTools } from "./utils"

describe("buildPromptAndTools", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const fetchQueries = sdk.queries.fetch as jest.Mock
    const fetchDatasources = sdk.datasources.fetch as jest.Mock
    const fetchTables = sdk.tables.getAllTables as jest.Mock
    const fetchAutomations = sdk.automations.fetch as jest.Mock

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
      enabledTools: [],
      knowledgeBases: ["kb_1"],
    } as Agent

    const result = await buildPromptAndTools(agent)

    expect(createKnowledgeFilesTool as jest.Mock).toHaveBeenCalledWith(
      "agent_1"
    )
    expect(Reflect.get(result.tools, "list_knowledge_files")).toBeDefined()
    expect(result.systemPrompt).toContain("call list_knowledge_files")
  })

  it("does not add knowledge files helper when no knowledge base exists", async () => {
    const agent = {
      _id: "agent_2",
      name: "Support Agent",
      aiconfig: "",
      enabledTools: [],
      knowledgeBases: [],
    } as Agent

    const result = await buildPromptAndTools(agent)

    expect(createKnowledgeFilesTool as jest.Mock).not.toHaveBeenCalled()
    expect(Reflect.get(result.tools, "list_knowledge_files")).toBeUndefined()
    expect(result.systemPrompt).toBe("system prompt")
  })

  it("throws when agent id is missing", async () => {
    const agent = {
      name: "Support Agent",
      aiconfig: "",
      enabledTools: [],
      knowledgeBases: ["kb_1"],
    } as Agent

    await expect(buildPromptAndTools(agent)).rejects.toThrow(
      "Agent _id is required"
    )
  })
})
