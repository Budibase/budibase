<script>
  import { getContext } from "svelte"
  import { fetchData, LuceneUtils } from "@budibase/frontend-core"
  import { Icon, ActionButton } from "@budibase/bbui"
  import TextCell from "./TextCell.svelte"
  import OptionsCell from "./OptionsCell.svelte"
  import DateCell from "./DateCell.svelte"

  export let table
  export let filter
  export let sortColumn
  export let sortOrder

  const { styleable, API, confirmationStore, notificationStore } =
    getContext("sdk")
  const component = getContext("component")
  const limit = 100
  const defaultWidth = 200

  let widths
  let hoveredRow
  let selectedCell
  let selectedRows = {}
  let horizontallyScrolled = false
  let changeCache = {}
  let newRows = []

  $: query = LuceneUtils.buildLuceneQuery(filter)
  $: fetch = createFetch(table)
  $: fetch.update({
    sortColumn,
    sortOrder,
    query,
    limit,
  })
  $: fields = Object.keys($fetch.schema || {})
  $: initWidths(fields)
  $: gridStyles = getGridStyles(widths)
  $: schema = $fetch.schema
  $: rowCount = $fetch.rows?.length || 0
  $: selectedRowCount = Object.values(selectedRows).filter(x => !!x).length
  $: rows = getSortedRows($fetch.rows, newRows)

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

  const initWidths = fields => {
    widths = fields.map(() => defaultWidth)
  }

  const getGridStyles = widths => {
    if (!widths?.length) {
      return "--grid: 1fr;"
    }
    return `--grid: 50px ${widths.map(x => `${x}px`).join(" ")};`
  }

  const handleScroll = e => {
    const nextHorizontallyScrolled = e.target.scrollLeft > 0
    if (nextHorizontallyScrolled !== horizontallyScrolled) {
      horizontallyScrolled = nextHorizontallyScrolled
    }
  }

  const getCellForField = field => {
    const type = schema?.[field]?.type
    if (type === "options") {
      return OptionsCell
    } else if (type === "datetime") {
      return DateCell
    }
    return TextCell
  }

  const getIconForField = field => {
    const type = schema?.[field]?.type
    if (type === "options") {
      return "ChevronDown"
    } else if (type === "datetime") {
      return "Date"
    }
    return "Text"
  }

  const selectRow = id => {
    selectedRows[id] = !selectedRows[id]
  }

  const selectAll = () => {
    const allSelected = selectedRowCount === rowCount
    if (allSelected) {
      selectedRows = {}
    } else {
      rows.forEach(row => {
        selectedRows[row._id] = true
      })
    }
  }

  const handleChange = async (rowId, field, value) => {
    let row = rows.find(x => x._id === rowId)
    if (!row) {
      return
    }
    if (row[field] === value) {
      return
    }
    changeCache[rowId] = { [field]: value }
    await API.saveRow({
      ...row,
      ...changeCache[rowId],
    })
    await fetch.refresh()
    delete changeCache[rowId]
  }

  const deleteRows = () => {
    // Fetch full row objects to be deleted
    const rowsToDelete = Object.entries(selectedRows)
      .map(entry => {
        if (entry[1] === true) {
          return rows.find(x => x._id === entry[0])
        } else {
          return null
        }
      })
      .filter(x => x != null)

    // Deletion callback when confirmed
    const performDeletion = async () => {
      await API.deleteRows({
        tableId: table.tableId,
        rows: rowsToDelete,
      })
      await fetch.refresh()
      notificationStore.actions.success(
        `${selectedRowCount} row${
          selectedRowCount === 1 ? "" : "s"
        } deleted successfully`
      )

      // Refresh state
      selectedCell = null
      hoveredRow = null
      selectedRows = {}
    }

    // Show confirmation
    confirmationStore.actions.showConfirmation(
      "Delete rows",
      `Are you sure you want to delete ${selectedRowCount} row${
        selectedRowCount === 1 ? "" : "s"
      }?`,
      performDeletion
    )
  }

  const addRow = async field => {
    const res = await API.saveRow({ tableId: table.tableId })
    selectedCell = `${res._id}-${field}`
    newRows.push(res._id)
    await fetch.refresh()
  }

  const getSortedRows = (rows, newRows) => {
    let sortedRows = rows.slice()
    sortedRows.sort((a, b) => {
      const aIndex = newRows.indexOf(a._id)
      const bIndex = newRows.indexOf(b._id)
      return aIndex < bIndex ? -1 : 1
    })
    return sortedRows
  }
</script>

<div use:styleable={$component.styles}>
  <div class="wrapper">
    <div class="controls">
      <div class="buttons">
        <ActionButton icon="Filter" size="S">Filter</ActionButton>
        <ActionButton icon="Group" size="S">Group</ActionButton>
        <ActionButton icon="SortOrderDown" size="S">Sort</ActionButton>
        <ActionButton icon="VisibilityOff" size="S">Hide fields</ActionButton>
      </div>
      <div class="title">Sales Records</div>
      <div class="delete">
        {#if selectedRowCount}
          <ActionButton icon="Delete" size="S" on:click={deleteRows}>
            Delete {selectedRowCount} row{selectedRowCount === 1 ? "" : "s"}
          </ActionButton>
        {:else}
          {rowCount} row{rowCount === 1 ? "" : "s"}
        {/if}
      </div>
    </div>
    <div
      class="spreadsheet"
      on:scroll={handleScroll}
      style={gridStyles}
      on:click|self={() => (selectedCell = null)}
    >
      <!-- Field headers -->
      <div class="header cell label" on:click={selectAll}>
        <input
          type="checkbox"
          checked={rowCount && selectedRowCount === rowCount}
        />
      </div>
      {#each fields as field, fieldIdx}
        <div
          class="header cell"
          class:sticky={fieldIdx === 0}
          class:shadow={horizontallyScrolled}
        >
          <Icon
            size="S"
            name={getIconForField(field)}
            color="var(--spectrum-global-color-gray-600)"
          />
          {field}
        </div>
      {/each}

      <!-- All real rows -->
      {#each rows as row, rowIdx (row._id)}
        {@const rowSelected = !!selectedRows[row._id]}
        {@const rowHovered = hoveredRow === row._id}
        {@const data = { ...row, ...changeCache[row._id] }}
        <div
          class="cell label"
          class:row-selected={rowSelected}
          class:hovered={rowHovered}
          on:focus
          on:mouseover={() => (hoveredRow = row._id)}
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
        {#each fields as field, fieldIdx}
          {@const cellIdx = `${row._id}-${field}`}
          <div
            class="cell"
            class:row-selected={rowSelected}
            class:sticky={fieldIdx === 0}
            class:hovered={rowHovered}
            class:selected={selectedCell === cellIdx}
            class:shadow={horizontallyScrolled}
            on:focus
            on:mouseover={() => (hoveredRow = row._id)}
            on:click={() => (selectedCell = cellIdx)}
          >
            <svelte:component
              this={getCellForField(field)}
              value={data[field]}
              schema={schema[field]}
              selected={selectedCell === cellIdx}
              onChange={val => handleChange(row._id, field, val)}
            />
          </div>
        {/each}
      {/each}

      <!-- New row placeholder -->
      <div class="cell label new" on:click={addRow}>
        <Icon hoverable name="Add" />
      </div>
      {#each fields as field, fieldIdx}
        <div
          class="cell new"
          class:sticky={fieldIdx === 0}
          class:shadow={horizontallyScrolled}
          on:click={() => addRow(field)}
        />
      {/each}
    </div>
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
  }
  .spreadsheet {
    display: grid;
    grid-template-columns: var(--grid);
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    overflow: auto;
    max-height: 1014px;
    position: relative;
    padding-bottom: 180px;
    padding-right: 100px;
  }

  .wrapper ::-webkit-scrollbar-track {
    background: var(--spectrum-global-color-gray-50);
  }

  .controls {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    height: 36px;
    padding: 0 12px;
    background: var(--spectrum-global-color-gray-200);
    gap: 8px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-400);
  }
  .title {
    font-weight: 600;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
  .delete {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: var(--spectrum-global-color-gray-700);
  }
  .delete :global(.spectrum-ActionButton) {
    color: var(--spectrum-global-color-red-600);
  }
  .delete :global(.spectrum-Icon) {
    fill: var(--spectrum-global-color-red-600);
  }

  .cell {
    height: 32px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    border-right: 1px solid var(--spectrum-global-color-gray-300);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: var(--spectrum-global-color-gray-900);
    font-size: 14px;
    gap: 4px;
    background: var(--spectrum-global-color-gray-50);
    position: relative;
  }
  .cell.hovered {
    background: var(--spectrum-global-color-gray-100);
  }
  .cell.selected {
    box-shadow: inset 0 0 0 2px var(--spectrum-global-color-blue-400);
    z-index: 1;
  }
  .cell:hover {
    cursor: default;
  }
  .cell.sticky {
    position: sticky;
    left: 50px;
    z-index: 2;
  }
  .cell.sticky.selected {
    z-index: 3;
  }
  .cell.row-selected {
    background-color: rgb(224, 242, 255);
  }
  .cell.new:hover {
    cursor: pointer;
  }

  .header {
    background: var(--spectrum-global-color-gray-200);
    position: sticky;
    top: 0;
    padding: 0 8px;
    z-index: 3;
    border-color: var(--spectrum-global-color-gray-400);
  }
  .header.sticky {
    z-index: 4;
  }

  .sticky.shadow:after {
    content: " ";
    position: absolute;
    width: 10px;
    left: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
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
