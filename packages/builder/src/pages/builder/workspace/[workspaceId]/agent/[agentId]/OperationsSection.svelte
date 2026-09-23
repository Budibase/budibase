<script lang="ts">
  import { Body, Button, Helpers, Icon, notifications } from "@budibase/bbui"
  import type { AgentOperation } from "@budibase/types"
  import { confirm } from "@/helpers/confirm"
  import { contextMenuStore, workspaceDeploymentStore } from "@/stores/builder"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import OperationNameModal from "./OperationNameModal.svelte"
  import OperationLiveBadge from "./OperationLiveBadge.svelte"
  import * as routify from "@roxi/routify"
  import { tick } from "svelte"
  import { withWorkspaceHomeReturn } from "@/helpers/workspaceHomeNavigation"

  const { goto } = routify

  $goto

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

  let { agentId }: { agentId: string } = $props()

  let selectedOperationId = $state<string | undefined>(undefined)
  let renameOperationId = $state<string | undefined>(undefined)
  let createOperationModal: OperationNameModal | undefined = $state()
  let renameOperationModal: OperationNameModal | undefined = $state()

  let operations = $derived($selectedAgent?.operations || [])
  let sortedOperations = $derived.by(() =>
    [...operations].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      })
    )
  )
  let hasOperation = $derived(operations.length > 0)

  const normalizeName = (value: string) => value.trim().toLowerCase()

  const openOperation = (operationId: string) => {
    selectedOperationId = operationId
    $goto(withWorkspaceHomeReturn(`./operation/${operationId}`))
  }

  const validateCreateOperationName = (name: string) => {
    const normalizedName = normalizeName(name)
    return operations.some(operation => {
      return normalizeName(operation.name || "") === normalizedName
    })
      ? "An operation with this name already exists"
      : undefined
  }

  const validateRenameOperationName = (name: string) => {
    const normalizedName = normalizeName(name)
    return operations.some(operation => {
      return (
        operation.id !== renameOperationId &&
        normalizeName(operation.name || "") === normalizedName
      )
    })
      ? "An operation with this name already exists"
      : undefined
  }

  const saveRename = async (name: string) => {
    if (!renameOperationId) {
      return
    }

    try {
      await agentsStore.updateAgentOperation(agentId, renameOperationId, {
        name,
      })
      await workspaceDeploymentStore.fetch()
      renameOperationId = undefined
    } catch (error) {
      console.error(error)
      notifications.error("Failed to rename operation")
    }
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

  const setOperationLive = async (operationId: string, nextLive: boolean) => {
    const targetOperation = operations.find(
      operation => operation.id === operationId
    )
    if (!targetOperation || targetOperation.live === nextLive) {
      return
    }

    try {
      await agentsStore.updateAgentOperation(agentId, targetOperation.id, {
        live: nextLive,
      })
      await workspaceDeploymentStore.fetch()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to update operation")
    }
  }

  const handleAddOperation = () => {
    createOperationModal?.show()
  }

  const createOperation = async (name: string) => {
    const operation = createDefaultOperation(name)

    try {
      await agentsStore.createAgentOperation(agentId, {
        id: operation.id,
        name: operation.name,
        live: operation.live,
        promptInstructions: operation.promptInstructions,
        allowKnowledgeSourceDownload: operation.allowKnowledgeSourceDownload,
      })
      $goto(withWorkspaceHomeReturn(`./operation/${operation.id}`))
      workspaceDeploymentStore.fetch().catch(error => {
        console.error(error)
      })
    } catch (error) {
      console.error(error)
      notifications.error("Failed to create operation")
    }
  }

  const openRenameModal = (operationId: string) => {
    const targetOperation = operations.find(
      operation => operation.id === operationId
    )
    renameOperationId = operationId
    renameOperationModal?.show(targetOperation?.name || "")
  }

  const confirmDeleteOperation = async (operationId: string) => {
    await tick()

    await confirm({
      title: "Confirm deletion",
      body: "Delete this operation? This will clear instructions and selected tools.",
      okText: "Delete",
      warning: true,
      onConfirm: async () => {
        try {
          await agentsStore.deleteAgentOperation(agentId, operationId)
          await workspaceDeploymentStore.fetch()
          notifications.success("Operation deleted.")
        } catch (error) {
          console.error(error)
          notifications.error("Failed to delete operation")
        }
      },
    })
  }

  const deleteOperation = (operationId: string) => {
    confirmDeleteOperation(operationId).catch(error => {
      console.error(error)
    })
  }

  const openOperationContextMenu = (event: MouseEvent, operationId: string) => {
    const menuOperation = operations.find(
      operation => operation.id === operationId
    )
    if (!menuOperation) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const menuOperationLive = menuOperation.live === true

    contextMenuStore.open(
      "agent-operation",
      [
        {
          icon: menuOperationLive ? "stop" : "play",
          name: menuOperationLive ? "Stop" : "Set live",
          visible: true,
          callback: () => setOperationLive(operationId, !menuOperationLive),
        },
        {
          icon: "pencil",
          name: "Rename",
          visible: true,
          callback: () => openRenameModal(operationId),
        },
        {
          icon: "trash",
          name: "Delete",
          visible: true,
          callback: () => deleteOperation(operationId),
        },
      ],
      { x: event.clientX, y: event.clientY },
      () => {
        selectedOperationId = undefined
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
      {#each sortedOperations as operation (operation.id)}
        <div
          class="operation-row"
          class:selected={selectedOperationId === operation.id}
        >
          <button
            class="operation-open-button"
            type="button"
            onclick={() => openOperation(operation.id)}
            oncontextmenu={event => {
              selectedOperationId = operation.id
              openOperationContextMenu(event, operation.id)
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
            onclick={async event => {
              event.preventDefault()
              event.stopPropagation()
              selectedOperationId = operation.id
              await tick()
              openOperationContextMenu(event, operation.id)
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

<OperationNameModal
  bind:this={createOperationModal}
  title="New operation"
  confirmText="Create"
  placeholder="Customer support"
  validateName={validateCreateOperationName}
  onConfirm={createOperation}
/>

<OperationNameModal
  bind:this={renameOperationModal}
  title="Rename operation"
  confirmText="Save"
  validateName={validateRenameOperationName}
  onConfirm={saveRename}
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
