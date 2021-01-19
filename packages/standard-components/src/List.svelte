<script>
  import { getContext, onMount } from "svelte"
  import { isEmpty } from "lodash/fp"

  const { API, styleable, DataProvider } = getContext("sdk")
  const component = getContext("component")
  console.log($component)
  const dataContext = getContext("data")

  export let datasource = []

  let rows = []

  $: datasource && fetchData()

  async function fetchData() {
    rows = await API.fetchDatasource(datasource, $dataContext)
  }

  onMount(async () => {
    if (!isEmpty(datasource)) {
      fetchData()
    }
  })
</script>

<div use:styleable={$component.styles}>
  {#if rows.length > 0}
    {#each rows as row}
      <DataProvider {row}>
        <slot />
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