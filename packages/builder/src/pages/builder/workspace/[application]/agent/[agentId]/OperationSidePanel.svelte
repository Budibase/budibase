<script lang="ts">
  import {
    Body,
    Button,
    Icon,
    Input,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import { confirm } from "@/helpers"
  import { agentsStore, knowledgeConnectionsStore } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import type {
    AgentOperation,
    CaretPositionFn,
    EnrichedBinding,
    InsertAtPositionFn,
    KnowledgeBaseFile,
    SharePointKnowledgeSourceSnapshot,
  } from "@budibase/types"
  import type { BindingCompletion } from "@/types"
  import { fly } from "svelte/transition"
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"
  import KnowledgeAddControls from "./knowledge/KnowledgeAddControls.svelte"
  import KnowledgeTable from "./knowledge/KnowledgeTable.svelte"
  import type { KnowledgeTableRow } from "./knowledge/renderers/types"
  import {
    toFileTableRows,
    toSharePointConnectionRows,
  } from "./knowledge/knowledgeTableRows"
  import ToolsDropdown from "./ToolsDropdown.svelte"
  import GenerateInstructionsControl from "./GenerateInstructionsControl.svelte"
  import SelectSharePointSiteModal from "./knowledge/new/SelectSharePointSiteModal.svelte"
  import DisplaySharePointSiteModal from "./knowledge/sharepoint/DisplaySharePointSiteModal.svelte"
  import SelectSharePointFilesModal from "./knowledge/sharepoint/SelectSharePointFilesModal.svelte"
  import type { AgentTool } from "./toolTypes"

  let {
    open = false,
    editingOperationId = undefined,
    operationDraft = $bindable(),
    agentId = undefined,
    promptBindings = [],
    bindingIcons = {},
    completions = [],
    toolsLoaded = false,
    availableTools = [],
    webSearchConfigured = false,
    onClose = () => {},
    onDelete = () => {},
    onUpdated = () => {},
    onAddApiConnection = () => {},
    onConfigureWebSearch = () => {},
  }: {
    open?: boolean
    editingOperationId?: string
    operationDraft: AgentOperation
    agentId?: string
    promptBindings?: EnrichedBinding[]
    bindingIcons?: Record<string, string | undefined>
    completions?: BindingCompletion[]
    toolsLoaded?: boolean
    availableTools?: AgentTool[]
    webSearchConfigured?: boolean
    onClose?: () => void
    onDelete?: () => void
    onUpdated?: () => void
    onAddApiConnection?: () => void
    onConfigureWebSearch?: () => void
  } = $props()

  let insertAtPos: InsertAtPositionFn | undefined = $state(undefined)
  let getCaretPosition: CaretPositionFn | undefined = $state(undefined)
  let resolvedIconCount = $derived(
    Object.values(bindingIcons).filter(Boolean).length
  )
  let panelRoot: HTMLDivElement | undefined = $state(undefined)
  let selectSharePointSiteModal = $state<SelectSharePointSiteModal>()
  let displaySharePointSiteModal = $state<DisplaySharePointSiteModal>()
  let selectSharePointFilesModal = $state<SelectSharePointFilesModal>()
  let selectedSharePointSiteId = $state("")
  let toolSearch = $state("")
  let filteredTools = $derived.by(() =>
    availableTools.filter(tool => {
      const query = toolSearch.trim().toLowerCase()
      if (!query) {
        return true
      }
      return `${tool.sourceLabel || ""} ${tool.readableName || tool.name}`
        .toLowerCase()
        .includes(query)
    })
  )
  let toolSections = $derived.by(() =>
    filteredTools.reduce(
      (acc, tool) => {
        const section = tool.sourceLabel || "Tools"
        if (!acc[section]) {
          acc[section] = []
        }
        acc[section].push(tool)
        return acc
      },
      {} as Record<string, AgentTool[]>
    )
  )
  $effect(() => {
    if (!(open && agentId)) return
    const operationId = editingOperationId || operationDraft.id
    if (operationId) {
      agentsStore.fetchAgentKnowledge(agentId, operationId)
    }
  })
  let knowledgeFiles = $derived.by(() =>
    agentId && $agentsStore.knowledgeByAgent[agentId]
      ? $agentsStore.knowledgeByAgent[agentId].files || []
      : ([] as KnowledgeBaseFile[])
  )
  let sharePointSourceSnapshots = $derived.by(() =>
    agentId && $agentsStore.knowledgeByAgent[agentId]
      ? $agentsStore.knowledgeByAgent[agentId].sharePointSources ||
        ([] as SharePointKnowledgeSourceSnapshot[])
      : ([] as SharePointKnowledgeSourceSnapshot[])
  )
  let sharePointSources = $derived(
    (operationDraft.knowledgeSources || []).filter(
      source => source.type === "sharepoint"
    )
  )
  const handleDeleteFile = async (file: KnowledgeBaseFile) => {
    if (!agentId || !file._id) {
      return
    }
    const operationId = editingOperationId || operationDraft.id
    if (!operationId) {
      return
    }

    await confirm({
      title: "Confirm deletion",
      body: `Are you sure you want to remove ${file.filename}? This action can't be undone.`,
      okText: "Delete",
      onConfirm: async () => {
        try {
          await agentsStore.deleteAgentFile(agentId, file._id!, operationId)
          await agentsStore.fetchAgentKnowledge(agentId, operationId)
          notifications.success("File removed")
        } catch (error) {
          console.error(error)
          notifications.error("Failed to remove file")
        }
      },
    })
  }
  const handleDeleteSharePointSite = async (siteId: string) => {
    if (!agentId) {
      return
    }
    const operationId = editingOperationId || operationDraft.id
    if (!operationId) {
      return
    }
    try {
      await agentsStore.disconnectAgentSharePointSite(
        agentId,
        siteId,
        operationId
      )
      await agentsStore.fetchAgentKnowledge(agentId, operationId)
      notifications.success("SharePoint site removed")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to remove SharePoint site")
    }
  }

  const handleSyncSharePointSite = async (sourceId: string) => {
    if (!agentId) {
      return
    }
    const operationId = editingOperationId || operationDraft.id
    if (!operationId) {
      return
    }
    try {
      await agentsStore.syncAgentKnowledgeSources(agentId, sourceId, operationId)
      await agentsStore.fetchAgentKnowledge(agentId, operationId)
      notifications.success("SharePoint sync started")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to sync SharePoint site")
    }
  }
  let knowledgeRows = $derived.by(() => [
    ...toSharePointConnectionRows({
      sharePointSources,
      sharePointSourceSnapshots,
      loadingSharePointSites: false,
      onDelete: handleDeleteSharePointSite,
      onSync: handleSyncSharePointSite,
    }),
    ...toFileTableRows(
      knowledgeFiles.filter(file => !file.source),
      handleDeleteFile
    ),
  ])

  const handleToolClick = (tool: AgentTool) => {
    const binding = tool.readableBinding || tool.runtimeBinding
    if (!binding) {
      return
    }
    const current = operationDraft.promptInstructions || ""
    const insertion = `{{ ${binding} }}`
    operationDraft.promptInstructions = `${current}${current ? "\n" : ""}${insertion}`
    operationDraft.enabledTools = Array.from(
      new Set([...(operationDraft.enabledTools || []), tool.runtimeBinding])
    )
    onUpdated()
  }

  const handleAddFromSharePoint = async () => {
    const sharePointConnections = $knowledgeConnectionsStore.connections.filter(
      connection => connection.sourceType === "sharepoint"
    )
    if (sharePointConnections.length === 0) {
      bb.settings("/connections/apis/new/microsoft-sharepoint")
      return
    }
    await selectSharePointSiteModal?.show()
    if (open && agentId) {
      const operationId = editingOperationId || operationDraft.id
      if (operationId) {
        await agentsStore.fetchAgentKnowledge(agentId, operationId)
      }
    }
  }

  const refreshKnowledge = async () => {
    if (!agentId) {
      return
    }
    const operationId = editingOperationId || operationDraft.id
    if (!operationId) {
      return
    }
    await agentsStore.fetchAgentKnowledge(agentId, operationId)
  }

  const handleKnowledgeRowClick = (row: KnowledgeTableRow) => {
    if (row.kind !== "sharepoint_connection") {
      return
    }
    selectedSharePointSiteId = row.siteId
    displaySharePointSiteModal?.show()
  }

  const openSharePointSiteSelectionModal = async (siteId: string) => {
    selectedSharePointSiteId = siteId
    await selectSharePointFilesModal?.show()
  }
</script>

{#if open}
  <div
    class="operation-panel-overlay"
    role="presentation"
    onclick={event => {
      const target = event.target as Node | null
      if (target && panelRoot?.contains(target)) {
        return
      }
      onClose()
    }}
  ></div>
  <div
    class="operation-panel-container"
    bind:this={panelRoot}
    transition:fly|local={{ x: 260, duration: 300 }}
  >
    <ResizablePanel
      storageKey="agent-operation-side-panel-width"
      defaultWidth={540}
      minWidth={360}
      maxWidthRatio={0.6}
      position="right"
    >
      <Panel
        title="Operation"
        showCloseButton
        onClickCloseButton={onClose}
        resizable
      >
        <svelte:fragment slot="panel-title-content">
          <div class="operation-title-row">
            <Body
              size="S"
              weight="500"
              color="var(--spectrum-global-color-gray-900)">Operation</Body
            >
            <Toggle
              label=""
              text={operationDraft.live ? "Live" : "Stopped"}
              bind:value={operationDraft.live}
              on:change={onUpdated}
            />
          </div>
        </svelte:fragment>
        <div class="operation-panel">
          <div class="operation-panel-content">
            <div class="operation-panel-section">
              <Input
                label="Name"
                placeholder="Access requests"
                bind:value={operationDraft.name}
                on:blur={onUpdated}
              />
            </div>

            <div class="operation-panel-section">
              <div class="instructions-header">
                <Body size="S" color="var(--spectrum-global-color-gray-900)">
                  Instructions
                </Body>
                <div class="instructions-actions">
                  <GenerateInstructionsControl
                    triggerLabel="Help write instructions"
                    promptInstructions={operationDraft.promptInstructions || ""}
                    {promptBindings}
                    {bindingIcons}
                    onApplyInstructions={instructions => {
                      operationDraft.promptInstructions = instructions
                      onUpdated()
                    }}
                  />
                </div>
              </div>

              <div class="instructions-editor">
                <div class="editor-body">
                  {#if toolsLoaded}
                    {#key resolvedIconCount}
                      <CodeEditor
                        value={operationDraft.promptInstructions || ""}
                        bindings={promptBindings}
                        {bindingIcons}
                        {completions}
                        mode={EditorModes.Handlebars}
                        bind:insertAtPos
                        renderBindingsAsTags={true}
                        renderMarkdownDecorations={true}
                        placeholder=""
                        on:change={event => {
                          operationDraft.promptInstructions = event.detail || ""
                        }}
                        on:blur={onUpdated}
                        bind:getCaretPosition
                      />
                    {/key}
                  {/if}
                </div>
                <div class="editor-footer">
                  <div class="footer-hint">
                    <span>Use</span>
                    <code>{`{{`}</code>
                    <span>
                      to add tools to your instructions or the button to the
                      right.
                    </span>
                  </div>
                  <div class="tools-popover-container">
                    <ToolsDropdown
                      {filteredTools}
                      {toolSections}
                      bind:toolSearch
                      webSearchEnabled={webSearchConfigured}
                      onToolClick={handleToolClick}
                      {onAddApiConnection}
                      {onConfigureWebSearch}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="operation-panel-section">
              <div class="knowledge-header">
                <Body size="S" color="var(--spectrum-global-color-gray-900)">
                  Knowledge
                </Body>
                <div class="knowledge-add-control">
                  <KnowledgeAddControls
                    {agentId}
                    operationId={editingOperationId}
                    onSharePoint={handleAddFromSharePoint}
                    onUploaded={refreshKnowledge}
                  />
                </div>
              </div>

              <KnowledgeTable
                loading={false}
                rows={knowledgeRows}
                onRowClick={handleKnowledgeRowClick}
              />
            </div>
          </div>

          <div class="operation-panel-footer">
            {#if editingOperationId}
              <Button secondary quiet icon="trash" on:click={onDelete}>
                Delete operation
              </Button>
            {/if}
          </div>
        </div>
      </Panel>
    </ResizablePanel>
  </div>
  <SelectSharePointSiteModal
    bind:this={selectSharePointSiteModal}
    agentId={agentId || ""}
    operationId={editingOperationId}
    existingSiteIds={sharePointSources
      .map(source => source.config.site?.id || "")
      .filter(Boolean)}
    onCreated={refreshKnowledge}
  />
  <DisplaySharePointSiteModal
    bind:this={displaySharePointSiteModal}
    agentId={agentId}
    siteId={selectedSharePointSiteId}
    onEdit={openSharePointSiteSelectionModal}
  />
  <SelectSharePointFilesModal
    bind:this={selectSharePointFilesModal}
    agentId={agentId}
    siteId={selectedSharePointSiteId}
  />
{/if}

<style>
  .operation-panel-overlay {
    position: fixed;
    top: calc(var(--top-bar-height, 51px) + 45px);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
    background: transparent;
  }

  .operation-panel-container {
    position: fixed;
    top: calc(var(--top-bar-height, 51px) + 45px);
    right: 0;
    bottom: 0;
    border-top: var(--border-light);
    z-index: 99;
    display: flex;
    align-items: stretch;
  }

  .operation-panel {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .operation-panel-content {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .operation-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: var(--spacing-s);
  }

  .operation-panel-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .instructions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .instructions-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .instructions-actions > button {
    background: transparent;
    border: none;
    color: var(--spectrum-global-color-gray-700);
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 20px;
    cursor: pointer;
  }

  .instructions-actions > button:hover {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
  }

  .instructions-editor {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    background: var(--spectrum-global-color-gray-100);
  }

  .editor-body {
    min-height: 170px;
    max-height: 260px;
    overflow-y: scroll;
  }

  .editor-body :global(.cm-editor) {
    min-height: 170px;
    height: 100%;
    background: var(--spectrum-global-color-gray-100) !important;
  }

  .editor-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background);
  }

  .footer-hint {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--spectrum-global-color-gray-900);
    font-size: 13px;
    min-width: 0;
  }

  .footer-hint code {
    font-family: "Andale Mono", "SFMono-Regular", Consolas, monospace;
    font-size: 12px;
    line-height: 1;
    border-radius: 4px;
    padding: 2px 4px;
    color: var(--spectrum-global-color-gray-900);
    background: var(--spectrum-global-color-blue-700);
  }

  .knowledge-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .knowledge-add-control {
    flex-shrink: 0;
  }

  .operation-panel-footer {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-m);
    padding: var(--spacing-m) var(--spacing-xl);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background);
  }
</style>
