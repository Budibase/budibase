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
  } from "@budibase/bbui"
  import {
    ToolType,
    type Agent,
    type ToolMetadata,
    type EnrichedBinding,
    type CaretPositionFn,
    type InsertAtPositionFn,
  } from "@budibase/types"
  import type { BindingCompletion } from "@/types"
  import TopBar from "@/components/common/TopBar.svelte"
  import { agentsStore, aiConfigsStore, selectedAgent } from "@/stores/portal"
  import { datasources, deploymentStore, restTemplates } from "@/stores/builder"
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { onMount } from "svelte"
  import { bb } from "@/stores/bb"
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
  import BudibaseLogo from "../logos/Budibase.svelte"
  import { goto } from "@roxi/routify"
  import { IntegrationTypes } from "@/constants/backend"
  import budibaseLogoOnly from "@/imgs/budibase-logo-only.png"

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
    enabledTools: [] as string[],
  }

  let getCaretPosition: CaretPositionFn | undefined
  let insertAtPos: InsertAtPositionFn | undefined
  let toolSearch = ""
  let promptBindings: EnrichedBinding[] = []
  let promptCompletions: BindingCompletion[] = []

  interface EnrichedTool extends ToolMetadata {
    readableBinding: string
    runtimeBinding: string
    icon?: IconInfo
  }

  let availableTools: EnrichedTool[] = []
  let filteredTools: EnrichedTool[] = []
  let toolSections: Record<string, EnrichedTool[]> = {}
  let readableToRuntimeBinding: Record<string, string> = {}
  let readableToIcon: Record<string, string | undefined> = {}

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
      enabledTools: currentAgent.enabledTools || [],
    }
    draftAgentId = currentAgent._id
  }

  $: modelOptions = $aiConfigsStore.customConfigs.map(config => ({
    label: config.name || config._id || "Unnamed",
    value: config._id || "",
  }))

  function getToolSourceIcon(
    sourceType: ToolType | undefined,
    sourceLabel: string | undefined
  ) {
    if (sourceType === ToolType.REST_QUERY) {
      const ds = $datasources.list.find(d => d.name === sourceLabel)
      if (ds?.restTemplate) {
        return getIntegrationIcon(
          IntegrationTypes.REST,
          ds.restTemplate,
          restTemplates.getByName(ds.restTemplate)?.icon
        )
      } else {
        return getIntegrationIcon(IntegrationTypes.REST)
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
    sourceType: ToolType | undefined,
    sourceLabel: string | undefined
  ): string => {
    if (sourceType === ToolType.BUDIBASE) {
      return "budibase"
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
    if (sourceType === ToolType.REST_QUERY) {
      return "API tools"
    }
    return "Tools"
  }

  $: availableTools = ($agentsStore.tools || []).map(tool => {
    const sourceType = tool.sourceType
    const sourceLabel = tool.sourceLabel
    const prefix = getBindingPrefix(sourceType, sourceLabel)

    return {
      ...tool,
      sourceLabel,
      sourceType,
      readableBinding: `${prefix}.${tool.name}`,
      runtimeBinding: tool.name,
      icon: getToolSourceIcon(sourceType, sourceLabel),
    }
  })

  $: readableToRuntimeBinding = availableTools.reduce(
    (acc, tool) => {
      if (tool.readableBinding && tool.runtimeBinding) {
        acc[tool.readableBinding] = tool.runtimeBinding
      }
      return acc
    },
    {} as Record<string, string>
  )

  $: readableToIcon = availableTools.reduce(
    (acc, tool) => {
      if (tool.readableBinding) {
        acc[tool.readableBinding] =
          tool.icon?.url ||
          (tool.sourceType === ToolType.BUDIBASE ? budibaseLogoOnly : undefined)
      }
      return acc
    },
    {} as Record<string, string | undefined>
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

  $: syncEnabledToolsFromPrompt(
    draft.promptInstructions,
    readableToRuntimeBinding
  )

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

  const normaliseBinding = (binding: string) =>
    binding
      .replace(/^\s*\{\{\s*/, "")
      .replace(/\s*\}\}\s*$/, "")
      .trim()

  const syncEnabledToolsFromPrompt = (
    prompt: string | undefined | null,
    bindingsMap: Record<string, string> = readableToRuntimeBinding
  ) => {
    const matches = (prompt || "").match(/\{\{[^}]+\}\}/g) || []
    const next = Array.from(
      new Set(
        matches
          .map(normaliseBinding)
          .map(binding => bindingsMap[binding])
          .filter(Boolean)
      )
    )

    const current = draft.enabledTools || []
    if (
      next.length !== current.length ||
      next.some(tool => !current.includes(tool))
    ) {
      draft.enabledTools = next
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

  onMount(async () => {
    await Promise.all([agentsStore.init(), aiConfigsStore.fetch()])
  })
</script>

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
            <div class="title-tools-bar">
              <Heading size="XS">Instructions</Heading>
              <div class="tools-popover-container" />
              <ToolsDropdown
                {filteredTools}
                {toolSections}
                bind:toolSearch
                onToolClick={handleToolClick}
                onAddApiConnection={() => $goto(`./apis`)}
              />
            </div>
            <div class="prompt-editor">
              <CodeEditor
                value={draft.promptInstructions || ""}
              bindings={promptBindings}
              bindingIcons={readableToIcon}
              completions={promptCompletions}
              mode={EditorModes.Handlebars}
              bind:getCaretPosition
              bind:insertAtPos
              renderBindingsAsPills={true}
              placeholder=""
              on:change={event =>
                (draft.promptInstructions = event.detail || "")}
            />
            </div>
          </div>
        </Layout>
      </div>
    </div>
    <div class="config-preview"></div>
  </div>
</div>

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
    box-sizing: border-box;
    gap: var(--spacing-l);
  }

  .config-content {
    flex: 0 0 auto;
    width: 45%;
    max-width: 600px;
    min-width: 0;
    height: calc(100% - var(--spacing-xl) * 2);
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-alias-background-color-primary);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .config-preview {
    flex: 1 1 auto;
    min-width: 0;
    height: calc(100% - var(--spacing-xl) * 2);
    padding: var(--spacing-xl);
    border-radius: 16px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-alias-background-color-primary);
    overflow-y: auto;
    overflow-x: hidden;
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
  :global(.config-form .spectrum-Textfield-input),
  :global(.config-form .spectrum-Picker) {
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
    flex: 1;
    gap: var(--spacing-m);
    min-height: 0;
  }

  :global(.tools-popover-container .spectrum-Popover) {
    background-color: var(--background-alt);
  }

  .title-tools-bar {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xxs);
    justify-content: space-between;
    flex-shrink: 0;
  }

  .prompt-editor {
    flex: 1;
    margin-top: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    min-height: 0;
    overflow: hidden;
  }

  .prompt-editor :global(.cm-editor) {
    background: var(--background-alt) !important;
  }
</style>
