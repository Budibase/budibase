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
  {#each rows as row}
    <DataProvider {row}>
      <slot />
    </DataProvider>
  {/each}
</div>
