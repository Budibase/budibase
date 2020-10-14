<script>
  import { onMount } from "svelte"
  import { cssVars } from "./cssVars"
  import ArrowUp from "./icons/ArrowUp.svelte"
  import ArrowDown from "./icons/ArrowDown.svelte"
  import fsort from "fast-sort"
  import fetchData from "./fetchData.js"
  import { isEmpty } from "lodash/fp"
  import AttachmentList from "./attachments/AttachmentList.svelte"

  export let backgroundColor
  export let color
  export let stripeColor
  export let borderColor
  export let datasource
  export let _bb

  let data = []
  let headers = []
  let sort = {}
  let sorted = []
  let schema = {}
  let store = _bb.store

  $: cssVariables = {
    backgroundColor,
    color,
    stripeColor,
    borderColor,
  }

  $: sorted = sort.direction ? fsort(data)[sort.direction](sort.column) : data

  async function fetchTable(tableId) {
    const FETCH_TABLE_URL = `/api/tables/${tableId}`
    const response = await _bb.api.get(FETCH_TABLE_URL)
    const table = await response.json()
    return table.schema
  }

  onMount(async () => {
    if (!isEmpty(datasource)) {
      data = await fetchData(datasource, $store)

      // Get schema for datasource
      // Views with "Calculate" applied provide their own schema.
      // For everything else, use the tableId property to pull to table schema
      if (datasource.schema) {
        schema = datasource.schema
        headers = Object.keys(schema).filter(shouldDisplayField)
      } else {
        schema = await fetchTable(datasource.tableId)
        headers = Object.keys(schema).filter(shouldDisplayField)
      }
    }
  })

  const shouldDisplayField = name => {
    if (name.startsWith("_")) return false
    // always 'row'
    if (name === "type") return false
    // tables are always tied to a single tableId, this is irrelevant
    if (name === "tableId") return false
    return true
  }

  function sortColumn(column) {
    if (column === sort.column) {
      sort = {
        direction: sort.direction === "asc" ? "desc" : null,
        column: sort.direction === "asc" ? sort.column : null,
      }
      return
    }

    sort = {
      column,
      direction: "asc",
    }
  }
</script>

<table use:cssVars={cssVariables}>
  <thead>
    <tr>
      {#each headers as header}
        <th on:click={() => sortColumn(header)}>
          <span>
            {header}
            {#if sort.column === header}
              <svelte:component
                this={sort.direction === 'asc' ? ArrowDown : ArrowUp}
                style="height: 1em;" />
            {/if}
          </span>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each sorted as row (row._id)}
      <tr>
        {#each headers as header}
          {#if schema[header] !== undefined}
            <!-- Rudimentary solution for attachments on array given this entire table will be replaced by AG Grid -->
            {#if schema[header] && schema[header].type === 'attachment'}
              <AttachmentList files={row[header]} />
            {:else if schema[header] && schema[header].type === 'link'}
              <td>{row[header] ? row[header].length : 0} related row(s)</td>
            {:else}
              <td>{row[header] == null ? '' : row[header]}</td>
            {/if}
          {/if}
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    overflow: scroll; /* Scrollbar are always visible */
    overflow: auto; /* Scrollbar is displayed as it's needed */
  }

  /* Zebra striping */
  tr:nth-of-type(odd) {
    background: var(--stripeColor);
  }

  th {
    background-color: var(--backgroundColor);
    color: var(--color);
    font-weight: bold;
    text-transform: capitalize;
    cursor: pointer;
  }

  th span {
    display: flex;
    align-items: center;
  }

  td,
  th {
    padding: 16px;
    border: 1px solid var(--borderColor);
    text-align: left;
  }

  @media only screen and (max-width: 760px),
    (min-device-width: 768px) and (max-device-width: 1024px) {
    table {
      width: 100%;
    }

    /* Force table to not be like tables anymore */
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }

    /* Hide table headers (but not display: none;, for accessibility) */
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    tr {
      border: 1px solid var(--borderColor);
    }

    td {
      /* Behave  like a "row" */
      border: none;
      border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 10%;
    }

    td:before {
      /* Now like a table header */
      position: absolute;
      /* Top/left values mimic padding */
      top: 6px;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
      /* Label the data */
      content: attr(data-column);
    }
  }
</style>
