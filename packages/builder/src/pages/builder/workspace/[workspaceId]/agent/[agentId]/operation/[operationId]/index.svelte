<script lang="ts">
  import { Body, Icon, notifications } from "@budibase/bbui"
  import {
    FeatureFlag,
    ToolExecutionPrincipal,
    ToolType,
    type AgentOperation,
    type CaretPositionFn,
    type EscalationRecipient,
    type InsertAtPositionFn,
  } from "@budibase/types"
  import * as routify from "@roxi/routify"
  import type { EditorView } from "@codemirror/view"
  import TopBar from "@/components/common/TopBar.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import {
    EditorModes,
    bindingsToCompletions,
    buildSectionHeader,
    hbAutocomplete,
  } from "@/components/common/CodeEditor"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"
  import LiveToggleButton from "@/components/common/LiveToggleButton.svelte"
  import {
    contextMenuStore,
    datasources,
    restTemplates,
    workspaceDeploymentStore,
  } from "@/stores/builder"
  import {
    agentsStore,
    aiConfigsStore,
    featureFlags,
    selectedAgent,
  } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import type { BindingCompletion, BindingCompletionOption } from "@/types"
  import AgentTabList from "../../AgentTabList.svelte"
  import AgentUnpublishedChangesIndicator from "../../AgentUnpublishedChangesIndicator.svelte"
  import ConfigureOperationToolModal from "../../ConfigureOperationToolModal.svelte"
  import GenerateInstructionsControl from "../../GenerateInstructionsControl.svelte"
  import Knowledge from "../../knowledge/index.svelte"
  import OperationRailSectionHeader from "../../OperationRailSectionHeader.svelte"
  import ToolIcon from "../../ToolIcon.svelte"
  import ToolsDropdown from "../../ToolsDropdown.svelte"
  import WebSearchConfigModal from "../../WebSearchConfigModal.svelte"
  import {
    buildBindingIcons,
    getAgentWebSearchConfig,
    isWebSearchConfigured,
    resolveAvailableAgentTools,
    toAgentPromptBindings,
  } from "../../agentAvailableTools"
  import {
    getDefaultToolExecutionPrincipal,
    isToolReferenced,
    normalizeConfiguredOperationTools,
  } from "../../toolBindingUtils"
  import { createSaveCoordinator } from "../../operationSaveCoordinator"
  import type { AgentTool } from "../../toolTypes"

  const { goto, params } = routify

  $goto

  type RailTab = "tools" | "knowledge" | "approvals"

  let togglingLive = $state(false)
  let saving = $state(false)
  let operation = $state<AgentOperation | undefined>()
  let lastSavedInstructions = $state("")
  let syncedAgentRev: string | undefined = $state()
  let toolSearch = $state("")
  let activeTab = $state<RailTab>("tools")
  let insertAtPos: InsertAtPositionFn | undefined = $state()
  let getCaretPosition: CaretPositionFn | undefined = $state()
  let webSearchConfigModal: WebSearchConfigModal | undefined = $state()
  let removeToolDialog: ConfirmDialog | undefined = $state()
  let configureToolModal: ConfigureOperationToolModal | undefined = $state()
  let editorToolsDropdown: ToolsDropdown | undefined = $state()
  let toolToRemove: AgentTool | undefined = $state()
  let restoreToolConfiguration = $state(false)
  let blockedTool: AgentTool | undefined = $state()
  let blockedToolDialog: ConfirmDialog | undefined = $state()
  let insertToolAfterAdding = $state(false)
  let addingTool: AgentTool | undefined = $state()
  let autocompleteToolPosition: { start: number; end: number } | undefined =
    $state()
  let addingToolInsertPosition: { start: number; end: number } | undefined =
    $state()

  let previousToolsLoaded = false

  let agent = $derived($selectedAgent)
  let agentId = $derived($params.agentId || agent?._id)
  let operationId = $derived($params.operationId)
  let storeOperation = $derived(
    agent?.operations?.find(item => item.id === operationId)
  )
  let operationName = $derived(
    storeOperation?.name?.trim() || "Untitled operation"
  )
  let toolsLoaded = $derived($agentsStore.toolsLoaded)
  let webSearchConfig = $derived(
    getAgentWebSearchConfig($aiConfigsStore.customConfigs, agent?.aiconfig)
  )
  let webSearchConfigured = $derived(isWebSearchConfigured(webSearchConfig))

  let availableTools = $derived.by(() =>
    resolveAvailableAgentTools({
      storeTools: $agentsStore.tools || [],
      datasourceList: $datasources.list,
      getRestTemplateIcon: identifier => restTemplates.get(identifier)?.icon,
      webSearchConfig,
    })
  )

  let configuredTools = $derived.by(() =>
    (operation?.enabledTools || [])
      .map(config =>
        availableTools.find(tool => tool.runtimeBinding === config.toolName)
      )
      .filter((tool): tool is AgentTool => !!tool)
  )
  let promptBindings = $derived(
    toAgentPromptBindings({ tools: configuredTools, webSearchConfigured })
  )
  let availablePromptBindings = $derived(
    toAgentPromptBindings({ tools: availableTools, webSearchConfigured })
  )
  let availableBindingIcons = $derived(
    buildBindingIcons(availablePromptBindings)
  )
  const bindingIcons: Record<string, string | undefined> = {}
  $effect(() => {
    const nextIcons = buildBindingIcons(promptBindings)
    for (const binding of Object.keys(bindingIcons)) {
      delete bindingIcons[binding]
    }
    Object.assign(bindingIcons, nextIcons)
  })

  const addToolCompletion: BindingCompletionOption = {
    label: "Add tool",
    detail: "Configure a new tool",
    type: "keyword",
    section: buildSectionHeader(null, "Actions", "", Number.MAX_SAFE_INTEGER),
    boost: -100,
    apply: (
      view: EditorView,
      _completion: BindingCompletionOption,
      from: number,
      to: number
    ) => {
      const textBeforeCompletion = view.state.doc.sliceString(0, from)
      const bindingPrefix = textBeforeCompletion.match(/(?:\{){2,}\s*$/)?.[0]
      const closingBraces = view.state.doc.sliceString(to, to + 2) === "}}"
      autocompleteToolPosition = {
        start: bindingPrefix ? from - bindingPrefix.length : from,
        end: closingBraces ? to + 2 : to,
      }
      editorToolsDropdown?.show()
    },
  }
  const operationAutocomplete: BindingCompletion = context => {
    const result = hbAutocomplete([
      ...bindingsToCompletions(promptBindings, EditorModes.Handlebars),
      addToolCompletion,
    ])(context)
    if (!result) {
      return null
    }
    return {
      ...result,
      options: [
        ...result.options.filter(option => option !== addToolCompletion),
        addToolCompletion,
      ],
    }
  }
  const completions = [operationAutocomplete]
  let filteredTools = $derived.by(() =>
    availableTools.filter(tool => {
      if (
        operation?.enabledTools?.some(
          config => config.toolName === tool.runtimeBinding
        )
      ) {
        return false
      }
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
  let toolSections = $derived.by(() =>
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

  const close = () => $goto("../../config")

  const hasUnsavedInstructions = () =>
    operation && (operation.promptInstructions || "") !== lastSavedInstructions

  $effect(() => {
    if (!agent?._id || !operationId) {
      operation = undefined
      lastSavedInstructions = ""
      syncedAgentRev = undefined
      return
    }

    const selected = agent.operations?.find(item => item.id === operationId)
    if (!selected) {
      close()
      return
    }

    if (operation?.id !== operationId) {
      operation = { ...selected }
      lastSavedInstructions = operation.promptInstructions || ""
      syncedAgentRev = agent._rev
      return
    }

    if (
      agent._rev !== syncedAgentRev &&
      !saving &&
      !togglingLive &&
      !hasUnsavedInstructions()
    ) {
      operation = { ...selected }
      lastSavedInstructions = operation.promptInstructions || ""
      syncedAgentRev = agent._rev
    }
  })

  const persistOperation = async (): Promise<boolean> => {
    if (!agentId || !operation || !toolsLoaded) {
      return false
    }

    const forOperationId = operation.id
    const snapshot = { ...operation }

    const enabledTools = normalizeConfiguredOperationTools({
      operation: snapshot,
      availableTools,
    })
    saving = true
    try {
      const updated = await agentsStore.updateAgentOperation(
        agentId,
        forOperationId,
        {
          name: snapshot.name,
          live: snapshot.live,
          promptInstructions: snapshot.promptInstructions,
          enabledTools,
          allowKnowledgeSourceDownload: snapshot.allowKnowledgeSourceDownload,
          escalation: snapshot.escalation,
        }
      )

      if (operationId === forOperationId && operation) {
        syncedAgentRev = updated._rev
        if (
          (operation.promptInstructions || "") ===
          (snapshot.promptInstructions || "")
        ) {
          lastSavedInstructions = snapshot.promptInstructions || ""
        }
      }

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

  const operationSaveCoordinator = createSaveCoordinator(persistOperation)

  const saveOperation = async (
    updates: Partial<AgentOperation> = {}
  ): Promise<boolean> => {
    if (!agentId || !operation) {
      return false
    }
    if (Object.keys(updates).length > 0) {
      operation = { ...operation, ...updates }
    }

    if (!toolsLoaded) {
      return false
    }

    return operationSaveCoordinator.save()
  }

  $effect(() => {
    const justLoaded = toolsLoaded && !previousToolsLoaded
    previousToolsLoaded = toolsLoaded

    if (
      justLoaded &&
      operation &&
      hasUnsavedInstructions() &&
      !saving &&
      !togglingLive
    ) {
      saveOperation()
    }
  })

  const updateInstructions = (instructions: string) => {
    if (!operation) {
      return
    }
    operation.promptInstructions = instructions
  }

  const insertToolBinding = (
    tool: AgentTool,
    position?: { start: number; end: number }
  ) => {
    if (!operation || !tool.readableBinding) {
      return
    }
    const current = operation.promptInstructions || ""
    const caret = position ||
      getCaretPosition?.() || {
        start: current.length,
        end: current.length,
      }
    const binding = `{{ ${tool.readableBinding} }}`
    const nextInstructions =
      current.slice(0, caret.start) + binding + current.slice(caret.end)

    insertAtPos?.({
      start: caret.start,
      end: caret.end,
      value: binding,
      cursor: { anchor: caret.start + binding.length },
    })
    saveOperation({ promptInstructions: nextInstructions })
  }

  const removeEmptyToolPlaceholder = (position?: {
    start: number
    end: number
  }) => {
    if (!operation || !position) {
      return
    }
    const current = operation.promptInstructions || ""
    if (!/^\{\{\s*\}\}$/.test(current.slice(position.start, position.end))) {
      return
    }
    const nextInstructions =
      current.slice(0, position.start) + current.slice(position.end)
    autocompleteToolPosition = undefined
    insertAtPos?.({
      start: position.start,
      end: position.end,
      value: "",
      cursor: { anchor: position.start },
    })
    saveOperation({ promptInstructions: nextInstructions })
  }

  const removeTool = (tool: AgentTool) => {
    if (!operation) {
      return
    }
    saveOperation({
      enabledTools: (operation.enabledTools || []).filter(
        config => config.toolName !== tool.runtimeBinding
      ),
    })
  }

  const getToolPrincipal = (toolName: string) =>
    operation?.enabledTools?.find(tool => tool.toolName === toolName)
      ?.executionPrincipal ?? ToolExecutionPrincipal.REQUESTER

  const getEffectiveToolPrincipal = (tool: AgentTool) =>
    !$featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY] ||
    tool.executionPolicy.mode === "admin"
      ? ToolExecutionPrincipal.ADMIN
      : getToolPrincipal(tool.runtimeBinding)

  const setToolPrincipal = ({
    toolName,
    executionPrincipal,
  }: {
    toolName: string
    executionPrincipal: ToolExecutionPrincipal
  }) => {
    if (!operation) {
      return
    }
    operation.enabledTools = (operation.enabledTools || []).map(config => ({
      ...config,
      executionPrincipal:
        config.toolName === toolName
          ? executionPrincipal
          : config.executionPrincipal,
    }))
    saveOperation()
  }

  const toggleOperationLive = async () => {
    if (!operation || togglingLive || !agentId) {
      return
    }

    const nextLive = operation.live !== true

    togglingLive = true
    try {
      const updated = await agentsStore.updateAgentOperation(
        agentId,
        operation.id,
        { live: nextLive }
      )
      const storeOperation = updated.operations?.find(
        item => item.id === operation?.id
      )
      if (storeOperation && operationId === operation.id) {
        operation = { ...operation, live: storeOperation.live }
        syncedAgentRev = updated._rev
      }
      await workspaceDeploymentStore.fetch()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to update operation")
    } finally {
      togglingLive = false
    }
  }

  const updateRecipients = (
    recipients: { type: string; config: Record<string, unknown> }[]
  ) => {
    if (!operation) {
      return
    }
    operation.escalation = {
      ...(operation.escalation || {}),
      recipients: recipients as EscalationRecipient[],
    }
    saveOperation()
  }

  const confirmRemoveTool = (
    tool: AgentTool,
    returnToConfiguration = false
  ) => {
    restoreToolConfiguration = returnToConfiguration
    if (
      isToolReferenced({
        prompt: operation?.promptInstructions,
        tool,
      })
    ) {
      blockedTool = tool
      blockedToolDialog?.show()
      return
    }
    toolToRemove = tool
    removeToolDialog?.show()
  }

  const handleRemoveToolConfirm = () => {
    if (!toolToRemove) {
      return
    }
    removeTool(toolToRemove)
    toolToRemove = undefined
    restoreToolConfiguration = false
  }

  const handleRemoveToolClose = () => {
    const tool = toolToRemove
    const shouldRestore = restoreToolConfiguration
    toolToRemove = undefined
    restoreToolConfiguration = false
    if (tool && shouldRestore) {
      configureTool(tool)
    }
  }

  const handleBlockedToolClose = () => {
    const tool = blockedTool
    const shouldRestore = restoreToolConfiguration
    blockedTool = undefined
    restoreToolConfiguration = false
    if (tool && shouldRestore) {
      configureTool(tool)
    }
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

  const configureTool = (tool: AgentTool) => {
    addingTool = undefined
    configureToolModal?.show(
      tool,
      getEffectiveToolPrincipal(tool),
      $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY] &&
        tool.executionPolicy.mode === "configurable"
    )
  }

  const beginAddingTool = (
    tool: AgentTool,
    insertAfterAdding = false,
    insertPosition?: { start: number; end: number }
  ) => {
    addingTool = tool
    insertToolAfterAdding = insertAfterAdding
    addingToolInsertPosition = insertPosition
    const executionPrincipal = getDefaultToolExecutionPrincipal({
      tool,
      toolSecurityEnabled: $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY],
    })
    if (!$featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY]) {
      saveToolConfiguration({ tool, executionPrincipal })
      return
    }
    configureToolModal?.show(
      tool,
      executionPrincipal,
      $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY] &&
        tool.executionPolicy.mode === "configurable",
      true
    )
  }

  const saveToolConfiguration = async ({
    tool,
    executionPrincipal,
  }: {
    tool: AgentTool
    executionPrincipal: ToolExecutionPrincipal
  }) => {
    if (addingTool?.runtimeBinding !== tool.runtimeBinding || !operation) {
      setToolPrincipal({
        toolName: tool.runtimeBinding,
        executionPrincipal,
      })
      return
    }

    const shouldInsertTool = insertToolAfterAdding
    const insertPosition = addingToolInsertPosition
    addingTool = undefined
    insertToolAfterAdding = false
    addingToolInsertPosition = undefined
    const alreadyConfigured = operation.enabledTools?.some(
      config => config.toolName === tool.runtimeBinding
    )
    if (!alreadyConfigured) {
      const saved = await saveOperation({
        enabledTools: [
          ...(operation.enabledTools || []),
          { toolName: tool.runtimeBinding, executionPrincipal },
        ],
      })
      if (!saved) {
        return
      }
    }
    if (shouldInsertTool) {
      insertToolBinding(tool, insertPosition)
    }
  }

  const selectEditorTool = (tool: AgentTool) => {
    const insertPosition = autocompleteToolPosition
    autocompleteToolPosition = undefined
    beginAddingTool(tool, true, insertPosition)
  }

  const cancelAutocompleteToolAddition = () => {
    const position = autocompleteToolPosition
    autocompleteToolPosition = undefined
    removeEmptyToolPlaceholder(position)
  }

  const closeToolConfiguration = () => {
    const insertPosition = addingToolInsertPosition
    addingTool = undefined
    insertToolAfterAdding = false
    addingToolInsertPosition = undefined
    removeEmptyToolPlaceholder(insertPosition)
  }
</script>

{#if operation && agentId}
  <div class="operation-page">
    <TopBar
      icon="Effect"
      breadcrumbs={[
        { text: "Agents", url: "../../../", tag: "Beta" },
        { text: agent?.name || "Agent", url: "../../config" },
        { text: operationName },
      ]}
    />

    <div class="operation-content">
      <main class="instructions-pane">
        <div class="instructions-header">
          <Body size="S" weight="500">Operation instructions</Body>
          <div class="instructions-actions">
            <AgentUnpublishedChangesIndicator />
            <GenerateInstructionsControl
              triggerLabel="Help write instructions"
              promptBindings={availablePromptBindings}
              bindingIcons={availableBindingIcons}
              onApplyInstructions={instructions =>
                saveOperation({ promptInstructions: instructions })}
            />
            <LiveToggleButton
              live={operation.live === true}
              size="S"
              disabled={togglingLive || !toolsLoaded}
              on:click={toggleOperationLive}
            />
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
                on:change={event => updateInstructions(event.detail || "")}
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
                bind:this={editorToolsDropdown}
                {filteredTools}
                {toolSections}
                bind:toolSearch
                webSearchEnabled={webSearchConfigured}
                onToolClick={selectEditorTool}
                onClose={cancelAutocompleteToolAddition}
                onAddApiConnection={() => bb.settings("/connections/apis")}
                onConfigureWebSearch={() => webSearchConfigModal?.show()}
              />
            </div>
          </div>
        </div>
      </main>

      <aside class="settings-rail">
        <AgentTabList ariaLabel="Operation settings" bordered>
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
        </AgentTabList>

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
                      webSearchEnabled={webSearchConfigured}
                      onToolClick={tool => beginAddingTool(tool)}
                      onAddApiConnection={() =>
                        bb.settings("/connections/apis")}
                      onConfigureWebSearch={() => webSearchConfigModal?.show()}
                    />
                  </div>
                {/snippet}
              </OperationRailSectionHeader>
              <div class="tools-list" role="list">
                {#each configuredTools as tool (tool.runtimeBinding)}
                  <div role="listitem">
                    <div
                      class="tool-row"
                      class:tool-row--with-run-as={$featureFlags[
                        FeatureFlag.AI_AGENT_TOOL_SECURITY
                      ]}
                    >
                      {#if $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY]}
                        <button
                          class="tool-row-activation"
                          aria-label={`Configure ${tool.readableBinding}`}
                          onclick={() => configureTool(tool)}
                        >
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
                          <div class="tool-row-run-as">
                            Run as {getEffectiveToolPrincipal(tool) ===
                            ToolExecutionPrincipal.ADMIN
                              ? "Admin"
                              : "Requester"}
                          </div>
                        </button>
                      {:else}
                        <div class="tool-row-activation">
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
                        </div>
                      {/if}
                      {#if !$featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY]}
                        <button
                          class="tool-actions"
                          aria-label={`Actions for ${tool.readableBinding}`}
                          onclick={event => openToolMenu(event, tool)}
                        >
                          <Icon name="dots-three" size="XS" />
                        </button>
                      {/if}
                    </div>
                  </div>
                {:else}
                  <Body size="XS" color="var(--spectrum-global-color-gray-700)"
                    >No tools are configured for this operation.</Body
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

  <ConfirmDialog
    bind:this={removeToolDialog}
    title="Remove tool?"
    okText="Remove"
    warning={true}
    onOk={handleRemoveToolConfirm}
    onClose={handleRemoveToolClose}
  >
    {#if toolToRemove?.readableBinding}
      Remove <b>{toolToRemove.readableBinding}</b> from this operation?
    {/if}
  </ConfirmDialog>

  <ConfirmDialog
    bind:this={blockedToolDialog}
    title="Tool is used in instructions"
    okText="Close"
    showCancelButton={false}
    warning={false}
    onOk={handleBlockedToolClose}
    onClose={handleBlockedToolClose}
  >
    {#if blockedTool?.readableBinding}
      Remove every <b>{`{{ ${blockedTool.readableBinding} }}`}</b> reference from
      the instructions before removing this tool.
    {/if}
  </ConfirmDialog>

  {#if $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY]}
    <ConfigureOperationToolModal
      bind:this={configureToolModal}
      onSave={saveToolConfiguration}
      onRemove={tool => confirmRemoveTool(tool, true)}
      onClose={closeToolConfiguration}
    />
  {/if}

  <WebSearchConfigModal
    bind:this={webSearchConfigModal}
    aiconfigId={agent?.aiconfig}
  />
{/if}

<style>
  .operation-page {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    flex-direction: column;
    background: var(--background);
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
    box-sizing: border-box;
    min-height: 34px;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0 12px;
    border-radius: 4px;
    background: var(--background-alt);
    width: 100%;
    color: inherit;
    text-align: left;
  }

  .tool-row--with-run-as {
    min-height: 50px;
    padding: 8px 12px;
  }

  .tool-row-activation {
    display: flex;
    min-width: 0;
    flex: 1 1 auto;
    align-items: center;
    border: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font-family: inherit;
    text-align: left;
  }

  button.tool-row-activation {
    cursor: pointer;
  }

  .tool-row--with-run-as .tool-row-activation {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
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
    padding-left: 21px;
    color: var(--spectrum-global-color-gray-700);
    font-size: 11px;
    line-height: 15px;
  }

  .tool-actions {
    display: flex;
    padding: 4px;
    border: 0;
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
