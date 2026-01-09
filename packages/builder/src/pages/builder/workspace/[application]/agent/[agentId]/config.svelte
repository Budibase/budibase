<script lang="ts">
  import {
    Button,
    Heading,
    Input,
    Layout,
    notifications,
    Select,
    ActionButton,
    Icon,
    ActionMenu,
    MenuItem,
  } from "@budibase/bbui"
  import {
    ToolType,
    type Agent,
    type ToolMetadata,
    type EnrichedBinding,
    type InsertAtPositionFn,
    WebSearchProvider,
  } from "@budibase/types"
  import type { BindingCompletion } from "@/types"
  import TopBar from "@/components/common/TopBar.svelte"
  import { agentsStore, aiConfigsStore, selectedAgent } from "@/stores/portal"
  import {
    datasources,
    deploymentStore,
    restTemplates,
    automationStore,
    queries,
  } from "@/stores/builder"
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { onDestroy, onMount } from "svelte"
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

  let currentAgent: Agent | undefined
  let draftAgentId: string | undefined
  let togglingLive = false
  let modelOptions: { label: string; value: string }[] = []
  let draft = {
    name: "",
    description: "",
    aiconfig: "",
    goal: "",
    promptInstructions: "",
    icon: "",
    iconColor: "",
  }

  let insertAtPos: InsertAtPositionFn | undefined
  let toolSearch = ""
  let promptBindings: EnrichedBinding[] = []
  let promptCompletions: BindingCompletion[] = []
  let autoSaveTimeout: ReturnType<typeof setTimeout> | undefined
  let saving = false
  const AUTO_SAVE_DEBOUNCE_MS = 800
  const clearAutoSave = () => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = undefined
    }
  }

  let availableTools: AgentTool[] = []
  let filteredTools: AgentTool[] = []
  let toolSections: Record<string, AgentTool[]> = {}
  let readableToRuntimeBinding: Record<string, string> = {}
  let readableToIcon: Record<string, string | undefined> = {}
  let includedToolRuntimeBindings: string[] = []
  let includedToolsWithDetails: AgentTool[] = []
  let webSearchConfigModal: WebSearchConfigModal
  let lastWebSearchConfigId: string | undefined
  let pendingWebSearchInsert = false

  $: currentAgent = $selectedAgent
  $: webSearchConfig = $aiConfigsStore.customConfigs.find(
    config => config._id === draft.aiconfig
  )?.webSearchConfig
  $: webSearchConfigured = Boolean(
    webSearchConfig?.apiKey && webSearchConfig.provider
  )

  const getWebSearchRuntimeBinding = () => {
    if (!webSearchConfigured || !webSearchConfig) {
      return undefined
    }
    if (webSearchConfig.provider === WebSearchProvider.EXA) {
      return "exa_search"
    }
    if (webSearchConfig.provider === WebSearchProvider.PARALLEL) {
      return "parallel_search"
    }
    return undefined
  }

  $: if (currentAgent && currentAgent._id !== draftAgentId) {
    draft = {
      name: currentAgent.name || "",
      description: currentAgent.description || "",
      aiconfig: currentAgent.aiconfig || "",
      goal: currentAgent.goal || "",
      promptInstructions: currentAgent.promptInstructions || "",
      icon: currentAgent.icon || "",
      iconColor: currentAgent.iconColor || "",
    }
    draftAgentId = currentAgent._id
  }

  $: modelOptions = $aiConfigsStore.customConfigs.map(config => ({
    label: config.name || config._id || "Unnamed",
    value: config._id || "",
  }))

  $: {
    const nextAiconfigId = draft.aiconfig || undefined
    if (nextAiconfigId !== lastWebSearchConfigId) {
      lastWebSearchConfigId = nextAiconfigId
      agentsStore.fetchTools(nextAiconfigId)
    }
  }

  const resolveAgentToolIcons = (
    tool: ToolMetadata,
    {
      sourceType,
      sourceLabel,
    }: { sourceType: ToolType | undefined; sourceLabel: string | undefined }
  ): { icon?: IconInfo; tagIconUrl?: string } => {
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

  $: {
    const tools = $agentsStore.tools || []
    availableTools = tools.map(tool => {
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

    // Below we add a synthetic web search tool as we want it to always appear
    // and it may not always be configured..
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

    availableTools = [
      {
        ...webSearchTool,
        readableBinding: `${prefix}.web_search`,
        runtimeBinding: getWebSearchRuntimeBinding() || "",
        icon,
        tagIconUrl,
      },
      ...availableTools.filter(tool => tool.sourceType !== ToolType.SEARCH),
    ]
  }

  const buildToolMaps = (tools: AgentTool[]) =>
    tools.reduce(
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

  $: ({ readableToRuntimeBinding, readableToIcon } =
    buildToolMaps(availableTools))

  $: filteredTools = availableTools.filter(tool => {
    const query = toolSearch.toLowerCase()
    return (
      tool.name?.toLowerCase().includes(query) ||
      tool.readableBinding?.toLowerCase().includes(query)
    )
  })

  $: toolSections = filteredTools.reduce<Record<string, AgentTool[]>>(
    (acc, tool) => {
      const key = getSectionName(tool.sourceType)
      acc[key] = acc[key] || []
      acc[key].push(tool)
      return acc
    },
    {}
  )

  $: promptBindings = (() => {
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
  })()

  $: promptCompletions =
    promptBindings.length > 0
      ? [
          hbAutocomplete([
            ...bindingsToCompletions(promptBindings, EditorModes.Handlebars),
          ]),
        ]
      : []

  $: includedToolRuntimeBindings = getIncludedToolRuntimeBindings(
    draft.promptInstructions,
    readableToRuntimeBinding
  )

  $: includedToolsWithDetails = includedToolRuntimeBindings
    .map(runtimeBinding =>
      availableTools.find(tool => tool.runtimeBinding === runtimeBinding)
    )
    .filter((tool): tool is AgentTool => !!tool)

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")

  const getBindingPrefix = (
    sourceType: ToolType | undefined,
    sourceLabel: string | undefined
  ): string => {
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

  const getSectionName = (sourceType: ToolType | undefined): string => {
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

  const normaliseToolNameForMatch = (name: string) => {
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
    const start = currentValue.length
    const end = start
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

  const normaliseBinding = (binding: string) =>
    binding
      .replace(/^\s*\{\{\s*/, "")
      .replace(/\s*\}\}\s*$/, "")
      .trim()

  const getIncludedToolRuntimeBindings = (
    prompt: string | undefined | null,
    bindingsMap: Record<string, string>
  ) => {
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

  $: if (pendingWebSearchInsert && webSearchConfigured) {
    const searchTool = availableTools.find(
      tool => tool.sourceType === ToolType.SEARCH
    )
    if (searchTool?.readableBinding) {
      insertToolBinding(searchTool.readableBinding)
    }
    pendingWebSearchInsert = false
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

  async function toggleAgentLive() {
    if (!currentAgent || togglingLive) return

    const nextLive = !currentAgent.live

    try {
      togglingLive = true

      await agentsStore.updateAgent({
        ...currentAgent,
        ...draft,
        enabledTools: includedToolRuntimeBindings,
        live: nextLive,
      })
      await deploymentStore.publishApp()
      await agentsStore.fetchAgents()

      notifications.success(
        nextLive ? "Agent is now live" : "Agent has been paused"
      )
    } catch (error) {
      console.error(error)
      notifications.error(
        nextLive ? "Error setting agent live" : "Error pausing agent"
      )
    } finally {
      togglingLive = false
    }
  }

  onMount(async () => {
    await Promise.all([agentsStore.init(), aiConfigsStore.fetch()])
    if (draft.aiconfig) {
      agentsStore.fetchTools(draft.aiconfig)
    }
  })

  onDestroy(() => {
    clearAutoSave()
  })
</script>

<div class="config-wrapper">
  <TopBar
    breadcrumbs={[
      { text: "Agents", url: "../" },
      { text: currentAgent?.name || "Agent" },
    ]}
    icon="Effect"
  ></TopBar>
  <div class="config-page">
    <div class="config-pane config-content">
      <div class="config-form">
        <Layout paddingY="XL" gap="L">
          <div class="start-pause-row">
            <div class="status-icons">
              <Icon
                tooltip="Documentation"
                on:click={() =>
                  window.open(
                    "https://docs.budibase.com/docs/agents",
                    "_blank"
                  )}
                name="info"
                size="M"
                color="var(--spectrum-global-color-gray-600)"
              />
              <Icon
                name="check-circle"
                size="M"
                color="var(--spectrum-semantic-positive-color-default, var(--spectrum-global-color-green-500))"
              />
            </div>
            <Button
              primary={!currentAgent?.live}
              secondary={currentAgent?.live}
              icon={currentAgent?.live ? "pause" : "play"}
              iconColor={currentAgent?.live ? "" : "var(--bb-blue)"}
              on:click={toggleAgentLive}
              disabled={togglingLive}
              >{currentAgent?.live ? "Pause agent" : "Set agent live"}</Button
            >
          </div>
          <div class="form-row">
            <div class="form-field">
              <Input
                label="Name"
                labelPosition="left"
                bind:value={draft.name}
                placeholder="Give your agent a name"
                on:blur={() => scheduleSave(true)}
              />
            </div>
            <div class="form-icon">
              <EditableIcon
                name={draft.icon}
                color={draft.iconColor}
                size="L"
                on:change={e => {
                  draft.icon = e.detail.name
                  draft.iconColor = e.detail.color
                  scheduleSave(true)
                }}
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <Select
                label="Model"
                labelPosition="left"
                bind:value={draft.aiconfig}
                options={modelOptions}
                placeholder="Select a model"
                on:change={() => scheduleSave(true)}
              />
            </div>
            <div class="form-icon">
              <ActionButton
                size="M"
                icon="sliders-horizontal"
                tooltip="Manage AI configurations"
                on:click={() => bb.settings("/ai")}
              />
            </div>
          </div>

          <div class="section">
            <Heading size="XS">Instructions</Heading>
            <div class="prompt-editor-wrapper">
              <div class="prompt-editor">
                <CodeEditor
                  value={draft.promptInstructions || ""}
                  bindings={promptBindings}
                  bindingIcons={readableToIcon}
                  completions={promptCompletions}
                  mode={EditorModes.Handlebars}
                  bind:insertAtPos
                  renderBindingsAsTags={true}
                  placeholder=""
                  on:change={event => {
                    draft.promptInstructions = event.detail || ""
                    scheduleSave()
                  }}
                />
              </div>
              <div class="bindings-bar">
                <span class="bindings-bar-text"
                  >Use <code>{`{{`}</code> to add to tools & knowledge sources</span
                >
                <span class="bindings-pill">
                  <Icon
                    name="brackets-curly"
                    size="S"
                    color="#BDB0F5"
                    weight="bold"
                  />
                  <span class="bindings-pill-text">
                    {includedToolsWithDetails.length} Binding{includedToolsWithDetails.length !==
                    1
                      ? "s"
                      : ""}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div class="section tools-section">
            <div class="title-tools-bar">
              <Heading size="XS">Tools this agent can use:</Heading>
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
                      <ToolIcon
                        icon={tool.icon}
                        size="M"
                        fallbackIcon="Wrench"
                      />
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
        </Layout>
      </div>
    </div>
    <div class="config-pane config-preview"></div>
  </div>
</div>

<WebSearchConfigModal
  bind:this={webSearchConfigModal}
  aiconfigId={draft.aiconfig}
/>

<style>
  .config-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
    background: var(--background);
  }

  .config-page {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    height: 0;
    overflow: hidden;
    padding: var(--spacing-xl) var(--spacing-l) var(--spacing-xl);
    gap: var(--spacing-l);
  }

  .config-pane {
    min-width: 0;
    height: calc(100% - var(--spacing-xl) * 2);
    padding: var(--spacing-xl);
    border-radius: 16px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-alias-background-color-primary);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .config-content {
    flex: 0 0 auto;
    width: 50%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
  }

  .config-preview {
    flex: 1 1 auto;
  }

  .config-form {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--spacing-m);
  }

  .form-field {
    min-width: 0;
  }

  .form-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--spectrum-alias-item-height-m);
    height: var(--spectrum-alias-item-height-m);
    flex-shrink: 0;
  }

  .start-pause-row {
    display: flex;
    justify-content: flex-end;
  }

  .status-icons {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    margin-right: var(--spacing-m);
  }

  /* Override input backgrounds to match design */
  :global(
    .config-form .spectrum-Textfield-input,
    .config-form .spectrum-Picker
  ) {
    background-color: var(--background) !important;
  }

  /* Align left-position labels into a clean column */
  :global(.config-form .spectrum-Form-item:not(.above)) {
    display: grid;
    grid-template-columns: 120px 1fr 20px;
    column-gap: var(--spacing-m);
  }

  :global(.config-form .container) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    gap: var(--spectrum-alias-grid-gutter-medium);
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    flex-shrink: 0;
  }

  .section:first-of-type {
    flex: 1;
    min-height: 0;
  }

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
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    overflow: hidden;
  }

  .prompt-editor {
    flex: 1;
    min-height: 0;
    overflow: hidden;
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
  }

  .bindings-bar code {
    background: var(--spectrum-global-color-gray-200);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
  }

  .bindings-pill {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 6px 10px;
    border-radius: 10px;
    background: var(--background-alt);
    border: 1px solid var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-50);
    font-weight: 500;
    line-height: 1;
  }

  .bindings-pill-text {
    color: var(--spectrum-global-color-gray-900);
    font-size: 13px;
  }

  .tools-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    margin-top: var(--spacing-s);
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
</style>
