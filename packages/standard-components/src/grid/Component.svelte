<script>
  // Import valueSetters and custom renderers
  import { number } from "./valueSetters"
  import { getRenderer } from "./customRenderer"
  import { isEmpty } from "lodash/fp"
  import { getContext, onMount } from "svelte"
  import AgGrid from "@budibase/svelte-ag-grid"
  import {
    TextButton as DeleteButton,
    Icon,
    Modal,
    ModalContent,
  } from "@budibase/bbui"

  // These maps need to be set up to handle whatever types that are used in the tables.
  const setters = new Map([["number", number]])
  const SDK = getContext("sdk")
  const component = getContext("component")
  const dataContext = getContext("data")
  const { API, styleable } = SDK

  export let datasource = {}
  export let editable
  export let theme = "alpine"
  export let height = 500
  export let pagination
  export let detailUrl

  // Add setting height as css var to allow grid to use correct height
  $: gridStyles = {
    ...$component.styles,
    normal: {
      ...$component.styles.normal,
      ["--grid-height"]: `${height}px`,
    },
  }

  // These can never change at runtime so don't need to be reactive
  let canEdit = editable && datasource && datasource.type !== "view"
  let canAddDelete = editable && datasource && datasource.type === "table"

  let modal
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

  async function fetchData() {
    data = await API.fetchDatasource(datasource, $dataContext)

    let schema

    // Get schema for datasource
    // Views with "Calculate" applied provide their own schema.
    // For everything else, use the tableId property to pull to table schema
    if (datasource.schema) {
      schema = datasource.schema
    } else {
      schema = (await API.fetchTableDefinition(datasource.tableId)).schema
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
        cellRenderer: getRenderer(schema[key], canEdit, SDK),
        autoHeight: true,
      }
    })

    if (detailUrl) {
      columnDefs = [
        ...columnDefs,
        {
          headerName: "Detail",
          field: "_id",
          minWidth: 100,
          width: 100,
          flex: 0,
          editable: false,
          sortable: false,
          cellRenderer: getRenderer(
            {
              type: "_id",
              options: { detailUrl },
            },
            false,
            SDK
          ),
          autoHeight: true,
          pinned: "left",
          filter: false,
        },
      ]
    }

    dataLoaded = true
  }

  $: datasource && fetchData()

  onMount(() => {
    if (!isEmpty(datasource)) fetchData()
  })

  const shouldHideField = name => {
    if (name.startsWith("_")) return true
    // always 'row'
    if (name === "type") return true
    // tables are always tied to a single tableId, this is irrelevant
    if (name === "tableId") return true

    return false
  }

  const handleUpdate = ({ detail }) => {
    data[detail.row] = detail.data
    updateRow(detail.data)
  }

  const updateRow = async row => {
    await API.updateRow(row)
  }

  const deleteRows = async () => {
    await API.deleteRows({ rows: selectedRows, tableId: datasource.name })
    data = data.filter(row => !selectedRows.includes(row))
    selectedRows = []
  }
</script>

<div class="container" use:styleable={gridStyles}>
  {#if dataLoaded}
    {#if canAddDelete}
      <div class="controls">
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
  .container :global(.ag-pinned-left-header .ag-header-cell-label) {
    justify-content: center;
  }

  .controls {
    min-height: 15px;
    margin-bottom: var(--spacing-s);
    display: grid;
    grid-gap: var(--spacing-s);
    grid-template-columns: auto auto;
    justify-content: start;
  }
</style>
