<script>
  import { getContext } from "svelte"
  import { isEmpty } from "lodash/fp"

  const { API, styleable, DataProvider, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let datasource = []
  export let noRowsMessage = "Feed me some data"

  let rows = []
  let loaded = false

  $: fetchData(datasource)

  async function fetchData(datasource) {
    if (!isEmpty(datasource)) {
      rows = await API.fetchDatasource(datasource)
    }
    loaded = true
  }
</script>

<div use:styleable={$component.styles}>
  {#if rows.length > 0}
    {#if $component.children === 0 && $builderStore.inBuilder}
      <p>Add some components too</p>
    {:else}
      {#each rows as row}
        <DataProvider {row}>
          <slot />
        </DataProvider>
      {/each}
    {/if}
  {:else if loaded && $builderStore.inBuilder}
    <p>{noRowsMessage}</p>
  {/if}
</div>

<style>
  p {
    display: grid;
    place-items: center;
    background: #f5f5f5;
    border: #ccc 1px solid;
    padding: var(--spacing-m);
  }
</style>
