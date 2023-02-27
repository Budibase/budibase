<script>
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import { fetchData } from "../../fetch/fetchData"
  import { LuceneUtils } from "../../utils"
  import { Icon } from "@budibase/bbui"
  import { createReorderStores } from "./stores/reorder"
  import { createViewportStores } from "./stores/viewport"
  import SpreadsheetHeader from "./SheetHeader.svelte"
  import SpreadsheetBody from "./SheetBody.svelte"
  import SpreadsheetCell from "./SheetCell.svelte"
  import SpreadsheetRow from "./SheetRow.svelte"
  import ResizeOverlay from "./ResizeOverlay.svelte"

  export let tableId
  export let filter
  export let sortColumn
  export let sortOrder
  export let API

  // Sheet constants
  const cellHeight = 36
  const limit = 100
  const defaultWidth = 200
  const rand = Math.random()

  // State stores
  const rows = writable([])
  const columns = writable([])
  const selectedCellId = writable(null)
  const selectedRows = writable({})
  const changeCache = writable({})
  const newRows = writable([])
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
    API,
    rand,
    rows,
    columns,
    selectedCellId,
    selectedRows,
    tableId,
    changeCache,
    newRows,
    cellHeight,
    bounds,
    scroll,
  }
  const { visibleRows, visibleColumns } = createViewportStores(context)
  context = { ...context, visibleRows, visibleColumns }
  const { reorder } = createReorderStores(context)

  $: query = LuceneUtils.buildLuceneQuery(filter)
  $: fetch = createFetch(tableId)
  $: fetch.update({
    sortColumn,
    sortOrder,
    query,
    limit,
  })
  $: generateColumns($fetch)
  $: rowCount = $rows.length
  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length
  $: updateSortedRows($fetch, $newRows)

  const createFetch = tableId => {
    return fetchData({
      API,
      datasource: {
        type: "table",
        tableId,
      },
      options: {
        sortColumn,
        sortOrder,
        query,
        limit,
        paginate: true,
      },
    })
  }

  // Generates the column array the first time the schema loads
  const generateColumns = ({ schema, definition }) => {
    if (!schema) {
      $columns = []
      return
    }
    const currentColumns = $columns

    // Get fields in new schema
    let fields = Object.keys(schema || {})
    const primaryDisplay = definition?.primaryDisplay
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

  const getIconForField = field => {
    const type = field.schema.type
    if (type === "options") {
      return "ChevronDown"
    } else if (type === "datetime") {
      return "Date"
    }
    return "Text"
  }

  const selectAll = () => {
    const allSelected = selectedRowCount === rowCount
    if (allSelected) {
      $selectedRows = {}
    } else {
      selectedRows.update(state => {
        $rows.forEach(row => {
          state[row._id] = true
        })
        return state
      })
    }
  }

  const updateValue = async (rowId, field, value) => {
    let row = $rows.find(x => x._id === rowId)
    if (!row) {
      return
    }
    if (row[field.name] === value) {
      return
    }
    changeCache.update(state => {
      state[rowId] = { [field.name]: value }
      return state
    })
    await API.saveRow({
      ...row,
      ...$changeCache[rowId],
    })
    await fetch.refresh()
    changeCache.update(state => {
      delete state[rowId]
      return state
    })
  }

  const addRow = async field => {
    const res = await API.saveRow({ tableId: table.tableId })
    $selectedCellId = `${res._id}-${field.name}`
    newRows.update(state => [...state, res._id])
    await fetch.refresh()
  }

  const updateSortedRows = (unsortedRows, newRows) => {
    let foo = unsortedRows.rows
    for (let i = 0; i < 0; i++) {
      foo = foo.concat(foo.map(x => ({ ...x, _id: x._id + "x" })))
    }
    let sortedRows = foo.slice()
    sortedRows.sort((a, b) => {
      const aIndex = newRows.indexOf(a._id)
      const bIndex = newRows.indexOf(b._id)
      return aIndex < bIndex ? -1 : 1
    })
    $rows = sortedRows.map((x, idx) => ({ ...x, __idx: idx }))
  }

  // API for children to consume
  const spreadsheetAPI = {
    refreshData: () => fetch?.refresh(),
    updateValue,
  }

  // Set context for children to consume
  setContext("spreadsheet", {
    ...context,
    reorder,
    visibleRows,
    visibleColumns,
    spreadsheetAPI,
  })
</script>

<div class="sheet" style="--cell-height:{cellHeight}px;" id="sheet-{rand}">
  <SpreadsheetHeader />
  <SpreadsheetBody>
    <div class="row">
      <!-- Field headers -->
      <SpreadsheetCell header label on:click={selectAll} width="40" left="0">
        <input
          type="checkbox"
          checked={rowCount && selectedRowCount === rowCount}
        />
      </SpreadsheetCell>
      {#each $visibleColumns as column}
        <SpreadsheetCell
          header
          sticky={column.idx === 0}
          reorderSource={$reorder.columnIdx === column.idx}
          reorderTarget={$reorder.swapColumnIdx === column.idx}
          on:mousedown={column.idx === 123
            ? null
            : e => reorder.actions.startReordering(column.idx, e)}
          width={column.width}
          left={column.left}
        >
          <Icon
            size="S"
            name={getIconForField(column)}
            color="var(--spectrum-global-color-gray-600)"
          />
          <span>
            {column.name}
          </span>
        </SpreadsheetCell>
      {/each}
    </div>

    <!-- All real rows -->
    {#each $visibleRows as row (row._id)}
      <SpreadsheetRow {row} />
    {/each}

    <!-- New row placeholder -->
    <div class="row new" style="--top:{($rows.length + 1) * cellHeight}px;">
      <SpreadsheetCell label on:click={addRow} width="40" left="0">
        <Icon hoverable name="Add" size="S" />
      </SpreadsheetCell>
      {#each $visibleColumns as column}
        <SpreadsheetCell
          sticky={column.idx === 0}
          reorderSource={$reorder.columnIdx === column.idx}
          reorderTarget={$reorder.swapColumnIdx === column.idx}
          on:click={() => addRow(column)}
          width={column.width}
          left={column.left}
        />
      {/each}
    </div>
  </SpreadsheetBody>
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

  .row {
    display: flex;
    position: sticky;
    top: 0;
    width: inherit;
    z-index: 10;
  }
  .row.new {
    position: absolute;
    transform: translateY(var(--top));
  }
  .row :global(> :last-child) {
    border-right-width: 1px;
  }
  input[type="checkbox"] {
    margin: 0;
  }
</style>
