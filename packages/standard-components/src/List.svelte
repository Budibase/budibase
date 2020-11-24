<script>
  import { getContext, onMount } from "svelte"
  import { isEmpty } from "lodash/fp"

  const { API, styleable, DataProvider } = getContext("sdk")
  const component = getContext("component")

  export let datasource = []

  let rows = []

  onMount(async () => {
    if (!isEmpty(datasource)) {
      rows = await API.fetchDatasource(datasource, $component.dataContext)
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
