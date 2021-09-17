<script>
  import { automationStore } from "builderStore"

  import FlowItem from "./FlowItem.svelte"
  import TestDataModal from "./TestDataModal.svelte"

  import { flip } from "svelte/animate"
  import { fade, fly } from "svelte/transition"
  import {
    Detail,
    Icon,
    ActionButton,
    notifications,
    Modal,
  } from "@budibase/bbui"
  import { database } from "stores/backend"

  export let automation
  export let onSelect
  let testDataModal
  let blocks
  $: instanceId = $database._id

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
    await automationStore.actions.delete(
      $automationStore.selectedAutomation?.automation
    )
  }

  async function testAutomation() {
    const result = await automationStore.actions.trigger(
      $automationStore.selectedAutomation.automation
    )
    if (result.status === 200) {
      notifications.success(
        `Automation ${$automationStore.selectedAutomation.automation.name} triggered successfully.`
      )
    } else {
      notifications.error(
        `Failed to trigger automation ${$automationStore.selectedAutomation.automation.name}.`
      )
    }
    return result
  }
</script>

<div class="canvas">
  <div class="content">
    <div class="title">
      <div class="subtitle">
        <Detail size="L">{automation.name}</Detail>
        <div
          style="display:flex;
          color: var(--spectrum-global-color-gray-400);"
        >
          <span on:click={() => deleteAutomation()} class="iconPadding">
            <Icon name="DeleteOutline" />
          </span>
          <ActionButton
            on:click={() => {
              testDataModal.show()
            }}
            icon="MultipleCheck"
            size="S">Run test</ActionButton
          >
        </div>
      </div>
    </div>
    {#each blocks as block, idx (block.id)}
      <div
        class="block"
        animate:flip={{ duration: 800 }}
        in:fade|local
        out:fly|local={{ x: 500 }}
      >
        <FlowItem {testDataModal} {testAutomation} {onSelect} {block} />
        {#if idx !== blocks.length - 1}
          <div class="separator" />
          <Icon name="AddCircle" size="S" />
          <div class="separator" />
        {/if}
      </div>
    {/each}
  </div>
  <Modal bind:this={testDataModal} width="30%">
    <TestDataModal {testAutomation} />
  </Modal>
</div>

<style>
  .separator {
    width: 1px;
    height: 25px;
    border-left: 1px dashed var(--grey-4);
    color: var(--grey-4);
    /* center horizontally */
    align-self: center;
  }
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
  }

  .iconPadding {
    cursor: pointer;
    display: flex;
    padding-right: var(--spacing-m);
  }
</style>
