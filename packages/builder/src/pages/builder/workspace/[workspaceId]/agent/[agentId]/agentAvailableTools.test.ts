import { ToolType, WebSearchProvider } from "@budibase/types"
import { describe, expect, it, vi } from "vitest"

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
  buildReadableToRuntimeBinding,
  getWebSearchRuntimeBinding,
  isWebSearchConfigured,
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
      storeTools: [
        {
          name: "find_rows",
          description: "Find rows",
          sourceType: ToolType.INTERNAL_TABLE,
          sourceLabel: "Employees",
        },
        {
          name: "api_search",
          description: "Search",
          sourceType: ToolType.SEARCH,
          sourceLabel: "Search tools",
        },
      ],
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
      toAgentPromptBindings({ tools: configuredTools, webSearchConfigured: true })
    ).toHaveLength(1)
  })

  it("builds readable to runtime binding map", () => {
    expect(
      buildReadableToRuntimeBinding([
        {
          name: "web_search",
          description: "",
          readableBinding: "search.web_search",
          runtimeBinding: "search_web_search",
        },
        {
          name: "find_rows",
          description: "",
          readableBinding: "budibase.find_rows",
          runtimeBinding: "",
        },
      ])
    ).toEqual({
      "search.web_search": "search_web_search",
    })
  })
})
