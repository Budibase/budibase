<script>
  import { backendUiStore } from "builderStore"

  export let value
  $: modelId = value ? value._id : ""

  function onChange(e) {
    value = $backendUiStore.models.find(model => model._id === e.target.value)
  }
</script>

<div class="block-field">
  <select class="budibase__input" value={modelId} on:blur={onChange} on:change={onChange}>
    <option value="">Choose an option</option>
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </select>
</div>
