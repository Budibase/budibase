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
  import {
    TextButton as DeleteButton,
    Icon,
    Modal,
    ModalContent,
  } from "@budibase/bbui"

  export let _bb
  export let datasource = {}
  export let editable
  export let theme = "alpine"
  export let height = 500
  export let pagination

  // These can never change at runtime so don't need to be reactive
  let canEdit = editable && datasource && datasource.type !== "view"
  let canAddDelete = editable && datasource && datasource.type === "table"

  let modal

  let store = _bb.store
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
    rowSelection: canEdit ? "multiple" : false,
    suppressRowClickSelection: !canEdit,
    paginationAutoPageSize: true,
    pagination,
  }

  onMount(async () => {
    if (!isEmpty(datasource)) {
      data = await fetchData(datasource, $store)
      let schema = {}

      // Get schema for datasource
      // Views with "Calculate" applied provide their own schema.
      // For everything else, use the tableId property to pull to table schema
      if (datasource.schema) {
        schema = datasource.schema
      } else {
        const jsonTable = await _bb.api.get(`/api/tables/${datasource.tableId}`)
        table = await jsonTable.json()
        schema = table.schema
      }

      columnDefs = Object.keys(schema).map((key, i) => {
        return {
          headerCheckboxSelection: i === 0 && canEdit,
          checkboxSelection: i === 0 && canEdit,
          valueSetter: setters.get(schema[key].type),
          headerName: key,
          field: key,
          hide: shouldHideField(key),
          sortable: true,
          editable: canEdit && schema[key].type !== "link",
          cellRenderer: getRenderer(schema[key], canEdit),
          autoHeight: true,
        }
      })
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
    {#if canAddDelete}
      <div class="controls">
        <CreateRowButton {_bb} {table} on:newRow={handleNewRow} />
        {#if selectedRows.length > 0}
          <DeleteButton text small on:click={modal.show()}>
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
  <Modal bind:this={modal}>
    <ModalContent
      title="Confirm Row Deletion"
      confirmText="Delete"
      onConfirm={deleteRows}>
      <span>Are you sure you want to delete {selectedRows.length} row(s)?</span>
    </ModalContent>
  </Modal>
</div>

<style>
  .controls {
    margin-bottom: var(--spacing-s);
    display: grid;
    grid-gap: var(--spacing-s);
    grid-template-columns: auto auto;
    justify-content: start;
  }
</style>
