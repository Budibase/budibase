<script>
  import {
    automationStore,
    automationHistoryStore,
    selectedAutomation,
  } from "stores/builder"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import { Icon, notifications, Modal, Toggle } from "@budibase/bbui"
  import { ActionStepID } from "constants/backend/automations"
  import UndoRedoControl from "components/common/UndoRedoControl.svelte"
  import StepNode from "./StepNode.svelte"
  import { memo } from "@budibase/frontend-core"
  import { sdk } from "@budibase/shared-core"
  import { onMount } from "svelte"

  export let automation

  const memoAutomation = memo(automation)

  let testDataModal
  let confirmDeleteDialog
  let scrolling = false
  let blockRefs = {}
  let treeEle

  // Memo auto - selectedAutomation
  $: memoAutomation.set(automation)

  // Parse the automation tree state
  $: refresh($memoAutomation)

  $: blocks = getBlocks($memoAutomation).filter(
    x => x.stepId !== ActionStepID.LOOP
  )
  $: isRowAction = sdk.automations.isRowAction($memoAutomation)

  const refresh = () => {
    // Build global automation bindings.
    const environmentBindings =
      automationStore.actions.buildEnvironmentBindings()

    // Get all processed block references
    blockRefs = $selectedAutomation.blockRefs

    automationStore.update(state => {
      return {
        ...state,
        bindings: [...environmentBindings],
      }
    })
  }

  const getBlocks = automation => {
    let blocks = []
    if (automation.definition.trigger) {
      blocks.push(automation.definition.trigger)
    }
    blocks = blocks.concat(automation.definition.steps || [])
    return blocks
  }

  const deleteAutomation = async () => {
    try {
      await automationStore.actions.delete(automation)
    } catch (error) {
      notifications.error("Error deleting automation")
    }
  }

  const handleScroll = e => {
    if (e.target.scrollTop >= 30) {
      scrolling = true
    } else if (e.target.scrollTop) {
      // Set scrolling back to false if scrolled back to less than 100px
      scrolling = false
    }
  }

  onMount(() => {
    // Ensure the trigger element is centered in the view on load.
    const triggerBlock = treeEle?.querySelector(".block.TRIGGER")
    triggerBlock?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "center",
    })
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="header" class:scrolling>
  <div class="header-left">
    <UndoRedoControl store={automationHistoryStore} />
  </div>
  <div class="controls">
    <div
      class:disabled={!automation?.definition?.trigger}
      on:click={() => {
        testDataModal.show()
      }}
      class="buttons"
    >
      <Icon size="M" name="Play" />
      <div>Run test</div>
    </div>
    <div class="buttons">
      <Icon disabled={!$automationStore.testResults} size="M" name="Multiple" />
      <div
        class:disabled={!$automationStore.testResults}
        on:click={() => {
          $automationStore.showTestPanel = true
        }}
      >
        Test details
      </div>
    </div>
    {#if !isRowAction}
      <div class="setting-spacing">
        <Toggle
          text={automation.disabled ? "Paused" : "Activated"}
          on:change={automationStore.actions.toggleDisabled(
            automation._id,
            automation.disabled
          )}
          disabled={!automation?.definition?.trigger}
          value={!automation.disabled}
        />
      </div>
    {/if}
  </div>
</div>
<div class="canvas" on:scroll={handleScroll}>
  <div class="content">
    <div class="tree">
      <div class="root" bind:this={treeEle}>
        {#if Object.keys(blockRefs).length}
          {#each blocks as block, idx (block.id)}
            <StepNode
              step={blocks[idx]}
              stepIdx={idx}
              isLast={blocks?.length - 1 === idx}
              automation={$memoAutomation}
              blocks={blockRefs}
            />
          {/each}
        {/if}
      </div>
    </div>
  </div>
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

<Modal bind:this={testDataModal} width="30%" zIndex={5}>
  <TestDataModal />
</Modal>

<style>
  .canvas {
    padding: var(--spacing-l) var(--spacing-xl);
    overflow-y: auto;
    max-height: 100%;
  }

  .header-left :global(div) {
    border-right: none;
  }
  /* Fix for firefox not respecting bottom padding in scrolling containers */
  .canvas > *:last-child {
    padding-bottom: 40px;
  }

  .root {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .root :global(.block) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .root :global(.blockSection) {
    width: 100%;
    box-sizing: border-box;
  }

  .content {
    padding: 23px 23px 80px;
    box-sizing: border-box;
    /* overflow-x: hidden; */
  }

  .header.scrolling {
    background: var(--background);
    border-bottom: var(--border-light);
    z-index: 1;
  }
  .tree {
    justify-content: center;
    display: inline-flex;
    min-width: 100%;
  }
  .header {
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: var(--spacing-l);
    transition: background 130ms ease-out;
    flex: 0 0 48px;
    padding-right: var(--spacing-xl);
  }

  .controls {
    display: flex;
    gap: var(--spacing-xl);
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-s);
  }

  .buttons:hover {
    cursor: pointer;
  }

  .disabled {
    pointer-events: none;
    color: var(--spectrum-global-color-gray-500) !important;
  }
</style>
