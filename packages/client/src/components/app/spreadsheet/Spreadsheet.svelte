<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import { fetchData, LuceneUtils } from "@budibase/frontend-core"
  import { Icon } from "@budibase/bbui"
  import { createReorderStores } from "./stores/reorder"
  import { createResizeStore } from "./stores/resize"
  import ReorderPlaceholder from "./ReorderPlaceholder.svelte"
  import ResizeSlider from "./ResizeSlider.svelte"
  import SpreadsheetHeader from "./SpreadsheetHeader.svelte"
  import SpreadsheetBody from "./SpreadsheetBody.svelte"
  import SpreadsheetCell from "./SpreadsheetCell.svelte"
  import SpacerCell from "./SpacerCell.svelte"
  import VerticalSpacer from "./VerticalSpacer.svelte"
  import SpreadsheetRow from "./SpreadsheetRow.svelte"

  export let table
  export let filter
  export let sortColumn
  export let sortOrder

  const { styleable, API } = getContext("sdk")
  const component = getContext("component")

  // Sheet constants
  const cellHeight = 32
  const limit = 100
  const defaultWidth = 160
  const rand = Math.random()

  // State stores
  const rows = writable([])
  const columns = writable([])
  const hoveredRowId = writable(null)
  const selectedCellId = writable(null)
  const selectedRows = writable({})
  const tableId = writable(table?.tableId)
  const changeCache = writable({})
  const newRows = writable([])
  const visibleRows = writable([0, 0])

  // Build up spreadsheet context and additional stores
  const context = {
    rand,
    rows,
    columns,
    hoveredRowId,
    selectedCellId,
    selectedRows,
    tableId,
    changeCache,
    newRows,
    cellHeight,
    visibleRows,
  }
  const { reorder, reorderPlaceholder } = createReorderStores(context)
  const resize = createResizeStore(context)

  $: tableId.set(table?.tableId)
  $: query = LuceneUtils.buildLuceneQuery(filter)
  $: fetch = createFetch(table)
  $: fetch.update({
    sortColumn,
    sortOrder,
    query,
    limit,
  })
  $: generateColumns($fetch)
  $: rowCount = $rows.length
  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length
  $: updateSortedRows($fetch.rows, $newRows)

  const createFetch = datasource => {
    return fetchData({
      API,
      datasource,
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
    if (!$columns.length && schema) {
      let fields = Object.keys(schema || {})
      const primaryDisplay = definition?.primaryDisplay
      if (primaryDisplay) {
        fields = [primaryDisplay, ...fields.filter(x => x !== primaryDisplay)]
      }
      $columns = fields.map(field => ({
        name: field,
        width: defaultWidth,
        schema: schema[field],
        primaryDisplay: field === primaryDisplay,
      }))
    }
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
    let sortedRows = unsortedRows.slice()
    sortedRows.sort((a, b) => {
      const aIndex = newRows.indexOf(a._id)
      const bIndex = newRows.indexOf(b._id)
      return aIndex < bIndex ? -1 : 1
    })
    $rows = sortedRows
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
    reorderPlaceholder,
    resize,
    spreadsheetAPI,
  })
</script>

<div use:styleable={$component.styles}>
  <div
    class="wrapper"
    class:resize={$resize.columnIdx != null}
    style="--cell-height:{cellHeight}px;"
  >
    <SpreadsheetHeader />
    <SpreadsheetBody>
      <!-- Field headers -->
      <SpreadsheetCell header label on:click={selectAll}>
        <input
          type="checkbox"
          checked={rowCount && selectedRowCount === rowCount}
        />
      </SpreadsheetCell>
      {#each $columns as field, fieldIdx}
        <SpreadsheetCell
          header
          sticky={fieldIdx === 0}
          reorderSource={$reorder.columnIdx === fieldIdx}
          reorderTarget={$reorder.swapColumnIdx === fieldIdx}
          on:mousedown={e => reorder.actions.startReordering(fieldIdx, e)}
          id={`sheet-${rand}-header-${fieldIdx}`}
        >
          <Icon
            size="S"
            name={getIconForField(field)}
            color="var(--spectrum-global-color-gray-600)"
          />
          <span>
            {field.name}
          </span>
          <ResizeSlider columnIdx={fieldIdx} />
        </SpreadsheetCell>
      {/each}
      <SpacerCell
        header
        reorderTarget={$reorder.swapColumnIdx === $columns.length}
      />

      <!-- All real rows -->
      {#each $rows as row, rowIdx (row._id)}
        <SpreadsheetRow {row} {rowIdx} />
      {/each}

      <!-- New row placeholder -->
      <SpreadsheetCell
        label
        on:click={addRow}
        on:mouseenter={() => ($hoveredRowId = "new")}
        rowHovered={$hoveredRowId === "new"}
      >
        <Icon hoverable name="Add" size="S" />
      </SpreadsheetCell>
      {#each $columns as field, fieldIdx}
        <SpreadsheetCell
          sticky={fieldIdx === 0}
          rowHovered={$hoveredRowId === "new"}
          reorderSource={$reorder.columnIdx === fieldIdx}
          reorderTarget={$reorder.swapColumnIdx === fieldIdx}
          on:click={() => addRow(field)}
          on:mouseenter={() => ($hoveredRowId = "new")}
        />
      {/each}
      <SpacerCell reorderTarget={$reorder.swapColumnIdx === $columns.length} />

      <!-- Vertical spacer to pad bottom of sheet -->
      <VerticalSpacer />
    </SpreadsheetBody>

    <!-- Placeholder overlay for new column position -->
    <ReorderPlaceholder />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
    position: relative;

    /* Variables */
    --cell-background: var(--spectrum-global-color-gray-50);
    --cell-background-hover: var(--spectrum-global-color-gray-100);
    --cell-padding: 8px;
    --cell-spacing: 4px;
    --cell-font-size: 14px;
  }
  .wrapper.resize *:hover {
    cursor: col-resize;
  }
  .wrapper::-webkit-scrollbar-track {
    background: var(--cell-background);
  }
</style>
