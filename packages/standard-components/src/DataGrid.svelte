<script>
  import fetchData from "./fetchData.js"
  import { isEmpty } from "lodash/fp"
  import { onMount } from "svelte"

  import AgGrid from "@budibase/svelte-ag-grid"

  export let datasource = {}

  let dataLoaded = false
  let data
  let columnDefs

  onMount(async () => {
    if (!isEmpty(datasource)) {
      data = await fetchData(datasource)
      if (data) {
        // Construct column definitions
        columnDefs = Object.keys(data[0]).map(key => {
          return {
            headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalise first letter
            field: key,
            hide: shouldHideField(key),
            sortable: true,
            editable: true,
          }
        })
      }
    }
    dataLoaded = true
  })

  const shouldHideField = name => {
    if (name.startsWith("_")) return true
    // always 'record'
    if (name === "type") return true
    // tables are always tied to a single modelId, this is irrelevant
    if (name === "modelId") return true

    return false
  }
</script>

{#if dataLoaded}
  <AgGrid bind:data {columnDefs} />
{/if}

<pre>{JSON.stringify(data, 0, 2)}</pre>
