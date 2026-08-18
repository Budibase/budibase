import { ToolType, WebSearchProvider } from "@budibase/types"
import { describe, expect, it, vi } from "vitest"
import type { AgentTool } from "./toolTypes"

const tableTool = {
  name: "find_rows",
  description: "Find rows",
  sourceType: ToolType.INTERNAL_TABLE,
  sourceLabel: "Employees",
  executionPolicy: { mode: "admin" as const },
}

const searchTool = {
  name: "api_search",
  description: "Search",
  sourceType: ToolType.SEARCH,
  sourceLabel: "Search tools",
  executionPolicy: { mode: "admin" as const },
}

vi.mock("./agentToolUtils", () => ({
  enrichAgentTool: (tool: {
    name: string
    description: string
    sourceType: ToolType
    sourceLabel?: string
  }) => ({
    ...tool,
    readableBinding: `${tool.sourceLabel || "tool"}.${tool.name}`,
    runtimeBinding: tool.name,
  }),
}))

import {
  buildAvailableAgentTools,
  buildBindingIcons,
  buildReadableToRuntimeBinding,
  getAgentWebSearchConfig,
  getWebSearchRuntimeBinding,
  isWebSearchConfigured,
  resolveAvailableAgentTools,
  toAgentPromptBindings,
} from "./agentAvailableTools"

describe("agentAvailableTools", () => {
  it("detects configured web search", () => {
    expect(
      isWebSearchConfigured({
        provider: WebSearchProvider.EXA,
        apiKey: "key",
      })
    ).toBe(true)
    expect(
      isWebSearchConfigured({
        provider: WebSearchProvider.EXA,
        apiKey: "",
      })
    ).toBe(false)
  })

  it("returns search_web_search runtime binding when configured", () => {
    expect(
      getWebSearchRuntimeBinding({
        webSearchConfigured: true,
        webSearchConfig: {
          provider: WebSearchProvider.PARALLEL,
          apiKey: "key",
        },
      })
    ).toBe("search_web_search")
    expect(
      getWebSearchRuntimeBinding({
        webSearchConfigured: false,
        webSearchConfig: {
          provider: WebSearchProvider.EXA,
          apiKey: "key",
        },
      })
    ).toBeUndefined()
  })

  it("prepends web search and filters api search tools", () => {
    const tools = buildAvailableAgentTools({
      storeTools: [tableTool, searchTool],
      webSearchConfigured: true,
      webSearchConfig: {
        provider: WebSearchProvider.EXA,
        apiKey: "key",
      },
    })

    expect(tools).toHaveLength(2)
    expect(tools[0].name).toBe("web_search")
    expect(tools[0].runtimeBinding).toBe("search_web_search")
    expect(tools[1].name).toBe("find_rows")
  })

  it("omits unconfigured web search from prompt bindings", () => {
    const tools = buildAvailableAgentTools({
      storeTools: [],
      webSearchConfigured: false,
      webSearchConfig: undefined,
    })

    expect(
      toAgentPromptBindings({ tools, webSearchConfigured: false })
    ).toHaveLength(0)

    const configuredTools = buildAvailableAgentTools({
      storeTools: [],
      webSearchConfigured: true,
      webSearchConfig: {
        provider: WebSearchProvider.EXA,
        apiKey: "key",
      },
    })

    expect(
      toAgentPromptBindings({
        tools: configuredTools,
        webSearchConfigured: true,
      })
    ).toHaveLength(1)
  })

  it("resolves available tools with datasource icons and web search", () => {
    const tools = resolveAvailableAgentTools({
      storeTools: [tableTool],
      datasourceList: [],
      getRestTemplateIcon: () => undefined,
      webSearchConfig: {
        provider: WebSearchProvider.EXA,
        apiKey: "key",
      },
    })

    expect(tools).toHaveLength(2)
    expect(tools[0].name).toBe("web_search")
    expect(tools[0].runtimeBinding).toBe("search_web_search")
  })

  it("gets web search config for an ai config id", () => {
    expect(
      getAgentWebSearchConfig(
        [
          {
            _id: "config-1",
            webSearchConfig: {
              provider: WebSearchProvider.EXA,
              apiKey: "key",
            },
          },
        ],
        "config-1"
      )?.apiKey
    ).toBe("key")
  })

  it("builds binding icons from prompt bindings", () => {
    expect(
      buildBindingIcons([
        {
          readableBinding: "search.web_search",
          runtimeBinding: "search_web_search",
          category: "Search tools",
          icon: "https://example.com/search.svg",
        },
      ])
    ).toEqual({
      "search.web_search": "https://example.com/search.svg",
    })
  })

  it("builds readable to runtime binding map", () => {
    expect(
      buildReadableToRuntimeBinding([
        {
          name: "web_search",
          description: "",
          sourceType: ToolType.SEARCH,
          executionPolicy: { mode: "admin" },
          readableBinding: "search.web_search",
          runtimeBinding: "search_web_search",
        },
        {
          name: "find_rows",
          description: "",
          sourceType: ToolType.INTERNAL_TABLE,
          executionPolicy: { mode: "admin" },
          readableBinding: "budibase.find_rows",
          runtimeBinding: "",
        },
      ] satisfies AgentTool[])
    ).toEqual({
      "search.web_search": "search_web_search",
    })
  })
})
