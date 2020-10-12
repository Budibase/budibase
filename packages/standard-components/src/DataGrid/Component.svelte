<script>
  // Import valueSetters and custom renderers
  import { number } from "./valueSetters"
  import { getRenderer } from "./customRenderer"

  // These maps need to be set up to handle whatever types that are used in the models.
  const setters = new Map([["number", number]])

  import fetchData from "../fetchData.js"
  import { isEmpty } from "lodash/fp"
  import { onMount } from "svelte"

  import AgGrid from "@budibase/svelte-ag-grid"
  import CreateRowButton from "./CreateRow/Button.svelte"
  import { TextButton as DeleteButton, Icon } from "@budibase/bbui"

  export let _bb
  export let datasource = {}
  export let editable
  export let theme = 'alpine'

  let dataLoaded = false
  let data
  let columnDefs
  let selectedRows = []
  let model
  let options = {
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
    },
    rowSelection: editable ? "multiple" : false,
    suppressRowClickSelection: !editable,
  }

  onMount(async () => {
    if (datasource.modelId) {
      const jsonModel = await _bb.api.get(`/api/models/${datasource.modelId}`)
      model = await jsonModel.json()
      const { schema } = model
      if (!isEmpty(datasource)) {
        data = await fetchData(datasource)
        columnDefs = Object.keys(schema).map((key, i) => {
          return {
            headerCheckboxSelection: i === 0,
            checkboxSelection: i === 0,
            valueSetter: setters.get(schema[key].type),
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            field: key,
            hide: shouldHideField(key),
            sortable: true,
            editable: editable,
            cellRenderer: getRenderer(schema[key], editable),
            autoHeight: true,
          }
        })
      }
      dataLoaded = true
    }
  })

  const isEditable = type =>
    type !== "boolean" &&
    type !== "options" &&
    // type !== "datetime" &&
     type !== "link" &&
    type !== "attachment" 

  const shouldHideField = name => {
    if (name.startsWith("_")) return true
    // always 'record'
    if (name === "type") return true
    // tables are always tied to a single modelId, this is irrelevant
    if (name === "modelId") return true

    return false
  }

  const handleNewRecord = async () => {
    data = await fetchData(datasource)
  }

  const handleUpdate = ({ detail }) => {
    data[detail.row] = detail.data
    updateRecord(detail.data)
  }

  const updateRecord = async record => {
    const response = await _bb.api.patch(
      `/api/${record.modelId}/records/${record._id}`,
      record
    )
    const json = await response.json()
  }

  const deleteRecords = async () => {
    const response = await _bb.api.post(`/api/${datasource.name}/records`, {
      records: selectedRows,
      type: "delete",
    })
    data = data.filter(record => !selectedRows.includes(record))
    selectedRows = []
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
</svelte:head>

<div class="container">
  {#if dataLoaded}
    {#if editable}
      <div class="controls">
        <CreateRowButton {_bb} {model} on:newRecord={handleNewRecord} />
        {#if selectedRows.length > 0}
          <DeleteButton text small on:click={deleteRecords}>
            <Icon name="addrow" />
            Delete {selectedRows.length} row(s)
          </DeleteButton>
        {/if}
      </div>
    {/if}
    <AgGrid
      {theme}
      {options}
      {data}
      {columnDefs}
      on:update={handleUpdate}
      on:select={({ detail }) => (selectedRows = detail)} />
  {/if}
</div>

<style>
  .container {
    --grid-height: 800px;
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
