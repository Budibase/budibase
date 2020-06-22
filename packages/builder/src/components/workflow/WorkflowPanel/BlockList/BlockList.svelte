<script>
  import { onMount } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import { WorkflowList } from "../"
  import WorkflowBlock from "./WorkflowBlock.svelte"
  import blockDefinitions from "../blockDefinitions"

  let selectedTab = "TRIGGER"
  let definitions = []

  $: definitions = Object.entries(blockDefinitions[selectedTab])

  $: {
    if (
      $workflowStore.currentWorkflow.hasTrigger() &&
      selectedTab === "TRIGGER"
    ) {
      selectedTab = "ACTION"
    }
  }
</script>

<section>
  <div class="subtabs">
    {#if !$workflowStore.currentWorkflow.hasTrigger()}
      <span
        class="hoverable"
        class:selected={'TRIGGER' === selectedTab}
        on:click={() => (selectedTab = 'TRIGGER')}>
        Triggers
      </span>
    {/if}
    <span
      class="hoverable"
      class:selected={'ACTION' === selectedTab}
      on:click={() => (selectedTab = 'ACTION')}>
      Actions
    </span>
    <span
      class="hoverable"
      class:selected={'LOGIC' === selectedTab}
      on:click={() => (selectedTab = 'LOGIC')}>
      Logic
    </span>
  </div>
  <div id="blocklist">
    {#each definitions as [actionId, blockDefinition]}
      <WorkflowBlock {blockDefinition} {actionId} blockType={selectedTab} />
    {/each}
  </div>
</section>

<style>
  .subtabs {
    margin-top: 27px;
    display: grid;
    grid-gap: 5px;
    grid-auto-flow: column;
    grid-auto-columns: 1fr 1fr 1fr;
    margin-bottom: 10px;
  }

  .subtabs span {
    transition: 0.3s all;
    text-align: center;
    color: var(--dark-grey);
    font-weight: 500;
    padding: 10px;
  }

  .subtabs span.selected {
    background: var(--dark-grey);
    color: var(--white);
    border-radius: 2px;
  }

  .subtabs span:not(.selected) {
    color: var(--dark-grey);
  }
</style>
