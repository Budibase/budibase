<script>
  // This should be fetched from somewhere in the future, rather than be hardcoded.
  import components from "./temporaryPanelStructure.js"
  import Tab from "./ComponentTab/Tab.svelte"
  import { store } from "builderStore"

  const categories = components.categories
  let selectedCategory = categories[0]
</script>

<div class="root">
  <ul class="tabs">
    {#each categories as category}
      <li
        on:click={() => (selectedCategory = category)}
        class:active={selectedCategory === category}>
        {category.name}
      </li>
    {/each}
  </ul>
  <div class="panel">
    <Tab list={selectedCategory} />
  </div>
</div>

<style>
  .tabs {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0 auto;
    padding: 0 30px;
    border-bottom: 1px solid #d8d8d8;

    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.14px;
  }

  li {
    color: #808192;
    margin: 0 5px;
    padding: 0 8px;
    cursor: pointer;
  }

  .panel {
    padding: 20px;
  }

  .active {
    border-bottom: solid 3px #0055ff;
    color: #393c44;
  }
</style>
