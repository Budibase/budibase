<svelte:options immutable={true} />

<script>
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import { createReorderStores } from "./stores/reorder"
  import { createViewportStores } from "./stores/viewport"
  import { createRowsStore } from "./stores/rows"
  import SheetHeader from "./SheetHeader.svelte"
  import SheetBody from "./SheetBody.svelte"
  import SheetRow from "./SheetRow.svelte"
  import ResizeOverlay from "./ResizeOverlay.svelte"
  import HeaderRow from "./HeaderRow.svelte"
  import NewRow from "./NewRow.svelte"
  import { createAPIClient } from "../../api"

  export let tableId
  export let filter
  export let sortColumn
  export let sortOrder
  export let API

  // Sheet constants
  const cellHeight = 36
  const defaultWidth = 200
  const rand = Math.random()

  // State stores
  const tableIdStore = writable()
  const columns = writable([])
  const selectedCellId = writable()
  const selectedRows = writable({})
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
    columns,
    selectedCellId,
    selectedRows,
    cellHeight,
    bounds,
    scroll,
    tableId: tableIdStore,
  }
  const { rows, schema, primaryDisplay } = createRowsStore(context)
  context = { ...context, rows }
  const { visibleRows, visibleColumns } = createViewportStores(context)
  context = { ...context, visibleRows, visibleColumns }
  const { reorder } = createReorderStores(context)
  context = { ...context, reorder }

  $: tableIdStore.set(tableId)
  $: generateColumns($schema, $primaryDisplay)

  // Generates the column array the first time the schema loads
  const generateColumns = (schema, primaryDisplay) => {
    if (!schema) {
      $columns = []
      return
    }
    const currentColumns = $columns

    // Get fields in new schema
    let fields = Object.keys(schema || {})
    if (primaryDisplay) {
      fields = [primaryDisplay, ...fields.filter(x => x !== primaryDisplay)]
    }

    // Update columns, removing extraneous columns and adding missing ones
    let offset = 40
    $columns = fields.map((field, idx) => {
      const existing = currentColumns.find(x => x.name === field)
      const newCol = {
        idx,
        name: field,
        width: existing?.width || defaultWidth,
        left: offset,
        schema: schema[field],
        primaryDisplay: field === primaryDisplay,
      }
      offset += newCol.width
      return newCol
    })
  }

  // Set context for children to consume
  setContext("spreadsheet", context)
</script>

<div class="sheet" style="--cell-height:{cellHeight}px;" id="sheet-{rand}">
  <SheetHeader />
  <HeaderRow />

  <SheetBody>
    {#each $visibleRows as row}
      <SheetRow {row} />
    {/each}
    <NewRow />
  </SheetBody>
  <ResizeOverlay />
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
  }
  .sheet,
  .sheet :global(*) {
    box-sizing: border-box;
  }
</style>
