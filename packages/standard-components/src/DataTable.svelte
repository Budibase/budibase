<script>
  import { onMount } from "svelte"
  import { cssVars, createClasses } from "./cssVars"
  import ArrowUp from "./icons/ArrowUp.svelte"
  import ArrowDown from "./icons/ArrowDown.svelte"
  import fsort from "fast-sort"
  import fetchData from "./fetchData.js"

  export let _bb

  export let backgroundColor
  export let color
  export let stripeColor
  export let borderColor
  export let datasource = {}

  let data = []
  let headers = []
  let store = _bb.store
  let sort = {}
  let sorted = []

  $: cssVariables = {
    backgroundColor,
    color,
    stripeColor,
    borderColor,
  }

  $: sorted = sort.direction ? fsort(data)[sort.direction](sort.column) : data

  onMount(async () => {
    if (datasource) {
      data = await fetchData(datasource)
      if (data) {
        headers = Object.keys(data[0]).filter(shouldDisplayField)
      }
    }
  })

  const shouldDisplayField = name => {
    if (name.startsWith("_")) return false
    // always 'record'
    if (name === "type") return false
    // tables are always tied to a single modelId, this is irrelevant
    if (name === "modelId") return false

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
          {#if row[header]}
            <td>{row[header]}</td>
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
