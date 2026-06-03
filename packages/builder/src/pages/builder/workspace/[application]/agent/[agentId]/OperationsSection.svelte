<script lang="ts">
  import {
    Body,
    Button,
    Helpers,
    Icon,
    Input,
    Modal,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import type { Agent, EnrichedBinding } from "@budibase/types"
  import type { AgentTool } from "./toolTypes"
  import type { BindingCompletion } from "@/types"
  import { confirm } from "@/helpers/confirm"
  import { contextMenuStore } from "@/stores/builder"
  import OperationSidePanel from "./OperationSidePanel.svelte"

  const DEFAULT_PROMPT_INSTRUCTIONS = `**Agent role**
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
    onDeleteOperation = async () => {},
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
    onDeleteOperation?: () => Promise<void>
    onUpdated: () => void
  } = $props()

  let operationPanelOpen = $state(false)
  let renameModal: Modal | undefined = $state()
  let renameDraft = $state("")
  let isRenameValid = $derived(Boolean(renameDraft.trim()))

  let mainOperation = $derived(agent?.operations?.[0])

  let operationName = $derived(mainOperation?.name?.trim())
  let hasOperation = $derived(Boolean(mainOperation?.name?.trim()))

  const openOperationPanel = () => {
    operationPanelOpen = true
  }

  const closeOperationPanel = () => {
    operationPanelOpen = false
  }

  const openRenameModal = () => {
    renameDraft = mainOperation?.name || ""
    renameModal?.show()
  }

  const saveRename = () => {
    if (!mainOperation) {
      return
    }
    const trimmedName = renameDraft.trim()
    if (!trimmedName) {
      notifications.error("Operation name is required.")
      return
    }
    mainOperation.name = trimmedName
    onUpdated()
    renameModal?.hide()
  }

  const createDefaultOperation = () => ({
    id: `operation_${Helpers.uuid()}`,
    name: "Main operation",
    promptInstructions: DEFAULT_PROMPT_INSTRUCTIONS,
  })

  const handleAddOperation = () => {
    if (hasOperation) {
      notifications.info("Only one operation is supported at the moment.")
      return
    }
    if (!agent) {
      return
    }
    agent.operations = [createDefaultOperation()]
    onUpdated()
    openOperationPanel()
  }

  const deleteOperation = async () => {
    if (!agent) {
      return
    }

    confirm({
      title: "Confirm deletion",
      body: "Delete this operation? This will clear instructions and selected tools.",
      okText: "Delete",
      warning: true,
      onConfirm: async () => {
        try {
          await onDeleteOperation()
          agent.operations = []
          onUpdated()
          closeOperationPanel()
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
      { x: event.clientX, y: event.clientY }
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
      <div class="operation-row">
        <button
          class="operation-open-button"
          type="button"
          onclick={() => openOperationPanel()}
          oncontextmenu={openOperationContextMenu}
        >
          <span class="operation-name">{operationName}</span>
        </button>

        <button
          class="operation-menu-trigger"
          type="button"
          aria-label="Operation actions"
          onclick={openOperationContextMenu}
        >
          <Icon
            name="dots-three"
            size="S"
            color="var(--spectrum-global-color-gray-600)"
            hoverable
          />
        </button>
      </div>
    </div>
  {/if}
</div>

{#if mainOperation}
  <OperationSidePanel
    open={operationPanelOpen}
    bind:operation={mainOperation}
    {promptBindings}
    {bindingIcons}
    {completions}
    {toolsLoaded}
    {availableTools}
    {webSearchConfigured}
    {onAddApiConnection}
    {onConfigureWebSearch}
    {onUpdated}
    onClose={closeOperationPanel}
  />
{/if}

<Modal bind:this={renameModal}>
  <ModalContent
    title="Rename operation"
    confirmText="Save"
    disabled={!isRenameValid}
    onConfirm={saveRename}
  >
    <Input label="Name" bind:value={renameDraft} />
  </ModalContent>
</Modal>

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

  .operation-open-button {
    flex: 1;
    min-width: 0;
    min-height: 36px;
    padding: 8px 12px;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
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
