<script lang="ts">
  import { Body, Button, Icon, notifications } from "@budibase/bbui"
  import type { AgentOperation, EnrichedBinding } from "@budibase/types"
  import type { BindingCompletion } from "@/types"
  import * as routify from "@roxi/routify"
  import { selectedAgent } from "@/stores/portal"
  import OperationSidePanel from "./OperationSidePanel.svelte"
  const { goto } = routify
  $goto

  let {
    operations = [],
    onSaveOperations = async () => {},
    promptBindings = [],
    bindingIcons = {},
    completions = [],
    toolsLoaded = false,
  }: {
    operations?: AgentOperation[]
    onSaveOperations?: (_nextOperations: AgentOperation[]) => Promise<void>
    promptBindings?: EnrichedBinding[]
    bindingIcons?: Record<string, string | undefined>
    completions?: BindingCompletion[]
    toolsLoaded?: boolean
  } = $props()

  let operationPanelOpen = $state(false)
  let currentAgentId: string | undefined = $derived($selectedAgent?._id)
  let savingDraft = $state(false)
  let editingOperationId: string | undefined = $state(undefined)
  const DEFAULT_OPERATION_INSTRUCTIONS = `**Agent role**
What is this agent responsible for?

**Inputs**
What information does the agent receive?

**Actions**
- What should the agent do?
- When should it use tools or APIs?

**Output**
- What should the response look like?
- Include any structure, formatting, or fields required.

**Rules**
Any constraints the agent must follow.
`
  let operationDraft: AgentOperation = $state({
    id: "",
    name: "",
    promptInstructions: DEFAULT_OPERATION_INSTRUCTIONS,
    live: false,
    enabledTools: [],
    knowledgeBases: [],
  })

  const createOperationId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `operation_${crypto.randomUUID()}`
    }
    return `operation_${Date.now()}`
  }

  const getNewOperationDraft = (): AgentOperation => ({
    id: createOperationId(),
    name: "",
    promptInstructions: DEFAULT_OPERATION_INSTRUCTIONS,
    live: false,
    enabledTools: [],
    knowledgeBases: [],
  })

  const openOperationPanel = (operation?: AgentOperation) => {
    editingOperationId = operation?.id
    operationDraft = operation
      ? {
          ...operation,
          enabledTools: operation.enabledTools || [],
          knowledgeBases: operation.knowledgeBases || [],
        }
      : getNewOperationDraft()
    operationPanelOpen = true
  }

  const showSingleOperationLimitInfo = () => {
    notifications.info("Only one operation is supported at the moment.")
  }

  const handleAddOperation = () => {
    if (operations.length >= 1) {
      showSingleOperationLimitInfo()
      return
    }
    openOperationPanel()
  }

  const closeOperationPanel = () => {
    operationPanelOpen = false
  }

  const saveOperation = async ({ closeAfterSave = false } = {}) => {
    if (savingDraft) {
      return
    }
    const name = operationDraft.name.trim()
    if (!name) {
      return
    }

    const nextOperation: AgentOperation = {
      ...operationDraft,
      name,
      id: operationDraft.id || createOperationId(),
      enabledTools: operationDraft.enabledTools || [],
      knowledgeBases: operationDraft.knowledgeBases || [],
      knowledgeSources: operationDraft.knowledgeSources || [],
    }

    const existingIndex = operations.findIndex(
      operation => operation.id === editingOperationId
    )
    if (existingIndex === -1 && operations.length >= 1) {
      showSingleOperationLimitInfo()
      return
    }

    const nextOperations =
      existingIndex === -1
        ? [...operations, nextOperation]
        : operations.map(operation =>
            operation.id === editingOperationId ? nextOperation : operation
          )

    savingDraft = true
    try {
      await onSaveOperations(nextOperations)
    } finally {
      savingDraft = false
    }
    if (closeAfterSave) {
      closeOperationPanel()
    }
  }

  const deleteOperation = async () => {
    if (!editingOperationId) {
      return
    }
    const nextOperations = operations.filter(
      operation => operation.id !== editingOperationId
    )
    await onSaveOperations(nextOperations)
    closeOperationPanel()
  }

  const handleAddKnowledge = () => {
    $goto("./knowledge")
  }
</script>

<div class="operations-section">
  <div class="operations-header">
    <div class="section-header">
      <Body size="XS" color="var(--spectrum-global-color-gray-900)"
        >Operations</Body
      >
      <Body size="XS" color="var(--spectrum-global-color-gray-700)">
        Define the types of requests this agent can handle.
      </Body>
    </div>
    <Button secondary size="S" icon="plus" on:click={handleAddOperation}>
      Add operation
    </Button>
  </div>

  {#if operations.length === 0}
    <button
      class="empty-operation"
      type="button"
      onclick={() => openOperationPanel()}
    >
      <span>No operations yet</span>
      <span>Add the first request type this agent can handle.</span>
    </button>
  {:else}
    <div class="operation-list">
      {#each operations as operation (operation.id)}
        <button
          class="operation-row"
          type="button"
          onclick={() => openOperationPanel(operation)}
        >
          <span class="operation-name">{operation.name}</span>
          <span class="operation-actions">
            <span class="operation-status" class:stopped={!operation.live}>
              <span></span>
              {operation.live ? "Live" : "Stopped"}
            </span>
            <Icon
              name="dots-three"
              size="S"
              color="var(--spectrum-global-color-gray-600)"
            />
          </span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<OperationSidePanel
  open={operationPanelOpen}
  agentId={currentAgentId}
  {editingOperationId}
  bind:operationDraft
  {promptBindings}
  {bindingIcons}
  {completions}
  {toolsLoaded}
  onAddKnowledge={handleAddKnowledge}
  onUpdated={saveOperation}
  onClose={closeOperationPanel}
  onDelete={deleteOperation}
/>

<style>
  .operations-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .operations-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-l);
  }

  .section-header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: 600px;
  }

  .section-header > :global(.spectrum-Body):first-child {
    font-weight: 500;
  }

  .operation-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .operation-row,
  .empty-operation {
    width: 100%;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
    border-radius: 4px;
    cursor: pointer;
    transition:
      background 130ms ease-out,
      border-color 130ms ease-out;
  }

  .operation-row {
    min-height: 36px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    text-align: left;
  }

  .operation-row:hover,
  .empty-operation:hover {
    background: var(--spectrum-global-color-gray-100);
    border-color: var(--spectrum-global-color-gray-300);
  }

  .operation-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }

  .operation-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    flex-shrink: 0;
  }

  .operation-status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-800);
    font-size: 12px;
    line-height: 1;
  }

  .operation-status span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--spectrum-global-color-green-500);
  }

  .operation-status.stopped span {
    background: var(--spectrum-global-color-orange-500);
  }

  .empty-operation {
    min-height: 84px;
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .empty-operation span:first-child {
    color: var(--spectrum-global-color-gray-900);
    font-size: 14px;
  }

  .empty-operation span:last-child {
    color: var(--spectrum-global-color-gray-700);
    font-size: 13px;
  }
</style>
