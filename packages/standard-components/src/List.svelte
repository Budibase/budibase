<script>
  import { getContext } from "svelte"
  import { isEmpty } from "lodash/fp"

  const { API, styleable, DataProvider } = getContext("sdk")
  const component = getContext("component")

  export let datasource = []

  let rows = []

  $: fetchData(datasource)

  async function fetchData(datasource) {
    if (!isEmpty(datasource)) {
      rows = await API.fetchDatasource(datasource)
    }
  }
</script>

<div use:styleable={$component.styles}>
  {#if rows.length > 0}
    {#each rows as row}
      <DataProvider {row}>
        {#if $component.children === 0}
         <p>Add some components too.</p>
        {:else}
          <slot />
        {/if}
      </DataProvider>
    {/each}
  {:else}
    <p>Feed me some data</p>
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