<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"

  export let modelId
  export let linkName
  export let linked = []

  let records = []

  async function fetchRecords() {
    const FETCH_RECORDS_URL = `/api/${$backendUiStore.selectedDatabase._id}/${modelId}/records`
    const response = await api.get(FETCH_RECORDS_URL)
    records = await response.json()
  }

  onMount(() => {
    fetchRecords()
  })

  function linkRecord(record) {
    linked.push(record._id)
  }
</script>

<section>
  <h3>{linkName}</h3>
  {#each records as record}
    <div class="linked-record" on:click={() => linkRecord(record)}>
      <div class="fields">
        {#each Object.keys(record).slice(0, 2) as key}
          <div class="field">
            <span>{key}</span>
            <p>{record[key]}</p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<style>
  h3 {
    font-size: 20px;
  }

  .fields {
    padding: 15px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    background: var(--grey);
    border: 1px solid var(--grey);
    border-radius: 5px;
  }

  .field:hover {
    cursor: pointer;
  }

  .field span {
    color: var(--ink-lighter);
    font-size: 12px;
  }

  .field p {
    color: var(--ink);
    font-size: 14px;
    word-break: break-word;
    font-weight: 500;
    margin-top: 4px;
  }
</style>
