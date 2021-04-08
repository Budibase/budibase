<script>
  import { createEventDispatcher } from "svelte"
  import "@spectrum-css/table/dist/index-vars.css"
  import CellRenderer from "./CellRenderer.svelte"
  import SelectEditRenderer from "./SelectEditRenderer.svelte"

  export let data = []
  export let schema = {}
  export let showAutoColumns = false
  export let rowCount = 14
  export let quiet = true
  export let loading = false
  export let allowSelectRows = true
  export let allowEditRows = true
  export let allowEditColumns = true
  export let selectedRows = []
  export let customColumnRenderer = SelectEditRenderer
  export let customColumnTitle

  const dispatch = createEventDispatcher()

  // Config
  const rowHeight = 55
  const headerHeight = 36
  const rowPreload = 5
  const maxRows = 100

  // Sorting state
  let sortColumn
  let sortOrder

  // Table state
  let loaded = false
  $: if (!loading) loaded = true
  $: rows = data ?? []
  $: visibleRowCount = loaded
    ? Math.min(rows.length, rowCount || maxRows, maxRows)
    : rowCount || 8
  $: scroll = rows.length > visibleRowCount
  $: contentStyle = getContentStyle(visibleRowCount, scroll || !loaded)
  $: sortedRows = sortRows(rows, sortColumn, sortOrder)
  $: fields = getFields(schema, showAutoColumns)

  // Scrolling state
  let timeout
  let nextScrollTop = 0
  let scrollTop = 0
  $: firstVisibleRow = calculateFirstVisibleRow(scrollTop)
  $: lastVisibleRow = calculateLastVisibleRow(
    firstVisibleRow,
    visibleRowCount,
    rows.length
  )

  const getContentStyle = (visibleRows, useFixedHeight) => {
    if (!useFixedHeight) {
      return ""
    }
    return `height: ${headerHeight - 1 + visibleRows * (rowHeight + 1)}px;`
  }

  const sortRows = (rows, sortColumn, sortOrder) => {
    if (!sortColumn || !sortOrder) {
      return rows
    }
    return rows.slice().sort((a, b) => {
      const colA = a[sortColumn]
      const colB = b[sortColumn]
      if (sortOrder === "Descending") {
        return colA > colB ? -1 : 1
      } else {
        return colA > colB ? 1 : -1
      }
    })
  }

  const sortBy = field => {
    if (field === sortColumn) {
      sortOrder = sortOrder === "Descending" ? "Ascending" : "Descending"
    } else {
      sortColumn = field
      sortOrder = "Descending"
    }
  }

  const getFields = (schema, showAutoColumns) => {
    let columns = []
    let autoColumns = []
    Object.entries(schema).forEach(([field, fieldSchema]) => {
      if (!fieldSchema?.autocolumn) {
        columns.push(field)
      } else if (showAutoColumns) {
        autoColumns.push(field)
      }
    })
    return columns.sort().concat(autoColumns)
  }

  const onScroll = event => {
    nextScrollTop = event.target.scrollTop
    if (timeout) {
      return
    }
    timeout = setTimeout(() => {
      scrollTop = nextScrollTop
      timeout = null
    }, 50)
  }

  const calculateFirstVisibleRow = scrollTop => {
    return Math.max(Math.floor(scrollTop / (rowHeight + 1)) - rowPreload, 0)
  }

  const calculateLastVisibleRow = (firstRow, visibleRowCount, allRowCount) => {
    return Math.min(firstRow + visibleRowCount + 2 * rowPreload, allRowCount)
  }

  const editColumn = (e, field) => {
    e.stopPropagation()
    dispatch("editcolumn", field)
  }

  const editRow = (e, row) => {
    e.stopPropagation()
    dispatch("editrow", row)
  }

  const toggleSelectRow = row => {
    if (!allowSelectRows) {
      return
    }
    if (selectedRows.includes(row)) {
      selectedRows = selectedRows.filter(selectedRow => selectedRow !== row)
    } else {
      selectedRows = [...selectedRows, row]
    }
  }
</script>

{#if !loaded}
  <div class="loading" style={contentStyle} />
{:else}
  <div
    on:scroll={onScroll}
    class:quiet
    style={`--row-height: ${rowHeight}px; --header-height: ${headerHeight}px;`}
    class="container">
    <div style={contentStyle}>
      <table class="spectrum-Table" class:spectrum-Table--quiet={quiet}>
        <thead class="spectrum-Table-head">
          <tr>
            {#if customColumnRenderer}
              <th class="spectrum-Table-headCell">
                <div class="spectrum-Table-headCell-content">
                  {customColumnTitle || ''}
                </div>
              </th>
            {/if}
            {#each fields as field}
              <th
                class="spectrum-Table-headCell is-sortable"
                class:is-sorted-desc={sortColumn === field && sortOrder === 'Descending'}
                class:is-sorted-asc={sortColumn === field && sortOrder === 'Ascending'}
                on:click={() => sortBy(field)}>
                <div class="spectrum-Table-headCell-content">
                  <div class="title">
                    {schema[field]?.displayName || schema[field]?.name}
                  </div>
                  {#if schema[field]?.autocolumn}
                    <svg
                      class="spectrum-Icon spectrum-Table-autoIcon"
                      focusable="false">
                      <use xlink:href="#spectrum-icon-18-MagicWand" />
                    </svg>
                  {/if}
                  {#if sortColumn === field}
                    <svg
                      class="spectrum-Icon spectrum-UIIcon-ArrowDown100 spectrum-Table-sortedIcon"
                      focusable="false"
                      aria-hidden="true">
                      <use xlink:href="#spectrum-css-icon-Arrow100" />
                    </svg>
                  {/if}
                  {#if allowEditColumns}
                    <svg
                      class="spectrum-Icon spectrum-Table-editIcon"
                      focusable="false"
                      on:click={e => editColumn(e, field)}>
                      <use xlink:href="#spectrum-icon-18-Edit" />
                    </svg>
                  {/if}
                </div>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody class="spectrum-Table-body">
          {#each sortedRows as row, idx}
            <tr
              on:click={() => toggleSelectRow(row)}
              class="spectrum-Table-row"
              class:hidden={idx < firstVisibleRow || idx > lastVisibleRow}>
              {#if idx >= firstVisibleRow && idx <= lastVisibleRow}
                {#if customColumnRenderer}
                  <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                    <div class="spectrum-Table-cell-content">
                      <svelte:component
                        this={customColumnRenderer}
                        data={row}
                        selected={selectedRows.includes(row)}
                        onToggleSelection={() => toggleSelectRow(row)}
                        onEdit={e => editRow(e, row)}
                        {allowSelectRows}
                        {allowEditRows} />
                    </div>
                  </td>
                {/if}
                {#each fields as field}
                  <td class="spectrum-Table-cell">
                    <div class="spectrum-Table-cell-content">
                      <CellRenderer schema={schema[field]} value={row[field]} />
                    </div>
                  </td>
                {/each}
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<style>
  .loading,
  .container,
  th {
    background-color: var(--spectrum-global-color-gray-100);
  }

  .container {
    position: relative;
    overflow: auto;
    border: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid)) !important;
    scrollbar-width: thin;
    scrollbar-color: var(--spectrum-global-color-gray-300)
      var(--spectrum-global-color-gray-100);
  }
  .container::-webkit-scrollbar {
    width: 18px;
    height: 18px;
  }
  .container::-webkit-scrollbar-track {
    background: var(--spectrum-global-color-gray-100);
  }
  .container::-webkit-scrollbar-thumb {
    background-color: var(--spectrum-global-color-gray-300);
    border-radius: 20px;
    border: 4px solid var(--spectrum-global-color-gray-100);
  }
  .container::-webkit-scrollbar-corner {
    background: var(--spectrum-global-color-gray-100);
  }
  .container.quiet {
    border: none !important;
  }
  table {
    width: 100%;
  }

  .spectrum-Table-headCell .spectrum-Icon {
    pointer-events: all;
    margin-left: var(
      --spectrum-table-header-sort-icon-gap,
      var(--spectrum-global-dimension-size-125)
    );
  }
  .spectrum-Table-editIcon,
  .spectrum-Table-autoIcon {
    width: var(--spectrum-global-dimension-size-150);
    height: var(--spectrum-global-dimension-size-150);
  }
  .spectrum-Table-editIcon {
    opacity: 0;
  }
  .spectrum-Table-headCell:hover .spectrum-Table-editIcon {
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  .spectrum,
  th {
    border-bottom: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid)) !important;
  }
  th {
    vertical-align: middle;
    height: var(--header-height);
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .spectrum-Table-headCell-content {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
  }
  .spectrum-Table-headCell-content .title {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  tbody {
    z-index: 1;
  }
  tbody tr {
    height: var(--row-height);
  }
  tbody tr.hidden {
    height: calc(var(--row-height) + 1px);
  }
  tbody tr.offset {
    background-color: red;
    display: block;
  }
  td {
    padding-top: 0;
    padding-bottom: 0;
    border-bottom: none !important;
    border-left: none !important;
    border-right: none !important;
    border-top: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid)) !important;
  }
  tr:first-child td {
    border-top: none !important;
  }
  .spectrum:not(.quiet) td.spectrum-Table-cell--divider {
    width: 1px;
    border-right: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid)) !important;
  }
  .spectrum-Table-cell-content {
    height: var(--row-height);
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
</style>
