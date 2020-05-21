<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import blockDefinitions from "./blockDefinitions"

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
      name: "Utilities",
      key: "UTILITIES",
    },
  ]

  let selectedTab = "TRIGGERS"
  let definitions = []

  $: definitions = Object.values(blockDefinitions[selectedTab])
</script>

<section>
  <header>
    <span>Blocks</span>
    <span>Props</span>
  </header>
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
      <div class="blockelem create-flowy noselect">
        <input
          type="hidden"
          name="blockelemtype"
          class="blockelemtype"
          value="1" />
        <div class="grabme">
          <!-- <img src="assets/grabme.svg" /> -->
        </div>
        <div class="blockin">
          <div class="blockico">
            <span />
            <!-- <img src="assets/eye.svg" /> -->
          </div>
          <div class="blocktext">
            <p class="blocktitle">{blockDefinition.name}</p>
            <p class="blockdesc">{blockDefinition.description}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

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
