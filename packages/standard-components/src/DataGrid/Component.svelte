<script>
  // Import valueSetters and custom renderers
  import { number } from "./valueSetters"
  import { getRenderer } from "./customRenderer"

  // These maps need to be set up to handle whatever types that are used in the tables.
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
  export let theme = "alpine"
  export let height = 500
  export let pagination

  let dataLoaded = false
  let data
  let columnDefs
  let selectedRows = []
  let table
  let options = {
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
    },
    rowSelection: editable ? "multiple" : false,
    suppressRowClickSelection: !editable,
    paginationAutoPageSize: true,
    pagination,
  }
  let store = _bb.store

  onMount(async () => {
    if (datasource.tableId) {
      const jsonTable = await _bb.api.get(`/api/tables/${datasource.tableId}`)
      table = await jsonTable.json()
      const { schema } = table
      if (!isEmpty(datasource)) {
        data = await fetchData(datasource, $store)
        columnDefs = Object.keys(schema).map((key, i) => {
          return {
            headerCheckboxSelection: i === 0 && editable,
            checkboxSelection: i === 0 && editable,
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
    // always 'row'
    if (name === "type") return true
    // tables are always tied to a single tableId, this is irrelevant
    if (name === "tableId") return true

    return false
  }

  const handleNewRow = async () => {
    data = await fetchData(datasource)
  }

  const handleUpdate = ({ detail }) => {
    data[detail.row] = detail.data
    updateRow(detail.data)
  }

  const updateRow = async row => {
    const response = await _bb.api.patch(
      `/api/${row.tableId}/rows/${row._id}`,
      row
    )
    const json = await response.json()
  }

  const deleteRows = async () => {
    const response = await _bb.api.post(`/api/${datasource.name}/rows`, {
      rows: selectedRows,
      type: "delete",
    })
    data = data.filter(row => !selectedRows.includes(row))
    selectedRows = []
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
</svelte:head>

<div style="--grid-height: {height}px">
  {#if dataLoaded}
    {#if editable}
      <div class="controls">
        <CreateRowButton {_bb} {table} on:newRow={handleNewRow} />
        {#if selectedRows.length > 0}
          <DeleteButton text small on:click={deleteRows}>
            <Icon name="addrow" />
            Delete
            {selectedRows.length}
            row(s)
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
