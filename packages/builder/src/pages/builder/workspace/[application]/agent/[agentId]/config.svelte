<script lang="ts">
  import { Body, notifications, Select, Button, Icon } from "@budibase/bbui"
  import {
    AIConfigType,
    ToolType,
    WebSearchProvider,
    type Agent,
    type ToolMetadata,
    type EnrichedBinding,
    type InsertAtPositionFn,
    type CaretPositionFn,
  } from "@budibase/types"
  import { agentsStore, aiConfigsStore, selectedAgent } from "@/stores/portal"
  import {
    datasources,
    restTemplates,
    automationStore,
    queries,
  } from "@/stores/builder"
  import { onDestroy, onMount, untrack } from "svelte"
  import { bb } from "@/stores/bb"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { getIntegrationIcon, type IconInfo } from "@/helpers/integrationIcons"
  import ToolsDropdown from "./ToolsDropdown.svelte"
  import ToolIcon from "./ToolIcon.svelte"
  import type { AgentTool } from "./toolTypes"
  import WebSearchConfigModal from "./WebSearchConfigModal.svelte"
  import {
    EditorModes,
    hbAutocomplete,
    hbInsert,
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
  import { goto } from "@roxi/routify"
  import BudibaseLogoSvg from "assets/bb-emblem.svg"

  $goto
  // Code editor tag icons must be URL strings (see `hbsTags.ts`).
  // Use URLs derived from the same Phosphor SVG paths as the Svelte logo components.
  const WebSearchIconSvg = WEB_SEARCH_TAG_ICON_URL
  const RestIconSvg = REST_TAG_ICON_URL
  const AUTO_SAVE_DEBOUNCE_MS = 800
  const DEFAULT_PROMPT_INSTRUCTIONS = `**Agent role**
What is this agent responsible for?

**Inputs**
What information does the agent receive?

**Actions**
- What should the agent do?
- When should it use tools or APIs?

**Output**
- What should the response look like?
- Include any structure, formatting, or fields required.

**Rules**
Any constraints the agent must follow.
`

  // Agent state
  let draftAgentId: string | undefined = $state()
  let draft = $state({
    name: "",
    description: "",
    aiconfig: "",
    goal: "",
    promptInstructions: DEFAULT_PROMPT_INSTRUCTIONS,
    icon: "",
    iconColor: "",
  })

  let insertAtPos: InsertAtPositionFn | undefined = $state()
  let toolSearch = $state("")
  let autoSaveTimeout: ReturnType<typeof setTimeout> | undefined
  let saving = $state(false)
  let getCaretPosition: CaretPositionFn | undefined = $state.raw()

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let completionConfigs = $derived(
    ($aiConfigsStore.customConfigs || []).filter(
      config => config.configType !== AIConfigType.EMBEDDINGS
    )
  )
  let modelOptions = $derived(
    completionConfigs.map(config => ({
      label: config.name || config._id || "Unnamed",
      value: config._id || "",
    }))
  )

  // Web search Config
  let webSearchConfigModal = $state<WebSearchConfigModal>()
  let lastWebSearchConfigId: string | undefined = $state()
  let pendingWebSearchInsert = $state(false)
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
        iconMap[tool.readableBinding] = tool.tagIconUrl
        if (tool.runtimeBinding) {
          runtimeMap[tool.readableBinding] = tool.runtimeBinding
        }
      }
    }
    return { readableToRuntimeBinding: runtimeMap, readableToIcon: iconMap }
  })

  /**
   * Doing this and key'ing the CodeEditor triggers a re-mount of the editor.
   * Else we would need to do some complex logic in CodeEditor and it's not worth it
   */
  let resolvedIconCount = $derived(
    Object.values(readableToIcon).filter(Boolean).length
  )
  let includedToolRuntimeBindings = $derived(
    getIncludedToolRuntimeBindings(
      draft.promptInstructions,
      readableToRuntimeBinding
    )
  )
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

  let includedToolsWithDetails = $derived(
    includedToolRuntimeBindings
      .map(runtimeBinding =>
        availableTools.find(tool => tool.runtimeBinding === runtimeBinding)
      )
      .filter((tool): tool is AgentTool => !!tool)
  )

  let filteredTools = $derived.by(() => {
    return availableTools.filter(tool => {
      const query = toolSearch.toLowerCase()
      return (
        tool.name?.toLowerCase().includes(query) ||
        tool.readableBinding?.toLowerCase().includes(query)
      )
    })
  })
  let toolSections = $derived(
    filteredTools.reduce<Record<string, AgentTool[]>>((acc, tool) => {
      const key = getSectionName(tool.sourceType, tool.sourceLabel)
      acc[key] = acc[key] || []
      acc[key].push(tool)
      return acc
    }, {})
  )

  $effect(() => {
    const agent = currentAgent
    if (agent && agent._id !== draftAgentId) {
      draft = {
        name: agent.name || "",
        description: agent.description || "",
        aiconfig: agent.aiconfig || "",
        goal: agent.goal || "",
        promptInstructions:
          agent.promptInstructions ?? DEFAULT_PROMPT_INSTRUCTIONS,
        icon: agent.icon || "",
        iconColor: agent.iconColor || "",
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
    if (modelOptions.length > 0 && currentAgent) {
      // Only auto-select if agent doesn't have an aiconfig set (undefined/null/empty)
      const agentHasAiconfig =
        currentAgent.aiconfig != null && currentAgent.aiconfig !== ""
      const currentValue = draft.aiconfig || ""
      // Only set default if agent never had a value and current draft is empty
      if (!agentHasAiconfig && !currentValue) {
        draft.aiconfig = modelOptions[0].value
      }
    }
  })

  $effect(() => {
    if (pendingWebSearchInsert && webSearchConfigured) {
      const searchTool = availableTools.find(
        tool => tool.sourceType === ToolType.SEARCH
      )
      if (searchTool?.readableBinding) {
        untrack(() => {
          insertToolBinding(searchTool.readableBinding!)
          pendingWebSearchInsert = false
        })
      }
    }
  })

  function resolveAgentToolIcons(
    tool: ToolMetadata,
    {
      sourceType,
      sourceLabel,
    }: { sourceType: ToolType | undefined; sourceLabel: string | undefined }
  ): { icon?: IconInfo; tagIconUrl?: string } {
    if (
      sourceType === ToolType.INTERNAL_TABLE ||
      sourceType === ToolType.EXTERNAL_TABLE ||
      sourceType === ToolType.AUTOMATION
    ) {
      if (sourceType === ToolType.EXTERNAL_TABLE && tool.sourceIconType) {
        const integrationIcon = getIntegrationIcon(tool.sourceIconType)
        if (integrationIcon) {
          if (integrationIcon.url) {
            return {
              icon: integrationIcon,
              tagIconUrl: integrationIcon.url,
            }
          }
          if (integrationIcon.icon) {
            const iconKey = tool.sourceIconType?.toUpperCase()
            const tagIconUrl = iconKey
              ? DATASOURCE_TAG_ICON_URLS[iconKey] ||
                DATASOURCE_TAG_ICON_URLS.CUSTOM ||
                BudibaseLogoSvg
              : BudibaseLogoSvg
            return { icon: integrationIcon, tagIconUrl }
          }
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
      const templateIconUrl = ds?.restTemplate
        ? restTemplates.getByName(ds.restTemplate)?.icon
        : undefined

      if (templateIconUrl) {
        return { icon: { url: templateIconUrl }, tagIconUrl: templateIconUrl }
      }

      return { icon: { icon: RestLogo }, tagIconUrl: RestIconSvg }
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
    return "Tools"
  }

  function normaliseToolNameForMatch(name: string) {
    const sanitised = name.replace(/[^a-zA-Z0-9_-]/g, "_")
    return sanitised.length > 64
      ? `${sanitised.substring(0, 64)}...`
      : sanitised
  }

  const findResourceByName = <T extends { name?: string; _id?: string }>(
    list: T[] | undefined,
    tool: AgentTool
  ) => {
    const targetName = normaliseToolNameForMatch(
      tool.runtimeBinding || tool.name || ""
    )
    return list?.find(
      item =>
        normaliseToolNameForMatch(item.name || "") === targetName ||
        item.name === tool.name
    )
  }

  const getToolResourcePath = (tool: AgentTool): string | null => {
    if (tool.sourceType === ToolType.AUTOMATION) {
      const automation = findResourceByName($automationStore.automations, tool)
      if (automation?._id) {
        return `../../automation/${automation._id}`
      }
    }

    if (tool.sourceType === ToolType.REST_QUERY) {
      const query = findResourceByName($queries.list, tool)
      if (query?._id) {
        return `../../apis/query/${query._id}`
      }
    }
    return null
  }

  const openToolResourceInNewTab = (tool: AgentTool) => {
    const path = getToolResourcePath(tool)
    if (path) {
      const currentPath = window.location.pathname
      const pathParts = currentPath.split("/").filter(Boolean)
      const basePath = pathParts.slice(0, -3).join("/")
      const cleanPath = path.replace(/^\.\.\/\.\./, "")
      const fullPath = `/${basePath}${cleanPath}`
      const url = `${window.location.origin}${fullPath}${window.location.hash}`
      window.open(url, "_blank")
    }
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

  const insertToolBinding = (readableBinding: string) => {
    const currentValue = draft.promptInstructions || ""
    const caretPos = getCaretPosition?.() ?? {
      start: currentValue.length,
      end: currentValue.length,
    }
    const start = caretPos.start
    const end = caretPos.end
    const wrapped = hbInsert(currentValue, start, end, readableBinding)

    if (insertAtPos) {
      insertAtPos({
        start,
        end,
        value: wrapped,
        cursor: { anchor: start + wrapped.length },
      })
    } else {
      draft.promptInstructions =
        currentValue.slice(0, start) + wrapped + currentValue.slice(end)
    }
  }

  const handleToolClick = (tool: AgentTool) => {
    if (!tool.readableBinding) {
      return
    }
    if (tool.sourceType === ToolType.SEARCH && !webSearchConfigured) {
      pendingWebSearchInsert = true
      configureWebSearch()
      return
    }
    insertToolBinding(tool.readableBinding)
  }

  function normaliseBinding(binding: string) {
    return binding
      .replace(/^\s*\{\{\s*/, "")
      .replace(/\s*\}\}\s*$/, "")
      .trim()
  }

  function getIncludedToolRuntimeBindings(
    prompt: string | undefined | null,
    bindingsMap: Record<string, string>
  ) {
    const matches = (prompt || "").match(/\{\{[^}]+\}\}/g) || []
    return Array.from(
      new Set(
        matches
          .map(normaliseBinding)
          .map(binding => bindingsMap[binding])
          .filter(Boolean)
      )
    )
  }

  function getWebSearchRuntimeBinding(
    configured?: boolean,
    config?: typeof webSearchConfig
  ) {
    if (!configured || !config) {
      return undefined
    }
    if (config.provider === WebSearchProvider.EXA) {
      return "exa_search"
    }
    if (config.provider === WebSearchProvider.PARALLEL) {
      return "parallel_search"
    }
    return undefined
  }

  const escapeRegExp = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  const removeToolBindingFromPrompt = (tool: AgentTool) => {
    if (!tool.readableBinding) {
      return
    }
    const current = draft.promptInstructions || ""
    const binding = escapeRegExp(tool.readableBinding)
    const regex = new RegExp(`\\{\\{\\s*${binding}\\s*\\}\\}`, "g")
    const next = current.replace(regex, "").replace(/\n{3,}/g, "\n\n")
    draft.promptInstructions = next
  }

  const configureWebSearch = () => {
    webSearchConfigModal?.show()
  }

  async function saveAgent({
    showNotifications = true,
  }: {
    showNotifications?: boolean
  }) {
    if (!currentAgent) return
    if (saving) return
    if (!draft.aiconfig) {
      if (showNotifications) {
        notifications.error("Please select an AI model")
      }
      return
    }

    saving = true
    try {
      await agentsStore.updateAgent({
        ...currentAgent,
        ...draft,
        enabledTools: includedToolRuntimeBindings,
      })

      if (showNotifications) {
        notifications.success("Agent saved successfully")
      }
      await agentsStore.fetchAgents()
    } catch (error) {
      notifications.error(`Error saving agent: ${JSON.stringify(error)}`)
    } finally {
      saving = false
    }
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
    clearAutoSave()
  })
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="llm-section-container">
  <div class="llm-header">
    <Body size="S" color="var(--spectrum-global-color-gray-900)">AI Model*</Body
    >
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Select which provider and model to use for the agent.{" "}
      <button
        class="link-button"
        onclick={() => bb.settings("/ai-config/configs")}
      >
        View AI Connectors.
      </button>
    </Body>
  </div>
  <div class="form-row">
    <div class="form-field">
      {#if modelOptions.length === 0}
        <Button
          secondary
          size="M"
          icon="sparkle"
          iconWeight="fill"
          iconColor="#8777D1"
          on:click={() => bb.settings("/ai-config/configs")}
        >
          Connect AI Model
        </Button>
      {:else}
        <Select
          bind:value={draft.aiconfig}
          options={modelOptions}
          on:change={() => scheduleSave(true)}
        />
      {/if}
    </div>
  </div>
</div>

<div class="tools-section">
  <div class="llm-section-container">
    <div class="llm-header">
      <Body size="S" color="var(--spectrum-global-color-gray-900)">Tools</Body>
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        Select which tools the agent can use.
      </Body>
    </div>
    <div>
      <div class="form-row">
        <div class="form-field">
          <div class="tools-popover-container"></div>
          <ToolsDropdown
            {filteredTools}
            {toolSections}
            {toolSearch}
            onToolClick={handleToolClick}
            onAddApiConnection={() => $goto(`./apis`)}
            webSearchEnabled={webSearchConfigured}
            onConfigureWebSearch={configureWebSearch}
          />
        </div>
      </div>
    </div>
  </div>
  {#if includedToolsWithDetails.length > 0}
    <div class="tools-list">
      {#each includedToolsWithDetails as tool (tool.runtimeBinding)}
        <div
          class="tool-card"
          role="button"
          tabindex="0"
          onclick={() => openToolResourceInNewTab(tool)}
          onkeydown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              openToolResourceInNewTab(tool)
            }
          }}
        >
          <div class="tool-main">
            <div class="tool-item-icon">
              <ToolIcon icon={tool.icon} size="M" fallbackIcon="Wrench" />
            </div>
            <div class="tool-label">
              <span>
                {tool.sourceLabel || "Tool"}:
              </span>
              <span>{formatToolLabel(tool)}</span>
            </div>
          </div>
          <div class="tool-actions">
            <button
              class="tool-close-button"
              type="button"
              onclick={e => {
                e.stopPropagation()
                removeToolBindingFromPrompt(tool)
                scheduleSave(true)
              }}
            >
              <Icon
                name="x"
                size="XS"
                color="var(--spectrum-global-color-gray-600)"
                hoverable
              />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<div class="section">
  <div class="section-header">
    <Body size="S" color="var(--spectrum-global-color-gray-900)"
      >Instructions</Body
    >
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Set the rules for how the AI agent responds, uses tools, and structures
      output.
    </Body>
  </div>
  <div class="prompt-editor-wrapper">
    <div class="prompt-editor">
      {#if toolsLoaded}
        {#key resolvedIconCount}
          <CodeEditor
            value={draft.promptInstructions ?? DEFAULT_PROMPT_INSTRUCTIONS}
            bindings={promptBindings}
            bindingIcons={readableToIcon}
            completions={promptCompletions}
            mode={EditorModes.Handlebars}
            bind:insertAtPos
            renderBindingsAsTags={true}
            renderMarkdownDecorations={true}
            placeholder=""
            on:change={event => {
              draft.promptInstructions = event.detail || ""
              scheduleSave()
            }}
            bind:getCaretPosition
          />
        {/key}
      {/if}
    </div>
    <div class="bindings-bar">
      <span class="bindings-bar-text"
        >Use <code>{`{{`}</code> to add to tools & knowledge sources</span
      >
    </div>
  </div>
</div>

<WebSearchConfigModal
  bind:this={webSearchConfigModal}
  aiconfigId={draft.aiconfig}
/>

<style>
  :global(.tools-popover-container .spectrum-Popover) {
    background-color: var(--background-alt);
  }

  .prompt-editor-wrapper {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    overflow: hidden;
  }

  .prompt-editor {
    flex: 1;
  }

  .prompt-editor :global(.cm-editor) {
    background: var(--background-alt) !important;
  }

  .bindings-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-m) var(--spacing-l);
    background: var(--background-alt);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    flex-shrink: 0;
  }

  .bindings-bar-text {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 13px;
    color: var(--spectrum-global-color-gray-700);
    line-height: 1.4;
  }

  .bindings-bar code {
    background: var(--spectrum-global-color-gray-200);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
  }

  .tools-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-s);
    margin-top: 8px;
  }

  .tool-card {
    display: flex;
    width: fit-content;
    height: fit-content;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left: 6px;
    padding-right: 6px;
    background: #215f9e33;
    border: none;
    gap: 6px;
    cursor: pointer;
    transition: background 130ms ease-out;
    outline: none;
  }

  .tool-card:focus-visible {
    outline: 2px solid var(--spectrum-global-color-blue-500);
    outline-offset: 2px;
  }

  .tool-card:hover {
    background: var(--spectrum-global-color-gray-200);
  }

  .tool-main {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    min-width: 0;
  }

  .tool-item-icon {
    width: 14px;
    height: 14px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    margin-bottom: var(--spacing-xs);
    color: var(--spectrum-global-color-gray-700);
  }

  .tool-item-icon :global(svg),
  .tool-item-icon :global(img) {
    color: var(--spectrum-global-color-gray-700);
  }

  .tool-label {
    color: var(--spectrum-global-color-gray-900);
    font-weight: 500;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tool-label > span:first-child {
    color: var(--spectrum-global-color-gray-800);
    font-family: SFMono-Regular, Consolas, "Liberation Mono", monospace;
  }

  .tool-label > span:last-child {
    font-family: SFMono-Regular, Consolas, "Liberation Mono", monospace;
    font-weight: 400;
    color: var(--spectrum-global-color-gray-800);
  }

  .tool-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .tool-close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    padding: 4px;
    border: none;
    background: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 130ms ease-out;
  }

  .tool-close-button:hover {
    background: var(--spectrum-global-color-gray-200);
  }

  .tools-section {
    display: flex;
    flex-direction: column;
  }

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

  .section-header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: 600px;
  }

  .llm-header > :global(.spectrum-Body):first-child {
    font-weight: 500;
  }

  .section-header > :global(.spectrum-Body):first-child {
    font-weight: 500;
  }
</style>
