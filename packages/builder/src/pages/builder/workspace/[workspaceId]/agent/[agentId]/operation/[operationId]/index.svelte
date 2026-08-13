<script lang="ts">
  import { Body, Button, Icon, notifications, Select } from "@budibase/bbui"
  import {
    FeatureFlag,
    ToolExecutionPrincipal,
    ToolType,
    type AgentOperation,
    type CaretPositionFn,
    type EnrichedBinding,
    type InsertAtPositionFn,
  } from "@budibase/types"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import {
    EditorModes,
    bindingsToCompletions,
    hbAutocomplete,
  } from "@/components/common/CodeEditor"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"
  import { bb } from "@/stores/bb"
  import {
    contextMenuStore,
    datasources,
    restTemplates,
    workspaceDeploymentStore,
  } from "@/stores/builder"
  import { getRestTemplateIdentifier } from "@/stores/builder/datasources"
  import { agentsStore, featureFlags, selectedAgent } from "@/stores/portal"
  import GenerateInstructionsControl from "../../GenerateInstructionsControl.svelte"
  import Knowledge from "../../knowledge/index.svelte"
  import OperationNameModal from "../../OperationNameModal.svelte"
  import OperationRailSectionHeader from "../../OperationRailSectionHeader.svelte"
  import ToolIcon from "../../ToolIcon.svelte"
  import ToolsDropdown from "../../ToolsDropdown.svelte"
  import { enrichAgentTool } from "../../agentToolUtils"
  import {
    getConfiguredOperationTools,
    getIncludedToolRuntimeBindings,
  } from "../../toolBindingUtils"
  import type { AgentTool } from "../../toolTypes"

  const { goto, params } = routify

  $goto

  type RailTab = "tools" | "knowledge" | "approvals"

  let activeTab = $state<RailTab>("tools")
  let insertAtPos: InsertAtPositionFn | undefined = $state()
  let getCaretPosition: CaretPositionFn | undefined = $state()
  let toolSearch = $state("")
  let saving = $state(false)
  let operation = $state<AgentOperation | undefined>()
  let renameModal: OperationNameModal | undefined = $state()
  let removeToolDialog: ConfirmDialog | undefined = $state()
  let toolToRemove: AgentTool | undefined = $state()
  let lastSavedInstructions = $state("")

  let agent = $derived($selectedAgent)
  let agentId = $derived($params.agentId || agent?._id)
  let operationId = $derived($params.operationId)
  let operationName = $derived(operation?.name?.trim() || "Untitled operation")
  let toolsLoaded = $derived($agentsStore.tools !== undefined)

  const formatToolLabel = (tool: AgentTool) =>
    (tool.readableName || tool.name)
      .split(".")
      .map(part =>
        part
          .split("_")
          .join(" ")
          .replace(/\b\w/g, letter => letter.toUpperCase())
      )
      .join(".")

  let availableTools: AgentTool[] = $derived.by(() =>
    ($agentsStore.tools || []).map(tool =>
      enrichAgentTool(tool, {
        resolveRestTemplateIcon: sourceLabel => {
          const datasource = $datasources.list.find(
            item => item.name === sourceLabel
          )
          const identifier = getRestTemplateIdentifier(datasource)
          return identifier ? restTemplates.get(identifier)?.icon : undefined
        },
      })
    )
  )

  let promptBindings: EnrichedBinding[] = $derived(
    availableTools.map(tool => ({
      runtimeBinding: tool.runtimeBinding,
      readableBinding: tool.readableBinding,
      category: tool.sourceLabel || "Tools",
      display: {
        name: formatToolLabel(tool),
        type: "tool",
        rank: 1,
      },
      icon: tool.tagIconUrl,
    }))
  )
  let bindingIcons = $derived(
    Object.fromEntries(
      availableTools.map(tool => [tool.readableBinding, tool.tagIconUrl])
    )
  )
  let completions = $derived(
    promptBindings.length
      ? [
          hbAutocomplete(
            bindingsToCompletions(promptBindings, EditorModes.Handlebars)
          ),
        ]
      : []
  )
  let readableToRuntimeBinding = $derived(
    Object.fromEntries(
      promptBindings.map(binding => [
        binding.readableBinding,
        binding.runtimeBinding,
      ])
    )
  )
  let includedRuntimeBindings = $derived(
    getIncludedToolRuntimeBindings(
      operation?.promptInstructions,
      readableToRuntimeBinding
    )
  )
  let includedTools = $derived(
    availableTools.filter(tool =>
      includedRuntimeBindings.includes(tool.runtimeBinding)
    )
  )
  let filteredTools = $derived(
    availableTools.filter(tool => {
      if (
        tool.sourceType === ToolType.ESCALATION &&
        !$featureFlags[FeatureFlag.ESCALATION]
      ) {
        return false
      }
      const query = toolSearch.trim().toLowerCase()
      return (
        !query ||
        `${tool.sourceLabel || ""} ${tool.readableName || tool.name}`
          .toLowerCase()
          .includes(query)
      )
    })
  )
  let toolSections = $derived(
    filteredTools.reduce(
      (sections, tool) => {
        const section = tool.sourceLabel || "Tools"
        sections[section] ||= []
        sections[section].push(tool)
        return sections
      },
      {} as Record<string, AgentTool[]>
    )
  )

  const executionPrincipalOptions = [
    {
      label: "Requester",
      value: ToolExecutionPrincipal.REQUESTER,
    },
    {
      label: "Admin (elevated)",
      value: ToolExecutionPrincipal.ADMIN,
    },
  ]

  const getToolPrincipal = (toolName: string) => {
    const config = operation?.enabledTools?.find(
      tool => tool.toolName === toolName
    )
    return config?.executionPrincipal ?? ToolExecutionPrincipal.REQUESTER
  }

  const getEffectiveToolPrincipal = (tool: AgentTool) =>
    tool.executionPolicy.mode === "admin"
      ? ToolExecutionPrincipal.ADMIN
      : getToolPrincipal(tool.runtimeBinding)

  const setToolPrincipal = (
    toolName: string,
    executionPrincipal: ToolExecutionPrincipal
  ) => {
    if (!operation) return
    operation.enabledTools = includedRuntimeBindings.map(name => ({
      toolName: name,
      executionPrincipal:
        name === toolName ? executionPrincipal : getToolPrincipal(name),
    }))
    saveOperation()
  }

  const close = () => $goto("../../config")

  const loadOperation = () => {
    if (!agent || !operationId) return
    const selected = agent.operations?.find(item => item.id === operationId)
    if (!selected) {
      close()
      return
    }
    if (operation?.id !== selected.id) {
      operation = { ...selected }
      lastSavedInstructions = operation.promptInstructions || ""
    }
  }

  $effect(loadOperation)

  const saveOperation = async (updates: Partial<AgentOperation> = {}) => {
    if (!agentId || !operation || saving) return false
    operation = { ...operation, ...updates }
    const enabledTools = getConfiguredOperationTools({
      operation,
      readableToRuntimeBinding,
      availableTools,
      toolSecurityEnabled: $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY],
    })
    saving = true
    try {
      const updated = await agentsStore.updateAgentOperation(
        agentId,
        operation.id,
        {
          name: operation.name,
          live: operation.live,
          promptInstructions: operation.promptInstructions,
          enabledTools,
          allowKnowledgeSourceDownload: operation.allowKnowledgeSourceDownload,
          escalation: operation.escalation,
        }
      )
      operation = {
        ...(updated.operations?.find(item => item.id === operation?.id) ||
          operation),
      }
      lastSavedInstructions = operation.promptInstructions || ""
      await workspaceDeploymentStore.fetch()
      return true
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save operation")
      return false
    } finally {
      saving = false
    }
  }

  const insertTool = (tool: AgentTool) => {
    if (!operation || !tool.readableBinding) return
    const current = operation.promptInstructions || ""
    const caret = getCaretPosition?.() || {
      start: current.length,
      end: current.length,
    }
    const binding = `{{ ${tool.readableBinding} }}`
    const nextInstructions =
      current.slice(0, caret.start) + binding + current.slice(caret.end)
    operation.promptInstructions = nextInstructions
    insertAtPos?.({
      start: caret.start,
      end: caret.end,
      value: binding,
      cursor: { anchor: caret.start + binding.length },
    })
    saveOperation({ promptInstructions: nextInstructions })
  }

  const removeTool = (tool: AgentTool) => {
    if (!operation || !tool.readableBinding) return
    const escaped = tool.readableBinding.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    operation.promptInstructions = (operation.promptInstructions || "")
      .replace(new RegExp(`\\{\\{\\s*${escaped}\\s*\\}\\}`, "g"), "")
      .replace(/\n{3,}/g, "\n\n")
    saveOperation()
  }

  const confirmRemoveTool = (tool: AgentTool) => {
    toolToRemove = tool
    removeToolDialog?.show()
  }

  const handleRemoveToolConfirm = () => {
    if (!toolToRemove) return
    removeTool(toolToRemove)
    toolToRemove = undefined
  }

  const clearToolToRemove = () => {
    toolToRemove = undefined
  }

  const openToolMenu = (event: MouseEvent, tool: AgentTool) => {
    event.preventDefault()
    event.stopPropagation()
    contextMenuStore.open(
      "agent-operation-tool",
      [
        {
          icon: "trash",
          name: "Remove tool",
          visible: true,
          callback: () => confirmRemoveTool(tool),
        },
      ],
      { x: event.clientX, y: event.clientY }
    )
  }

  const updateRecipients = (recipients: any[]) => {
    if (!operation) return
    operation.escalation = { ...(operation.escalation || {}), recipients }
    saveOperation()
  }

  const validateName = (name: string) =>
    agent?.operations?.some(
      item =>
        item.id !== operation?.id &&
        item.name.trim().toLowerCase() === name.trim().toLowerCase()
    )
      ? "An operation with this name already exists"
      : undefined

  onDestroy(() => {
    if (
      operation &&
      (operation.promptInstructions || "") !== lastSavedInstructions
    ) {
      saveOperation()
    }
  })
</script>

{#if operation}
  <div class="operation-page">
    <TopBar
      icon="Effect"
      showPublish={false}
      breadcrumbs={[
        { text: "Agents", url: "../../../", tag: "Beta" },
        { text: agent?.name || "Agent", url: "../../config" },
        { text: operationName },
      ]}
    >
      <div class="header-actions">
        <button
          class="header-button"
          aria-label="Rename operation"
          onclick={() => renameModal?.show(operationName)}
        >
          <Icon name="pencil" size="S" />
        </button>
        <button
          class="header-button"
          aria-label="Close operation"
          onclick={close}
        >
          <Icon name="x" size="M" />
        </button>
      </div>
    </TopBar>

    <div class="operation-content">
      <main class="instructions-pane">
        <div class="instructions-header">
          <Body size="S" weight="500">Operation instructions</Body>
          <div class="instructions-actions">
            <GenerateInstructionsControl
              triggerLabel="Help write instructions"
              promptInstructions={operation.promptInstructions || ""}
              {promptBindings}
              {bindingIcons}
              onApplyInstructions={instructions =>
                saveOperation({ promptInstructions: instructions })}
            />
            <Button
              secondary={operation.live}
              size="S"
              icon={operation.live ? "stop" : "play"}
              iconSize="XXS"
              iconWeight="fill"
              disabled={saving}
              on:click={() => saveOperation({ live: !operation?.live })}
            >
              {operation.live ? "Stop" : "Set live"}
            </Button>
          </div>
        </div>

        <div class="editor-shell">
          <div class="editor-body">
            {#if toolsLoaded}
              <CodeEditor
                value={operation.promptInstructions || ""}
                bindings={promptBindings}
                {bindingIcons}
                {completions}
                mode={EditorModes.Handlebars}
                renderBindingsAsTags
                renderMarkdownDecorations
                bind:insertAtPos
                bind:getCaretPosition
                on:change={event => {
                  if (operation)
                    operation.promptInstructions = event.detail || ""
                }}
                on:blur={() => saveOperation()}
              />
            {/if}
          </div>
          <div class="editor-footer">
            <span
              >Use <code>{`{{`}</code> to add tools to your instructions.</span
            >
            <div class="tools-popover-container">
              <ToolsDropdown
                {filteredTools}
                {toolSections}
                bind:toolSearch
                webSearchEnabled={false}
                onToolClick={insertTool}
                onAddApiConnection={() => bb.settings("/connections/apis")}
                onConfigureWebSearch={() => bb.settings("/connections/ai")}
              />
            </div>
          </div>
        </div>
      </main>

      <aside class="settings-rail">
        <div class="rail-tabs" role="tablist" aria-label="Operation settings">
          <button
            class:active={activeTab === "tools"}
            onclick={() => (activeTab = "tools")}>Tools</button
          >
          <button
            class:active={activeTab === "knowledge"}
            onclick={() => (activeTab = "knowledge")}>Knowledge</button
          >
          {#if $featureFlags[FeatureFlag.ESCALATION]}
            <button
              class:active={activeTab === "approvals"}
              onclick={() => (activeTab = "approvals")}>Approvals</button
            >
          {/if}
        </div>

        <div class="rail-content">
          {#if activeTab === "tools"}
            <div class="rail-section">
              <OperationRailSectionHeader
                title="Tools"
                description="Give the operation access to the tools it needs to complete requests and take action."
              >
                {#snippet actions()}
                  <div class="tools-popover-container">
                    <ToolsDropdown
                      {filteredTools}
                      {toolSections}
                      bind:toolSearch
                      webSearchEnabled={false}
                      onToolClick={insertTool}
                      onAddApiConnection={() =>
                        bb.settings("/connections/apis")}
                      onConfigureWebSearch={() =>
                        bb.settings("/connections/ai")}
                    />
                  </div>
                {/snippet}
              </OperationRailSectionHeader>
              <div class="tools-list" role="list">
                {#each includedTools as tool (tool.runtimeBinding)}
                  <div
                    class="tool-row"
                    class:tool-row--with-run-as={$featureFlags[
                      FeatureFlag.AI_AGENT_TOOL_SECURITY
                    ] && tool.executionPolicy.mode === "configurable"}
                    role="listitem"
                    oncontextmenu={event => openToolMenu(event, tool)}
                  >
                    <div class="tool-row-main">
                      <div class="tool-name">
                        <span class="tool-icon">
                          <ToolIcon
                            icon={tool.icon}
                            size="S"
                            fallbackIcon="Wrench"
                          />
                        </span>
                        <span>{tool.readableBinding}</span>
                      </div>
                      <button
                        aria-label={`Actions for ${tool.readableBinding}`}
                        onclick={event => openToolMenu(event, tool)}
                      >
                        <Icon name="dots-three" size="XS" />
                      </button>
                    </div>
                    {#if $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY] && tool.executionPolicy.mode === "configurable"}
                      <div
                        class="tool-row-run-as"
                        role="group"
                        aria-label="Run as"
                        oncontextmenu={event => event.stopPropagation()}
                      >
                        <span class="run-as-label">Run as</span>
                        <Select
                          size="S"
                          bordered={false}
                          placeholder={false}
                          autoWidth
                          popoverAutoWidth
                          value={getEffectiveToolPrincipal(tool)}
                          options={executionPrincipalOptions}
                          getOptionLabel={option => option.label}
                          getOptionValue={option => option.value}
                          tooltip={`Execution identity for ${formatToolLabel(tool)}`}
                          on:change={event =>
                            setToolPrincipal(
                              tool.runtimeBinding,
                              event.detail as ToolExecutionPrincipal
                            )}
                        />
                      </div>
                    {/if}
                  </div>
                {:else}
                  <Body size="XS" color="var(--spectrum-global-color-gray-700)"
                    >No tools are referenced in these instructions.</Body
                  >
                {/each}
              </div>
            </div>
          {:else if activeTab === "knowledge"}
            <Knowledge bind:operation onUpdated={() => saveOperation()} />
          {:else}
            <div class="rail-section approval-panel">
              <OperationRailSectionHeader
                title="Approvals"
                description="Choose who gets notified when this operation escalates for approval."
              />
              <EscalationRecipients
                single
                recipients={operation.escalation?.recipients || []}
                {agentId}
                onChange={updateRecipients}
              />
            </div>
          {/if}
        </div>
      </aside>
    </div>
  </div>

  <OperationNameModal
    bind:this={renameModal}
    title="Rename operation"
    confirmText="Save"
    {validateName}
    onConfirm={async name => {
      await saveOperation({ name })
    }}
  />

  <ConfirmDialog
    bind:this={removeToolDialog}
    title="Remove tool?"
    okText="Remove"
    warning={true}
    onOk={handleRemoveToolConfirm}
    onCancel={clearToolToRemove}
    onClose={clearToolToRemove}
  >
    {#if toolToRemove?.readableBinding}
      Remove <b>{toolToRemove.readableBinding}</b> from this operation? Its binding
      will also be removed from the instructions.
    {/if}
  </ConfirmDialog>
{/if}

<style>
  .operation-page {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    flex-direction: column;
    background: var(--background);
  }
  .header-actions {
    margin-left: auto;
    display: flex;
    gap: 6px;
  }
  .header-button {
    width: 36px;
    height: 28px;
    border: 0;
    border-radius: 999px;
    background: var(--spectrum-global-color-gray-200);
    color: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .operation-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    flex: 1 1 auto;
    min-height: 0;
  }
  .instructions-pane {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    gap: 10px;
    padding: 10px 12px 12px;
  }
  .instructions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }
  .instructions-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .editor-shell {
    display: flex;
    min-height: 0;
    flex: 1 1 auto;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    background: var(--spectrum-global-color-gray-100);
  }
  .editor-body {
    min-height: 0;
    flex: 1 1 auto;
    overflow: auto;
  }
  .editor-body :global(.cm-editor) {
    min-height: 100%;
    height: 100%;
    background: var(--spectrum-global-color-gray-100) !important;
  }
  .editor-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding: 8px 12px;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    font-size: 12px;
  }
  .editor-footer code {
    padding: 2px 5px;
    border-radius: 3px;
    background: var(--spectrum-global-color-gray-200);
  }
  .settings-rail {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    background: var(--background);
    border-left: 1px solid var(--spectrum-global-color-gray-200);
  }
  .rail-tabs {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 2px 12px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }
  .rail-tabs button {
    border: 0;
    border-radius: 6px;
    padding: 4px 8px;
    background: transparent;
    color: var(--spectrum-global-color-gray-700);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    line-height: 19px;
  }
  .rail-tabs button.active {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
  }
  .rail-content {
    min-height: 0;
    flex: 1 1 auto;
    overflow: auto;
    padding: 20px 12px;
  }
  .rail-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .tools-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tool-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 4px;
    background: var(--background-alt);
    cursor: pointer;
  }
  .tool-row--with-run-as {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    padding: 8px 12px;
  }
  .tool-row-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
    flex: 1 1 auto;
  }
  .tool-row--with-run-as .tool-row-main {
    width: 100%;
  }
  .tool-name {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    line-height: 17px;
  }
  .tool-icon {
    display: flex;
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .tool-icon :global(img),
  .tool-icon :global(svg) {
    width: 14px !important;
    height: 14px !important;
  }
  .tool-name span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tool-row-run-as {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding-left: 21px;
  }
  .run-as-label {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-xs);
    white-space: nowrap;
  }
  .tool-row-run-as :global(.spectrum-Picker) {
    min-width: 0;
  }
  .tool-row-main button {
    display: flex;
    border: 0;
    padding: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  @media (max-width: 900px) {
    .operation-content {
      grid-template-columns: minmax(0, 1fr) 300px;
    }
  }
</style>
