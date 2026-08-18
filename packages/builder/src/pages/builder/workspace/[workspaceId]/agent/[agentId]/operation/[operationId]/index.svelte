<script lang="ts">
  import { Body, Helpers, Icon, notifications } from "@budibase/bbui"
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
  import TopBar from "@/components/common/TopBar.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import {
    EditorModes,
    bindingsToCompletions,
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
    buildReadableToRuntimeBinding,
    getAgentWebSearchConfig,
    isWebSearchConfigured,
    resolveAvailableAgentTools,
    toAgentPromptBindings,
  } from "../../agentAvailableTools"
  import {
    getConfiguredOperationTools,
    getIncludedToolRuntimeBindings,
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
  let toolToRemove: AgentTool | undefined = $state()
  let toolToAdd: AgentTool | undefined = $state()
  let toolInsertPosition: { start: number; end: number } | undefined = $state()

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

  let escalationToolHidden = $derived(
    !$featureFlags[FeatureFlag.ESCALATION] ||
      $featureFlags[FeatureFlag.AI_TOOL_ESCALATION]
  )
  let promptBindings = $derived.by(() => {
    const bindings = toAgentPromptBindings({
      tools: availableTools,
      webSearchConfigured,
    })
    return escalationToolHidden
      ? bindings.filter(
          binding => !binding.readableBinding?.startsWith("escalation.")
        )
      : bindings
  })
  let bindingIcons = $derived(buildBindingIcons(promptBindings))
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
    buildReadableToRuntimeBinding(availableTools)
  )
  let includedRuntimeBindings = $derived(
    getIncludedToolRuntimeBindings(
      operation?.promptInstructions,
      readableToRuntimeBinding
    )
  )
  let includedTools = $derived(
    availableTools.filter(
      tool =>
        includedRuntimeBindings.includes(tool.runtimeBinding) &&
        !(tool.sourceType === ToolType.ESCALATION && escalationToolHidden)
    )
  )
  let filteredTools = $derived.by(() =>
    availableTools.filter(tool => {
      if (tool.sourceType === ToolType.ESCALATION && escalationToolHidden) {
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

    const enabledTools = getConfiguredOperationTools({
      operation: snapshot,
      readableToRuntimeBinding,
      availableTools,
      toolSecurityEnabled: $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY],
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
          approvalPolicies: snapshot.approvalPolicies,
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

  const insertTool = (
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

  const removeTool = (tool: AgentTool) => {
    if (!operation || !tool.readableBinding) {
      return
    }
    const escaped = tool.readableBinding.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const nextInstructions = (operation.promptInstructions || "")
      .replace(new RegExp(`\\{\\{\\s*${escaped}\\s*\\}\\}`, "g"), "")
      .replace(/\n{3,}/g, "\n\n")
    saveOperation({ promptInstructions: nextInstructions })
  }

  const getToolPrincipal = (toolName: string) =>
    operation?.enabledTools?.find(tool => tool.toolName === toolName)
      ?.executionPrincipal ?? ToolExecutionPrincipal.REQUESTER

  const getEffectiveToolPrincipal = (tool: AgentTool) =>
    !$featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY] ||
    tool.executionPolicy.mode === "admin"
      ? ToolExecutionPrincipal.ADMIN
      : getToolPrincipal(tool.runtimeBinding)

  const getDefaultToolPrincipal = (tool: AgentTool) => {
    if (
      !$featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY] ||
      tool.executionPolicy.mode === "admin"
    ) {
      return ToolExecutionPrincipal.ADMIN
    }
    return tool.executionPolicy.defaultPrincipal
  }

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
    const existing = new Map(
      (operation.enabledTools || []).map(tool => [tool.toolName, tool])
    )
    operation.enabledTools = includedRuntimeBindings.map(name => ({
      ...existing.get(name),
      toolName: name,
      executionPrincipal:
        name === toolName ? executionPrincipal : getToolPrincipal(name),
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

  const confirmRemoveTool = (tool: AgentTool) => {
    toolToRemove = tool
    removeToolDialog?.show()
  }

  const handleRemoveToolConfirm = () => {
    if (!toolToRemove) {
      return
    }
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

  const handleToolActions = (event: MouseEvent, tool: AgentTool) => {
    event.stopPropagation()
    if ($featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY]) {
      configureTool(tool)
      return
    }
    openToolMenu(event, tool)
  }

  const getToolApprovalCount = (toolName: string) =>
    $featureFlags[FeatureFlag.AI_TOOL_ESCALATION]
      ? (operation?.enabledTools?.find(
          configured => configured.toolName === toolName
        )?.executionRules?.length ?? 0)
      : 0

  const getToolEscalationPolicyId = (toolName: string) =>
    operation?.enabledTools?.find(
      configured => configured.toolName === toolName
    )?.executionRules?.[0]?.policyId

  const getToolEscalationRecipients = (
    toolName: string
  ): EscalationRecipient[] => {
    const policyId = getToolEscalationPolicyId(toolName)
    if (!policyId) {
      return []
    }
    const policy = operation?.approvalPolicies?.find(
      candidate => candidate.id === policyId
    )
    return policy?.notifications?.recipients ?? []
  }

  const applyToolEscalation = (
    tool: AgentTool,
    recipients: EscalationRecipient[] | undefined
  ) => {
    if (!operation || recipients === undefined) {
      return
    }
    const toolName = tool.runtimeBinding
    const existingPolicyId = getToolEscalationPolicyId(toolName)
    const entry = operation.enabledTools?.find(
      configured => configured.toolName === toolName
    )
    if (recipients.length) {
      const policyId = existingPolicyId ?? Helpers.uuid()
      const policy = {
        id: policyId,
        name: `${tool.readableBinding} approval`,
        notifications: { recipients },
      }
      operation.approvalPolicies = [
        ...(operation.approvalPolicies || []).filter(
          candidate => candidate.id !== policyId
        ),
        policy,
      ]
      if (entry) {
        entry.executionRules = [{ policyId }]
      }
    } else if (existingPolicyId) {
      if (entry) {
        delete entry.executionRules
      }
      const referenced = (operation.enabledTools || []).some(configured =>
        configured.executionRules?.some(
          rule => rule.policyId === existingPolicyId
        )
      )
      if (!referenced) {
        operation.approvalPolicies = (operation.approvalPolicies || []).filter(
          candidate => candidate.id !== existingPolicyId
        )
      }
    }
  }

  const toolEscalationOptions = (toolName: string) =>
    $featureFlags[FeatureFlag.AI_TOOL_ESCALATION]
      ? {
          enabled: true,
          recipients: getToolEscalationRecipients(toolName),
        }
      : undefined

  const configureTool = (tool: AgentTool) => {
    toolToAdd = undefined
    toolInsertPosition = undefined
    configureToolModal?.show(
      tool,
      getEffectiveToolPrincipal(tool),
      $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY] &&
        tool.executionPolicy.mode === "configurable",
      false,
      toolEscalationOptions(tool.runtimeBinding)
    )
  }

  const addTool = (tool: AgentTool) => {
    if (!$featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY]) {
      insertTool(tool)
      return
    }

    toolToAdd = tool
    toolInsertPosition = getCaretPosition?.()
    configureToolModal?.show(
      tool,
      getDefaultToolPrincipal(tool),
      $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY] &&
        tool.executionPolicy.mode === "configurable",
      true,
      toolEscalationOptions(tool.runtimeBinding)
    )
  }

  const saveToolConfiguration = ({
    tool,
    executionPrincipal,
    recipients,
  }: {
    tool: AgentTool
    executionPrincipal: ToolExecutionPrincipal
    recipients?: EscalationRecipient[]
  }) => {
    if (toolToAdd?.runtimeBinding === tool.runtimeBinding && operation) {
      operation.enabledTools = [
        ...(operation.enabledTools || []).filter(
          configured => configured.toolName !== tool.runtimeBinding
        ),
        { toolName: tool.runtimeBinding, executionPrincipal },
      ]
      applyToolEscalation(tool, recipients)
      insertTool(tool, toolInsertPosition)
      toolToAdd = undefined
      toolInsertPosition = undefined
      return
    }

    setToolPrincipal({
      toolName: tool.runtimeBinding,
      executionPrincipal,
    })
    applyToolEscalation(tool, recipients)
    if (recipients !== undefined) {
      saveOperation()
    }
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
              promptInstructions={operation.promptInstructions || ""}
              {promptBindings}
              {bindingIcons}
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
                {filteredTools}
                {toolSections}
                bind:toolSearch
                webSearchEnabled={webSearchConfigured}
                onToolClick={addTool}
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
          {#if !escalationToolHidden}
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
                      onToolClick={addTool}
                      onAddApiConnection={() =>
                        bb.settings("/connections/apis")}
                      onConfigureWebSearch={() => webSearchConfigModal?.show()}
                    />
                  </div>
                {/snippet}
              </OperationRailSectionHeader>
              <div class="tools-list" role="list">
                {#each includedTools as tool (tool.runtimeBinding)}
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
                          <div class="tool-row-summary">
                            <span class="tool-row-run-as">
                              Run as {getEffectiveToolPrincipal(tool) ===
                              ToolExecutionPrincipal.ADMIN
                                ? "Admin"
                                : "Requester"}
                            </span>
                            {#if getToolApprovalCount(tool.runtimeBinding)}
                              <span class="tool-row-approvals">
                                <Icon name="shield-check" size="XS" />
                                {getToolApprovalCount(tool.runtimeBinding)}
                                {getToolApprovalCount(tool.runtimeBinding) === 1
                                  ? "approval"
                                  : "approvals"}
                              </span>
                            {/if}
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
                    </div>
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
          {:else if !escalationToolHidden}
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
    onCancel={clearToolToRemove}
    onClose={clearToolToRemove}
  >
    {#if toolToRemove?.readableBinding}
      Remove <b>{toolToRemove.readableBinding}</b> from this operation? Its binding
      will also be removed from the instructions.
    {/if}
  </ConfirmDialog>

  {#if $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY]}
    <ConfigureOperationToolModal
      bind:this={configureToolModal}
      {agentId}
      onSave={saveToolConfiguration}
      onRemove={confirmRemoveTool}
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

  .tool-row-summary {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
    justify-content: space-between;
  }

  .tool-row-run-as {
    color: var(--spectrum-global-color-gray-700);
    font-size: 11px;
    line-height: 15px;
  }

  .tool-row-approvals {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
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
