<script lang="ts">
  import { Body, notifications, Select, Button } from "@budibase/bbui"
  import {
    AIConfigType,
    ToolType,
    WebSearchProvider,
    type Agent,
    type ToolMetadata,
    type EnrichedBinding,
  } from "@budibase/types"
  import { agentsStore, aiConfigsStore, selectedAgent } from "@/stores/portal"
  import {
    datasources,
    restTemplates,
    workspaceDeploymentStore,
  } from "@/stores/builder"
  import { getRestTemplateIdentifier } from "@/stores/builder/datasources"
  import { onDestroy, onMount } from "svelte"
  import { bb } from "@/stores/bb"
  import { getIntegrationIcon, type IconInfo } from "@/helpers/integrationIcons"
  import type { AgentTool } from "./toolTypes"
  import {
    EditorModes,
    hbAutocomplete,
    bindingsToCompletions,
  } from "@/components/common/CodeEditor"
  import BudibaseLogo from "../logos/Budibase.svelte"
  import WebSearchLogo from "../logos/WebSearch.svelte"
  import RestLogo from "../logos/Rest.svelte"
  import {
    REST_TAG_ICON_URL,
    WEB_SEARCH_TAG_ICON_URL,
  } from "../logos/tagIconUrls"
  import { DATASOURCE_TAG_ICON_URLS } from "../datasourceIconUrls"
  import BudibaseLogoSvg from "assets/bb-emblem.svg"
  import { shouldAutoSelectAgentModel } from "./configUtils"
  import { getIncludedToolRuntimeBindings } from "./toolBindingUtils"
  import OperationsSection from "./OperationsSection.svelte"
  import WebSearchConfigModal from "./WebSearchConfigModal.svelte"

  // Code editor tag icons must be URL strings (see `hbsTags.ts`).
  // Use URLs derived from the same Phosphor SVG paths as the Svelte logo components.
  const WebSearchIconSvg = WEB_SEARCH_TAG_ICON_URL
  const RestIconSvg = REST_TAG_ICON_URL
  const AUTO_SAVE_DEBOUNCE_MS = 800
  // Agent state
  let draftAgentId: string | undefined = $state()
  let draft = $state<Agent>({
    name: "",
    description: "",
    aiconfig: "",
    goal: "",
    icon: "",
    iconColor: "",
    operations: [],
  })

  let autoSaveTimeout: ReturnType<typeof setTimeout> | undefined
  let saving = $state(false)
  let webSearchConfigModal: WebSearchConfigModal | undefined = $state()

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let completionConfigs = $derived($aiConfigsStore.customConfigs || [])
  let modelOptions = $derived(
    completionConfigs.map(config => ({
      label: config.name || config._id || "Unnamed",
      value: config._id || "",
    }))
  )

  // Web search Config
  let lastWebSearchConfigId: string | undefined = $state()
  let webSearchConfig = $derived(
    $aiConfigsStore.customConfigs.find(config => config._id === draft.aiconfig)
      ?.webSearchConfig
  )
  let webSearchConfigured = $derived(
    !!webSearchConfig?.apiKey && !!webSearchConfig.provider
  )
  let toolsLoaded = $derived(!!$agentsStore.tools)

  function enrichToolMetadata(tool: ToolMetadata): AgentTool {
    const { sourceType, sourceLabel } = tool
    const prefix = getBindingPrefix(sourceType, sourceLabel)
    const { icon, tagIconUrl } = resolveAgentToolIcons(tool, {
      sourceType,
      sourceLabel,
    })
    const displayName = tool.readableName || tool.name
    return {
      ...tool,
      sourceLabel,
      sourceType,
      readableBinding: `${prefix}.${displayName}`,
      runtimeBinding: tool.name,
      icon,
      tagIconUrl,
    }
  }

  function createWebSearchTool(): AgentTool {
    const webSearchTool: ToolMetadata = {
      name: "web_search",
      description: "Configure web search",
      sourceType: ToolType.SEARCH,
      sourceLabel: "Search",
    }
    const enriched = enrichToolMetadata(webSearchTool)
    return {
      ...enriched,
      runtimeBinding:
        getWebSearchRuntimeBinding(webSearchConfigured, webSearchConfig) || "",
    }
  }

  let availableTools: AgentTool[] = $derived.by(() => {
    const tools = $agentsStore.tools || []
    const mappedTools = tools
      .filter(tool => tool.sourceType !== ToolType.SEARCH)
      .map(enrichToolMetadata)
    return [createWebSearchTool(), ...mappedTools]
  })

  // Build lookup maps from readable binding to runtime binding and icon URL
  let { readableToRuntimeBinding, readableToIcon } = $derived.by(() => {
    const runtimeMap: Record<string, string> = {}
    const iconMap: Record<string, string | undefined> = {}
    for (const tool of availableTools) {
      if (tool.readableBinding) {
        if (tool.runtimeBinding) {
          runtimeMap[tool.readableBinding] = tool.runtimeBinding
        }
        iconMap[tool.readableBinding] = tool.tagIconUrl
      }
    }
    return { readableToRuntimeBinding: runtimeMap, readableToIcon: iconMap }
  })

  let promptBindings: EnrichedBinding[] = $derived.by(() => {
    return availableTools
      .filter(tool => !!tool.name)
      .filter(
        tool =>
          tool.sourceType !== ToolType.SEARCH ||
          (webSearchConfigured && tool.runtimeBinding)
      )
      .map(tool => ({
        runtimeBinding: tool.runtimeBinding,
        readableBinding: tool.readableBinding,
        category: getSectionName(tool.sourceType, tool.sourceLabel),
        display: {
          name:
            tool.sourceType === ToolType.SEARCH
              ? "Web search"
              : formatToolLabel(tool),
          type: "tool",
          rank: tool.sourceType === ToolType.SEARCH ? 0 : 1,
        },
        icon: tool.tagIconUrl,
      }))
  })

  let promptCompletions = $derived.by(() => {
    return promptBindings.length > 0
      ? [
          hbAutocomplete([
            ...bindingsToCompletions(promptBindings, EditorModes.Handlebars),
          ]),
        ]
      : []
  })

  $effect(() => {
    const agent = currentAgent
    if (agent && agent._id !== draftAgentId) {
      draft = {
        name: agent.name || "",
        description: agent.description || "",
        aiconfig: agent.aiconfig || "",
        goal: agent.goal || "",
        icon: agent.icon || "",
        iconColor: agent.iconColor || "",
        operations:
          agent.operations?.map(op => ({
            id: op.id,
            name: op.name,
            promptInstructions: op.promptInstructions,
          })) || [],
      }
      draftAgentId = agent._id
    }
  })

  $effect(() => {
    const nextAiConfigId = draft.aiconfig || undefined
    if (nextAiConfigId !== lastWebSearchConfigId) {
      lastWebSearchConfigId = nextAiConfigId
      agentsStore.fetchTools(nextAiConfigId)
    }
  })

  $effect(() => {
    if (
      currentAgent &&
      shouldAutoSelectAgentModel({
        modelOptions,
        agentAiconfig: currentAgent.aiconfig,
        draftAiconfig: draft.aiconfig,
      })
    ) {
      draft.aiconfig = modelOptions[0].value
      scheduleSave(true)
    }
  })

  function resolveAgentToolIcons(
    tool: ToolMetadata,
    {
      sourceType,
      sourceLabel,
    }: { sourceType: ToolType | undefined; sourceLabel: string | undefined }
  ): { icon?: IconInfo; tagIconUrl?: string } {
    const resolveDatasourceIcon = (sourceIconType?: string) => {
      if (!sourceIconType) {
        return undefined
      }
      const integrationIcon = getIntegrationIcon(sourceIconType)
      if (!integrationIcon) {
        return undefined
      }
      if (integrationIcon.url) {
        return {
          icon: integrationIcon,
          tagIconUrl: integrationIcon.url,
        }
      }
      if (integrationIcon.icon) {
        const iconKey = sourceIconType.toUpperCase()
        const tagIconUrl =
          DATASOURCE_TAG_ICON_URLS[iconKey] ||
          DATASOURCE_TAG_ICON_URLS.CUSTOM ||
          BudibaseLogoSvg
        return { icon: integrationIcon, tagIconUrl }
      }
      return undefined
    }

    if (
      sourceType === ToolType.INTERNAL_TABLE ||
      sourceType === ToolType.EXTERNAL_TABLE ||
      sourceType === ToolType.AUTOMATION
    ) {
      if (sourceType === ToolType.EXTERNAL_TABLE) {
        const externalIcon = resolveDatasourceIcon(tool.sourceIconType)
        if (externalIcon) {
          return externalIcon
        }
      }
      return {
        icon: { icon: BudibaseLogo },
        tagIconUrl: BudibaseLogoSvg,
      }
    }

    if (sourceType === ToolType.SEARCH) {
      return {
        icon: { icon: WebSearchLogo },
        tagIconUrl: WebSearchIconSvg,
      }
    }

    if (sourceType === ToolType.REST_QUERY) {
      const ds = $datasources.list.find(d => d.name === sourceLabel)
      const templateIconUrl = getRestTemplateIdentifier(ds)
        ? restTemplates.get(getRestTemplateIdentifier(ds))?.icon
        : undefined

      if (templateIconUrl) {
        return { icon: { url: templateIconUrl }, tagIconUrl: templateIconUrl }
      }

      return { icon: { icon: RestLogo }, tagIconUrl: RestIconSvg }
    }

    if (sourceType === ToolType.DATASOURCE_QUERY) {
      const datasourceIcon = resolveDatasourceIcon(tool.sourceIconType)
      if (datasourceIcon) {
        return datasourceIcon
      }
      return {
        icon: { icon: BudibaseLogo },
        tagIconUrl: BudibaseLogoSvg,
      }
    }

    return {}
  }

  function sanitizeString(str: string, lowercase = false) {
    const base = lowercase ? str.toLowerCase() : str
    const pattern = lowercase ? /[^a-z0-9]+/g : /[^a-zA-Z0-9]+/g
    return base.replace(pattern, "_").replace(/^_|_$/g, "")
  }
  function getBindingPrefix(
    sourceType: ToolType | undefined,
    sourceLabel: string | undefined
  ): string {
    if (
      sourceType === ToolType.INTERNAL_TABLE ||
      sourceType === ToolType.AUTOMATION
    ) {
      return "budibase"
    }
    if (sourceType === ToolType.EXTERNAL_TABLE) {
      return sourceLabel ? sanitizeString(sourceLabel) : "external"
    }
    if (sourceType === ToolType.SEARCH) {
      return "search"
    }
    if (sourceType === ToolType.REST_QUERY && sourceLabel) {
      return `api.${sanitizeString(sourceLabel, true)}`
    }
    if (sourceType === ToolType.DATASOURCE_QUERY) {
      return sourceLabel ? sanitizeString(sourceLabel, true) : "datasource"
    }
    return "tool"
  }

  function getSectionName(
    sourceType: ToolType | undefined,
    sourceLabel?: string
  ): string {
    if (sourceType === ToolType.INTERNAL_TABLE) {
      return "Budibase"
    }
    if (sourceType === ToolType.AUTOMATION) {
      return "Automations"
    }
    if (sourceType === ToolType.EXTERNAL_TABLE) {
      return sourceLabel || "External"
    }
    if (sourceType === ToolType.SEARCH) {
      return "Knowledge sources"
    }
    if (sourceType === ToolType.REST_QUERY) {
      return "API tools"
    }
    if (sourceType === ToolType.DATASOURCE_QUERY) {
      return sourceLabel || "Datasource tools"
    }
    return "Tools"
  }

  // list_tables -> List tables
  const formatToolLabel = (tool: AgentTool) =>
    (tool.readableName || tool.name)
      .split(".")
      .map(part =>
        part
          .split("_")
          .join(" ")
          .replace(/\b\w/g, l => l.toUpperCase())
      )
      .join(".")

  function getWebSearchRuntimeBinding(
    configured?: boolean,
    config?: typeof webSearchConfig
  ) {
    if (!configured || !config) {
      return undefined
    }
    if (
      config.provider === WebSearchProvider.EXA ||
      config.provider === WebSearchProvider.PARALLEL
    ) {
      return "search_web_search"
    }
    return undefined
  }

  async function saveAgent({
    showNotifications = true,
  }: {
    showNotifications?: boolean
  }) {
    if (!currentAgent) return
    if (saving) return

    saving = true
    try {
      const instructions =
        currentAgent.operations?.map(o => o.promptInstructions).join("\n\n") ||
        ""
      const enabledTools = getIncludedToolRuntimeBindings(
        instructions,
        readableToRuntimeBinding
      )
      await agentsStore.updateAgent({
        ...currentAgent,
        ...draft,
        enabledTools,
      })

      if (showNotifications) {
        notifications.success("Agent saved successfully")
      }
      await agentsStore.fetchAgents()
      await workspaceDeploymentStore.fetch()
    } catch (error) {
      notifications.error(`Error saving agent: ${JSON.stringify(error)}`)
    } finally {
      saving = false
    }
  }

  async function deleteOperationKnowledge() {
    if (!currentAgent?._id) {
      return
    }

    const agentId = currentAgent._id
    const knowledge = await agentsStore.fetchAgentKnowledge(agentId)
    const fileDeletes = (knowledge.files || [])
      .map(file => file._id)
      .filter((id): id is string => !!id)
      .map(fileId => agentsStore.deleteAgentFile(agentId, fileId))

    const sourceDisconnects = (currentAgent.knowledgeSources || [])
      .map(source => source.config?.site?.id)
      .filter((id): id is string => !!id)
      .map(siteId => agentsStore.disconnectAgentSharePointSite(agentId, siteId))

    await Promise.all([...fileDeletes, ...sourceDisconnects])
  }

  const scheduleSave = (immediate = false) => {
    clearAutoSave()

    if (immediate) {
      saveAgent({ showNotifications: false })
      return
    }

    autoSaveTimeout = setTimeout(() => {
      saveAgent({ showNotifications: false })
      autoSaveTimeout = undefined
    }, AUTO_SAVE_DEBOUNCE_MS)
  }
  const clearAutoSave = () => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = undefined
    }
  }

  onMount(async () => {
    if (!$agentsStore.agentsLoaded) {
      await agentsStore.init()
    }
    await aiConfigsStore.fetch()

    if (draft.aiconfig) {
      agentsStore.fetchTools(draft.aiconfig)
    }
  })

  onDestroy(() => {
    const shouldFlushSave = !!autoSaveTimeout
    clearAutoSave()
    if (shouldFlushSave) {
      saveAgent({ showNotifications: false })
    }
  })

  const openWebSearchConfigModal = () => {
    webSearchConfigModal?.show()
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="llm-section-container">
  <div class="llm-header">
    <Body size="XS" color="var(--spectrum-global-color-gray-900)">AI Model</Body
    >
    <Body size="XS" color="var(--spectrum-global-color-gray-700)">
      Choose the model that runs this agent. Use{" "}
      <button
        class="link-button"
        onclick={() => bb.settings(`/connections/${AIConfigType.COMPLETIONS}`)}
      >
        AI Connectors
      </button>{" "}
      to add or change providers and models.
    </Body>
  </div>
  <div class="form-row">
    <div class="form-field">
      {#if modelOptions.length === 0}
        <Button
          secondary
          size="S"
          icon="sparkle"
          iconWeight="fill"
          iconColor="#8777D1"
          on:click={() =>
            bb.settings(`/connections/${AIConfigType.COMPLETIONS}`)}
        >
          Connect AI Model
        </Button>
      {:else}
        <Select
          bind:value={draft.aiconfig}
          placeholder={false}
          options={modelOptions}
          size="S"
          on:change={() => scheduleSave(true)}
        />
      {/if}
    </div>
  </div>
</div>

<OperationsSection
  bind:agent={draft}
  {promptBindings}
  bindingIcons={readableToIcon}
  completions={promptCompletions}
  {toolsLoaded}
  {availableTools}
  {webSearchConfigured}
  onAddApiConnection={() => bb.settings("/connections/apis")}
  onConfigureWebSearch={openWebSearchConfigModal}
  onDeleteOperation={deleteOperationKnowledge}
  onUpdated={() => scheduleSave(true)}
/>

<WebSearchConfigModal
  bind:this={webSearchConfigModal}
  aiconfigId={draft.aiconfig}
/>

<style>
  .llm-section-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-l);
    flex-wrap: wrap;
  }

  .llm-header {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 200px;
    width: 260px;
    max-width: 600px;
    gap: 2px;
  }

  .llm-section-container .form-row {
    flex-shrink: 0;
  }

  .llm-section-container .form-row :global(.spectrum-Picker) {
    width: 240px;
  }

  .llm-section-container .form-row :global(.spectrum-Picker-label) {
    color: var(--spectrum-global-color-gray-900);
  }

  .llm-section-container .form-row :global(.spectrum-Button) {
    gap: calc(var(--spacing-s) - 2px);
  }

  .link-button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: var(--spectrum-global-color-gray-800);
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
  }

  .link-button:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .llm-header > :global(.spectrum-Body):first-child {
    font-weight: 500;
  }
</style>
