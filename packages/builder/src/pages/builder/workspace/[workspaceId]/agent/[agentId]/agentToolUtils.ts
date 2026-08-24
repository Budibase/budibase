import {
  getReadableQueryToolBinding,
  isQueryToolType,
} from "@budibase/shared-core"
import { ToolType, type ToolMetadata } from "@budibase/types"
import { getIntegrationIcon, type IconInfo } from "@/helpers/integrationIcons"
import { ToolBindingPrefix } from "@/constants"
import BudibaseLogo from "../logos/Budibase.svelte"
import RestLogo from "../logos/Rest.svelte"
import WebSearchLogo from "../logos/WebSearch.svelte"
import { DATASOURCE_TAG_ICON_URLS } from "../datasourceIconUrls"
import {
  ESCALATION_TAG_ICON_URL,
  REST_TAG_ICON_URL,
  WEB_SEARCH_TAG_ICON_URL,
} from "../logos/tagIconUrls"
import BudibaseLogoSvg from "assets/bb-emblem.svg"
import type { AgentTool } from "./toolTypes"

interface EnrichAgentToolOptions {
  resolveRestTemplateIcon?: (sourceLabel?: string) => string | undefined
}

const sanitizeString = (value: string) =>
  value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "")

const getBindingPrefix = (
  sourceType: ToolType | undefined,
  sourceLabel: string | undefined
) => {
  if (
    sourceType === ToolType.INTERNAL_TABLE ||
    sourceType === ToolType.AUTOMATION
  ) {
    return ToolBindingPrefix.BUDIBASE
  }
  if (sourceType === ToolType.EXTERNAL_TABLE) {
    return sourceLabel
      ? sanitizeString(sourceLabel)
      : ToolBindingPrefix.EXTERNAL
  }
  if (sourceType === ToolType.SEARCH) return ToolBindingPrefix.SEARCH
  if (sourceType === ToolType.ESCALATION) return ToolBindingPrefix.ESCALATION
  return ToolBindingPrefix.TOOL
}

const resolveDatasourceIcon = (sourceIconType?: string) => {
  if (!sourceIconType) return undefined
  const icon = getIntegrationIcon(sourceIconType)
  if (!icon) return undefined
  if (icon.url) return { icon, tagIconUrl: icon.url }
  if (icon.icon) {
    return {
      icon,
      tagIconUrl:
        DATASOURCE_TAG_ICON_URLS[sourceIconType.toUpperCase()] ||
        DATASOURCE_TAG_ICON_URLS.CUSTOM ||
        BudibaseLogoSvg,
    }
  }
  return undefined
}

const resolveAgentToolIcons = (
  tool: ToolMetadata,
  options: EnrichAgentToolOptions
): { icon?: IconInfo; tagIconUrl?: string } => {
  const { sourceType } = tool
  if (
    sourceType === ToolType.INTERNAL_TABLE ||
    sourceType === ToolType.EXTERNAL_TABLE ||
    sourceType === ToolType.AUTOMATION
  ) {
    if (sourceType === ToolType.EXTERNAL_TABLE) {
      const externalIcon = resolveDatasourceIcon(tool.sourceIconType)
      if (externalIcon) return externalIcon
    }
    return { icon: { icon: BudibaseLogo }, tagIconUrl: BudibaseLogoSvg }
  }
  if (sourceType === ToolType.SEARCH) {
    return {
      icon: { icon: WebSearchLogo },
      tagIconUrl: WEB_SEARCH_TAG_ICON_URL,
    }
  }
  if (sourceType === ToolType.ESCALATION) {
    return { tagIconUrl: ESCALATION_TAG_ICON_URL }
  }
  if (sourceType === ToolType.REST_QUERY) {
    const templateIconUrl = options.resolveRestTemplateIcon?.(tool.sourceLabel)
    return templateIconUrl
      ? { icon: { url: templateIconUrl }, tagIconUrl: templateIconUrl }
      : { icon: { icon: RestLogo }, tagIconUrl: REST_TAG_ICON_URL }
  }
  if (sourceType === ToolType.DATASOURCE_QUERY) {
    return (
      resolveDatasourceIcon(tool.sourceIconType) || {
        icon: { icon: BudibaseLogo },
        tagIconUrl: BudibaseLogoSvg,
      }
    )
  }
  return {}
}

export const enrichAgentTool = (
  tool: ToolMetadata,
  options: EnrichAgentToolOptions = {}
): AgentTool => {
  const displayName = tool.readableName || tool.name
  const readableBinding = isQueryToolType(tool.sourceType)
    ? getReadableQueryToolBinding({
        sourceType: tool.sourceType,
        sourceLabel: tool.sourceLabel,
        queryName: displayName,
      })
    : `${getBindingPrefix(tool.sourceType, tool.sourceLabel)}.${displayName}`
  const { icon, tagIconUrl } = resolveAgentToolIcons(tool, options)
  return {
    ...tool,
    readableBinding,
    runtimeBinding: tool.name,
    icon,
    tagIconUrl,
    fallbackIcon: tool.sourceType === ToolType.ESCALATION ? "User" : undefined,
  }
}
