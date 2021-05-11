<script>
  import { createEventDispatcher } from "svelte"
  import "@spectrum-css/table/dist/index-vars.css"
  import CellRenderer from "./CellRenderer.svelte"
  import SelectEditRenderer from "./SelectEditRenderer.svelte"

  export let data = []
  export let schema = {}
  export let showAutoColumns = false
  export let rowCount = 0
  export let quiet = false
  export let loading = false
  export let allowSelectRows = true
  export let allowEditRows = true
  export let allowEditColumns = true
  export let selectedRows = []
  export let editColumnTitle = "Edit"
  export let customRenderers = []

  const dispatch = createEventDispatcher()

  // Config
  const rowHeight = 55
  const headerHeight = 36
  const rowPreload = 5

  // Sorting state
  let sortColumn
  let sortOrder

  // Table state
  let height = 0
  let loaded = false
  $: schema = fixSchema(schema)
  $: if (!loading) loaded = true
  $: rows = data ?? []
  $: visibleRowCount = getVisibleRowCount(loaded, height, rows.length, rowCount)
  $: contentStyle = getContentStyle(visibleRowCount, rowCount)
  $: sortedRows = sortRows(rows, sortColumn, sortOrder)
  $: fields = getFields(schema, showAutoColumns)
  $: showEditColumn = allowEditRows || allowSelectRows

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

  // Reset state when data changes
  $: data.length, reset()
  const reset = () => {
    nextScrollTop = 0
    scrollTop = 0
    clearTimeout(timeout)
    timeout = null
  }

  const fixSchema = schema => {
    let fixedSchema = {}
    Object.entries(schema || {}).forEach(([fieldName, fieldSchema]) => {
      if (typeof fieldSchema === "string") {
        fixedSchema[fieldName] = {
          type: fieldSchema,
          name: fieldName,
        }
      } else {
        fixedSchema[fieldName] = {
          ...fieldSchema,
          name: fieldName,
        }
      }
    })
    return fixedSchema
  }

  const getVisibleRowCount = (loaded, height, allRows, rowCount) => {
    if (!loaded) {
      return rowCount || 0
    }
    if (rowCount) {
      return Math.min(allRows, rowCount)
    }
    return Math.min(allRows, Math.ceil(height / rowHeight))
  }

  const getContentStyle = (visibleRows, rowCount) => {
    if (!rowCount || !visibleRows) {
      return ""
    }
    return `height: ${headerHeight + visibleRows * (rowHeight + 1)}px;`
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

  const sortBy = fieldSchema => {
    if (fieldSchema.sortable === false) {
      return
    }
    if (fieldSchema.name === sortColumn) {
      sortOrder = sortOrder === "Descending" ? "Ascending" : "Descending"
    } else {
      sortColumn = fieldSchema.name
      sortOrder = "Descending"
    }
  }

  const getDisplayName = schema => {
    let name = schema?.displayName
    if (schema && name === undefined) {
      name = schema.name
    }
    return name || ""
  }

  const getFields = (schema, showAutoColumns) => {
    let columns = []
    let autoColumns = []
    Object.entries(schema || {}).forEach(([field, fieldSchema]) => {
      if (!field || !fieldSchema) {
        return
      }
      if (!fieldSchema?.autocolumn) {
        columns.push(fieldSchema)
      } else if (showAutoColumns) {
        autoColumns.push(fieldSchema)
      }
    })
    return columns
      .sort((a, b) => {
        const orderA = a.order || Number.MAX_SAFE_INTEGER
        const orderB = b.order || Number.MAX_SAFE_INTEGER
        const nameA = getDisplayName(a)
        const nameB = getDisplayName(b)
        if (orderA !== orderB) {
          return orderA < orderB ? orderA : orderB
        }
        return nameA < nameB ? a : b
      })
      .concat(autoColumns)
      .map(column => column.name)
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
    if (visibleRowCount === 0) {
      return -1
    }
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

<div class="wrapper" bind:offsetHeight={height}>
  {#if !loaded}
    <div class="loading" style={contentStyle} />
  {:else}
    <div
      on:scroll={onScroll}
      class:quiet
      style={`--row-height: ${rowHeight}px; --header-height: ${headerHeight}px;`}
      class="container"
    >
      <div style={contentStyle}>
        <table class="spectrum-Table" class:spectrum-Table--quiet={quiet}>
          {#if fields.length}
            <thead class="spectrum-Table-head">
              <tr>
                {#if showEditColumn}
                  <th class="spectrum-Table-headCell">
                    <div class="spectrum-Table-headCell-content">
                      {editColumnTitle || ""}
                    </div>
                  </th>
                {/if}
                {#each fields as field}
                  <th
                    class="spectrum-Table-headCell"
                    class:is-sortable={schema[field].sortable !== false}
                    class:is-sorted-desc={sortColumn === field &&
                      sortOrder === "Descending"}
                    class:is-sorted-asc={sortColumn === field &&
                      sortOrder === "Ascending"}
                    on:click={() => sortBy(schema[field])}
                  >
                    <div class="spectrum-Table-headCell-content">
                      <div class="title">{getDisplayName(schema[field])}</div>
                      {#if schema[field]?.autocolumn}
                        <svg
                          class="spectrum-Icon spectrum-Table-autoIcon"
                          focusable="false"
                        >
                          <use xlink:href="#spectrum-icon-18-MagicWand" />
                        </svg>
                      {/if}
                      {#if sortColumn === field}
                        <svg
                          class="spectrum-Icon spectrum-UIIcon-ArrowDown100 spectrum-Table-sortedIcon"
                          focusable="false"
                          aria-hidden="true"
                        >
                          <use xlink:href="#spectrum-css-icon-Arrow100" />
                        </svg>
                      {/if}
                      {#if allowEditColumns && schema[field]?.editable !== false}
                        <svg
                          class="spectrum-Icon spectrum-Table-editIcon"
                          focusable="false"
                          on:click={e => editColumn(e, field)}
                        >
                          <use xlink:href="#spectrum-icon-18-Edit" />
                        </svg>
                      {/if}
                    </div>
                  </th>
                {/each}
              </tr>
            </thead>
          {/if}
          <tbody class="spectrum-Table-body">
            {#if sortedRows?.length && fields.length}
              {#each sortedRows as row, idx}
                <tr
                  on:click={() => toggleSelectRow(row)}
                  class="spectrum-Table-row"
                  class:hidden={idx < firstVisibleRow || idx > lastVisibleRow}
                >
                  {#if idx >= firstVisibleRow && idx <= lastVisibleRow}
                    {#if showEditColumn}
                      <td
                        class="spectrum-Table-cell spectrum-Table-cell--divider"
                      >
                        <div class="spectrum-Table-cell-content">
                          <SelectEditRenderer
                            data={row}
                            selected={selectedRows.includes(row)}
                            onToggleSelection={() => toggleSelectRow(row)}
                            onEdit={e => editRow(e, row)}
                            {allowSelectRows}
                            {allowEditRows}
                          />
                        </div>
                      </td>
                    {/if}
                    {#each fields as field}
                      <td
                        class="spectrum-Table-cell"
                        class:spectrum-Table-cell--divider={!!schema[field]
                          .divider}
                      >
                        <div class="spectrum-Table-cell-content">
                          <CellRenderer
                            {customRenderers}
                            {row}
                            schema={schema[field]}
                            value={row[field]}
                            on:clickrelationship
                          >
                            <slot />
                          </CellRenderer>
                        </div>
                      </td>
                    {/each}
                  {/if}
                </tr>
              {/each}
            {:else}
              <tr class="placeholder-row">
                {#if showEditColumn}
                  <td class="placeholder-offset" />
                {/if}
                {#each fields as field}
                  <td />
                {/each}
                <div class="placeholder" class:has-fields={fields.length > 0}>
                  <div class="placeholder-content">
                    <svg
                      class="spectrum-Icon spectrum-Icon--sizeXXL"
                      focusable="false"
                    >
                      <use xlink:href="#spectrum-icon-18-Table" />
                    </svg>
                    <div>No rows found</div>
                  </div>
                </div>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    background-color: var(--spectrum-alias-background-color-secondary);
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .container {
    height: 100%;
    position: relative;
    overflow: auto;
  }
  .container.quiet {
    border: none;
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

  th {
    vertical-align: middle;
    height: var(--header-height);
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: var(--spectrum-alias-background-color-secondary);
    border-bottom: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
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

  .placeholder-row {
    position: relative;
    height: 150px;
  }
  .placeholder-row td {
    border-top: none !important;
    border-bottom: none !important;
  }
  .placeholder-offset {
    width: 1px;
  }
  .placeholder {
    top: 0;
    height: 100%;
    left: 0;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .placeholder.has-fields {
    top: var(--header-height);
    height: calc(100% - var(--header-height));
  }

  .placeholder-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(
      --spectrum-table-cell-text-color,
      var(--spectrum-alias-text-color)
    );
  }
  .placeholder-content div {
    margin-top: 10px;
    font-size: var(
      --spectrum-table-cell-text-size,
      var(--spectrum-alias-font-size-default)
    );
    text-align: center;
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
    border-bottom: none;
    border-top: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
    border-radius: 0;
  }
  tr:first-child td {
    border-top: none;
  }
  tr:last-child td {
    border-bottom: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
  }
  td.spectrum-Table-cell--divider {
    width: 1px;
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
