<script>
  import fetchData from "../fetchData.js"
  import { isEmpty } from "lodash/fp"
  import { onMount } from "svelte"

  import AgGrid from "@budibase/svelte-ag-grid"
  import InputForm from "./InputForm.svelte"

  export let _bb
  export let datasource = {}

  let dataLoaded = false
  let data
  let columnDefs

  onMount(async () => {
    console.log(datasource)
    const jsonModel = await _bb.api.get(`/api/models/${datasource.modelId}`)
    const { schema } = await jsonModel.json()
    if (!isEmpty(datasource)) {
      data = await fetchData(datasource)
      if (data) {
        // Construct column definitions
        columnDefs = Object.keys(schema).map(key => {
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

  const handleUpdate = ({ detail }) => {
    console.log(detail)
    data[detail.row] = detail.data
    updateRecord(detail.data)
  }

  const updateRecord = async record => {
    const response = await _bb.api.patch(
      `/api/${record.modelId}/records/${record._id}`,
      record
    )
    const json = await response.json()
    console.log(json)
  }
</script>

<div class="container">
  {#if dataLoaded}
    <AgGrid {data} {columnDefs} on:update={handleUpdate} />
    <InputForm fields={columnDefs} on:submit={handleSubmit} />
  {/if}
</div>
<pre>{JSON.stringify(data, 0, 2)}</pre>

<style>
  .container {
    --grid-height: 400px;
  }
  .container :global(form) {
    display: grid;
    grid-template-columns: repeat(2);
  }
</style>
