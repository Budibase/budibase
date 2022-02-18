<script>
  import { createEventDispatcher } from "svelte"
  import "@spectrum-css/table/dist/index-vars.css"
  import CellRenderer from "./CellRenderer.svelte"
  import SelectEditRenderer from "./SelectEditRenderer.svelte"
  import { cloneDeep, deepGet } from "../helpers"

  /**
   * The expected schema is our normal couch schemas for our tables.
   * Each field schema can be enriched with a few extra properties to customise
   * the behaviour.
   * All of these are optional and do not need to be added.
   * displayName: Overrides the field name displayed as the column title
   * sortable: Set to false to disable sorting data by a certain column
   * editable: Set to false to disable editing a certain column if the
   *  allowEditColumns prop is true
   */
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
  export let disableSorting = false

  const dispatch = createEventDispatcher()
  rowCount = 8

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
  $: fields = getFields(schema, showAutoColumns)
  $: rows = fields?.length ? data || [] : []
  $: visibleRowCount = getVisibleRowCount(loaded, height, rows.length, rowCount)
  $: contentStyle = getContentStyle(visibleRowCount, rowCount)
  $: sortedRows = sortRows(rows, sortColumn, sortOrder)
  $: gridStyle = getGridStyle(fields, schema, showEditColumn)
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
  $: rows.length, reset()
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

  const getGridStyle = (fields, schema, showEditColumn) => {
    let style = "grid-template-columns:"
    if (showEditColumn) {
      style += " auto"
    }
    fields?.forEach(field => {
      const fieldSchema = schema[field]
      if (fieldSchema.width) {
        style += ` ${fieldSchema.width}`
      } else {
        style += " minmax(auto, 1fr)"
      }
    })
    style += ";"
    return style
  }

  const sortRows = (rows, sortColumn, sortOrder) => {
    if (!sortColumn || !sortOrder || disableSorting) {
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
    dispatch("sort", { column: sortColumn, order: sortOrder })
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
    dispatch("editrow", cloneDeep(row))
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

<div
  class="wrapper"
  class:wrapper--quiet={quiet}
  bind:offsetHeight={height}
  style={`--row-height: ${rowHeight}px; --header-height: ${headerHeight}px;`}
>
  {#if !loaded}
    <div class="loading" style={contentStyle} />
  {:else}
    <div
      on:scroll={onScroll}
      class="spectrum-Table"
      style={`${contentStyle}${gridStyle}`}
    >
      {#if fields.length}
        {#if showEditColumn}
          <div class="spectrum-Table-headCell">
            {editColumnTitle || ""}
          </div>
        {/if}
        {#each fields as field}
          <div
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
          </div>
        {/each}
      {/if}
      {#if sortedRows?.length}
        {#each sortedRows as row, idx}
          <div
            class="spectrum-Table-row"
            on:click={() => dispatch("click", row)}
            on:click={() => toggleSelectRow(row)}
          >
            {#if idx >= firstVisibleRow && idx <= lastVisibleRow}
              {#if showEditColumn}
                <div
                  class="spectrum-Table-cell spectrum-Table-cell--divider spectrum-Table-cell--edit"
                >
                  <SelectEditRenderer
                    data={row}
                    selected={selectedRows.includes(row)}
                    onToggleSelection={() => toggleSelectRow(row)}
                    onEdit={e => editRow(e, row)}
                    {allowSelectRows}
                    {allowEditRows}
                  />
                </div>
              {/if}
              {#each fields as field}
                <div
                  class="spectrum-Table-cell"
                  class:spectrum-Table-cell--divider={!!schema[field].divider}
                >
                  <CellRenderer
                    {customRenderers}
                    {row}
                    schema={schema[field]}
                    value={deepGet(row, field)}
                    on:clickrelationship
                  >
                    <slot />
                  </CellRenderer>
                </div>
              {/each}
            {:else}
              <div class="spectrum-Table-cell spectrum-Table-cell--empty" />
            {/if}
          </div>
        {/each}
      {:else}
        <div class="placeholder" class:placeholder--no-fields={!fields?.length}>
          <div class="placeholder-content">
            <svg class="spectrum-Icon spectrum-Icon--sizeXXL" focusable="false">
              <use xlink:href="#spectrum-icon-18-Table" />
            </svg>
            <div>No rows found</div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Wrapper */
  .wrapper {
    background-color: var(--spectrum-alias-background-color-secondary);
    overflow: hidden;
    position: relative;
    z-index: 0;
    --table-bg: var(--spectrum-global-color-gray-50);
    --table-border: 1px solid var(--spectrum-alias-border-color-mid);
  }
  .wrapper--quiet {
    --table-bg: var(--spectrum-alias-background-color-transparent);
  }

  /* Table */
  .spectrum-Table {
    width: 100%;
    overflow: auto;
    border-radius: 0;
    background-color: var(--table-bg);
    display: grid;
  }

  /* Header */
  .spectrum-Table-head {
    display: flex;
    position: sticky;
    top: 0;
    width: fit-content;
    border-bottom: var(--table-border);
    border-right: 2px solid transparent;
    min-width: calc(100% - 2px);
  }
  .spectrum-Table-headCell {
    vertical-align: middle;
    height: var(--header-height);
    position: sticky;
    top: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: var(--spectrum-alias-background-color-secondary);
    z-index: 2;
    border-bottom: var(--table-border);
  }
  .spectrum-Table-headCell-content {
    overflow: hidden;
    text-overflow: ellipsis;
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
  .spectrum-Table-headCell:hover .spectrum-Table-editIcon {
    opacity: 1;
    transition: opacity 0.2s ease;
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

  /* Table rows */
  .spectrum-Table-row {
    display: contents;
  }
  .spectrum-Table-row:hover .spectrum-Table-cell {
    background-color: var(--spectrum-alias-highlight-hover);
  }
  .wrapper--quiet .spectrum-Table-row {
    border-left: none;
    border-right: none;
  }
  .spectrum-Table-row > :first-child {
    border-left: var(--table-border);
  }
  .spectrum-Table-row > :last-child {
    border-right: var(--table-border);
  }

  /* Table cells */
  .spectrum-Table-cell {
    flex: 1 1 auto;
    padding-top: 0;
    padding-bottom: 0;
    border-top: none;
    border-bottom: none;
    border-radius: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: var(--row-height);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    transition: background-color
      var(--spectrum-global-animation-duration-100, 0.13s) ease-in-out;
    border-bottom: 1px solid var(--spectrum-alias-border-color-mid);
  }
  .spectrum-Table-cell--empty {
    grid-column: 1 / -1;
  }

  /* Placeholder  */
  .placeholder {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border: var(--table-border);
    border-top: none;
    grid-column: 1 / -1;
  }
  .placeholder--no-fields {
    border-top: var(--table-border);
  }
  .wrapper--quiet .placeholder {
    border-left: none;
    border-right: none;
  }
  .placeholder-content {
    padding: 40px;
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
</style>
