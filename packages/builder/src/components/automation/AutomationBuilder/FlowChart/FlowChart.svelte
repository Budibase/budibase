<script>
  import { automationStore, selectedAutomation } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import FlowItem from "./FlowItem.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import { flip } from "svelte/animate"
  import { fly } from "svelte/transition"
  import {
    Heading,
    Icon,
    ActionButton,
    notifications,
    Modal,
  } from "@budibase/bbui"
  import { ActionStepID } from "constants/backend/automations"
  import UndoRedoControl from "components/common/UndoRedoControl.svelte"
  import { automationHistoryStore } from "builderStore"

  export let automation

  let testDataModal
  let confirmDeleteDialog

  $: blocks = getBlocks(automation)

  const getBlocks = automation => {
    let blocks = []
    if (automation.definition.trigger) {
      blocks.push(automation.definition.trigger)
    }
    blocks = blocks.concat(automation.definition.steps || [])
    return blocks
  }

  async function deleteAutomation() {
    try {
      await automationStore.actions.delete($selectedAutomation)
    } catch (error) {
      notifications.error("Error deleting automation")
    }
  }
</script>

<div class="canvas">
  <div class="header">
    <Heading size="S">{automation.name}</Heading>
    <div class="controls">
      <UndoRedoControl store={automationHistoryStore} />
      <Icon
        on:click={confirmDeleteDialog.show}
        hoverable
        size="M"
        name="DeleteOutline"
      />
      <div class="buttons">
        <ActionButton
          on:click={() => {
            testDataModal.show()
          }}
          icon="MultipleCheck"
          size="M">Run test</ActionButton
        >
        <ActionButton
          disabled={!$automationStore.testResults}
          on:click={() => {
            $automationStore.showTestPanel = true
          }}
          size="M">Test Details</ActionButton
        >
      </div>
    </div>
  </div>
</div>
<div class="content">
  {#each blocks as block, idx (block.id)}
    <div
      class="block"
      animate:flip={{ duration: 500 }}
      in:fly={{ x: 500, duration: 500 }}
      out:fly|local={{ x: 500, duration: 500 }}
    >
      {#if block.stepId !== ActionStepID.LOOP}
        <FlowItem {testDataModal} {block} {idx} />
      {/if}
    </div>
  {/each}
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Automation"
  onOk={deleteAutomation}
  title="Confirm Deletion"
>
  Are you sure you wish to delete the automation
  <i>{automation.name}?</i>
  This action cannot be undone.
</ConfirmDialog>

<Modal bind:this={testDataModal} width="30%">
  <TestDataModal />
</Modal>

<style>
  .canvas {
    padding: var(--spacing-l) var(--spacing-xl);
  }
  /* Fix for firefox not respecting bottom padding in scrolling containers */
  .canvas > *:last-child {
    padding-bottom: 40px;
  }

  .block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .content {
    display: inline-block;
    text-align: left;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .controls,
  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .buttons {
    gap: var(--spacing-s);
  }
</style>
