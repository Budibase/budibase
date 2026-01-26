<script lang="ts">
  import {
    Body,
    Input,
    notifications,
    Select,
    ActionButton,
    Button,
    Icon,
    ActionMenu,
    MenuItem,
    AbsTooltip,
  } from "@budibase/bbui"
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
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { onDestroy, onMount, untrack } from "svelte"
  import { bb } from "@/stores/bb"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import type { IconInfo } from "@/helpers/integrationIcons"
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
  import { goto } from "@roxi/routify"
  import BudibaseLogoSvg from "assets/bb-emblem.svg"

  $goto
  // Code editor tag icons must be URL strings (see `hbsTags.ts`).
  // Use URLs derived from the same Phosphor SVG paths as the Svelte logo components.
  const WebSearchIconSvg = WEB_SEARCH_TAG_ICON_URL
  const RestIconSvg = REST_TAG_ICON_URL
  const AUTO_SAVE_DEBOUNCE_MS = 800

  // Agent state
  let draftAgentId: string | undefined = $state()
  let draft = $state({
    name: "",
    description: "",
    aiconfig: "",
    goal: "",
    promptInstructions: "",
    icon: "",
    iconColor: "",
    ragConfigId: undefined as string | undefined,
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
  let availableTools: AgentTool[] = $derived.by(() => {
    const tools = $agentsStore.tools || []
    const mappedTools = tools.map(tool => {
      const sourceType = tool.sourceType
      const sourceLabel = tool.sourceLabel

      const prefix = getBindingPrefix(sourceType, sourceLabel)
      const { icon, tagIconUrl } = resolveAgentToolIcons(tool, {
        sourceType,
        sourceLabel,
      })

      return {
        ...tool,
        sourceLabel,
        sourceType,
        readableBinding: `${prefix}.${tool.name}`,
        runtimeBinding: tool.name,
        icon,
        tagIconUrl,
      }
    })

    // Add a synthetic web search tool as we want it to always appear
    const webSearchTool: ToolMetadata = {
      name: "web_search",
      description: "Configure web search",
      sourceType: ToolType.SEARCH,
      sourceLabel: "Search",
    }
    const prefix = getBindingPrefix(
      webSearchTool.sourceType,
      webSearchTool.sourceLabel
    )
    const { icon, tagIconUrl } = resolveAgentToolIcons(webSearchTool, {
      sourceType: webSearchTool.sourceType,
      sourceLabel: webSearchTool.sourceLabel,
    })

    return [
      {
        ...webSearchTool,
        readableBinding: `${prefix}.web_search`,
        runtimeBinding:
          getWebSearchRuntimeBinding(webSearchConfigured, webSearchConfig) ||
          "",
        icon,
        tagIconUrl,
      },
      ...mappedTools.filter(tool => tool.sourceType !== ToolType.SEARCH),
    ]
  })

  let toolMaps = $derived(buildToolMaps(availableTools))
  let readableToRuntimeBinding = $derived(toolMaps.readableToRuntimeBinding)
  let readableToIcon = $derived(toolMaps.readableToIcon)

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
        category: getSectionName(tool.sourceType),
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
      const key = getSectionName(tool.sourceType)
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
        promptInstructions: agent.promptInstructions || "",
        icon: agent.icon || "",
        iconColor: agent.iconColor || "",
        ragConfigId: agent.ragConfigId,
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
      const agentHasAiconfig = currentAgent.aiconfig != null && currentAgent.aiconfig !== ""
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
    if (sourceType === ToolType.BUDIBASE) {
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

  function buildToolMaps(tools: AgentTool[]) {
    return tools.reduce(
      (acc, tool) => {
        if (tool.readableBinding) {
          acc.readableToIcon[tool.readableBinding] = tool.tagIconUrl
        }
        if (tool.readableBinding && tool.runtimeBinding) {
          acc.readableToRuntimeBinding[tool.readableBinding] =
            tool.runtimeBinding
        }
        return acc
      },
      {
        readableToRuntimeBinding: {} as Record<string, string>,
        readableToIcon: {} as Record<string, string | undefined>,
      }
    )
  }

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
  }
  function getBindingPrefix(
    sourceType: ToolType | undefined,
    sourceLabel: string | undefined
  ): string {
    if (sourceType === ToolType.BUDIBASE) {
      return "budibase"
    }
    if (sourceType === ToolType.SEARCH) {
      return "search"
    }
    if (sourceType === ToolType.REST_QUERY && sourceLabel) {
      return `api.${slugify(sourceLabel)}`
    }
    return "tool"
  }

  function getSectionName(sourceType: ToolType | undefined): string {
    if (sourceType === ToolType.BUDIBASE) {
      return "Budibase"
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
    if (tool.sourceType === ToolType.BUDIBASE) {
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

  const navigateToTool = (tool: AgentTool) => {
    const path = getToolResourcePath(tool)
    if (path) {
      $goto(path)
    } else {
      notifications.error("Unable to locate resource for this tool")
    }
  }

  // list_tables -> List tables
  const formatToolLabel = (tool: AgentTool) =>
    tool.name
      .split("_")
      .join(" ")
      .replace(/\b\w/g, l => l.toUpperCase())

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
      console.error(error)
      notifications.error("Error saving agent")
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

<div class="llm-section-container">
  <div class="llm-header">
    <Body size="S" color="var(--spectrum-global-color-gray-900)">AI Model*</Body>
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Select which provider and model to use for the LLM.{" "}
      <button
        class="link-button"
        on:click={() => bb.settings("/ai-config/configs")}
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
          placeholder="Select a model"
          on:change={() => scheduleSave(true)}
        />
      {/if}
    </div>
  </div>
</div>

<div class="section">
  <div class="section-header">
    <Body size="S" color="var(--spectrum-global-color-gray-900)"
      >Instructions</Body
    >
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Set the rules for how the AI responds, uses tools, and structures output.
    </Body>
  </div>
  <div class="prompt-editor-wrapper">
    <div class="prompt-editor">
      {#if toolsLoaded}
        {#key resolvedIconCount}
          <CodeEditor
            value={draft.promptInstructions || ""}
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

<div class="section tools-section">
  <div class="title-tools-bar">
    <Body size="S" color="var(--spectrum-global-color-gray-900)"
      >Tools this agent can use:</Body
    >
    <div class="tools-popover-container"></div>
    <ToolsDropdown
      {filteredTools}
      {toolSections}
      bind:toolSearch
      onToolClick={handleToolClick}
      onAddApiConnection={() => $goto(`./apis`)}
      webSearchEnabled={webSearchConfigured}
      onConfigureWebSearch={configureWebSearch}
    />
  </div>
</div>
{#if includedToolsWithDetails.length > 0}
  <div class="tools-list">
    {#each includedToolsWithDetails as tool (tool.runtimeBinding)}
      <div class="tool-card">
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
          <ActionMenu align="right" roundedPopover>
            <div slot="control" class="tool-menu-trigger">
              <Icon
                name="MoreVertical"
                size="M"
                hoverable
                tooltip="Tool actions"
              />
            </div>
            {#if tool.sourceType === ToolType.SEARCH}
              <MenuItem on:click={configureWebSearch}>
                Configure web search
              </MenuItem>
            {:else if getToolResourcePath(tool)}
              <MenuItem on:click={() => navigateToTool(tool)}>
                Navigate to resource
              </MenuItem>
            {/if}
            <MenuItem
              on:click={() => {
                removeToolBindingFromPrompt(tool)
                scheduleSave(true)
              }}
            >
              Remove from instructions
            </MenuItem>
          </ActionMenu>
        </div>
      </div>
    {/each}
  </div>
{/if}

<WebSearchConfigModal
  bind:this={webSearchConfigModal}
  aiconfigId={draft.aiconfig}
/>

<style>
  .tools-section {
    flex-shrink: 0;
    margin-bottom: calc(-1 * var(--spacing-l));
  }

  :global(.tools-popover-container .spectrum-Popover) {
    background-color: var(--background-alt);
  }

  .title-tools-bar {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xxs);
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
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
    flex-direction: column;
    gap: var(--spacing-s);
    margin-top: calc(var(--spacing-s) - 12px);
  }

  .tool-card {
    display: flex;
    height: 25px;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    padding: var(--spacing-xs) var(--spacing-l) var(--spacing-xs)
      var(--spacing-l);
    border: 1px solid var(--spectrum-global-color-gray-200);
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
  }

  .tool-label {
    color: var(--spectrum-global-color-gray-900);
    font-weight: 500;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tool-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .tool-menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    transition: background 130ms ease-out;
  }

  .tool-menu-trigger:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
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
    max-width: 500px;
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
    max-width: 500px;
  }

  .llm-header > :global(.spectrum-Body):first-child,
  .section-header > :global(.spectrum-Body):first-child,
  .title-tools-bar > :global(.spectrum-Body) {
    font-weight: 500;
  }
</style>
