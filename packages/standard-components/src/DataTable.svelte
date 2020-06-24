<script>
  import { onMount } from "svelte"

  export let _bb
  export let onLoad
  export let model

  let headers = []
  let store = _bb.store

  async function fetchData() {
    const FETCH_RECORDS_URL = `/api/views/all_${model}`

    const response = await _bb.api.get(FETCH_RECORDS_URL)
    if (response.status === 200) {
      const json = await response.json()

      store.update(state => {
        state[model] = json
        return state
      })

      headers = Object.keys(json[0]).filter(key => !key.startsWith("_"))
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
    background: #393c44;
    border: 1px solid #ccc;
    height: 40px;
    text-align: left;
    margin-right: 60px;
  }

  thead th {
    color: #ffffff;
    text-transform: capitalize;
    font-weight: 500;
    font-size: 14px;
    text-rendering: optimizeLegibility;
    justify-content: left;
    padding: 16px 20px 16px 8px;
    margin-right: 20px;
  }

  tbody tr {
    border-bottom: 1px solid #ccc;
    transition: 0.3s background-color;
    color: #393c44;
    font-size: 14px;
    height: 40px;
  }

  tbody tr:hover {
    background: var(--grey-1);
  }
</style>
