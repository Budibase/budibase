<script lang="ts">
  import { Body, Button, Helpers, Icon, notifications } from "@budibase/bbui"
  import {
    FeatureFlag,
    type Agent,
    type AgentOperation,
    type EnrichedBinding,
  } from "@budibase/types"
  import type { AgentTool } from "./toolTypes"
  import type { BindingCompletion } from "@/types"
  import { confirm } from "@/helpers/confirm"
  import { getSequentialName } from "@/helpers/duplicate"
  import { contextMenuStore } from "@/stores/builder"
  import { featureFlags } from "@/stores/portal"
  import CreateOperationModal from "./CreateOperationModal.svelte"
  import OperationLiveBadge from "./OperationLiveBadge.svelte"
  import OperationSidePanel from "./OperationSidePanel.svelte"
  import RenameOperationModal from "./RenameOperationModal.svelte"

  const DEFAULT_PROMPT_INSTRUCTIONS = `**Operation role**
What is this operation responsible for?

**Inputs**
What information does this operation receive?

**Actions**
- What should this operation do?
- When should it use tools or APIs?

**Output**
- What should the response look like?
- Include any structure, formatting, or fields required.

**Rules**
Any constraints this operation must follow.
`

  let {
    agent = $bindable(),
    promptBindings = [],
    bindingIcons = {},
    completions = [],
    toolsLoaded = false,
    availableTools = [],
    webSearchConfigured = false,
    onAddApiConnection = () => {},
    onConfigureWebSearch = () => {},
    onSetOperationLive = async () => false,
    onUpdated,
  }: {
    agent?: Agent
    promptBindings?: EnrichedBinding[]
    bindingIcons?: Record<string, string | undefined>
    completions?: BindingCompletion[]
    toolsLoaded?: boolean
    availableTools?: AgentTool[]
    webSearchConfigured?: boolean
    onAddApiConnection?: () => void
    onConfigureWebSearch?: () => void
    onSetOperationLive?: (
      operationId: string,
      live: boolean
    ) => Promise<boolean>
    onUpdated: () => Promise<boolean>
  } = $props()

  let selectedOperationId = $state<string | undefined>(undefined)
  let operationPanelOpen = $state(false)
  let renameOperationId = $state<string | undefined>(undefined)
  let createOperationModal: CreateOperationModal | undefined = $state()
  let renameOperationModal: RenameOperationModal | undefined = $state()

  let operations = $derived(agent?.operations || [])
  let selectedOperation = $derived(
    operations.find(operation => operation.id === selectedOperationId)
  )
  let hasOperation = $derived(operations.length > 0)
  let multipleOperationsEnabled = $derived(
    $featureFlags[FeatureFlag.MULTIPLE_OPERATIONS]
  )
  let canAddOperation = $derived(
    multipleOperationsEnabled || operations.length === 0
  )
  let operationLive = $derived(selectedOperation?.live === true)

  const openOperationPanel = (operationId: string) => {
    selectedOperationId = operationId
    operationPanelOpen = true
  }

  const closeOperationPanel = () => {
    selectedOperationId = undefined
    operationPanelOpen = false
  }

  const openRenameModal = () => {
    renameOperationId = selectedOperation?.id
    renameOperationModal?.show(selectedOperation?.name || "")
  }

  const saveRename = async (name: string) => {
    if (!agent || !renameOperationId) {
      return
    }
    const operation = operations.find(
      operation => operation.id === renameOperationId
    )
    if (!operation) {
      return
    }

    operation.name = name
    await onUpdated()
    renameOperationId = undefined
  }

  const createDefaultOperation = (name: string) => {
    return {
      id: `operation_${Helpers.uuid()}`,
      name,
      live: false,
      promptInstructions: DEFAULT_PROMPT_INSTRUCTIONS,
      allowKnowledgeSourceDownload: true,
    } satisfies AgentOperation
  }

  const setOperationLive = async (nextLive: boolean) => {
    if (!selectedOperation || selectedOperation.live === nextLive) {
      return
    }
    const currentOperation = selectedOperation
    const previousLive = currentOperation.live
    currentOperation.live = nextLive
    const saveSucceeded = await onSetOperationLive(
      currentOperation.id,
      nextLive
    )
    if (saveSucceeded === false) {
      currentOperation.live = previousLive
    }
  }

  const handleAddOperation = () => {
    if (!canAddOperation) {
      notifications.info("Only one operation is supported at the moment.")
      return
    }
    const suggestedName =
      getSequentialName(operations, "New operation ", {
        getName: operation => operation.name,
      }) || "Operation 1"
    createOperationModal?.show(suggestedName)
  }

  const createOperation = async (name: string) => {
    if (!agent) {
      return
    }

    const operation = createDefaultOperation(name)
    agent.operations = [...(agent.operations || []), operation]
    selectedOperationId = operation.id
    await onUpdated()
    openOperationPanel(operation.id)
  }

  const deleteOperation = async () => {
    if (!agent || !selectedOperationId) {
      return
    }
    const operationIdToDelete = selectedOperationId

    confirm({
      title: "Confirm deletion",
      body: "Delete this operation? This will clear instructions and selected tools.",
      okText: "Delete",
      warning: true,
      onConfirm: async () => {
        try {
          agent.operations = (agent.operations || []).filter(
            operation => operation.id !== operationIdToDelete
          )
          await onUpdated()
          if (selectedOperationId === operationIdToDelete) {
            closeOperationPanel()
          }
          notifications.success("Operation deleted.")
        } catch (error) {
          console.error(error)
          notifications.error("Failed to delete operation")
        }
      },
    })
  }

  const openOperationContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    contextMenuStore.open(
      "agent-operation",
      [
        {
          icon: operationLive ? "stop" : "play",
          name: operationLive ? "Stop" : "Set live",
          visible: true,
          callback: async () => await setOperationLive(!operationLive),
        },
        {
          icon: "pencil",
          name: "Edit",
          visible: true,
          callback: openRenameModal,
        },
        {
          icon: "trash",
          name: "Delete",
          visible: true,
          callback: deleteOperation,
        },
      ],
      { x: event.clientX, y: event.clientY },
      () => {
        if (!operationPanelOpen) {
          selectedOperationId = undefined
        }
      }
    )
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

  {#if hasOperation}
    <div class="operation-list">
      {#each operations as operation (operation.id)}
        <div
          class="operation-row"
          class:selected={selectedOperationId === operation.id}
        >
          <button
            class="operation-open-button"
            type="button"
            onclick={() => openOperationPanel(operation.id)}
            oncontextmenu={event => {
              selectedOperationId = operation.id
              openOperationContextMenu(event)
            }}
          >
            <span class="operation-name"
              >{operation.name?.trim() || "Untitled operation"}</span
            >
            <span class="status-indicator">
              <OperationLiveBadge live={operation.live === true} />
            </span>
          </button>

          <button
            class="operation-menu-trigger"
            type="button"
            aria-label="Operation actions"
            onclick={event => {
              selectedOperationId = operation.id
              openOperationContextMenu(event)
            }}
          >
            <Icon
              name="dots-three"
              size="S"
              color="var(--spectrum-global-color-gray-600)"
              hoverable
            />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<CreateOperationModal
  bind:this={createOperationModal}
  onConfirm={createOperation}
/>

{#if agent && selectedOperation}
  <OperationSidePanel
    open={operationPanelOpen}
    bind:operation={selectedOperation}
    {promptBindings}
    {bindingIcons}
    {completions}
    {toolsLoaded}
    {availableTools}
    {webSearchConfigured}
    {onAddApiConnection}
    {onConfigureWebSearch}
    {onSetOperationLive}
    {onUpdated}
    onClose={closeOperationPanel}
  />
{/if}

<RenameOperationModal bind:this={renameOperationModal} onConfirm={saveRename} />

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
    gap: 8px;
  }

  .operation-row {
    border: 1px solid var(--spectrum-global-color-gray-200);
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
    border-radius: 4px;
    min-height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .operation-row:hover {
    background: var(--spectrum-global-color-gray-100);
    border-color: var(--spectrum-global-color-gray-300);
  }

  .operation-row.selected {
    background: var(--spectrum-global-color-blue-100);
    border-color: var(--spectrum-global-color-gray-300);
  }

  .operation-open-button {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 36px;
    padding: 8px 0 8px 12px;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .status-indicator {
    pointer-events: none;
  }

  .operation-name {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }

  .operation-menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
</style>
