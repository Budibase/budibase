<script>
  import { goto, params } from "@sveltech/routify"
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Button, Icon } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"

  // New
  import AgGrid from "@budibase/svelte-ag-grid"
  import { getRenderer, editRowRenderer } from "./cells/cellRenderers";
  import TableHeader from "./TableHeader"

  export let schema = []
  export let data = []
  export let title
  export let allowEditing = false
  export let loading = false

  export let theme = "alpine"

  let columnDefs = []

  let options = {
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
    },
    rowSelection: "multiple",
    rowMultiSelectWithClick: true,
    suppressRowClickSelection: false,
    paginationAutoPageSize: true,
    pagination: true,
    enableRangeSelection: true,
    popupParent: document.body,
  }

  $: console.log(options)

  // TODO: refactor
  $: {
    let result = []
    if (allowEditing) {
      result.push({
        headerName: "Edit",
        sortable: false,
        resizable: false,
        suppressMovable: true,
        suppressMenu: true,
        minWidth: 0,
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

  // function selectRelationship(row, fieldName) {
  //   if (!row?.[fieldName]?.length) {
  //     return
  //   }
  //   $goto(
  //     `/${$params.application}/data/table/${tableId}/relationship/${row._id}/${fieldName}`
  //   )
  // }
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
  />
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

  :global(.ag-header-cell-text) {
    font-family: Inter;
    font-weight: 600;
    color: var(--ink);
  }
</style>
