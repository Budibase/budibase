<script>
  // Import valueSetters and custom renderers
  import { number } from "./valueSetters"
  import { booleanRenderer } from "./customRenderer"

  // These maps need to be set up to handle whatever types that are used in the models.
  const setters = new Map([["number", number]])
  const renderers = new Map([["boolean", booleanRenderer]])

  import fetchData from "../fetchData.js"
  import { isEmpty } from "lodash/fp"
  import { onMount } from "svelte"

  import AgGrid from "@budibase/svelte-ag-grid"
  import InputForm from "./InputForm.svelte"
  import CreateRowButton from "./CreateRow/Button.svelte"
  import { TextButton as DeleteButton, Icon } from "@budibase/bbui"

  export let _bb
  export let datasource = {}

  let dataLoaded = false
  let data
  let columnDefs
  let selectedRows = []

  onMount(async () => {
    const jsonModel = await _bb.api.get(`/api/models/${datasource.modelId}`)
    const { schema } = await jsonModel.json()
    if (!isEmpty(datasource)) {
      data = await fetchData(datasource)
      columnDefs = Object.keys(schema).map((key, i) => {
        return {
          headerCheckboxSelection: i === 0,
          checkboxSelection: i === 0,
          valueSetter: setters.get(schema[key].type),
          headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalise first letter
          field: key,
          hide: shouldHideField(key),
          sortable: true,
          editable: schema[key].type !== "boolean",
          cellRenderer: renderers.get(schema[key].type),
        }
      })
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

  const deleteRecords = async () => {
    console.log(_bb.api)
    const response = await _bb.api.post(`/api/${datasource.name}/records`, {
      records: selectedRows,
      type: "delete",
    })
    data = data.filter(record => !selectedRows.includes(record))
    selectedRows = []
  }
</script>

<div class="container">
  <div class="controls">
    <CreateRowButton />
    {#if selectedRows.length > 0}
      <DeleteButton text small on:click={deleteRecords}>
        <Icon name="addrow" />
        Delete {selectedRows.length} row(s)
      </DeleteButton>
    {/if}
  </div>
  {#if dataLoaded}
    <AgGrid
      {data}
      {columnDefs}
      on:update={handleUpdate}
      on:select={({ detail }) => (selectedRows = detail)} />
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
  .controls {
    margin-bottom: var(--spacing-s);
    display: grid;
    grid-gap: var(--spacing-s);
    grid-template-columns: auto auto;
    justify-content: start;
  }
</style>
