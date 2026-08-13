<script lang="ts">
  import { notifications } from "@budibase/bbui"
  import {
    FeatureFlag,
    ToolExecutionPrincipal,
    type AgentOperation,
    type CaretPositionFn,
    type InsertAtPositionFn,
  } from "@budibase/types"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import {
    EditorModes,
    bindingsToCompletions,
    hbAutocomplete,
  } from "@/components/common/CodeEditor"
  import {
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
  import type { AgentTool } from "../../toolTypes"
  import { createSaveCoordinator } from "../../operationSaveCoordinator"
  import OperationInstructionsPane from "./OperationInstructionsPane.svelte"
  import OperationSettingsRail from "./OperationSettingsRail.svelte"
  import {
    insertOperationToolBinding,
    removeOperationToolBinding,
  } from "./operationEditorUtils"
  import {
    filterOperationTools,
    groupToolsBySection,
  } from "./operationToolFilters"
  import {
    hasUnsavedOperationInstructions,
    mergeResyncedOperation,
    shouldResyncOperationFromStore,
  } from "./operationPageUtils"

  const { goto, params } = routify

  $goto

  let togglingLive = $state(false)
  let saving = $state(false)
  let operation = $state<AgentOperation | undefined>()
  let lastSavedInstructions = $state("")
  let syncedAgentRev: string | undefined = $state()
  let toolSearch = $state("")
  let insertAtPos: InsertAtPositionFn | undefined = $state()
  let getCaretPosition: CaretPositionFn | undefined = $state()
  let webSearchConfigModal: WebSearchConfigModal | undefined = $state()

  let agent = $derived($selectedAgent)
  let agentId = $derived($params.agentId || agent?._id)
  let operationId = $derived($params.operationId)
  let storeOperation = $derived(
    agent?.operations?.find(item => item.id === operationId)
  )
  let operationName = $derived(
    storeOperation?.name?.trim() || "Untitled operation"
  )
  let toolsLoaded = $derived($agentsStore.tools !== undefined)
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

  let promptBindings = $derived(
    toAgentPromptBindings({ tools: availableTools, webSearchConfigured })
  )
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
    availableTools.filter(tool =>
      includedRuntimeBindings.includes(tool.runtimeBinding)
    )
  )
  let filteredTools = $derived(
    filterOperationTools({
      tools: availableTools,
      toolSearch,
      escalationEnabled: $featureFlags[FeatureFlag.ESCALATION],
    })
  )
  let toolSections = $derived(groupToolsBySection(filteredTools))

  const close = () => $goto("../../config")

  const loadOperation = () => {
    if (!agent?._id || !operationId) {
      syncedAgentRev = undefined
      return
    }

    const selected = agent.operations?.find(item => item.id === operationId)
    if (!selected) {
      close()
      return
    }

    if (operation?.id !== selected.id) {
      operation = { ...selected }
      lastSavedInstructions = operation.promptInstructions || ""
      syncedAgentRev = agent._rev
      return
    }

    if (
      shouldResyncOperationFromStore({
        agentRev: agent._rev,
        syncedAgentRev,
        isSaving: saving || togglingLive,
      })
    ) {
      const preserveInstructionEdits = hasUnsavedOperationInstructions({
        promptInstructions: operation?.promptInstructions,
        lastSavedInstructions,
      })
      operation = mergeResyncedOperation({
        storeOperation: selected,
        localOperation: operation || selected,
        preserveInstructionEdits,
      })
      if (!preserveInstructionEdits) {
        lastSavedInstructions = operation.promptInstructions || ""
      }
      syncedAgentRev = agent._rev
    }
  }

  $effect(loadOperation)

  const persistOperation = async (): Promise<boolean> => {
    if (!agentId || !operation) {
      return false
    }

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
      syncedAgentRev = updated._rev
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

  const saveOperation = async (updates: Partial<AgentOperation> = {}) => {
    if (!agentId || !operation) {
      return false
    }
    if (Object.keys(updates).length > 0) {
      operation = { ...operation, ...updates }
    }
    return operationSaveCoordinator.save()
  }

  const updateInstructions = (instructions: string) => {
    if (!operation) {
      return
    }
    operation.promptInstructions = instructions
  }

  const insertTool = (tool: AgentTool) => {
    if (!operation) {
      return
    }
    const nextInstructions = insertOperationToolBinding({
      tool,
      instructions: operation.promptInstructions || "",
      getCaretPosition,
      insertAtPos,
    })
    saveOperation({ promptInstructions: nextInstructions })
  }

  const removeTool = (tool: AgentTool) => {
    if (!operation || !tool.readableBinding) {
      return
    }
    const nextInstructions = removeOperationToolBinding({
      instructions: operation.promptInstructions || "",
      readableBinding: tool.readableBinding,
    })
    saveOperation({ promptInstructions: nextInstructions })
  }

  const getToolPrincipal = (toolName: string) =>
    operation?.enabledTools?.find(tool => tool.toolName === toolName)
      ?.executionPrincipal ?? ToolExecutionPrincipal.REQUESTER

  const getEffectiveToolPrincipal = (tool: AgentTool) =>
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
    operation.enabledTools = includedRuntimeBindings.map(name => ({
      toolName: name,
      executionPrincipal:
        name === toolName ? executionPrincipal : getToolPrincipal(name),
    }))
    saveOperation()
  }

  const toggleOperationLive = async () => {
    if (!operation || togglingLive) {
      return
    }

    togglingLive = true
    try {
      await saveOperation({ live: !operation.live })
    } finally {
      togglingLive = false
    }
  }

  const updateRecipients = (recipients: unknown[]) => {
    if (!operation) {
      return
    }
    operation.escalation = { ...(operation.escalation || {}), recipients }
    saveOperation()
  }

  const openWebSearchConfigModal = () => {
    webSearchConfigModal?.show()
  }

  onDestroy(() => {
    if (
      operation &&
      (operation.promptInstructions || "") !== lastSavedInstructions
    ) {
      saveOperation()
    }
  })
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
      <OperationInstructionsPane
        {operation}
        {toolsLoaded}
        {promptBindings}
        {bindingIcons}
        {completions}
        {filteredTools}
        {toolSections}
        bind:toolSearch
        bind:insertAtPos
        bind:getCaretPosition
        {webSearchConfigured}
        {togglingLive}
        onInstructionsChange={updateInstructions}
        onInstructionsBlur={() => saveOperation()}
        onApplyGeneratedInstructions={instructions =>
          saveOperation({ promptInstructions: instructions })}
        onToggleLive={toggleOperationLive}
        onToolClick={insertTool}
        onConfigureWebSearch={openWebSearchConfigModal}
      />

      <OperationSettingsRail
        bind:operation
        {agentId}
        {includedTools}
        {filteredTools}
        {toolSections}
        bind:toolSearch
        {webSearchConfigured}
        onToolClick={insertTool}
        onConfigureWebSearch={openWebSearchConfigModal}
        onRemoveTool={removeTool}
        onSetToolPrincipal={setToolPrincipal}
        {getEffectiveToolPrincipal}
        onUpdated={() => saveOperation()}
        onRecipientsChange={updateRecipients}
      />
    </div>
  </div>

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
  @media (max-width: 900px) {
    .operation-content {
      grid-template-columns: minmax(0, 1fr) 300px;
    }
  }
</style>
