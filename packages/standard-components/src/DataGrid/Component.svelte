<script>
  import fetchData from "../fetchData.js"
  import { isEmpty } from "lodash/fp"
  import { onMount } from "svelte"

  import AgGrid from "@budibase/svelte-ag-grid"
  import InputForm from "./InputForm.svelte"

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

  const handleSubmit = e => {
    // Send off data here and update to display in grid component
    console.log("Submitting:", e.detail)
  }
</script>

<div class="container">
  {#if dataLoaded}
    <AgGrid bind:data {columnDefs} />
    <InputForm fields={columnDefs} on:submit={handleSubmit} />
  {/if}
</div>

<style>
  .container {
    --grid-height: 400px;
  }
  .container :global(form) {
    display: grid;
    grid-template-columns: repeat(2);
  }
</style>
