<script>
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"

  export let ids = []
  export let header

  let records = []
  let open = false

  async function fetchRecords() {
    const FETCH_RECORDS_URL = `/api/${$backendUiStore.selectedDatabase._id}/records/search`
    const response = await api.post(FETCH_RECORDS_URL, {
      keys: ids,
    })
    records = await response.json()
  }

  $: ids && fetchRecords() 

  onMount(() => {
    fetchRecords()
  })
</script>

<section>
  <a on:click={() => (open = !open)}>{records.length}</a>
  {#if open}
    <div class="popover" transition:fade>
      <h3>{header}</h3>
      {#each records as record}
        <div class="linked-record">
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
    </div>
  {/if}
</section>

<style>
  a {
    font-size: 14px;
  }

  .popover {
    position: absolute;
    right: 15%;
    padding: 20px;
    background: var(--light-grey);
    border: 1px solid var(--grey);
  }

  h3 {
    font-size: 20px;
  }

  .fields {
    padding: 15px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    background: var(--white);
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
