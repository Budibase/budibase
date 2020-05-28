<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import { WorkflowList } from "../";
  import WorkflowBlock from "./WorkflowBlock.svelte";
  import api from "builderStore/api"
  import blockDefinitions from "../blockDefinitions"

  const SUB_TABS = [
    {
      name: "Triggers",
      key: "TRIGGERS",
    },
    {
      name: "Actions",
      key: "ACTIONS",
    },
    {
      name: "Logic",
      key: "LOGIC",
    },
  ]

  let selectedTab = "TRIGGERS"
  let definitions = []

  $: definitions = Object.values(blockDefinitions[selectedTab])

  function myAction(node) {
    console.log("ACTION FIRED", node);
  }
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
    {#each definitions as blockDefinition}
      <WorkflowBlock {blockDefinition} blockType={selectedTab} />
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
  }

  .subtabs span {
    text-align: center;
    color: var(--font);
    font-weight: 500;
  }

  .subtabs span.selected {
    border-bottom: 4px solid var(--primary);
  }

  .subtabs span:not(.selected) {
    color: var(--dark-grey);
  }
</style>
