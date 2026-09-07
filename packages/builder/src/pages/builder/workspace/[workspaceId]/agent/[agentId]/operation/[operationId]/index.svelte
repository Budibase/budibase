<script lang="ts">
  import {
    Body,
    Button,
    Helpers,
    Icon,
    Link,
    notifications,
    ProgressCircle,
  } from "@budibase/bbui"
  import {
    FeatureFlag,
    ToolExecutionPrincipal,
    ToolType,
    type AgentOperation,
    type EscalationRecipient,
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
  import { configuredEscalationProviders } from "@/stores/portal/escalations"
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
  import {
    getPendingToolInsertion,
    type PendingToolInsertion,
  } from "../../toolAutocomplete"
  import { createSaveCoordinator } from "../../operationSaveCoordinator"
  import type { AgentTool } from "../../toolTypes"
  import {
    getWorkspaceHomeUrl,
    withWorkspaceHomeReturn,
  } from "@/helpers/workspaceHomeNavigation"

  const { goto, params } = routify

  $goto

  type RailTab = "tools" | "knowledge" | "approvals"
  type RemovableTool = Pick<AgentTool, "readableBinding" | "runtimeBinding">

  let togglingLive = $state(false)
  let saving = $state(false)
  let operation = $state<AgentOperation | undefined>()
  let lastSavedInstructions = $state("")
  let syncedAgentRev: string | undefined = $state()
  let toolSearch = $state("")
  let activeTab = $state<RailTab>("tools")
  let instructionsEditor: CodeEditor | undefined = $state()
  let webSearchConfigModal: WebSearchConfigModal | undefined = $state()
  let removeToolDialog: ConfirmDialog | undefined = $state()
  let configureToolModal: ConfigureOperationToolModal | undefined = $state()
  let editorToolsDropdown: ToolsDropdown | undefined = $state()
  let toolToRemove: RemovableTool | undefined = $state()
  let restoreToolConfiguration = $state(false)
  let addingTool: AgentTool | undefined = $state()
  let pendingToolInsertion: PendingToolInsertion | undefined = $state()

  let previousToolsLoaded = false

  let agent = $derived($selectedAgent)
  let homeUrl = $derived(getWorkspaceHomeUrl($params.workspaceId))
  let agentId = $derived($params.agentId || agent?._id)
  let escalationProviders = $derived(configuredEscalationProviders(agent))
  let operationId = $derived($params.operationId)
  let storeOperation = $derived(
    agent?.operations?.find(item => item.id === operationId)
  )
  let operationName = $derived(
    storeOperation?.name?.trim() || "Untitled operation"
  )
  let toolsLoaded = $derived($agentsStore.toolsLoaded)
  let toolsLoadFailed = $derived($agentsStore.toolsLoadFailed)
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
  let configuredToolList = $derived(
    (operation?.enabledTools || [])
      .map(config => ({
        config,
        tool: availableTools.find(
          availableTool => availableTool.runtimeBinding === config.toolName
        ),
      }))
      .filter(
        item =>
          !(
            item.tool?.sourceType === ToolType.ESCALATION &&
            escalationToolHidden
          )
      )
      .sort((a, b) =>
        (a.tool?.readableBinding || a.config.toolName).localeCompare(
          b.tool?.readableBinding || b.config.toolName
        )
      )
  )
  let configuredTools = $derived(
    configuredToolList
      .map(item => item.tool)
      .filter(
        (tool): tool is AgentTool =>
          !!tool &&
          !(tool.sourceType === ToolType.ESCALATION && escalationToolHidden)
      )
  )
  let promptBindings = $derived(
    toAgentPromptBindings({ tools: configuredTools, webSearchConfigured })
  )
  let availablePromptBindings = $derived(
    toAgentPromptBindings({
      tools: availableTools.filter(
        tool =>
          !(tool.sourceType === ToolType.ESCALATION && escalationToolHidden)
      ),
      webSearchConfigured,
    })
  )
  let availableBindingIcons = $derived(
    buildBindingIcons(availablePromptBindings)
  )
  let bindingIcons = $derived(buildBindingIcons(promptBindings))
  let toolToRemoveIsAvailable = $derived(
    !!toolToRemove &&
      availableTools.some(
        tool => tool.runtimeBinding === toolToRemove?.runtimeBinding
      )
  )
  let toolToRemoveIsReferenced = $derived(
    toolToRemoveIsAvailable &&
      isToolReferenced({
        prompt: operation?.promptInstructions,
        tool: toolToRemove!,
      })
  )

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
      pendingToolInsertion = getPendingToolInsertion({
        text: view.state.doc.toString(),
        from,
        to,
      })
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
    availableTools
      .filter(tool => {
        if (
          operation?.enabledTools?.some(
            config => config.toolName === tool.runtimeBinding
          )
        ) {
          return false
        }
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
      .sort((a, b) =>
        (a.readableName || a.name).localeCompare(b.readableName || b.name)
      )
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

  const close = () => $goto(withWorkspaceHomeReturn("../../config"))

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

  const applyGeneratedInstructions = (instructions: string) => {
    if (!operation) {
      return
    }
    const configuredToolNames = new Set(
      (operation.enabledTools || []).map(config => config.toolName)
    )
    const generatedToolConfigs = availableTools
      .filter(
        tool =>
          tool.runtimeBinding &&
          !configuredToolNames.has(tool.runtimeBinding) &&
          isToolReferenced({ prompt: instructions, tool })
      )
      .map(tool => ({
        toolName: tool.runtimeBinding,
        executionPrincipal: getDefaultToolExecutionPrincipal(tool),
      }))

    saveOperation({
      promptInstructions: instructions,
      enabledTools: [
        ...(operation.enabledTools || []),
        ...generatedToolConfigs,
      ],
    })
  }

  const insertToolBinding = (
    tool: AgentTool,
    position?: PendingToolInsertion
  ): string | undefined => {
    if (!tool.readableBinding || !instructionsEditor) {
      return
    }
    const binding = `{{ ${tool.readableBinding} }}`
    return instructionsEditor.replaceRange({
      from: position?.from,
      to: position?.to,
      insert: binding,
    })
  }

  const cancelPendingToolInsertion = (position?: PendingToolInsertion) => {
    if (!operation || !position?.removeOnCancel || !instructionsEditor) {
      return
    }
    const nextInstructions = instructionsEditor.replaceRange({
      from: position.from,
      to: position.to,
      insert: "",
    })
    saveOperation({ promptInstructions: nextInstructions })
  }

  const removeTool = (tool: RemovableTool) => {
    if (!operation) {
      return
    }
    applyToolEscalation(tool, [])
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
    tool: RemovableTool,
    returnToConfiguration = false
  ) => {
    restoreToolConfiguration = returnToConfiguration
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
      const availableTool = availableTools.find(
        item => item.runtimeBinding === tool.runtimeBinding
      )
      if (availableTool) {
        configureTool(availableTool)
      }
    }
  }

  const openToolMenu = (event: MouseEvent, tool: RemovableTool) => {
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

  // Auto-deleting unreferenced policies is interim behaviour - retire it
  // when the policies work makes them user-owned and reusable.
  const applyToolEscalation = (
    tool: RemovableTool,
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
    addingTool = undefined
    configureToolModal?.show(
      tool,
      getEffectiveToolPrincipal(tool),
      tool.executionPolicy.mode === "configurable",
      false,
      toolEscalationOptions(tool.runtimeBinding)
    )
  }

  const beginAddingTool = (
    tool: AgentTool,
    insertPosition?: PendingToolInsertion
  ) => {
    addingTool = tool
    pendingToolInsertion = insertPosition
    const executionPrincipal = getDefaultToolExecutionPrincipal(tool)
    configureToolModal?.show(
      tool,
      executionPrincipal,
      tool.executionPolicy.mode === "configurable",
      true,
      toolEscalationOptions(tool.runtimeBinding)
    )
  }

  const saveToolConfiguration = async ({
    tool,
    executionPrincipal,
    recipients,
  }: {
    tool: AgentTool
    executionPrincipal: ToolExecutionPrincipal
    recipients?: EscalationRecipient[]
  }) => {
    if (addingTool?.runtimeBinding !== tool.runtimeBinding || !operation) {
      setToolPrincipal({
        toolName: tool.runtimeBinding,
        executionPrincipal,
      })
      applyToolEscalation(tool, recipients)
      await saveOperation()
      return
    }

    const insertPosition = pendingToolInsertion
    addingTool = undefined
    pendingToolInsertion = undefined
    const existingConfig = operation.enabledTools?.find(
      config => config.toolName === tool.runtimeBinding
    )
    operation.enabledTools = [
      ...(operation.enabledTools || []).filter(
        config => config.toolName !== tool.runtimeBinding
      ),
      {
        ...existingConfig,
        toolName: tool.runtimeBinding,
        executionPrincipal,
      },
    ]
    applyToolEscalation(tool, recipients)
    const updates: Partial<AgentOperation> = {}
    if (insertPosition) {
      const nextInstructions = insertToolBinding(tool, insertPosition)
      if (nextInstructions !== undefined) {
        updates.promptInstructions = nextInstructions
      }
    }
    await saveOperation(updates)
  }

  const selectEditorTool = (tool: AgentTool) => {
    beginAddingTool(tool, pendingToolInsertion)
  }

  const cancelAutocompleteToolAddition = () => {
    if (addingTool) {
      return
    }
    const position = pendingToolInsertion
    pendingToolInsertion = undefined
    cancelPendingToolInsertion(position)
  }

  const closeToolConfiguration = () => {
    const insertPosition = pendingToolInsertion
    addingTool = undefined
    pendingToolInsertion = undefined
    cancelPendingToolInsertion(insertPosition)
  }

  const retryLoadTools = () => agentsStore.fetchTools()
</script>

{#snippet toolsLoadStatus()}
  {#if toolsLoadFailed}
    <div class="loading-state">
      <Body size="XS">Failed to load tools</Body>
      <Button secondary size="S" on:click={retryLoadTools}>Retry</Button>
    </div>
  {:else}
    <div class="loading-state">
      <ProgressCircle size="S" />
      <Body size="XS">Loading tools...</Body>
    </div>
  {/if}
{/snippet}

{#if operation && agentId}
  <div class="operation-page">
    <TopBar
      icon="Effect"
      breadcrumbs={[
        { text: "Agents", url: homeUrl, tag: "Beta" },
        {
          text: agent?.name || "Agent",
          url: withWorkspaceHomeReturn("../../config"),
        },
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
              onApplyInstructions={applyGeneratedInstructions}
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
                bind:this={instructionsEditor}
                value={operation.promptInstructions || ""}
                bindings={promptBindings}
                {bindingIcons}
                {completions}
                mode={EditorModes.Handlebars}
                renderBindingsAsTags
                renderMarkdownDecorations
                on:change={event => updateInstructions(event.detail || "")}
                on:blur={() => saveOperation()}
              />
            {:else}
              {@render toolsLoadStatus()}
            {/if}
          </div>
          {#if toolsLoaded}
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
          {/if}
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
            {#if !toolsLoaded}
              {@render toolsLoadStatus()}
            {:else}
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
                        onConfigureWebSearch={() =>
                          webSearchConfigModal?.show()}
                      />
                    </div>
                  {/snippet}
                </OperationRailSectionHeader>
                <div class="tools-list" role="list">
                  {#each configuredToolList as item (item.config.toolName)}
                    {@const tool = item.tool}
                    <div role="listitem">
                      <div class="tool-row" class:tool-row--with-run-as={tool}>
                        {#if !tool}
                          <div class="tool-row-activation">
                            <div class="tool-name">
                              <span class="tool-icon">
                                <Icon name="Wrench" size="XS" />
                              </span>
                              <span>{item.config.toolName}</span>
                              <span class="tool-unavailable">Unavailable</span>
                            </div>
                          </div>
                        {:else}
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
                                  {getToolApprovalCount(tool.runtimeBinding) ===
                                  1
                                    ? "approval"
                                    : "approvals"}
                                </span>
                              {/if}
                            </div>
                          </button>
                        {/if}
                        {#if !tool}
                          <button
                            class="tool-actions"
                            aria-label={`Actions for ${item.config.toolName}`}
                            onclick={event =>
                              openToolMenu(event, {
                                readableBinding: item.config.toolName,
                                runtimeBinding: item.config.toolName,
                              })}
                          >
                            <Icon name="dots-three" size="XS" />
                          </button>
                        {/if}
                      </div>
                    </div>
                  {:else}
                    <Body
                      size="XS"
                      color="var(--spectrum-global-color-gray-700)"
                      >No tools are configured for this operation.</Body
                    >
                  {/each}
                </div>
              </div>
            {/if}
          {:else if activeTab === "knowledge"}
            <Knowledge bind:operation onUpdated={() => saveOperation()} />
          {:else if !escalationToolHidden}
            <div class="rail-section approval-panel">
              <OperationRailSectionHeader
                title="Approvals"
                description="Choose who gets notified when this operation escalates for approval."
              />
              {#if !escalationProviders.length}
                <div class="escalation-disabled">
                  <Body
                    size="S"
                    weight="500"
                    color="var(--spectrum-global-color-gray-900)"
                  >
                    Escalation disabled
                  </Body>
                  <Body size="XS" color="var(--spectrum-global-color-gray-700)">
                    There are currently no deployments configured on this agent.
                    Add one in <Link
                      on:click={() => $goto("../../deployment")}
                      quiet>deployments</Link
                    > to choose who gets notified.
                  </Body>
                </div>
              {:else}
                <EscalationRecipients
                  single
                  recipients={operation.escalation?.recipients || []}
                  {agentId}
                  providers={escalationProviders}
                  onChange={updateRecipients}
                />
              {/if}
            </div>
          {/if}
        </div>
      </aside>
    </div>
  </div>

  <ConfirmDialog
    bind:this={removeToolDialog}
    title={toolToRemoveIsReferenced
      ? "Tool is used in instructions"
      : "Remove tool?"}
    okText="Remove"
    warning={true}
    onOk={handleRemoveToolConfirm}
    onClose={handleRemoveToolClose}
  >
    {#if toolToRemove?.readableBinding}
      {#if !toolToRemoveIsAvailable}
        Remove <b>{toolToRemove.readableBinding}</b> from this operation? If it is
        referenced in the instructions, those references will remain and won't resolve
        until the tool is reconfigured.
      {:else if toolToRemoveIsReferenced}
        <b>{toolToRemove.readableBinding}</b> is referenced in the instructions.
        Removing the tool will leave those references in place, and they won't resolve
        until the tool is reconfigured.
      {:else}
        Remove <b>{toolToRemove.readableBinding}</b> from this operation?
      {/if}
    {/if}
  </ConfirmDialog>

  <ConfigureOperationToolModal
    bind:this={configureToolModal}
    {agentId}
    providers={escalationProviders}
    onSave={saveToolConfiguration}
    onRemove={tool => confirmRemoveTool(tool, true)}
    onClose={closeToolConfiguration}
  />

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

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    padding: 24px 0;
    min-height: 100%;
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

  .escalation-disabled {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
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

  .tool-name .tool-unavailable {
    flex: 0 0 auto;
    color: var(--spectrum-global-color-gray-700);
    font-size: 11px;
  }

  .tool-row-summary {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
    justify-content: space-between;
  }

  .tool-row-run-as {
    padding-left: 21px;
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
