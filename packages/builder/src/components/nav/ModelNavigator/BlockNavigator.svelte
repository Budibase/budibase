<script>
  import * as blockDefinitions from "constants/backend"
  import { backendUiStore } from "builderStore"
  import Block from "components/common/Block.svelte"

  const HEADINGS = [
    {
      title: "Fields",
      key: "FIELDS",
    },
    {
      title: "Blocks",
      key: "BLOCKS",
    },
  ]

  let selectedTab = "FIELDS"

  function addField(blockDefinition) {
    backendUiStore.actions.models.addField(blockDefinition)
    backendUiStore.actions.models.fetch()
  }
</script>

<section>
  <header>
    {#each HEADINGS as tab}
      <span
        class:selected={selectedTab === tab.key}
        on:click={() => (selectedTab = tab.key)}>
        {tab.title}
      </span>
    {/each}
  </header>

  <div class="block-grid">
    {#each Object.values(blockDefinitions[selectedTab]) as blockDefinition}
      <Block
        on:click={() => addField(blockDefinition)}
        title={blockDefinition.name}
        icon={blockDefinition.icon} />
    {/each}
  </div>
</section>

<style>
  header {
    margin-top: 20px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  span {
    text-align: center;
    padding: 10px;
    font-weight: 500;
    border-radius: 3px;
    color: var(--ink-lighter);
    font-size: 14px;
    background: var(--grey-1);
  }

  span:hover {
    background: var(--blue-light);
    cursor: pointer;
  }

  .selected {
    background: var(--grey-3);
    color: var(--ink);
  }

  .block-grid {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
</style>
