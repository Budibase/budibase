<script>
  import * as blockDefinitions from "constants/backend"
  import { backendUiStore, tourStore } from "builderStore"
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

    setTimeout(() => {
      $tourStore.tour.next()
    })
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
    cursor: pointer;
    display: grid;
    justify-content: center;
    align-content: center;
    padding: 0px 16px;
    height: 36px;
    text-align: center;
    background: #ffffff;
    color: var(--grey-7);
    border-radius: 5px;
    font-family: inter;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.3s;
    text-rendering: optimizeLegibility;
    border: none !important;
    transition: 0.2s;
    outline: none;
  }

  span:hover {
    color: var(--ink);
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
