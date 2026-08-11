import {
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
  ToolType,
  type Agent,
} from "@budibase/types"
import type { Tool } from "ai"
import { requesterTools } from "../tests/utils"

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
  createTableTools: jest.fn((tableIds: string[]) => [
    {
      name: "list_tables",
      description: "List configured tables",
      sourceType: "INTERNAL_TABLE",
      sourceLabel: "Budibase",
      tool: { execute: jest.fn().mockResolvedValue({ tableIds }) },
    },
    {
      name: "get_table",
      description: "Get a configured table",
      sourceType: "INTERNAL_TABLE",
      sourceLabel: "Budibase",
      tool: { execute: jest.fn().mockResolvedValue({ tableIds }) },
    },
  ]),
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
  createEscalatePlaceholderTool: jest.fn(() => ({
    name: "escalate",
    description: "Escalate to a human",
    sourceType: "ESCALATION",
    sourceLabel: "Escalation",
    tool: {
      execute: jest.fn().mockResolvedValue({ status: "unavailable" }),
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
  resolveToolExecutionPrincipal: jest.fn(
    (_tool, config) =>
      config?.executionPrincipal ?? ToolExecutionPrincipal.REQUESTER
  ),
  toToolSet: (tools: any[]) =>
    Object.fromEntries(tools.map(t => [t.name, t.tool])),
}))

jest.mock("../../../../ai/tools/authorization", () => ({
  authorizeAgentToolCall: jest.fn(),
}))

jest.mock("@budibase/pro", () => ({
  __esModule: true,
  ai: {
    composeAutomationAgentSystemPrompt: jest.fn(() => "system prompt"),
  },
}))

import sdk from "../../.."
import {
  createTableTools,
  getBudibaseTools,
  createKnowledgeFilesTool,
  createKnowledgeSearchTool,
} from "../../../../ai/tools/budibase"
import { buildPromptAndTools } from "./utils"
import { generator } from "@budibase/backend-core/tests"
import { authorizeAgentToolCall } from "../../../../ai/tools/authorization"

describe("buildPromptAndTools", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getBudibaseTools).mockReturnValue([])
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
          enabledTools: requesterTools(),
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
          enabledTools: requesterTools(),
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
          enabledTools: requesterTools(),
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
          enabledTools: requesterTools("draft_tool"),
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

  it("uses the provided operation for building the prompt and tools", async () => {
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
          enabledTools: requesterTools(),
          knowledgeBases: [],
          allowKnowledgeSourceDownload: generator.bool(),
        },
        {
          id: "operation_2",
          name: "Knowledge support",
          live: true,
          promptInstructions: "Handle knowledge requests",
          enabledTools: requesterTools(),
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

  it("scopes table helpers to tables with explicitly enabled tools", async () => {
    jest.mocked(getBudibaseTools).mockReturnValue([
      {
        name: "ta_invoices_search_rows",
        readableName: "Invoices.search_rows",
        tableId: "ta_invoices",
        description: "Search invoices",
        sourceType: ToolType.INTERNAL_TABLE,
        sourceLabel: "Budibase",
        executionPolicy: {
          mode: "configurable",
          defaultPrincipal: ToolExecutionPrincipal.REQUESTER,
        },
        tool: {} as Tool,
      },
      {
        name: "ta_suppliers_search_rows",
        readableName: "Suppliers.search_rows",
        tableId: "ta_suppliers",
        description: "Search suppliers",
        sourceType: ToolType.INTERNAL_TABLE,
        sourceLabel: "Budibase",
        executionPolicy: {
          mode: "configurable",
          defaultPrincipal: ToolExecutionPrincipal.REQUESTER,
        },
        tool: {} as Tool,
      },
    ])
    const agent = {
      _id: "agent_tables",
      name: "Invoice Agent",
      aiconfig: "",
      operations: [
        {
          id: "operation_1",
          name: "Invoice lookup",
          live: true,
          enabledTools: requesterTools("ta_invoices_search_rows"),
          knowledgeBases: [],
          allowKnowledgeSourceDownload: false,
        },
      ],
    } satisfies Agent

    const result = await buildPromptAndTools(agent, agent.operations[0])

    expect(createTableTools).toHaveBeenCalledWith(["ta_invoices"])
    expect(Reflect.get(result.tools, "list_tables")).toBeDefined()
    expect(Reflect.get(result.tools, "get_table")).toBeDefined()
  })

  it("keeps configured tools available until execution authorization", async () => {
    jest.mocked(getBudibaseTools).mockReturnValue([
      {
        name: "ta_large_expenses_create_row",
        readableName: "Large expenses.create_row",
        tableId: "ta_large_expenses",
        description: "Create a large expense",
        sourceType: ToolType.INTERNAL_TABLE,
        sourceLabel: "Budibase",
        executionPolicy: {
          mode: "configurable",
          defaultPrincipal: ToolExecutionPrincipal.REQUESTER,
        },
        authorization: {
          permissionType: PermissionType.TABLE,
          permissionLevel: PermissionLevel.WRITE,
          resourceId: "ta_large_expenses",
        },
        tool: {} as Tool,
      },
    ])
    const agent = {
      _id: "agent_expenses",
      name: "Expense Agent",
      aiconfig: "",
      operations: [
        {
          id: "operation_1",
          name: "Track expenses",
          live: true,
          enabledTools: requesterTools("ta_large_expenses_create_row"),
          knowledgeBases: [],
          allowKnowledgeSourceDownload: false,
        },
      ],
    } satisfies Agent

    const result = await buildPromptAndTools(agent, agent.operations[0], {
      executionContext: {
        tenantId: "tenant_1",
        workspaceId: "app_1",
        agentId: agent._id,
        operationId: "operation_1",
        conversationId: "conversation_1",
        requester: {
          userId: "user_1",
          authorization: { mode: "current" },
        },
      },
    })

    expect(
      Reflect.get(result.tools, "ta_large_expenses_create_row")
    ).toBeDefined()
    expect(authorizeAgentToolCall).not.toHaveBeenCalled()
    expect(result.systemPrompt).toContain(
      "do not substitute a different tool or resource"
    )
  })
})
