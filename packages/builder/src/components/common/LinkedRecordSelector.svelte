<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"

  export let modelId
  export let linkedRecords

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
    linkedRecords.push(record)
  }
</script>

<section>
  {#each records as record}
    <div class="linked-record" on:click={linkRecord}>
      <h3>{record.name}</h3>
      <div class="fields">
        {#each Object.keys(record) as key}
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
  section {
    background: var(--grey);
    padding: 20px;
  }

  .fields {
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    background: var(--white);
    border: 1px solid var(--grey);
    border-radius: 5px;
  }

  .field span {
    color: var(--ink-lighter);
    font-size: 12px;
  }

  .field p {
    color: var(--ink);
    font-size: 14px;
    word-break: break-word;
  }
</style>
