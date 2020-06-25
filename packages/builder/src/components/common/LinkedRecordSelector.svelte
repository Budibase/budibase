<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"

  export let modelId
  export let linkName
  export let linked = []

  let records = []
  let model = {}

  let linkedRecords = new Set(linked)

  $: linked = [...linkedRecords]
  $: FIELDS_TO_HIDE = [$backendUiStore.selectedModel._id]
  $: schema = $backendUiStore.selectedModel.schema

  async function fetchRecords() {
    const FETCH_RECORDS_URL = `/api/${modelId}/records`
    const response = await api.get(FETCH_RECORDS_URL)
    const modelResponse = await api.get(`/api/models/${modelId}`)

    model = await modelResponse.json()
    records = await response.json()
  }

  function linkRecord(id) {
    if (linkedRecords.has(id)) {
      linkedRecords.delete(id)
    } else {
      linkedRecords.add(id)
    }

    linkedRecords = linkedRecords
  }

  onMount(() => {
    fetchRecords()
  })
</script>

<section>
  <header>
    <h3>{linkName}</h3>
  </header>
  {#each records as record}
    <div class="linked-record" on:click={() => linkRecord(record._id)}>
      <div class="fields" class:selected={linkedRecords.has(record._id)}>
        {#each Object.keys(model.schema).filter(key => !FIELDS_TO_HIDE.includes(key)) as key}
          <div class="field">
            <span>{model.schema[key].name}</span>
            <p>{record[key]}</p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<style>
  .fields.selected {
    background: var(--grey-1);
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--ink);
  }

  .fields {
    padding: 15px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    background: var(--white);
    border: 1px solid var(--grey);
    border-radius: 5px;
    transition: 0.5s all;
    margin-bottom: 8px;
  }

  .fields:hover {
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
