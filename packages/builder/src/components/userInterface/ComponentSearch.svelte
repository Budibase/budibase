<script>
  import { searchAllComponents } from "./pagesParsing/searchComponents"
  import { store } from "../builderStore"

  export let onComponentChosen = () => {}

  let phrase = ""

  components = $store.components

  $: filteredComponents = !phrase ? [] : searchAllComponents(components, phrase)
</script>

<div class="root">

  <form on:submit|preventDefault class="uk-search uk-search-large">
    <span uk-search-icon />
    <input
      class="uk-search-input"
      type="search"
      placeholder="Based on component..."
      bind:value={phrase} />
  </form>

  <div>
    {#each filteredComponents as component}
      <div class="component" on:click={() => onComponentChosen(component)}>
        <div class="title">{component.name}</div>
        <div class="description">{component.description}</div>
      </div>
    {/each}
  </div>

</div>

<style>
  .component {
    padding: 5px;
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: var(--grey-1);
    cursor: pointer;
  }

  .component:hover {
    background-color: var(--primary10);
  }

  .component > .title {
    font-size: 13pt;
    color: var(--ink);
  }

  .component > .description {
    font-size: 10pt;
    color: var(--blue);
    font-style: italic;
  }
</style>
