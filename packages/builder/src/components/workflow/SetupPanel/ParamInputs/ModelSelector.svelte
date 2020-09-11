<script>
  import { backendUiStore } from "builderStore"

  export let value
  let modelId = value ? value._id : ""
  $: value = $backendUiStore.models.find(x => x._id === modelId)
</script>

<div class="block-field">
  <select class="budibase__input" bind:value={modelId}>
    <option value="">Choose an option</option>
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </select>
</div>
