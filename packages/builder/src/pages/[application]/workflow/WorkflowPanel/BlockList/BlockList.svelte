<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import { WorkflowList } from "../"
  import WorkflowBlock from "./WorkflowBlock.svelte"
  import api from "builderStore/api"
  import blockDefinitions from "../blockDefinitions"

  const SUB_TABS = [
    {
      name: "Triggers",
      key: "TRIGGER",
    },
    {
      name: "Actions",
      key: "ACTION",
    },
    {
      name: "Logic",
      key: "LOGIC",
    },
  ]

  let selectedTab = "TRIGGER"
  let definitions = []

  $: definitions = Object.entries(blockDefinitions[selectedTab])
</script>

<section>
  <div class="subtabs">
    {#each SUB_TABS as tab}
      <span
        class="hoverable"
        class:selected={tab.key === selectedTab}
        on:click={() => (selectedTab = tab.key)}>
        {tab.name}
      </span>
    {/each}
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
