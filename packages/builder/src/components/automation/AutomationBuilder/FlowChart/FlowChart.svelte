<script>
  import { automationStore } from "builderStore"
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

  export let automation

  let testDataModal
  let blocks
  let confirmDeleteDialog

  $: {
    blocks = []
    if (automation) {
      if (automation.definition.trigger) {
        blocks.push(automation.definition.trigger)
      }
      blocks = blocks.concat(automation.definition.steps || [])
    }
  }

  async function deleteAutomation() {
    try {
      await automationStore.actions.delete(
        $automationStore.selectedAutomation?.automation
      )
    } catch (error) {
      notifications.error("Error deleting automation")
    }
  }
</script>

<div class="canvas">
  <div class="content">
    <div class="title">
      <div class="subtitle">
        <Heading size="S">{automation.name}</Heading>
        <div style="display:flex; align-items: center;">
          <div class="iconPadding">
            <div class="icon">
              <Icon
                on:click={confirmDeleteDialog.show}
                hoverable
                size="M"
                name="DeleteOutline"
              />
            </div>
          </div>
          <ActionButton
            on:click={() => {
              testDataModal.show()
            }}
            icon="MultipleCheck"
            size="M">Run test</ActionButton
          >
        </div>
      </div>
    </div>
    {#each blocks as block, idx (block.id)}
      <div
        class="block"
        animate:flip={{ duration: 500 }}
        in:fly|local={{ x: 500, duration: 1500 }}
      >
        <FlowItem {testDataModal} {block} />
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
</div>

<style>
  .canvas {
    margin: 0 -40px calc(-1 * var(--spacing-l)) -40px;
    overflow-y: auto;
    text-align: center;
    height: 100%;
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

  .title {
    padding-bottom: var(--spacing-xl);
  }

  .subtitle {
    padding-bottom: var(--spacing-xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iconPadding {
    padding-top: var(--spacing-s);
  }

  .icon {
    cursor: pointer;
    padding-right: var(--spacing-m);
  }
</style>
