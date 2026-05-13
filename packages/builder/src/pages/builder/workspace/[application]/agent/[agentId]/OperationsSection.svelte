<script lang="ts">
  import { Body, Button, Icon, notifications } from "@budibase/bbui"
  import type { Agent, EnrichedBinding } from "@budibase/types"
  import type { AgentTool } from "./toolTypes"
  import type { BindingCompletion } from "@/types"
  import * as routify from "@roxi/routify"
  import { selectedAgent } from "@/stores/portal"
  import OperationSidePanel from "./OperationSidePanel.svelte"
  const { goto } = routify
  $goto

  let {
    agent = $bindable(),
    promptBindings = [],
    bindingIcons = {},
    completions = [],
    toolsLoaded = false,
    availableTools = [],
    webSearchConfigured = false,
  }: {
    agent?: Agent
    promptBindings?: EnrichedBinding[]
    bindingIcons?: Record<string, string | undefined>
    completions?: BindingCompletion[]
    toolsLoaded?: boolean
    availableTools?: AgentTool[]
    webSearchConfigured?: boolean
  } = $props()

  let operationPanelOpen = $state(false)
  let currentAgentId: string | undefined = $derived($selectedAgent?._id)

  const openOperationPanel = () => {
    operationPanelOpen = true
  }

  const showSingleOperationLimitInfo = () => {
    notifications.info("Only one operation is supported at the moment.")
  }

  const handleAddOperation = () => {
    showSingleOperationLimitInfo()
    return
  }

  const closeOperationPanel = () => {
    operationPanelOpen = false
  }

  const deleteOperation = async () => {
    notifications.warning("Delete operation is not implemented yet.")
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

  <div class="operation-list">
    <button
      class="operation-row"
      type="button"
      onclick={() => openOperationPanel()}
    >
      <span class="operation-name">Default operation</span>
      <span class="operation-actions">
        <Icon
          name="dots-three"
          size="S"
          color="var(--spectrum-global-color-gray-600)"
        />
      </span>
    </button>
  </div>
</div>

<OperationSidePanel
  open={operationPanelOpen}
  agentId={currentAgentId}
  bind:agent
  {promptBindings}
  {bindingIcons}
  {completions}
  {toolsLoaded}
  {availableTools}
  {webSearchConfigured}
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
