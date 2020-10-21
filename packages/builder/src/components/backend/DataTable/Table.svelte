<script>
  import { goto, params } from "@sveltech/routify"
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import fsort from "fast-sort"
  import getOr from "lodash/fp/getOr"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Button, Icon } from "@budibase/bbui"
  import ActionButton from "components/common/ActionButton.svelte"
  import CreateEditRowModal from "./modals/CreateEditRowModal.svelte"
  import RowPopover from "./buttons/CreateRowButton.svelte"
  import ColumnPopover from "./buttons/CreateColumnButton.svelte"
  import ViewPopover from "./buttons/CreateViewButton.svelte"
  import ColumnHeaderPopover from "./popovers/ColumnPopover.svelte"
  import EditRowPopover from "./popovers/RowPopover.svelte"
  import CalculationPopover from "./buttons/CalculateButton.svelte"
  import Spinner from "components/common/Spinner.svelte"

  // New
  import AgGrid from "@budibase/svelte-ag-grid"
  import { getRenderer, editRowRenderer } from "./cells/cellRenderers";
  import TableHeader from "./TableHeader"

  // const ITEMS_PER_PAGE = 10
  

  export let schema = []
  export let data = []
  export let title
  export let allowEditing = false
  export let loading = false

  // New stuff
  export let theme = "alpine"

  let columnDefs = []

  let options = {
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
    },
    rowSelection: "multiple",
    suppressRowClickSelection: false,
    paginationAutoPageSize: true,
  }

  // let currentPage = 0
  // $: columns = schema ? Object.keys(schema) : []
  // $: sort = $backendUiStore.sort
  // $: sorted = sort ? fsort(data)[sort.direction](sort.column) : data
  // $: paginatedData =
  //   sorted && sorted.length
  //     ? sorted.slice(
  //         currentPage * ITEMS_PER_PAGE,
  //         currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  //       )
  //     : []
  // TODO: refactor
  $: {
    let result = []
    if (allowEditing) {
      result.push({
        headerName: "Edit",
        sortable: false,
        resizable: false,
        suppressMovable: true,
        width: 10,
        cellRenderer: editRowRenderer
      })
    }
    columnDefs = [...result, ...Object.keys(schema).map(key => ({
      // headerCheckboxSelection: i === 0 && canEdit,
      // checkboxSelection: i === 0 && canEdit,
      // valueSetter: setters.get(schema[key].type),
      headerComponent: TableHeader,
      headerComponentParams: {
        field: schema[key]
      },
      headerName: key,
      field: key,
      // hide: shouldHideField(key),
      sortable: true,
      // editable: canEdit && schema[key].type !== "link",
      cellRenderer: getRenderer(schema[key], true),
      autoHeight: true,
      resizable: true,
    }))]
  }
  $: tableId = data?.length ? data[0].tableId : null

  function selectRelationship(row, fieldName) {
    if (!row?.[fieldName]?.length) {
      return
    }
    $goto(
      `/${$params.application}/data/table/${tableId}/relationship/${row._id}/${fieldName}`
    )
  }

  // New stuff
  const deleteRows = async () => {
    const response = await api.post(`/api/${tableId}/rows`, {
      rows: selectedRows,
      type: "delete",
    })
    data = data.filter(row => !selectedRows.includes(row))
    selectedRows = []
  }

  const handleUpdate = ({ detail }) => {
    data[detail.row] = detail.data
    updateRow(detail.data)
  }
</script>

<section>
  <div class="table-controls">
    <h2 class="title">
      <span>{title}</span>
      {#if loading}
        <div transition:fade>
          <Spinner size="10" />
        </div>
      {/if}
    </h2>
    <div class="popovers">
      <slot />
    </div>
  </div>
  <AgGrid 
    {theme}
    {options}
    {data}
    {columnDefs}
    on:update={handleUpdate}
    on:select={({ detail }) => (console.log(detail))} />
  <!-- <table class="bb-table">
    <thead>
      <tr>
        {#if allowEditing}
          <th class="edit-header">
            <div>Edit</div>
          </th>
        {/if}
        {#each columns as header}
          <th>
            {#if allowEditing}
              <ColumnHeaderPopover field={schema[header]} />
            {:else}
              <div class="header">{header}</div>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if paginatedData.length === 0}
        {#if allowEditing}
          <td class="no-border">No data.</td>
        {/if}
        {#each columns as header, idx}
          <td class="no-border">
            {#if idx === 0 && !allowEditing}No data.{/if}
          </td>
        {/each}
      {/if}
      {#each paginatedData as row}
        <tr>
          {#if allowEditing}
            <td>
              <EditRowPopover {row} />
            </td>
          {/if}
          {#each columns as header}
            <td>
              {#if schema[header].type === 'link'}
                <div
                  class:link={row[header] && row[header].length}
                  on:click={() => selectRelationship(row, header)}>
                  {row[header] ? row[header].length : 0}
                  related row(s)
                </div>
              {:else if schema[header].type === 'attachment'}
                <AttachmentList files={row[header] || []} />
              {:else}{getOr('', header, row)}{/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table> -->
  <!-- <TablePagination
    {data}
    bind:currentPage
    pageItemCount={paginatedData.length}
    {ITEMS_PER_PAGE} /> -->
</section>

<style>
  .title {
    font-size: 24px;
    font-weight: 600;
    text-rendering: optimizeLegibility;
    margin-top: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .title > span {
    margin-right: var(--spacing-xs);
  }

  .table-controls {
    width: 100%;
  }

  .popovers {
    display: flex;
  }

  :global(.popovers > div) {
    margin-right: var(--spacing-m);
    margin-bottom: var(--spacing-xl);
  }
</style>
