<script>
  import { backendUiStore } from "builderStore"

  export let value
</script>

<div class="block-field">
  <select class="budibase__input" bind:value>
    <option value="">Choose an option</option>
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </select>
</div>
