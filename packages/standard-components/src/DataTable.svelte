<script>
  import { onMount } from "svelte"

  export let _bb
  export let onLoad
  export let _instanceId
  export let model

  let headers = []
  let store = _bb.store

  async function fetchData() {
    const FETCH_RECORDS_URL = `/api/${_instanceId}/all_${model._id}/records`
    const response = await _bb.api.get(FETCH_RECORDS_URL)
    if (response.status === 200) {
      const json = await response.json()

      store.update(state => {
        state[model._id] = json
        return state
      })

      headers = Object.keys(json[0]).filter(key => !key.startsWith("_"))
    } else {
      throw new Error("Failed to fetch records.", response)
    }
  }

  $: data = $store[model._id] || []

  onMount(async () => {
    await fetchData()
  })
</script>

<table class="uk-table">
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
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 3px;
    border-collapse: collapse;
  }

  thead {
    background: #f9f9f9;
    border: 1px solid #ccc;
  }

  thead th {
    color: var(--button-text);
    text-transform: capitalize;
    font-weight: 500;
    font-size: 14px;
    text-rendering: optimizeLegibility;
    letter-spacing: 1px;
  }

  tbody tr {
    border-bottom: 1px solid #ccc;
    transition: 0.3s background-color;
    color: var(--secondary100);
    font-size: 14px;
  }

  tbody tr:hover {
    background: #fafafa;
  }
</style>
