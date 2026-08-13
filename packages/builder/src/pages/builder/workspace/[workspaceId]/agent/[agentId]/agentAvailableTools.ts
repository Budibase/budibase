import type { EnrichedBinding, ToolMetadata, WebSearchConfig } from "@budibase/types"
import { ToolType, WebSearchProvider } from "@budibase/types"
import { enrichAgentTool } from "./agentToolUtils"
import type { AgentTool } from "./toolTypes"

const WEB_SEARCH_TOOL: ToolMetadata = {
  name: "web_search",
  description: "Configure web search",
  sourceType: ToolType.SEARCH,
  sourceLabel: "Search tools",
  executionPolicy: {
    mode: "admin",
  },
}

export const isWebSearchConfigured = (
  webSearchConfig?: WebSearchConfig | null
) => !!webSearchConfig?.apiKey && !!webSearchConfig?.provider

export const getWebSearchRuntimeBinding = ({
  webSearchConfigured,
  webSearchConfig,
}: {
  webSearchConfigured: boolean
  webSearchConfig?: WebSearchConfig | null
}) => {
  if (!webSearchConfigured || !webSearchConfig) {
    return undefined
  }
  if (
    webSearchConfig.provider === WebSearchProvider.EXA ||
    webSearchConfig.provider === WebSearchProvider.PARALLEL
  ) {
    return "search_web_search"
  }
  return undefined
}

export const formatAgentToolLabel = (tool: AgentTool) =>
  (tool.readableName || tool.name)
    .split(".")
    .map(part =>
      part
        .split("_")
        .join(" ")
        .replace(/\b\w/g, letter => letter.toUpperCase())
    )
    .join(".")

export const createRestTemplateIconResolver = ({
  datasourceList,
  getRestTemplateIcon,
}: {
  datasourceList: Array<{
    name?: string
    restTemplateId?: string
    restTemplate?: string
  }>
  getRestTemplateIcon: (identifier: string) => string | undefined
}) => {
  return (sourceLabel?: string) => {
    const datasource = datasourceList.find(item => item.name === sourceLabel)
    const identifier = datasource?.restTemplateId || datasource?.restTemplate
    return identifier ? getRestTemplateIcon(identifier) : undefined
  }
}

export const buildAvailableAgentTools = ({
  storeTools,
  webSearchConfigured,
  webSearchConfig,
  resolveRestTemplateIcon,
}: {
  storeTools: ToolMetadata[]
  webSearchConfigured: boolean
  webSearchConfig?: WebSearchConfig | null
  resolveRestTemplateIcon?: (sourceLabel?: string) => string | undefined
}): AgentTool[] => {
  const enrichTool = (tool: ToolMetadata) =>
    enrichAgentTool(tool, { resolveRestTemplateIcon })

  const webSearchTool = enrichTool(WEB_SEARCH_TOOL)
  const runtimeBinding = getWebSearchRuntimeBinding({
    webSearchConfigured,
    webSearchConfig,
  })

  const mappedTools = storeTools
    .filter(tool => tool.sourceType !== ToolType.SEARCH)
    .map(enrichTool)

  return [
    {
      ...webSearchTool,
      runtimeBinding: runtimeBinding || "",
    },
    ...mappedTools,
  ]
}

export const buildReadableToRuntimeBinding = (tools: AgentTool[]) => {
  const runtimeMap: Record<string, string> = {}
  for (const tool of tools) {
    if (tool.readableBinding && tool.runtimeBinding) {
      runtimeMap[tool.readableBinding] = tool.runtimeBinding
    }
  }
  return runtimeMap
}

export const toAgentPromptBindings = ({
  tools,
  webSearchConfigured,
}: {
  tools: AgentTool[]
  webSearchConfigured: boolean
}): EnrichedBinding[] =>
  tools
    .filter(
      tool =>
        tool.sourceType !== ToolType.SEARCH ||
        (webSearchConfigured && tool.runtimeBinding)
    )
    .map(tool => ({
      runtimeBinding: tool.runtimeBinding,
      readableBinding: tool.readableBinding,
      category: tool.sourceLabel || "Tools",
      display: {
        name:
          tool.sourceType === ToolType.SEARCH
            ? "Web search"
            : formatAgentToolLabel(tool),
        type: "tool",
        rank: tool.sourceType === ToolType.SEARCH ? 0 : 1,
      },
      icon: tool.tagIconUrl,
    }))
