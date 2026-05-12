<script lang="ts">
  import { Button, Input, TextArea, Toggle } from "@budibase/bbui"
  import type { AgentOperation } from "@budibase/types"
  import { fly } from "svelte/transition"
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"
  import Panel from "@/components/design/Panel.svelte"

  export let open = false
  export let editingOperationId: string | undefined = undefined
  export let operationDraft: AgentOperation
  export let saving = false
  export let onClose: () => void = () => {}
  export let onSave: () => void = () => {}
  export let onDelete: () => void = () => {}
</script>

{#if open}
  <div
    class="operation-panel-container"
    transition:fly|local={{ x: 260, duration: 300 }}
  >
    <ResizablePanel
      storageKey="agent-operation-side-panel-width"
      defaultWidth={420}
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
        <div class="operation-panel">
          <div class="operation-panel-content">
            <div class="operation-panel-section">
              <Input
                label="Name"
                placeholder="Access requests"
                bind:value={operationDraft.name}
              />
              <Toggle
                label="Status"
                text={operationDraft.live ? "Live" : "Stopped"}
                bind:value={operationDraft.live}
              />
            </div>

            <div class="operation-panel-section">
              <TextArea
                label="Instructions"
                minHeight={180}
                bind:value={operationDraft.promptInstructions}
                updateOnChange
              />
            </div>

            {#if editingOperationId}
              <div class="operation-danger">
                <Button secondary quiet icon="trash" on:click={onDelete}>
                  Delete operation
                </Button>
              </div>
            {/if}
          </div>

          <div class="operation-panel-footer">
            <Button secondary on:click={onClose}>Cancel</Button>
            <Button primary on:click={onSave} disabled={saving}>Save</Button>
          </div>
        </div>
      </Panel>
    </ResizablePanel>
  </div>
{/if}

<style>
  .operation-panel-container {
    position: fixed;
    top: calc(var(--top-bar-height, 51px) + 45px);
    right: 0;
    bottom: 0;
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

  .operation-panel-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
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

  .operation-danger {
    padding-top: var(--spacing-m);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }
</style>
