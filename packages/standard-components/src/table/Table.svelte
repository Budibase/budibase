<script>
  import { fade } from "svelte/transition"
  import "@spectrum-css/table/dist/index-vars.css"
  import { getContext } from "svelte"
  import CellRenderer from "./CellRenderer.svelte"

  export let theme
  export let size
  export let dataProvider
  export let columns
  export let showAutoColumns
  export let rowCount
  export let quiet

  const component = getContext("component")
  const { styleable, Provider } = getContext("sdk")

  // Config
  const rowHeight = 55
  const headerHeight = 36
  const rowPreload = 5
  const maxRows = 100

  // Sorting state
  let sortColumn
  let sortOrder

  // Table state
  $: loaded = dataProvider?.loaded ?? false
  $: rows = dataProvider?.rows ?? []
  $: visibleRowCount = loaded
    ? Math.min(rows.length, rowCount || maxRows, maxRows)
    : Math.min(8, rowCount || maxRows)
  $: scroll = rows.length > visibleRowCount
  $: contentStyle = getContentStyle(visibleRowCount, scroll || !loaded)
  $: sortedRows = sortRows(rows, sortColumn, sortOrder)
  $: schema = dataProvider?.schema ?? {}
  $: fields = getFields(schema, columns, showAutoColumns)

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

  const getFields = (schema, customColumns, showAutoColumns) => {
    // Check for an invalid column selection
    let invalid = false
    customColumns?.forEach(column => {
      if (schema[column] == null) {
        invalid = true
      }
    })

    // Use column selection if it exists
    if (!invalid && customColumns?.length) {
      return customColumns
    }

    // Otherwise generate columns
    let columns = []
    let autoColumns = []
    Object.entries(schema).forEach(([field, fieldSchema]) => {
      if (!fieldSchema?.autocolumn) {
        columns.push(field)
      } else if (showAutoColumns) {
        autoColumns.push(field)
      }
    })
    return columns.concat(autoColumns)
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
</script>

{#if !loaded}
  <div class="content" style={contentStyle} />
{:else}
  <div use:styleable={$component.styles}>
    <div
      on:scroll={onScroll}
      lang="en"
      dir="ltr"
      class:quiet
      style={`--row-height: ${rowHeight}px; --header-height: ${headerHeight}px;`}
      class={`spectrum ${size || 'spectrum--medium'} ${theme || 'spectrum--light'}`}>
      <div class="content" style={contentStyle}>
        <table class="spectrum-Table" class:spectrum-Table--quiet={quiet}>
          <thead class="spectrum-Table-head">
            <tr>
              {#if $component.children}
                <th class="spectrum-Table-headCell">
                  <div class="spectrum-Table-headCell-content" />
                </th>
              {/if}
              {#each fields as field}
                <th
                  class="spectrum-Table-headCell is-sortable"
                  class:is-sorted-desc={sortColumn === field && sortOrder === 'Descending'}
                  class:is-sorted-asc={sortColumn === field && sortOrder === 'Ascending'}
                  on:click={() => sortBy(field)}>
                  <div class="spectrum-Table-headCell-content">
                    <div class="title">{schema[field]?.name}</div>
                    <svg
                      class="spectrum-Icon spectrum-UIIcon-ArrowDown100 spectrum-Table-sortedIcon"
                      class:visible={sortColumn === field}
                      focusable="false"
                      aria-hidden="true">
                      <use xlink:href="#spectrum-css-icon-Arrow100" />
                    </svg>
                  </div>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody class="spectrum-Table-body">
            {#each sortedRows as row, idx}
              <tr
                class="spectrum-Table-row"
                class:hidden={idx < firstVisibleRow || idx > lastVisibleRow}>
                {#if idx >= firstVisibleRow && idx <= lastVisibleRow}
                  {#if $component.children}
                    <td
                      class="spectrum-Table-cell spectrum-Table-cell--divider">
                      <div class="spectrum-Table-cell-content">
                        <Provider data={row}>
                          <slot />
                        </Provider>
                      </div>
                    </td>
                  {/if}
                  {#each fields as field}
                    <td class="spectrum-Table-cell">
                      <div class="spectrum-Table-cell-content">
                        <CellRenderer
                          schema={schema[field]}
                          value={row[field]} />
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
  </div>
{/if}

<style>
  .spectrum {
    position: relative;
    overflow: auto;
    border: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid)) !important;
  }
  .spectrum.quiet {
    border: none !important;
  }
  table {
    width: 100%;
  }

  .spectrum-Table-sortedIcon {
    opacity: 0;
    display: block !important;
  }
  .spectrum-Table-sortedIcon.visible {
    opacity: 1;
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
    background-color: var(--spectrum-global-color-gray-100);
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
