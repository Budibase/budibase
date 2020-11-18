<script>
  import { onMount } from "svelte"
  import {
    fetchDatasource,
    styleable,
    DataProvider,
  } from "@budibase/component-sdk"
  import { isEmpty } from "lodash/fp"

  export let datasource = []
  export let styles

  let rows = []

  onMount(async () => {
    if (!isEmpty(datasource)) {
      rows = await fetchDatasource(datasource)
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
