<svelte:options immutable={true} />

<script>
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import { createReorderStores } from "./stores/reorder"
  import { createViewportStores } from "./stores/viewport"
  import { createRowsStore } from "./stores/rows"
  import { createColumnsStores } from "./stores/columns"
  import SheetControls from "./SheetControls.svelte"
  import SheetBody from "./SheetBody.svelte"
  import SheetRow from "./SheetRow.svelte"
  import ResizeOverlay from "./ResizeOverlay.svelte"
  import HeaderRow from "./HeaderRow.svelte"
  import NewRow from "./NewRow.svelte"
  import { createAPIClient } from "../../api"
  import ScrollOverlay from "./ScrollOverlay.svelte"
  import StickyColumn from "./StickyColumn.svelte"

  export let tableId
  export let filter
  export let sortColumn
  export let sortOrder
  export let API

  // Sheet constants
  const cellHeight = 40
  const rand = Math.random()

  // State stores
  const tableIdStore = writable()
  const selectedCellId = writable()
  const selectedRows = writable({})
  const hoveredRowId = writable()
  const scroll = writable({
    left: 0,
    top: 0,
  })
  const bounds = writable({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  // Build up spreadsheet context and additional stores
  let context = {
    API: API || createAPIClient(),
    rand,
    selectedCellId,
    selectedRows,
    cellHeight,
    bounds,
    scroll,
    hoveredRowId,
    tableId: tableIdStore,
  }
  const { rows, schema } = createRowsStore(context)
  context = { ...context, rows, schema }
  const { columns, stickyColumn } = createColumnsStores(context)
  context = { ...context, columns, stickyColumn }
  const { visibleRows, visibleColumns } = createViewportStores(context)
  context = { ...context, visibleRows, visibleColumns }
  const { reorder } = createReorderStores(context)
  context = { ...context, reorder }

  $: tableIdStore.set(tableId)

  // Set context for children to consume
  setContext("spreadsheet", context)
</script>

<div class="sheet" style="--cell-height:{cellHeight}px;" id="sheet-{rand}">
  <SheetControls />
  <div class="sheet-data">
    <StickyColumn />
    <div class="sheet-main">
      <HeaderRow />
      <SheetBody>
        {#each $visibleRows as row}
          <SheetRow {row} />
        {/each}
        <NewRow />
      </SheetBody>
    </div>
    <ResizeOverlay />
    <ScrollOverlay />
  </div>
</div>

<style>
  .sheet {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    overflow: hidden;

    /* Variables */
    --cell-background: var(--spectrum-global-color-gray-50);
    --cell-background-hover: var(--spectrum-global-color-gray-75);
    --cell-padding: 10px;
    --cell-spacing: 4px;
    --cell-font-size: 14px;
    --controls-height: 50px;
    --cell-border: 1px solid var(--spectrum-global-color-gray-200);
  }
  .sheet,
  .sheet :global(*) {
    box-sizing: border-box;
  }

  .sheet-data {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-items: flex-start;
    align-items: flex-start;
    overflow: hidden;
    height: 0;
    position: relative;
  }
  .sheet-main {
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-self: stretch;
  }
</style>
