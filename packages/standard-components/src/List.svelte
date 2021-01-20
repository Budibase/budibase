<script>
  import { getContext, onMount } from "svelte"
  import { isEmpty } from "lodash/fp"

  const { API, styleable, DataProvider } = getContext("sdk")
  const component = getContext("component")
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
  {#each rows as row}
    <DataProvider {row}>
      <slot />
    </DataProvider>
  {/each}
</div>
