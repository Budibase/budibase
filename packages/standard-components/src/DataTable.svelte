<script>
  import { onMount } from "svelte"
  import { cssVars, createClasses } from "./cssVars"

  export let _bb
  export let onLoad
  export let model
  export let backgroundColor
  export let color
  export let stripeColor
  export let borderColor

  let headers = []
  let store = _bb.store

  $: cssVariables = {
    backgroundColor,
    color,
    stripeColor,
    borderColor,
  }

  const shouldDisplayField = name => {
    if (name.startsWith("_")) return false
    // always 'record'
    if (name === "type") return false
    // tables are always tied to a single modelId, this is irrelevant
    if (name === "modelId") return false

    return true
  }

  async function fetchData() {
    const FETCH_RECORDS_URL = `/api/views/all_${model}`

    const response = await _bb.api.get(FETCH_RECORDS_URL)
    if (response.status === 200) {
      const json = await response.json()

      store.update(state => {
        state[model] = json
        return state
      })

      headers = Object.keys(json[0]).filter(shouldDisplayField)
    } else {
      throw new Error("Failed to fetch records.", response)
    }
  }

  $: data = $store[model] || []
  $: if (model) fetchData()

  onMount(async () => {
    await fetchData()
  })
</script>

<table use:cssVars={cssVariables}>
  <thead>
    <tr>
      {#each headers as header}
        <th>{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as row}
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
