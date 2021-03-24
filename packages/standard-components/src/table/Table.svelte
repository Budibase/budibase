<script>
  import "@spectrum-css/table/dist/index-vars.css"
  import { getContext } from "svelte"
  import CellRenderer from "./CellRenderer.svelte"

  export let theme
  export let size
  export let dataProvider
  export let columns
  export let showAutoColumns
  export let rowCount = 8

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  let sortColumn
  let sortOrder

  $: rows = dataProvider?.rows ?? []
  $: sortedRows = sortRows(rows, sortColumn, sortOrder)
  $: loaded = dataProvider?.loaded ?? false
  $: schema = dataProvider?.schema ?? {}
  $: fields = getFields(schema, columns, showAutoColumns)

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
    if (customColumns?.length) {
      return customColumns
    }
    let columns = []
    Object.entries(schema).forEach(([field, fieldSchema]) => {
      console.log(fieldSchema)
      if (showAutoColumns || !fieldSchema?.autocolumn) {
        columns.push(field)
      }
    })
    return columns
  }
</script>

<div use:styleable={$component.styles}>
  <div
    lang="en"
    dir="ltr"
    class={`spectrum ${size || 'spectrum--medium'} ${theme || 'spectrum--light'}`}
    style={`height: ${rowCount * 55}px;`}>
    <table class="spectrum-Table">
      <thead class="spectrum-Table-head">
        <tr>
          {#each fields as field}
            <th
              class="spectrum-Table-headCell is-sortable"
              class:is-sorted-desc={sortColumn === field && sortOrder === 'Descending'}
              class:is-sorted-asc={sortColumn === field && sortOrder === 'Ascending'}
              on:click={() => sortBy(field)}>
              <div class="spectrum-Table-headCell-content">
                {schema[field]?.name}
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
        {#each sortedRows as row}
          <tr class="spectrum-Table-row">
            {#each fields as field}
              <td class="spectrum-Table-cell" tabindex="0">
                <div class="spectrum-Table-cell-content">
                  <CellRenderer schema={schema[field]} value={row[field]} />
                </div>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .spectrum {
    position: relative;
    overflow: auto;
  }
  table {
    width: 100%;
  }
  tbody {
    z-index: 1;
  }
  th {
    position: sticky;
    top: 0;
    background-color: var(--spectrum-global-color-gray-100);
    border-bottom: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
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
  .spectrum-Table-cell {
    padding-top: 0;
    padding-bottom: 0;
    border-bottom: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
    border-top: none !important;
  }
  .spectrum-Table-cell-content {
    height: 55px;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
  .spectrum-Table-sortedIcon {
    opacity: 0;
    display: block !important;
  }
  .spectrum-Table-sortedIcon.visible {
    opacity: 1;
  }
</style>
