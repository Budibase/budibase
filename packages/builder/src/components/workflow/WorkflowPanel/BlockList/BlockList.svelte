<script>
  import { onMount } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import { WorkflowList } from "../"
  import WorkflowBlock from "./WorkflowBlock.svelte"
  import api from "builderStore/api"
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
    margin-top: 20px;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr 1fr 1fr;
    margin-bottom: 12px;
  }

  .subtabs span {
    transition: 0.3s all;
    text-align: center;
    color: var(--grey-7);
    font-weight: 400;
    padding: 8px 16px;
    text-rendering: optimizeLegibility;
    border: none !important;
    outline: none;
  }

  .subtabs span.selected {
    background: var(--grey-3);
    color: var(--ink);
    border-radius: 5px;
  }

  .subtabs span:not(.selected) {
    color: var(--ink);
  }
</style>
