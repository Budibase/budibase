<script>
  import { getContext, onMount } from "svelte"
  import { isEmpty } from "lodash/fp"

  const { API, styleable, DataProvider } = getContext("sdk")
  const dataContextStore = getContext("data")
  const component = getContext("component")

  export let datasource = []

  let rows = []

  onMount(async () => {
    if (!isEmpty(datasource)) {
      rows = await API.fetchDatasource(datasource, $dataContextStore)
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
