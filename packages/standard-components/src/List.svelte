<script>
  import { getContext, onMount } from "svelte"
  import { isEmpty } from "lodash/fp"
  import DataProvider from "./DataProvider.svelte"

  const { API, styleable } = getContext("app")

  export let datasource = []
  export let styles

  let rows = []

  onMount(async () => {
    if (!isEmpty(datasource)) {
      rows = await API.fetchDatasource(datasource)
    }
  })
</script>

<div use:styleable={styles}>
  {#each rows as row}
    <DataProvider {row}>
      <slot />
    </DataProvider>
  {/each}
</div>
