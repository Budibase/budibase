<script lang="ts">
  import {
    Body,
    Button,
    Heading,
    Input,
    Layout,
    notifications,
    Select,
    ActionButton,
    Icon,
    Helpers,
  } from "@budibase/bbui"
  import {
    ToolSourceType,
    type Agent,
    type Tool,
    type EnrichedBinding,
    type CaretPositionFn,
    type InsertAtPositionFn,
    type AgentToolSource,
  } from "@budibase/types"
  import type { BindingCompletion } from "@/types"
  import TopBar from "@/components/common/TopBar.svelte"
  import { agentsStore, aiConfigsStore, selectedAgent } from "@/stores/portal"
  import { datasources, deploymentStore, restTemplates } from "@/stores/builder"
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { onMount } from "svelte"
  import { bb } from "@/stores/bb"
  import AgentToolConfigModal from "./AgentToolConfigModal.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { getIntegrationIcon, type IconInfo } from "@/helpers/integrationIcons"
  import ToolsDropdown from "./ToolsDropdown.svelte"

  import {
    EditorModes,
    hbAutocomplete,
    hbInsert,
    bindingsToCompletions,
    getHelperCompletions,
  } from "@/components/common/CodeEditor"
  import { IntegrationTypes } from "@/constants/backend"
  import BudibaseLogo from "../logos/Budibase.svelte"

  let currentAgent: Agent | undefined
  let draftAgentId: string | undefined
  let toolConfigModal: AgentToolConfigModal
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

  let getCaretPosition: CaretPositionFn | undefined
  let insertAtPos: InsertAtPositionFn | undefined
  let toolSearch = ""
  let promptBindings: EnrichedBinding[] = []
  let promptCompletions: BindingCompletion[] = []

  interface EnrichedTool extends Tool {
    sourceLabel?: string
    sourceType?: ToolSourceType
    readableBinding: string
    runtimeBinding: string
    icon?: IconInfo
  }

  let availableTools: EnrichedTool[] = []
  let filteredTools: EnrichedTool[] = []
  let toolSections: Record<string, EnrichedTool[]> = {}

  $: currentAgent = $selectedAgent

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

  function getToolSourceIcon(toolSource: AgentToolSource) {
    if (toolSource.type === ToolSourceType.REST_QUERY) {
      const ds = $datasources.list.find(d => d._id === toolSource.datasourceId)
      if (ds?.restTemplate) {
        const result = getIntegrationIcon(
          IntegrationTypes.REST,
          ds.restTemplate,
          restTemplates.getByName(ds.restTemplate)?.icon
        )
        return result
      }
    }
    return { icon: BudibaseLogo }
  }

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")

  const getBindingPrefix = (
    sourceType: ToolSourceType | undefined,
    sourceLabel: string | undefined
  ): string => {
    if (sourceType === ToolSourceType.BUDIBASE) {
      return "budibase"
    }
    if (sourceType === ToolSourceType.REST_QUERY && sourceLabel) {
      return `api.${slugify(sourceLabel)}`
    }
    return "tool"
  }

  const getSectionName = (sourceType: ToolSourceType | undefined): string => {
    if (sourceType === ToolSourceType.BUDIBASE) {
      return "Budibase"
    }
    if (sourceType === ToolSourceType.REST_QUERY) {
      return "API tools"
    }
    return "Tools"
  }

  $: availableTools = ($agentsStore.toolSources || []).flatMap(source =>
    (source.tools || []).map(tool => {
      const prefix = getBindingPrefix(source.type, source.label)
      return {
        ...tool,
        sourceLabel: source.label,
        sourceType: source.type,
        readableBinding: `${prefix}.${tool.name}`,
        runtimeBinding: tool.name,
        icon: getToolSourceIcon(source),
      }
    })
  )

  $: filteredTools =
    toolSearch.trim().length === 0
      ? availableTools
      : availableTools.filter(tool => {
          const query = toolSearch.toLowerCase()
          return (
            tool.name?.toLowerCase().includes(query) ||
            tool.readableBinding?.toLowerCase().includes(query)
          )
        })

  $: toolSections = filteredTools.reduce<Record<string, EnrichedTool[]>>(
    (acc, tool) => {
      const key = getSectionName(tool.sourceType)
      acc[key] = acc[key] || []
      acc[key].push(tool)
      return acc
    },
    {}
  )

  $: promptBindings = availableTools
    .filter(tool => !!tool.name)
    .map(tool => ({
      runtimeBinding: tool.runtimeBinding,
      readableBinding: tool.readableBinding,
      category: getSectionName(tool.sourceType),
      display: {
        name: tool.description || tool.name,
        type: "tool",
        rank: 1,
      },
      icon: tool.icon?.url,
    }))

  $: promptCompletions =
    promptBindings.length > 0
      ? [
          hbAutocomplete([
            ...bindingsToCompletions(promptBindings, EditorModes.Handlebars),
            ...getHelperCompletions(EditorModes.Handlebars),
          ]),
        ]
      : []

  const handleToolClick = (tool: EnrichedTool) => {
    if (!tool.readableBinding) {
      return
    }
    const currentValue = draft.promptInstructions || ""
    const start = currentValue.length
    const end = start
    const wrapped = hbInsert(currentValue, start, end, tool.readableBinding)

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

  async function saveAgent() {
    if (!currentAgent) return
    try {
      await agentsStore.updateAgent({
        ...currentAgent,
        ...draft,
      })

      notifications.success("Agent saved successfully")
      await agentsStore.fetchAgents()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving agent")
    }
  }

  async function toggleAgentLive() {
    if (!currentAgent || togglingLive) return

    const nextLive = !currentAgent.live

    try {
      togglingLive = true

      await agentsStore.updateAgent({
        ...currentAgent,
        ...draft,
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

  const agentUrl = "budibase.app/chat/3432343dff34334334dfd"

  async function copyAgentUrl() {
    try {
      await Helpers.copyToClipboard(agentUrl)
      notifications.success("URL copied to clipboard")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to copy URL")
    }
  }

  function openAgentUrl() {
    window.open(`https://${agentUrl}`, "_blank")
  }

  onMount(async () => {
    await Promise.all([
      agentsStore.init(),
      aiConfigsStore.fetch(),
      $agentsStore.currentAgentId
        ? agentsStore.fetchToolSources($agentsStore.currentAgentId)
        : Promise.resolve(),
    ])
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="config-wrapper">
  <TopBar
    breadcrumbs={[
      { text: "Agents", url: "../" },
      { text: currentAgent?.name || "Agent" },
    ]}
    icon="Effect"
  >
    <Button cta icon="save" on:click={saveAgent}>Save Changes</Button>
  </TopBar>
  <div class="config-page">
    <div class="config-content">
      <div class="config-form">
        <Layout paddingY="XL" gap="L">
          <div class="name-row">
            <div class="name-input">
              <Input
                label="Name"
                labelPosition="left"
                bind:value={draft.name}
                placeholder="Give your agent a name"
              />
            </div>
            <EditableIcon
              name={draft.icon}
              color={draft.iconColor}
              size="L"
              on:change={e => {
                draft.icon = e.detail.name
                draft.iconColor = e.detail.color
              }}
            />
          </div>

          <div class="model-row">
            <div class="model-select">
              <Select
                label="Model"
                labelPosition="left"
                bind:value={draft.aiconfig}
                options={modelOptions}
                placeholder="Select a model"
              />
            </div>
            <ActionButton
              size="M"
              icon="sliders-horizontal"
              tooltip="Manage AI configurations"
              on:click={() => bb.settings("/ai")}
            />
          </div>

          <div class="section">
            <div class="title-tools-bar">
              <Heading size="XS">Instructions</Heading>
              <div class="tools-popover-container" />
              <ToolsDropdown
                {filteredTools}
                {toolSections}
                bind:toolSearch
                onToolClick={handleToolClick}
                onAddApiConnection={() => toolConfigModal.show()}
              />
            </div>
            <div class="prompt-editor">
              <CodeEditor
                value={draft.promptInstructions || ""}
                bindings={promptBindings}
                completions={promptCompletions}
                mode={EditorModes.Handlebars}
                bind:getCaretPosition
                bind:insertAtPos
                placeholder=""
                on:change={event =>
                  (draft.promptInstructions = event.detail || "")}
              />
            </div>
          </div>
        </Layout>
      </div>

      {#if currentAgent?.live}
        <div class="agent-live-card">
          <div class="live-header">
            <div class="live-icon">
              <Icon name="activity" size="M" />
            </div>
            <Heading size="S">Your agent is live.</Heading>
          </div>
          <div class="url-section">
            <div class="url">
              <Input readonly disabled value={agentUrl} />
            </div>
            <div class="url-actions">
              <div class="url-action-button">
                <Icon name="copy" size="S" on:click={copyAgentUrl} />
              </div>
              <div class="url-action-button">
                <Icon
                  name="arrow-square-out"
                  size="S"
                  on:click={openAgentUrl}
                />
              </div>
            </div>
          </div>
          <div class="live-actions">
            <Button
              secondary
              icon="pause"
              on:click={toggleAgentLive}
              disabled={togglingLive}>Pause agent</Button
            >
          </div>
        </div>
      {:else}
        <div class="agent-live-card">
          <Button
            quiet
            icon="play"
            iconColor="var(--bb-blue)"
            disabled={togglingLive}
            on:click={toggleAgentLive}>Set your agent live</Button
          >
          <div class="live-description">
            <Body size="S">
              Once your agent is live, it will be available to use.
            </Body>
            <Body size="S">You can pause your agent at any time.</Body>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<AgentToolConfigModal
  bind:this={toolConfigModal}
  agentId={$agentsStore.currentAgentId || ""}
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
    flex-direction: column;
    height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--spacing-xl) var(--spacing-l) var(--spacing-xl);
    box-sizing: border-box;
  }

  .config-content {
    max-width: 840px;
    width: 100%;
    margin: 0 auto;
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    border-radius: 16px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-alias-background-color-primary);
  }

  .config-form {
    flex: 1 1 auto;
  }

  .model-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .model-select {
    flex: 1;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .name-input {
    flex: 1;
  }

  /* Override input backgrounds to match design */
  :global(.config-form .spectrum-Textfield-input),
  :global(.config-form .spectrum-Picker) {
    background-color: var(--background) !important;
  }

  /* Align left-position labels into a clean column */
  :global(.config-form .spectrum-Form-item:not(.above)) {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    column-gap: var(--spacing-m);
  }

  :global(.config-form .spectrum-Form-itemLabel) {
    justify-self: flex-start;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .agent-live-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin-top: var(--spacing-xl);
    padding: var(--spacing-xl);
    border-radius: 12px;
    background-color: #212121;
    align-items: center;
  }

  .live-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
    padding: var(--spacing-xl);
    margin: calc(-1 * var(--spacing-xl)) calc(-1 * var(--spacing-xl)) 0;
    background-color: #1a1a1a;
    border-radius: 12px 12px 0 0;
  }

  .live-actions {
    display: flex;
    justify-content: flex-start;
    gap: var(--spacing-m);
    width: 100%;
  }

  .live-header :global(.spectrum-Heading) {
    color: #ffffff;
    margin: 0;
  }

  .live-icon {
    color: #4caf50;
    display: flex;
    align-items: center;
  }

  .url-section {
    width: 100%;
    display: flex;
  }

  .url {
    width: 100%;
  }

  .url-actions {
    margin-left: var(--spacing-m);
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  .url-action-button {
    cursor: pointer;
  }

  .url-action-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .live-description {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: center;
  }

  .live-description :global(.spectrum-Body) {
    color: #bdbdbd;
    margin: 0;
  }

  :global(.tools-popover-container .spectrum-Popover) {
    background-color: var(--background-alt);
  }

  .title-tools-bar {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xxs);
    justify-content: space-between;
  }

  .prompt-editor {
    margin-top: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    height: 320px;
    overflow: hidden;
  }

  .prompt-editor :global(.cm-editor) {
    background: var(--background-alt) !important;
  }
</style>
