<script>
  import * as blockDefinitions from "constants/backend"
  import Block from "./Block.svelte"

  console.log(blockDefinitions)

  const HEADINGS = [
    {
      title: "Fields",
      key: "FIELDS",
    },
    {
      title: "Blocks",
      key: "BLOCKS",
    },
    {
      title: "Table",
      key: "TABLES",
    },
  ]

  let selectedTab = "FIELDS"
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
        primary={true}
        secondary={false}
        tertiary={false}
        title={blockDefinition.name}
        icon={blockDefinition.icon} />
    {/each}
  </div>
</section>

<style>
  header {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  span {
    margin-right: 20px;
    padding: 10px;
    border-radius: 3px;
    color: var(--ink-lighter);
    font-size: 14px;
    background: var(--light-grey);
  }

  span:hover {
    background: var(--secondary);
    cursor: pointer;
  }

  .selected {
    background: var(--secondary);
    color: var(--ink);
  }

  .block-grid {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
</style>
