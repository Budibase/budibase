<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import { fetchData, LuceneUtils } from "@budibase/frontend-core"
  import { Icon } from "@budibase/bbui"
  import TextCell from "./cells/TextCell.svelte"
  import OptionsCell from "./cells/OptionsCell.svelte"
  import DateCell from "./cells/DateCell.svelte"
  import MultiSelectCell from "./cells/MultiSelectCell.svelte"
  import NumberCell from "./cells/NumberCell.svelte"
  import RelationshipCell from "./cells/RelationshipCell.svelte"
  import { createReorderStores } from "./stores/reorder"
  import { createResizeStore } from "./stores/resize"
  import ReorderPlaceholder from "./ReorderPlaceholder.svelte"
  import ResizeSlider from "./ResizeSlider.svelte"
  import SpreadsheetHeader from "./SpreadsheetHeader.svelte"
  import SpreadsheetBody from "./SpreadsheetBody.svelte"

  export let table
  export let filter
  export let sortColumn
  export let sortOrder

  const { styleable, API } = getContext("sdk")
  const component = getContext("component")

  // Sheet constants
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

  // Build up spreadsheet context and additional stores
  const context = {
    rand,
    rows,
    columns,
    hoveredRowId,
    selectedCellId,
    selectedRows,
    tableId,
  }
  const { reorder, reorderPlaceholder } = createReorderStores(context)
  const resize = createResizeStore(context)

  // API for children to consume
  const spreadsheetAPI = {
    refreshData: () => fetch?.refresh(),
  }

  // Set context for children to consume
  setContext("spreadsheet", {
    ...context,
    reorder,
    reorderPlaceholder,
    resize,
    spreadsheetAPI,
  })

  let changeCache = {}
  let newRows = []

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
  $: updateSortedRows($fetch.rows, newRows)

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

  const getCellForField = field => {
    const type = field.schema.type
    if (type === "options") {
      return OptionsCell
    } else if (type === "datetime") {
      return DateCell
    } else if (type === "array") {
      return MultiSelectCell
    } else if (type === "number") {
      return NumberCell
    } else if (type === "link") {
      return RelationshipCell
    }
    return TextCell
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

  const selectRow = id => {
    selectedRows.update(state => {
      state[id] = !state[id]
      return state
    })
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

  const handleChange = async (rowId, field, value) => {
    let row = $rows.find(x => x._id === rowId)
    if (!row) {
      return
    }
    if (row[field.name] === value) {
      return
    }
    changeCache[rowId] = { [field.name]: value }
    await API.saveRow({
      ...row,
      ...changeCache[rowId],
    })
    await fetch.refresh()
    delete changeCache[rowId]
  }

  const addRow = async field => {
    const res = await API.saveRow({ tableId: table.tableId })
    $selectedCellId = `${res._id}-${field.name}`
    newRows.push(res._id)
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
</script>

<div use:styleable={$component.styles}>
  <div class="wrapper" class:resize={$resize.columnIdx != null}>
    <SpreadsheetHeader />
    <SpreadsheetBody>
      <!-- Field headers -->
      <div class="header cell label" on:click={selectAll}>
        <input
          type="checkbox"
          checked={rowCount && selectedRowCount === rowCount}
        />
      </div>
      {#each $columns as field, fieldIdx}
        <div
          class="header cell"
          class:sticky={fieldIdx === 0}
          class:reorder-source={$reorder.columnIdx === fieldIdx}
          class:reorder-target={$reorder.swapColumnIdx === fieldIdx}
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
        </div>
      {/each}
      <!-- Horizontal spacer -->
      <div
        class="header cell spacer"
        class:reorder-target={$reorder.swapColumnIdx === $columns.length}
      />

      <!-- All real rows -->
      {#each $rows as row, rowIdx (row._id)}
        {@const rowSelected = !!$selectedRows[row._id]}
        {@const rowHovered = $hoveredRowId === row._id}
        {@const data = { ...row, ...changeCache[row._id] }}
        <div
          class="cell label"
          class:row-selected={rowSelected}
          class:hovered={rowHovered}
          on:focus
          on:mouseover={() => ($hoveredRowId = row._id)}
          on:click={() => selectRow(row._id)}
        >
          {#if rowSelected || rowHovered}
            <input type="checkbox" checked={rowSelected} />
          {:else}
            <span>
              {rowIdx + 1}
            </span>
          {/if}
        </div>
        {#each $columns as field, fieldIdx}
          {@const cellIdx = `${row._id}-${field.name}`}
          {#key cellIdx}
            <div
              class="cell"
              class:row-selected={rowSelected}
              class:sticky={fieldIdx === 0}
              class:hovered={rowHovered}
              class:selected={$selectedCellId === cellIdx}
              class:reorder-source={$reorder.columnIdx === fieldIdx}
              class:reorder-target={$reorder.swapColumnIdx === fieldIdx}
              on:focus
              on:mouseover={() => ($hoveredRowId = row._id)}
              on:click={() => ($selectedCellId = cellIdx)}
            >
              <svelte:component
                this={getCellForField(field)}
                value={data[field.name]}
                schema={field.schema}
                selected={$selectedCellId === cellIdx}
                onChange={val => handleChange(row._id, field, val)}
                readonly={field.schema.autocolumn}
              />
            </div>
          {/key}
        {/each}
        <!-- Horizontal spacer -->
        <div
          class="cell spacer"
          class:reorder-target={$reorder.swapColumnIdx === $columns.length}
        />
      {/each}

      <!-- New row placeholder -->
      <div
        class="cell label new"
        on:click={addRow}
        on:focus
        on:mouseover={() => ($hoveredRowId = "new")}
        class:hovered={$hoveredRowId === "new"}
      >
        <Icon hoverable name="Add" size="S" />
      </div>
      {#each $columns as field, fieldIdx}
        <div
          class="cell new"
          class:sticky={fieldIdx === 0}
          class:hovered={$hoveredRowId === "new"}
          class:reorder-source={$reorder.columnIdx === fieldIdx}
          class:reorder-target={$reorder.swapColumnIdx === fieldIdx}
          on:click={() => addRow(field)}
          on:focus
          on:mouseover={() => ($hoveredRowId = "new")}
        />
      {/each}
      <!-- Horizontal spacer -->
      <div
        class="cell spacer"
        class:reorder-target={$reorder.swapColumnIdx === $columns.length}
      />

      <!-- Vertical spacer -->
      <div class="vertical-spacer" />
    </SpreadsheetBody>

    <!-- Reorder placeholder -->
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
    --cell-height: 32px;
    --cell-font-size: 14px;
  }
  .wrapper.resize *:hover {
    cursor: col-resize;
  }
  .wrapper ::-webkit-scrollbar-track {
    background: var(--cell-background);
  }

  /* Cells */
  .cell {
    height: var(--cell-height);
    border-style: solid;
    border-color: var(--spectrum-global-color-gray-300);
    border-width: 0;
    border-bottom-width: 1px;
    border-left-width: 1px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: var(--spectrum-global-color-gray-900);
    font-size: var(--cell-font-size);
    gap: var(--cell-spacing);
    background: var(--cell-background);
    position: relative;
    transition: border-color 130ms ease-out;
  }
  .cell.hovered {
    background: var(--cell-background-hover);
  }
  .cell.selected {
    box-shadow: inset 0 0 0 2px var(--spectrum-global-color-blue-400);
    z-index: 1;
  }
  .cell:not(.selected) {
    user-select: none;
  }
  .cell:hover {
    cursor: default;
  }
  .cell.row-selected {
    background-color: rgb(224, 242, 255);
  }
  .cell.new:hover {
    cursor: pointer;
  }

  /* Header cells */
  .header {
    background: var(--spectrum-global-color-gray-200);
    position: sticky;
    top: 0;
    padding: 0 var(--cell-padding);
    z-index: 3;
    border-color: var(--spectrum-global-color-gray-400);
  }
  .header span {
    flex: 1 1 auto;
    width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .header.sticky {
    z-index: 4;
  }

  /* Sticky styles */
  .sticky {
    position: sticky;
    left: 40px;
    z-index: 2;
    border-left-color: transparent;
  }
  .sticky.selected {
    z-index: 3;
  }

  /* Spacer cells */
  .spacer {
    background: none;
    border-bottom: none;
  }
  .vertical-spacer {
    grid-column: 1/-1;
    height: 180px;
  }

  /* Reorder styles */
  .cell.reorder-source {
    background: var(--spectrum-global-color-gray-200);
  }
  .cell.reorder-target {
    border-left-color: var(--spectrum-global-color-blue-400);
  }

  .label {
    padding: 0 12px;
    border-right: none;
    position: sticky;
    left: 0;
    z-index: 2;
  }
  .label.header {
    z-index: 4;
  }
  .label span {
    min-width: 14px;
    text-align: center;
    color: var(--spectrum-global-color-gray-500);
  }

  input[type="checkbox"] {
    margin: 0;
  }
</style>
